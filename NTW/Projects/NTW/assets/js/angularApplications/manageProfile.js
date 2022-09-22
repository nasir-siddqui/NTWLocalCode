define(['jquery', 'angular', 'constants', 'helpers/common', 'local/queryStringHelper', 'local/angularApplications/services/userStorageService', 'local/angularApplications/services/userSettingsService', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree', 'local/angularApplications/combineRoles', 'local/angularApplications/commonDirectives'],
    function ($, ng, constants, common, queryStringHelper) {
        "use strict";

    var app = ng.module('manageProfile', ['userSettingsService', 'userStorageService', 'accessTree', 'combineRoles', 'commonDirectives']);


    app.controller('ManageProfileController', ['$scope', '$rootScope', '$attrs', '$q', '$http', '$sce', 'userStorageService', 'userSettingsService', 'corpAdministrationService', 'selectedRolesService', function ($scope, $rootScope, $attrs, $q, $http, $sce, userStorageService, userSettingsService, corpAdministrationService, selectedRolesService) {
        $scope.edit = false;
        $scope.editPreference = false;
        $scope.editLanguage = false;
        $scope.languages = common.languages;
        $scope.editCompany = false;
        $scope.enableSaveOrganizations = false;
        $scope.organizations = JSON.parse($attrs.organizations);
        $scope.registeredOrganization = false;
        $scope.orgIdRegex = /^(\d{6})(\-)?(\d{4})$/;
        $scope.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $scope.mobileRegex = /^(\+)?\d{1,3}(\-)?\d{9,10}$/;
        $scope.editPassword = false;
        $scope.showPassword = false;
        $scope.samePassword = false;
        $scope.passwordAttempt = false;
        $scope.saveUserAttempt = false;
        $scope.mobileNumberObject = { name: "Mobiltelefon", value: "phone" };
        $scope.emailObject = { name: "E-post", value: "email" };
        $scope.loginOptions = [
            $scope.mobileNumberObject, $scope.emailObject
        ];
        $scope.exampleMobileNumber = 'Ex: 0721234567';



        /////////////////////////////////////
        // Edit content

        // User info
        $scope.editUserInfo = function() {
            $scope.edit = !$scope.edit;
        }

        $scope.saveUserInfo = function() {
            $scope.saveUserInfoStatus = "LOADING";
            $scope.saveUserAttempt = true;
            $scope.needHigherAuthLevel = false;
            var email = $scope.newEmail || $scope.email;
            var mobileNumber = $scope.newMobileNumber || $scope.mobileNumber;
            var currentUrl = document.URL;
            currentUrl = currentUrl.replace('https://www.telia.se/', '');
            var loginUrlParams = constants.loginUrlSMS + "&ref=" + currentUrl;

            var postData = {
                email: email,
                mobileNumber: mobileNumber,
                loginUrl: loginUrlParams,
            }

            postData = $.param(postData);

            $http({
                method: 'POST',
                url: constants.userInfo,
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
            }).success(function(data, status, headers, config) {
                $scope.hideUserAttention = false;
                if (data.email) {
                    $scope.savedUserInfoSuccess = true;
                    $scope.edit = false;
                    $scope.clearedUserInfo = false;
                    $scope.email = email;
                    $scope.mobileNumber = mobileNumber;
                    $scope.saveUserInfoStatus = "RESET";
                }
                else {
                    $scope.saveUserFailed = true;
                    $scope.savedUserInfoSuccess = false;
                    $scope.userInfoErrorMessage = data;
                    $scope.trustedHtml = $sce.trustAsHtml($scope.userInfoErrorMessage);
                    $scope.saveUserInfoStatus = "FAILED";
                }

            });
        }

        function getUserInfo() {

            var postData = {
                getUserInfo: true
            }

            postData = $.param(postData);

            $http({
                method: 'POST',
                url: constants.userInfo,
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
            }).success(function(data, status, headers, config) {
                $scope.email = data.email;
                $scope.mobileNumber = data.mobileNumber;
                getDefaultLoginMethod();
            });
        }

        $scope.clearUserInfo = function() {
            $scope.saveUserInfoStatus = "RESET";
            $scope.saveUserAttempt = false;
            $scope.clearedUserInfo = true;
            $scope.edit = false;
            $scope.newMobileNumber = "";
            $scope.newEmail = "";
        }


        // Roles
        function getRoles() {
            corpAdministrationService.getRolesOnProfile(common.orgTscid).then(function (roles) {
                $scope.roles = roles;
                corpAdministrationService.fillPuisOnRoles(roles).then(function() {
                    selectedRolesService.selectRoles(roles);
                });
            });
        }


        // Preferences
        $scope.editPreferences = function() {
            $scope.editPreference = !$scope.editPreference;
            if ($scope.editPreference === false) {
                $scope.organization = $scope.defaultOrganization;
                $scope.language = $scope.defaultLanguage;
            }
        }

        $scope.savePreferences =  function() {
            var savedOrganization = false;
            var savedLanguage = false;
            var savedLoginMethod = false;
            $scope.findOrganization = false;
            $scope.savePreferencesStatus = "LOADING";

            if ($scope.language.value) {
                $scope.defaultLanguage = $scope.language;
                userSettingsService.setLanguage($scope.language.value).then(function() {
                    savedLanguage = true;
                    if ($scope.loginMethod) {
                        saveLoginMethod();
                    }
                    else if ($scope.organization.organizationTscid) {
                        saveOrganization();
                    }
                    else {
                        clearSave();
                    }

                });
            }


            function saveOrganization() {
                $scope.defaultOrganization = $scope.organization;
                userSettingsService.setDefaultOrganization($scope.organization).then(function() {
                    savedOrganization = true;
                    clearSave();
               });
            }

            function saveLoginMethod() {
                $scope.defaultLoginMethod = $scope.loginMethod;
                userStorageService.setUserProperty("preferredTwoLevelLoginMethod", $scope.loginMethod.value).then(function() {
                    savedLoginMethod = true;
                    if ($scope.organization.organizationTscid) {
                        saveOrganization();
                    }
                    else {
                        clearSave();
                    }
                });
            }


            function clearSave() {
                $scope.hidePreferencesAttention = false;
                $scope.savePreferencesStatus = "RESET";
                $scope.editPreference = false;
                $scope.savedPreferencesSuccess = true;
                $scope.clearedPreferences = false;
            }

        }

        // Add new organization
        $scope.openFindOrganization = function() {
            $scope.organizationNumber = "";
            $scope.registeredOrganization = false;
        }

        $scope.registerOrganization = function() {
            $scope.registerOrganizationStatus = "LOADING";
            corpAdministrationService.createAccessRequest(common.userId, null, null, null, null, null, "1", $scope.organizationNumber.replace("-", "").replace(" ", ""))
                .then(function() { $scope.registerOrganizationSuccess = true; $scope.registerOrganizationStatus = "FINISHED"; $scope.registeredOrganization = true; $scope.clearFindOrganization();},
                    function(errorMessage) { $scope.registerOrganizationSuccess = false; $scope.hideRegisterAttention = false; $scope.registerOrganizationStatus = "FAILED"; $scope.registerOrganizationErrorMessage = errorMessage; });
        }

        // Clear
        $scope.clearPreferences = function() {
            $scope.clearedPreferences = true;
            $scope.editPreference = false;
            $scope.language = $scope.defaultLanguage;
            $scope.organization = $scope.defaultOrganization;
            $scope.loginMethod = $scope.defaultLoginMethod;
            $scope.findOrganization = false;
        }

        $scope.clearFindOrganization = function() {
            $scope.findOrganization = false;
            $scope.registerOrganizationStatus = "RESET";
        }


        // Get default preferences
        function getDefaultLanguage() {
            userSettingsService.getLanguage().then(function (storedLanguage) {
                if (storedLanguage) {
                    var match = $.grep($scope.languages, function(language) { return language.value === storedLanguage });
                    if (match.length > 0) {
                        $scope.language = match[0];
                        $scope.defaultLanguage = match[0];
                    }
                    else {
                        $scope.language = $scope.languages[0];
                    }

                } 
                else {
                    $scope.defaultLanguage = $scope.languages[0];
                    $scope.language = $scope.languages[0];
                }
            });
        }


        function getDefaultOrganization() {
            userSettingsService.getDefaultOrganizationTscid().then(function (storedOrganizationTscid) {
                if (typeof storedOrganizationTscid == "undefined") {
                    $scope.defaultOrganization = $scope.organizations[0];
                }
                else if (storedOrganizationTscid === null) {
                    $scope.defaultOrganization = $scope.organizations[0];
                } 
                else {
                    var match = $.grep($scope.organizations, function(organization) { return organization.organizationTscid === storedOrganizationTscid });
                    if(match.length > 0) {
                        $scope.organization = match[0];
                        $scope.defaultOrganization = match[0];
                    } 
                    else {
                        $scope.organization = $scope.organizations[0]; 
                        $scope.defaultOrganization = $scope.organizations[0];
                    }

                }
            });
        }

        function getDefaultLoginMethod() {
            function defaultLoginMethod() {
                if ($scope.mobileNumber) {
                    $scope.defaultLoginMethod = $scope.loginOptions[0];
                } 
                else if ($scope.email) {
                    $scope.defaultLoginMethod = $scope.loginOptions[1];
                }
                else {
                    $scope.defaultLoginMethod = "";
                }
                $scope.loginMethod = $scope.defaultLoginMethod;
            }

            userStorageService.getUserProperty("preferredTwoLevelLoginMethod").then(function (storedLoginMethod) {
                if (typeof storedLoginMethod == "undefined") {
                    defaultLoginMethod();
                }
                else if (storedLoginMethod === null) {
                    defaultLoginMethod();
                }
                else {
                    var match = $.grep($scope.loginOptions, function(loginMethod) { return loginMethod.value === storedLoginMethod });
                    if (match.length > 0) {
                        $scope.loginMethod = match[0];
                        $scope.defaultLoginMethod = match[0];
                    }
                    else {
                        defaultLoginMethod();
                    }
                }
            });

        }


        /////////////////////////////////////
        // Password handling
        $scope.$watch('newPassword', comparePasswords);

        $scope.$watch('repeatPassword', comparePasswords);

        function comparePasswords() {
            if ($scope.newPassword && ($scope.newPassword.length > 5) && ($scope.newPassword == $scope.repeatPassword)) {
                $scope.samePassword = true;
            }
            else {
                $scope.samePassword = false;
            }
        }

        $scope.editPasswords = function() {
            $scope.editPassword = !$scope.editPassword;
        }

        $scope.showPasswords = function() {
            $scope.showPassword = !$scope.showPassword;
        }

        $scope.clearPasswords = function() {
            $scope.editPasswords();
            $scope.currentPassword = "";
            $scope.newPassword = "";
            $scope.repeatPassword = "";
            $scope.passwordAttempt = false;
        }

        $scope.savePasswords = function() {
            $scope.passwordSaveStatus = "LOADING";
            var postData = {
                password: $scope.currentPassword,
                newPassword: $scope.newPassword,
                repeatPassword: $scope.repeatPassword
            }

            postData = $.param(postData);

            $http({
                method: 'POST',
                url: constants.changePassword,
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
            }).success(function(data, status, headers, config) {
                $scope.passwordAttention = false;
                console.log(data);
                if (/\S/.test(data)) {
                    $scope.passwordSaveStatus = "FAILED";
                    $scope.errorMessage = data;
                    $scope.success = false;
                    $scope.passwordAttempt = true;
                }
                else {
                    $scope.passwordSaveStatus = "FINISHED";
                    $scope.success = true;
                    $scope.passwordAttempt = true;
                }
            });
        }


        function initController() {
            getUserInfo();
            getRoles();
            getDefaultOrganization();
            getDefaultLanguage();
            selectedRolesService.loadData();
        }

        initController();
    }]);

    var init = function (element) {
        ng.bootstrap(element, ['manageProfile']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };

});