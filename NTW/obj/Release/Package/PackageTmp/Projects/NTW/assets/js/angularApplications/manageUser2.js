define(['jquery', 'angular', 'constants', 'helpers/common', 'local/queryStringHelper', 'translationPUI', 'translationManageUser', 'local/angularApplications/templates', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree', 'local/angularApplications/combineRoles', 'angular-route', 'local/angularApplications/commonDirectives'],
    function ($, ng, constants, common, queryStringHelper, translationPUI, translation) {
        "use strict";

    var app = ng.module('manageUser', ['accessTree', 'combineRoles', 'ngRoute', 'commonDirectives', 'templates-main']);

    app.config(['$routeProvider', function($routeProvider) {
        if (constants.manageUserUrlRegexp.test(window.location.href)) {
            $routeProvider.
                    when('/home', {templateUrl: constants.manageUserHomeTemplateUrl}).
                    when('/summary', {templateUrl: constants.manageUserSummaryTemplateUrl}).
                    otherwise({redirectTo: '/home'});
        }
    }]);

    app.controller('ManageUserController', ['$scope', '$rootScope', '$q', '$location', 'corpAdministrationService', 'selectedRolesService', '$anchorScroll', '$route', '$interpolate',
        function ($scope, $rootScope, $q, $location, corpAdministrationService, selectedRolesServiceWrapper, $anchorScroll, $route, $interpolate) {

        var selectedRolesService = selectedRolesServiceWrapper.getInstance();
        var url = common.isTeliaAdmin ? constants.adminManageUsersTableUrl : constants.manageUsersTableUrl;

        $scope.translation = translation;
        $scope.translationPUI = translationPUI;
        $scope.currentRoles = [];
        $scope.currentRoleIds = [];
        $scope.errorMessage = null;

        $scope.managePuiAttributes = common.isTeliaAdmin;

        selectedRolesService.managePuiAttributes = $scope.managePuiAttributes;

        $scope.$on("$routeChangeSuccess", function () {
            $anchorScroll(); // Scroll to top on route change
            if ($route.current.$$route) {
                var path = $route.current.$$route.regexp;
                if (new RegExp(path).test('/summary')) {
                    selectedRolesService.loadPuiAttributes();
                }
            }
        });

        $scope.texts = {
            redirectExpr: $interpolate(translation.translate("SAVE_REDIRECT_TEXT"))
        };

        /*$scope.$watch(function () { return selectedRolesService.selectedPuiNames; }, function () {
            $scope.currentRoles = selectedRolesService.selectedRoles;
            $scope.currentRoleIds = selectedRolesService.selectedRoleIds;
        });

        */
        $scope.$watch(function () { return selectedRolesService.attributePuis; }, function(val) {
            $scope.attributePuis = val;
        });

        selectedRolesService.getSelectedRoles(function(roles) {
            $scope.currentRoles = roles;
        });

        $scope.user = null;

        $scope.next = function() {
            $location.path('/summary');
        };

        $scope.prev = function () {
            $location.path('/home');
        };

        $scope.save = function () {
            if ($location.path() !== "/summary") return;

            if ($scope.user.isRequest) {
                // Auto-accept request on save
                corpAdministrationService.acceptRequest($scope.user.organizationTscid, $scope.user.id) // user.id is request id in this case
                    .then(saveUser);
            } else {
                saveUser();
            }
        };

        function saveUser() {
            
            var savedPromise = $q.defer();

            selectedRolesService.getSelectedRoleIds(function(data) {
                
                corpAdministrationService.setRolesOnUser($scope.user.organizationTscid, $scope.user.tcwssUserId, data).then(function() {
                    
                    if ($scope.managePuiAttributes) {
                        // save the pui attributes that have been changed
                        var attrs = [];
                        $.each($scope.attributePuis, function(i, pui) {
                            $.each(pui.attributes, function(j, attr) {
                                if (attr.changed) {
                                    attrs.push({ id: attr.id, value: attr.value });
                                }
                            });
                        });

                        var promises = $.map(attrs, function(attr) {
                            return attr.value !== null && attr.value !== "" ? corpAdministrationService.setPUIAttributeOnProfile(attr.id, $scope.user.tcwssUserId, $scope.user.organizationTscid, attr.value) : corpAdministrationService.deletePUIAttributeOnProfile(attr.id, $scope.user.tcwssUserId, $scope.user.organizationTscid);
                        });

                        $q.all(promises).then(function() { savedPromise.resolve(); }, handleError);
                    } else {
                        savedPromise.resolve();
                    }
                    
                }, handleError);
            });

            savedPromise.promise.then(function() {
                $scope.saveRedirect = url;
            }, handleError);
        }

        $scope.abort = function () {
            navigateToListPage();
        };

        function navigateToListPage() {
            window.location.href = url;
        }

        function handleError(message) {
            $scope.errorMessage = message;
            throw new Error(message);
        }

        function loadUserData(organizationTscid, tcwssUserId) {
            corpAdministrationService.getUserOrRequest(organizationTscid, tcwssUserId)
                .then(function (user) {
                    $scope.user = user;
                    if (!user.isRequest) {
                        corpAdministrationService.getRolesOnUser(organizationTscid, tcwssUserId)
                            .then(function(role) {
                                /*corpAdministrationService.fillPuisOnRoles(role).then(function() {
                                    selectedRolesService.selectRoles(role);
                                }, handleError);*/
                                selectedRolesService.setSelectedRoleIds($.map(role, function(item) { return item.id; }));
                            }, handleError);
                    }
                }, handleError);


        }

        function initController() {
            var organizationTscid = queryStringHelper.getQueryString(0);
            var tcwssUserId = queryStringHelper.getQueryInt(1);
            //selectedRolesService.organizationTscid = organizationTscid;
            //selectedRolesService.tcwssUserId = tcwssUserId;

            selectedRolesService.setTscId(organizationTscid);
            selectedRolesService.setTcwssId(tcwssUserId);

            selectedRolesService.loadData();

            if (tcwssUserId > 0) loadUserData(organizationTscid, tcwssUserId);
            else $scope.errorMessage = "Missing organization and user id.";
        }

        initController();
    }]);

    var init = function (element) {
        ng.bootstrap(element, ['manageUser']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };

});