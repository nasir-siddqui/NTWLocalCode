define(['jquery', 'angular', 'underscore', 'common/utils', 'constants', 'helpers/common', 'local/queryStringHelper', 'translationInvite', 'modules/jquery.validation', 'local/angularApplications/templates', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree', 'local/angularApplications/combineRoles', 'angular-route', 'local/angularApplications/commonDirectives', 'local/angularApplications/customTable', 'local/angularApplications/services/manageInviteNgService', 'local/angularApplications/savedOrganizations', 'local/angularApplications/services/corpAdministrationService', 'angular-sanitize'],
    function ($, ng, _, utils, constants, common, queryStringHelper, translation, Validator) {
        "use strict";
    var app = ng.module('manageInvite', ['ngSanitize', 'accessTree', 'combineRoles', 'commonDirectives', 'templates-main', 'selectedRolesService', 'customTable', 'manageInviteNgService', 'corpAdministrationService', 'savedOrganizations']);

    app.directive('tsManageInvite', [function() {
        return {
            templateUrl: constants.manageInviteTemplateUrl,
            controller: 'ManageInviteController',
            transclude: true
        };
    }]);

    app.controller('ManageInviteController', ['$scope', '$q', '$attrs', 'selectedRolesService', 'manageInviteNgService', 'corpAdministrationService', '$timeout', 'validatorService', '$interpolate', '$http', 'savedOrganizationsService', function($scope, $q, $attrs, selectedRolesServiceWrapper, manageInviteNgService, corpAdministrationService, $timeout, service, $interpolate, $http, savedOrganizationsService) {
        
        service.translation = translation;

        $scope.translationInvite = translation;
        $scope.instances = {
            general: '_general',
            orgPrefix: '_org-'
        };

        $scope.texts = {
            generalHeader: translation.translate("ADD_GENERAL_HEADER"),
            generalAddText: translation.translate("ADD_GENERAL_BUTTON"),
            orgAddText: translation.translate("ADD_ROLES_ORG_BUTTON"),
            redirectExpr: $interpolate(translation.translate("SAVE_REDIRECT_TEXT")),
            generalManageText: translation.translate("ADD_GENERAL_MANAGE"),
            orgManageText: translation.translate("ADD_ROLES_ORG_MANAGE")
        };

        $scope.columns = [
            { name: translation.translate("TABLE_NUMBER"), fieldName: "nr" },
            { name: translation.translate("TABLE_NAME"), fieldName: "name" },
            { name: translation.translate("TABLE_ROLES"), fieldName: "hasRoles" }
        ];

        $scope.utils = utils;
        $scope.isLoading = true;

        $scope.saveRedirect = common.isTeliaAdmin ? constants.adminManageUsersTableUrl : constants.manageUsersTableUrl;

        $scope.isAdmin = common.isTeliaAdmin;

        var initOrganisation = function(item) {
            if (!item.loaded) {
                item.loaded = true;
                item.rolesService.setTscId(item.id);
                item.rolesService.loadData();
                item.rolesService.getSelectedRoleIds(function(data, id) {
                    var org = _.find(inviteOrgs, function(item) { return $scope.instances.orgPrefix + item.id === id; });
                    generalRoles.getSelectedRoleIds(function(roles) {
                        var extra = _.difference(data, roles);
                        org.hasRoles = extra.length ? true : false;
                    });
                });
                generalRoles.getSelectedRoleIds(function(roles) {
                    if (!item.initGeneralRoles) {
                        item.initGeneralRoles = true;
                        item.rolesService.setSelectedRoleIds(_.union(roles, item.roles));
                        item.rolesService.setRoleIdsEnabled(roles, false);
                    }
                });
            }
        };

        var generalRoleIds = [];

        var organisationsDeferred = $q.defer();

        var inviteOrgs = [];
        var inviteOrgsDeferred = $q.defer();
        $scope.inviteOrgs = inviteOrgs;

        $scope.$watch("saveError", function(a, b) {
            if (a !== b && a !== "") {
                var _a = a;
                $timeout(function() {
                    if (_a === a) {
                        $scope.saveError = "";
                    }
                }, 5000);
            }
        });

        var inviteOrgsCallback = function(data) {
            _.each(_.filter(data, function(x) { return x.manageUser; }), function(item) {
                item.hasRoles = false;
                item.$selected = false;
                item.roles = [];
                item.rolesService = selectedRolesServiceWrapper.getInstance($scope.instances.orgPrefix + item.id);
                item.loaded = false;
                item.editable = true;
                inviteOrgs.push(item);
            });
            inviteOrgs = _.sortBy(_.uniq(inviteOrgs, function(x) { return x.id; }), 'name');
            $scope.inviteOrgs = inviteOrgs;
            inviteOrgsDeferred.resolve(inviteOrgs);
            return data;
        };

        var transformOrganisations = function(data) {
            var promises = _.map(data, function(x) { return corpAdministrationService.getOrganization(x); });
            return $q.all(promises).then(function(organizations) {
                var orgs = _.map(_.filter(organizations, function(x) {
                    return x !== null;
                }), function(x) {
                    return { id: x.organizationTscid, nr: x.organizationNumber, name: x.name, manageUser: true };
                });
                return inviteOrgsCallback(orgs);
            });
        };

        if (common.isTeliaAdmin) {
            savedOrganizationsService.getSavedOrganizations().then(function(data) {
                transformOrganisations(_.pluck(data, 'organizationTscid'));
            });
        } else {
            inviteOrgsCallback(common.organisations);
        }

        savedOrganizationsService.getOrganizations(function(data) {
            var newOrgs = _.filter(data, function(x) {
                return !_.find(inviteOrgs, function(y) {
                    return y.id === x.organizationTscid;
                });
            });
            if (newOrgs.length) {
                transformOrganisations(_.pluck(newOrgs, 'organizationTscid'));
            }
        });

        manageInviteNgService.getInviteOrganisations({ callback: function(data) {

            _.each(inviteOrgs, function(item) {
                item.$selected = _.find(data, function(x) {
                    return x.id === item.id;
                }) ? true : false;
                if (item.$selected) {
                    initOrganisation(item);
                }
            });

        }});

        $scope.manageInviteNgService = manageInviteNgService;
        $scope.displayOrganisationsWarning = false;

        var generalRoles = selectedRolesServiceWrapper.getInstance($scope.instances.general);
        generalRoles.loadData();

        generalRoles.getSelectedRoleIds(function(data) {
            
            // disable and add the selected roles to the role services for all organisations
            var added = _.difference(data, generalRoleIds);
            var removed = _.difference(generalRoleIds, data);

            generalRoleIds = data;

            _.each(inviteOrgs, function(org) {
                if (org.loaded) {

                    if (added.length) {
                        org.rolesService.addSelectedRoleIds(added);
                        org.rolesService.setRoleIdsEnabled(added, false);
                    } else if (removed.length) {
                        org.rolesService.removeSelectedRoleIds(removed);
                        org.rolesService.setRoleIdsEnabled(removed, true);
                    }

                }
            });

        });

        var inviteId = queryStringHelper.getQueryInt(0);

        if (inviteId > 0) {
            $q.all([corpAdministrationService.getInvite(inviteId), inviteOrgsDeferred.promise]).then(function(d) {
                
                var data = d[0];

                $scope.isLoading = false;

                var _inviteRoles = data.inviteRoles;
                $scope.invite = data;

                data.userInfoLoading = true;

                $timeout(function() {
                    if (service.validator) {
                        _.each(service.validator.fields, function(item) {
                            service.validator.validateField(item);
                        });
                        service.validator.toggleSubmitButton();
                    }
                });

                // filter out the different organisations
                var orgs = _.uniq(_.pluck(_inviteRoles, 'orgId'));
                

                var initAllOrgs = function() {

                    manageInviteNgService.loadUserInfo(data);

                    _.each(inviteOrgs, function(item) {
                        item.$selected = _.contains(orgs, item.id);
                        item.roles = _.pluck(_.where(_inviteRoles, { orgId: item.id }), 'roleId');
                    });

                    var tableOrgs = _.filter(inviteOrgs, function(item) { return item.$selected; });

                    manageInviteNgService.setInviteOrganisations(tableOrgs);

                    _.each(tableOrgs, function(item) {
                        initOrganisation(item);
                    });

                    // compute the roles that are in each organisation
                    var _roles = _.intersection.apply(null, _.pluck(tableOrgs, 'roles'));
                    generalRoles.setSelectedRoleIds(_roles);
                };

                // check if orgs contains any organisation not available for the current user
                var v = _.difference(orgs, _.pluck(inviteOrgs, 'id'));
                if (v.length) {
                    // load the rest of the organisations
                    if (common.isTeliaAdmin) {
                        transformOrganisations(v).then(function(data) {
                            
                            // add the organisations to the savedOrganizations service
                            savedOrganizationsService.addOrganizationTscId(v);
                            var args = [
                                v.length,
                                _.map(v, function(id) {
                                    return _.find(inviteOrgs, function(org) {
                                        return org.id === id;
                                    }).name;
                                }).join(', ')
                            ];
                            $scope.addedOrganisations = translation.translate("ADMIN_ADDED_ORGANISATIONS", args);
                            initAllOrgs();

                        });

                    }
                    // display warning message and filter out the missing organisations
                    else {
                        $scope.displayOrganisationsWarning = true;
                        orgs = _.without.apply(null, [orgs].concat(v));
                        initAllOrgs();
                    }
                } else {
                    initAllOrgs();
                }
                
            }, function(message) {

                $scope.loadingError = message;
                $scope.isLoading = false;

            });

        } else {

            $scope.isLoading = false;
            $scope.invite = { };
            manageInviteNgService.setInviteOrganisations([]);
            generalRoles.setSelectedRoleIds([], true);
        }

        $scope.save = function() {

            $scope.saveError = "";

            var orgs = _.filter(inviteOrgs, function(x) { return x.$selected; });

            if (!orgs.length) {
                // must have at least in organisation
                $scope.saveError = translation.translate("NO_ORGANISATIONS_SELECTED_ERROR");
                return;
            }

            // get all the roles
            var promises = _.map(orgs, function(org) { return org.rolesService.getSelectedRoleIds(); });
            $q.all(promises).then(function(data) {
                var roles = _.flatten(_.map(orgs, function(org, index) {
                    return _.map(data[index], function(role) {
                        return { orgId: org.id, roleId: role };
                    });
                }));

                if (!roles.length) {
                    // must have at least in organisation
                    $scope.saveError = translation.translate("NO_ROLES_SELECTED_ERROR");
                    return;
                }

                // save the invite
                if (inviteId > 0) {
                    // existing invite, update
                    corpAdministrationService.updateInvite(inviteId, $scope.invite.email, $scope.invite.mobileNumber, $scope.invite.firstName, $scope.invite.lastName, $scope.invite.inviteText, roles).then(saveSuccess, error);
                } else {
                    // new invite, create
                    corpAdministrationService.createInvite($scope.invite.email, $scope.invite.mobileNumber, $scope.invite.firstName, $scope.invite.lastName, $scope.invite.inviteText, roles).then(saveSuccess, error);
                }

            });

            var sendEmail = function(invite, update) {

                var _url = update ? constants.sendInviteUpdateEmailUrl : constants.sendInviteEmailUrl;
                var _data = {
                    mailAddress: invite.email,
                    mailFullName: invite.firstName + " " + invite.lastName,
                    mailLoginUrl: constants.loginUrl + "?inviteId=" + invite.inviteId + "&inviteToken=" + invite.nonce,
                    mailRegisterUrl: constants.registerUrl + "?" + invite.inviteId + "&" + invite.nonce,
                    mailComment: (invite.inviteText || "").replace(/\n/g, "<br>"),
                    mailFrom: invite.invitedByName
                };
                
                // i would have used the angular $http module but it is a little more comple to post regular form data. Easier to do that with jquery
                //$http.post(_url, _data, { headers: { "Content-type": "application/x-www-form-urlencoded; charset=utf-8" }, responseType: 'text/plain' });
                
                $.post(_url, _data, function(data) {
                    $scope.$apply(function() {
                        success();
                    });
                }, 'text');

            };

            var saveSuccess = function(data) {

                if (!$scope.invite.inviteId && typeof data === "number") {
                    corpAdministrationService.getInvite(data).then(function(data) {
                        data.invitedByName = common.fullName;
                        sendEmail(data);
                    });
                } else {
                    sendEmail($scope.invite, true);
                }

            };

            var success = function(data) {
                $scope.saveSuccess = true;
            };

            var error = function(message) {
                $scope.saveError = message;
            };

       };


    }]);

    var init = function (element) {
        ng.bootstrap(element, ['manageInvite']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };

});