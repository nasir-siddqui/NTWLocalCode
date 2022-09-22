define(['jquery', 'angular', 'constants', 'helpers/common', 'local/queryStringHelper', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree', 'local/angularApplications/combineRoles'],
    function ($, ng, constants, common, queryStringHelper) {
        "use strict";

    var app = ng.module('manageroles', ['corpAdministrationService', 'selectedRolesService', 'accessTree', 'combineRoles']);

    app.controller('ManageRoleController', ['$scope', '$timeout', '$q', 'corpAdministrationService', 'selectedRolesService', function ($scope, $timeout, $q, corpAdministrationService, selectedRolesServiceWrapper) {
        
        var selectedRolesService = selectedRolesServiceWrapper.getInstance();

        $scope.role = {
            name: null,
            description: null,
            id: null,
            organizationTscid: null
        };
        $scope.errorMessage = null;
        $scope.saveError = null;
        $scope.loading = true;
        $scope.selectedRolesService = selectedRolesService;
        $scope.common = common;
        $scope.proceed = false;

        function navigateToListPage() {
            window.location.href = common.isTeliaAdmin ? constants.adminManageRolesTableUrl : constants.manageRolesTableUrl;
        }

        function success() {
            $scope.saveStatus = "FINISHED";
            $scope.proceed = true;
            $timeout(function() {
                navigateToListPage();
            }, 1000);
        }

        function handleError(message) {
            $scope.errorMessage = message;
            throw new Error(message);
        }

        function handleSaveError(message) {
            $scope.errorMessage = message;
            $scope.saveStatus = "FAILED";
            throw new Error(message);
        }

        $scope.prev = function() {
            navigateToListPage();
        };

        $scope.deleteEnabled = function() {
            return ($scope.role.id !== null && ($scope.role.organizationTscid === common.orgTscid || common.isTeliaAdmin));
        };

        $scope._delete = function() {
            corpAdministrationService.deleteRole($scope.role.organizationTscid, $scope.role.id)
                    .then(navigateToListPage, handleError);
        };

        $scope.saveEnabled = function () {
            return (selectedRolesService.tscId === common.orgTscid || common.isTeliaAdmin);
        };

        $scope.saveTemporaryDisabled = function() {
            if ($scope.role.name && $scope.puiIsSelected) {
                return false;
            }
            else {
                return true;
            }
        };

        $scope.save = function() {
            $scope.saveStatus = "LOADING";
            selectedRolesService.getSelectedPuiNames(function(names) {
                if ($scope.role.id === null) {
                    if (selectedRolesService.tscId > 0) { // If organization is set, create as organization role
                            corpAdministrationService.createOrganizationRole(selectedRolesService.tscId, $scope.role.name, $scope.role.description, names).then(success, handleSaveError);
                    } else { // No organization (telia admin), create as system role
                        corpAdministrationService.createSystemRole($scope.role.name, $scope.role.description, names).then(success, handleSaveError);
                    }
                } else {
                    if (!$scope.role.systemRole) {
                        corpAdministrationService.updateOrganizationRole($scope.role.organizationTscid, $scope.role.id, $scope.role.name, $scope.role.description, names).then(success, handleSaveError);
                    } else {
                        corpAdministrationService.updateSystemRole($scope.role.id, $scope.role.name, $scope.role.description, names).then(success, handleSaveError);
                    }
                }
            });
        };

        function loadRoleData(roleId, organizationTscid) {
            var rolePromise;
            if (organizationTscid > 0) {
                rolePromise = corpAdministrationService.getOrganizationRole(organizationTscid, roleId);
            } else {
                rolePromise = corpAdministrationService.getSystemRole(roleId);
            }
            rolePromise.then(function(role) {
                $scope.role.name = role.roleName;
                $scope.role.description = role.description;
                $scope.role.id = role.id;
                $scope.role.organizationTscid = role.organizationTscid || 0;
                $scope.role.systemRole = role.systemRole;
                selectedRolesService.setSelectedPuiNames($.map(role.puis, function(pui) { return pui.name; }));
                $scope.loading = false;
            }, handleError);
        };

        function initController() {
            selectedRolesService.combineRolesEnabled = false;
            var roleId = queryStringHelper.getQueryInt(0);
            var organizationTscid = queryStringHelper.getQueryString(1);

            //selectedRolesService.organizationTscid = organizationTscid || common.orgTscid;
            var tscId = organizationTscid || common.orgTscid;
            if (tscId && tscId !== "" && tscId !== "0") {
                selectedRolesService.setTscId(tscId);
            }
            selectedRolesService.loadData();

            if (roleId > 0) loadRoleData(roleId, organizationTscid);
            else $scope.loading = false;
        }

        initController();
    }]);

    var init = function (element) {
        ng.bootstrap(element, ['manageroles']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };

});