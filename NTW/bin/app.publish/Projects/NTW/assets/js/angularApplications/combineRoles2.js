define(['jquery', 'angular', 'constants', 'translationManageUser', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/templates'], function ($, ng, constants, translation) {
    "use strict";

    var app = ng.module('combineRoles', ['selectedRolesService', 'templates-main']);

    app.directive('tsCombineRoles', ['selectedRolesService', function (selectedRolesServiceWrapper) {
        return {
            templateUrl: constants.combineRolesTemplateUrl,
            replace: 'true',
            //controller: 'CombineRolesController',
            link: function($scope, element, $attrs, controller) {
                
                $scope.manageEnabled = $attrs.manageEnabled && $attrs.manageEnabled === "true";

                var instanceId = $scope.$eval($attrs.instance);
                var selectedRolesService = selectedRolesServiceWrapper.getInstance(instanceId);

                $scope.visible = selectedRolesService.combineRolesEnabled;
                $scope.$watch(function() { return selectedRolesService.combineRolesEnabled; }, function() {
                    $scope.visible = selectedRolesService.combineRolesEnabled;
                    //if ($scope.visible && $scope.allRoles === null) getRoleData();
                });

                $scope.translation = translation;

                $scope.manageText = $scope.translation.translate($attrs.manageText || "COMBINE_ROLES_MANAGE");
                $scope.closeText = $scope.translation.translate($attrs.closeText || "COMBINE_ROLES_CLOSE");
                $scope.headerText = $scope.translation.translate($attrs.headerText || "Add roles to user");
                $scope.addText = $scope.translation.translate($attrs.addText || "Add user role");

                if (typeof $attrs.headerTextExpr !== "undefined") {
                    $scope.headerText = $scope.$eval($attrs.headerTextExpr);
                }
                if (typeof $attrs.addTextExpr !== "undefined") {
                    $scope.addText = $scope.$eval($attrs.addTextExpr);
                }
                if ($attrs.manageTextExpr) {
                    $scope.manageText = $scope.$eval($attrs.manageTextExpr);
                }
                if ($attrs.closeTextExpr) {
                    $scope.closeText = $scope.$eval($attrs.closeTextExpr);
                }

                $scope.allRoles = null;
                $scope.combinedRoles = [];
                $scope.addActive = false;
                $scope.manage = $attrs.manageInit && $attrs.manageInit === "true";

                /*
                $scope.$watch(function () { return selectedRolesService.selectedRoleIds; }, function (newVal) { setCombinedRoles(newVal); });
                $scope.$watch(function () { return selectedRolesService.availableRoles; }, function () { getRoleData(); });
                */
               
                $scope.toggleAdd = function () {
                    $scope.addActive = !$scope.addActive;
                };

                $scope.toggleManage = function () {
                    $scope.manage = !$scope.manage;
                };

                function addRole(role) {
                    role.$selected = true;
                    $scope.combinedRoles = $scope.combinedRoles.concat([role]);
                    updateSelectedRoles();
                };

                function removeRole(role) {
                    role.$selected = false;
                    $scope.combinedRoles = $.grep($scope.combinedRoles, function (r) { return r.id !== role.id; });
                    updateSelectedRoles();
                };

                $scope.toggleRole = function (role) {
                    if (role.$disabled) {
                        return;   
                    }
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
                    updateSelectedRoles();
                }

                function updateSelectedRoles() {
                    selectedRolesService.setSelectedRoleIds($.map($scope.combinedRoles, function(item) { return item.id; }));
                }

                function getRoleData() {
                    if (selectedRolesService.organizationTscid !== null && selectedRolesService.availableRoles !== null) {
                        $scope.allRoles = selectedRolesService.getAvailableRoles();
                        setCombinedRoles(selectedRolesService.getSelectedRoleIds());
                    }
                }

                function init() {
                    /*if ($attrs.systemRoles !== undefined && $attrs.organizationRoles !== undefined) {
                        $scope.allRoles = $.parseJSON($attrs.systemRoles).concat($.parseJSON($attrs.organizationRoles));
                        setCombinedRoles(selectedRolesService.selectedRoleIds);
                    } else {
                        if (selectedRolesService.organizationTscid !== null) getRoleData();
                    }*/
                    //window.t = selectedRolesService;

                    selectedRolesService.getAvailableRoles(function(data) {
                        $scope.allRoles = data;
                        selectedRolesService.getSelectedRoleIds(function(data) {
                            setCombinedRoles(data);
                        });
                    });
                }

                init();
            }
        };
    }]);

    app.controller("CombineRolesController", ['$timeout', '$scope', '$rootScope', '$q', '$attrs', 'selectedRolesService', function ($timeout, $scope, $rootScope, $q, $attrs, selectedRolesServiceWrapper) {
                $scope.$watch("manage", function (newVal) { console.log(newVal); });

    }]);
});