define(['jquery', 'angular', 'constants', 'translationManageUser', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/templates'], function ($, ng, constants, translation) {
    "use strict";

    var app = ng.module('combineRoles', ['selectedRolesService', 'templates-main']);

    app.directive('tsCombineRoles', function () {
        return {
            templateUrl: constants.combineRolesTemplateUrl,
            replace: 'true',
            controller: 'CombineRolesController'
        };
    });

    app.controller("CombineRolesController", ['$compile', '$scope', '$rootScope', '$q', '$attrs', 'selectedRolesService', function ($compile, $scope, $rootScope, $q, $attrs, selectedRolesService) {
        $scope.allRoles = null;
        $scope.combinedRoles = [];
        $scope.addActive = false;
        $scope.translation = translation;
        $scope.headerText = $scope.translation.translate($attrs.headerText || "Add roles to user");
        $scope.addText = $scope.translation.translate($attrs.addText || "Add user role");

        $scope.visible = selectedRolesService.combineRolesEnabled;
        $scope.$watch(function() { return selectedRolesService.combineRolesEnabled; }, function() {
            $scope.visible = selectedRolesService.combineRolesEnabled;
            if ($scope.visible && $scope.allRoles === null) getRoleData();
        });
        $scope.$watch(function () { return selectedRolesService.selectedRoleIds; }, function (newVal) { setCombinedRoles(newVal); });
        $scope.$watch(function () { return selectedRolesService.availableRoles; }, function () { getRoleData(); });

        $scope.toggleAdd = function () {
            $scope.addActive = !$scope.addActive;
        };

        function addRole(role) {
            role.$selected = true;
            $scope.combinedRoles = $scope.combinedRoles.concat([role]);
            updateEffectivePuis();
        };

        function removeRole(role) {
            role.$selected = false;
            $scope.combinedRoles = $.grep($scope.combinedRoles, function (r) { return r.id !== role.id; });
            updateEffectivePuis();
        };

        $scope.toggleRole = function (role) {
            if (role.$selected) {
                removeRole(role);
            } else {
                addRole(role);
            }
        };

        function setCombinedRoles(roleIds) {
            if ($scope.allRoles === null) return;

            $scope.combinedRoles = $.map(roleIds, function (roleId) {
                return $.grep($scope.allRoles, function (role) {
                    return role.id === roleId;
                });
            });
            $.each($scope.allRoles, function() { this.$selected = false; });
            $.each($scope.combinedRoles, function() { this.$selected = true; });
            updateEffectivePuis();
        }

        function updateEffectivePuis() {
            selectedRolesService.selectRoles($scope.combinedRoles);
        }

        function getRoleData() {
            if (selectedRolesService.organizationTscid !== null && selectedRolesService.availableRoles !== null) {
                $scope.allRoles = selectedRolesService.availableRoles;
                setCombinedRoles(selectedRolesService.selectedRoleIds);
            }
        }

        function init() {
            if ($attrs.systemRoles !== undefined && $attrs.organizationRoles !== undefined) {
                $scope.allRoles = $.parseJSON($attrs.systemRoles).concat($.parseJSON($attrs.organizationRoles));
                setCombinedRoles(selectedRolesService.selectedRoleIds);
            } else {
                if (selectedRolesService.organizationTscid !== null) getRoleData();
            }
        }

        init();


    }]);
});