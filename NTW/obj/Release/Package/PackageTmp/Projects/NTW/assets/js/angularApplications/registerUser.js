/*global define */
define(['jquery', 'angular', 'constants', 'local/queryStringHelper', 'translationInvite', 'translationCommon', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/commonDirectives', 'local/angularApplications/customTable', 'local/angularApplications/accessTree', 'local/angularApplications/services/selectedRolesService'],
    function ($, ng, constants, queryStringHelper, translation, translationCommon) {
        "use strict";

        var app = ng.module('registerUser', ['corpAdministrationService', 'commonDirectives', 'customTable', 'selectedRolesService', 'accessTree']);

        app.controller('RegisterUserController', [
            '$scope', '$attrs', '$http', 'corpAdministrationService', '$q', 'selectedRolesService', 'validatorService', '$timeout',
            function ($scope, $attrs, $http, corpAdministrationService, $q, selectedRolesServiceWrapper, validatorService, $timeout) {
                
                var inviteId = queryStringHelper.getQueryInt(0);
                var inviteToken = queryStringHelper.getQueryString(1);

                var invite;
                var inviteInfo;

                var smsText = translation.translate("INVITE_SMS_TEXT");

                $scope.translation = translation;
                $scope.form = {};

                $scope.invite = {};

                if (inviteId > 0 && inviteToken !== "") {
                    // chack if the invite is valid
                    corpAdministrationService.isInviteNonceValid(inviteId, inviteToken).then(function(data) {
                        if (data) {

                            console.log(data);
                            // get the invite and info
                            
                            var promises = [corpAdministrationService.getInviteWithNonce(inviteId, inviteToken), corpAdministrationService.getInviteInfo(inviteId, inviteToken)];

                            $q.all(promises).then(function(data) {

                                invite = data[0];
                                inviteInfo = data[1];

                                if (invite.inviteStatus === "Accepted") {
                                    $scope.inviteError = translation.translate("INVITE_ALREADY_ACCEPTED");
                                    return;
                                }

                                $scope.verifyButtonText = translation.translate("VERIFY_BUTTON_TEXT");

                                $scope.form.email = invite.email;
                                $scope.form.mobileNumber = invite.mobileNumber;

                                $scope.form.firstName = invite.firstName;
                                $scope.form.lastName = invite.lastName;

                                $timeout(function() {
                                    if (validatorService.validator) {
                                        _.each(validatorService.validator.fields, function(item) {
                                            validatorService.validator.validateField(item);
                                        });
                                        validatorService.validator.toggleSubmitButton();
                                    }
                                });

                                $scope.disableEmailAndMobile = true;

                                // try and get the token
                                
                                $scope.inviteVerified = true;
                                $.getJSON(constants.inviteSmsTokenUrl, function(data) {
                                    if (data && data.code) {
                                        // token already entered, verify it!
                                        $scope.$apply(function() {
                                            $scope.invite.smstoken = data.code;
                                            $scope.isInvite = true;
                                            $scope.verifyInvite(true);
                                        });

                                    } else {
                                        // send the sms
                                        corpAdministrationService.sendInviteSmsToken(smsText, inviteId).then(sendInviteSmsTokenComplete, sendInviteSmsTokenError);
                                    }
                                });

                            });

                        } else {

                            $scope.inviteError = translation.translate("INVITE_INVALID");

                        }
                    });
                } else {

                    $scope.showRegister = true;
                }
                
                var sendInviteSmsTokenComplete = function(result) {
                    if (result) {
                        $scope.sendSmsTokenText = translation.translate("SMS_TOKEN_SENT", [ invite.mobileNumber ]);
                        $scope.inviteVerified = false;
                        $scope.isInvite = true;
                    } else {
                        $scope.inviteError = translation.translate("INVITE_ERROR_SEND_SMS");
                    }
                };

                var sendInviteSmsTokenError = function(error) {
                    $scope.inviteError = error;
                };

                $scope.verifyInvite = function(sendOutNewOnFail) {
                    
                    // save the token
                    $.post(constants.inviteSmsTokenUrl, { smsCode: $scope.invite.smstoken });

                    corpAdministrationService.verifyInvite(invite.inviteId, invite.nonce, $scope.invite.smstoken).then(function(data) {

                        if (data) {
                            
                            $scope.inviteVerified = true;
                            $scope.showRegister = true;

                            var orgs = _.uniq(_.pluck(invite.inviteRoles, 'orgId'));

                            console.log(inviteInfo);

                            $scope.tableData = _.map(orgs, function(item) {

                                var roleIds = _.pluck(_.filter(invite.inviteRoles, function(x) { return x.orgId === item; }), 'roleId');
                                var roles = [];
                                var instance = "_" + item;

                                var org = { id: item, name: inviteInfo.organisations[item].name, nr: inviteInfo.organisations[item].organizationNumber, roleIds: roleIds, roles: roles, instanceId: instance };

                                var service = selectedRolesServiceWrapper.getInstance(instance);
                                service.setTscId(item);
                                service.setCommonPuis(inviteInfo.commonPuis);
                                service.setPuisOnOrganisation(inviteInfo.orgPuis[item]);
                                var _roles = _.filter(inviteInfo.roles, function(x) { return x.systemRole || x.organizationTscid === item; });
                                service.setAvailableRoles(_roles);
                                //service.loadData();
                                service.setSelectedRoleIds(roleIds);

                                service.getAvailableRoles(function(data) {
                                    org.roles = _.filter(data, function(item) { return _.contains(roleIds, item.id); });
                                });

                                // get the organisation name and org number somehow
                                return org;
                            });

                            $scope.tableDefinition = [
                                { name: "Organisationsnummer", fieldName: "nr"},
                                { name: "Namn", fieldName: "name" }
                            ];
                        } else {
                            $scope.inviteVerified = false;
                            $scope.inviteError = translation.translate(sendOutNewOnFail ? "VERFIY_INVITE_NEWTOKEN_ERROR" : "VERIFY_INVITE_ERROR");

                            if (sendOutNewOnFail) {
                                corpAdministrationService.sendInviteSmsToken(smsText, inviteId).then(sendInviteSmsTokenComplete, sendInviteSmsTokenError);
                            }
                        }

                    });

                };

                $scope.submit = function () {
                    var form = $scope.form;
                    var postData = $.param(form);
                    $http({
                        method: 'POST',
                        url: constants.userRegistrationPostUrl,
                        data: postData,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (message) {
                        if(message.errorMessage) {
                            $scope.errorMessage = message.errorMessage;
                        } else {
                            
                            if (invite) {
                                
                                corpAdministrationService.acceptInvite(invite.inviteId, invite.nonce, $scope.invite.smstoken, message.tcwssUserId).then(function() {
                                    // redirect
                                    $scope.redirectLink = constants.userRegistrationSuccessUrl;
                                }, function(message) {
                                    $scope.errorMessage = message;
                                });

                            } else {

                                corpAdministrationService.createAccessRequest(message.tcwssUserId, form.userName, form.firstName, form.lastName, form.mobileNumber, form.email, "1", form.orgNr.replace("-", "").replace(" ", ""))
                                    .then(function() { $scope.redirectLink = constants.userRegistrationSuccessUrl; },
                                        function(errorMessage) { $scope.errorMessage = errorMessage; });
                            
                            }
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.errorMessage = "Server error " + status;
                    });
                };
            }
        ]);

        var init = function(element) {
            ng.bootstrap(element, ['registerUser']);
        };

        return {
            init: function(element) {
                init(element);
            }

        };

    });