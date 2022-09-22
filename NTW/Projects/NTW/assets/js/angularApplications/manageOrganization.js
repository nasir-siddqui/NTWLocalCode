/*global define */
define(['jquery', 'angular', 'constants', 'helpers/common', 'local/queryStringHelper', 'local/angularApplications/services/userStorageService', 'local/angularApplications/customTable', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/commonDirectives', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree'],
    function ($, ng, constants, common, queryStringHelper) {
        "use strict";

        var app = ng.module('manageOrganization', ['userStorageService', 'commonDirectives', 'corpAdministrationService', 'selectedRolesService', 'accessTree', 'customTable']);

        app.controller('ManageOrganizationController2', [
            '$scope', '$q', '$timeout', 'corpAdministrationService', 'selectedRolesService', 'userStorageService',
            function ($scope, $q, $timeout, corpAdministrationService, selectedRolesService, userStorageService) {

                $scope.loading = true;
                $scope.newOrganization = null;
                $scope.orgNoRegex = /^(\d{6})(\-)?(\d{4})$/;
                $scope.organization = null;
                $scope.organizationCustom = {
                    phone: null,
                    website: null,
                    cost: null,
                    afNumber: null,
                    contactPerson: null,
                    profitabilitySegment: null,
                };
                $scope.editInformation = false;
                $scope.editInvoiceInformation = false;
                $scope.organizationPuisInitialized = false;

                $scope.saveCustomInformation = function () {
                    // Save all custom data
                    var saveOrganizationCustomData = function(propName, data) {
                        return userStorageService.setOrganisationProperty($scope.organization.organizationTscid, propName, data);
                    };
                    var promises = [];
                    for (var prop in $scope.organizationCustom) {
                        if ($scope.organizationCustom.hasOwnProperty(prop)) {
                            promises.push(saveOrganizationCustomData(prop, $scope.organizationCustom[prop]));
                        }
                    }

                    $q.all(promises).catch(handleError);
                };

                $scope.$watch(
                    function() { return selectedRolesService.selectedPuiNames; },
                    function (puis) {
                        if (!$scope.organizationPuisInitialized || $scope.organization === null) {
                            return;
                        }

                        selectedRolesService.accessReadOnly = true;
                        corpAdministrationService.setPuisOnOrganization($scope.organization.organizationTscid, puis)
                            .then(function() { selectedRolesService.accessReadOnly = false; }, handleError);
                    }
                );

                function handleError(message) {
                    $scope.errorMessage = message;
                    $scope.loading = false;
                    throw new Error(message);
                }

                $scope.createOrganization = function () {
                    $scope.newOrganization.failedAlreadyExists = false;
                    $scope.newOrganization.failedMissingInAlpha = false;
                    $scope.newOrganization.disabled = true;
                    
                    if ($scope.newOrganization && $scope.newOrganization.orgNo) {
                        corpAdministrationService.getOrganizationByOrgNr($scope.newOrganization.orgNo)
                            .then(function(organization) {
                                if (organization !== null) {
                                    $scope.newOrganization.failedAlreadyExists = true;
                                    $scope.newOrganization.disabled = false;
                                    return $q.reject("ORGANIZATION_ALREADY_EXISTS");
                                }
                            }, handleError)
                            .then(function() {
                                corpAdministrationService.createOrganizationIfNotExists($scope.newOrganization.orgNo)
                                    .then(function(organizationTscid) {
                                        if (organizationTscid === null) {
                                            return $q.reject("AGORA_ERROR_ORGANISATION_DOES_NOT_EXIST_IN_ALPHA");
                                        }
                                        window.location.href = constants.adminManageOrganizationUrl.substituteUrlParameters({ organizationTscid: organizationTscid });
                                    })
                                    .catch(function(error) {
                                        if (error.contains("AGORA_ERROR_ORGANISATION_DOES_NOT_EXIST_IN_ALPHA")) {
                                            $scope.newOrganization.failedMissingInAlpha = true;
                                        } else {
                                            handleError(error);
                                        }
                                        $scope.newOrganization.disabled = false;
                                    });
                            });
                    }
                };

                function loadOrganization(organizationTscid) {
                    // Get basic organization data
                    var orgPromise = corpAdministrationService.getOrganization(organizationTscid)
                        .then(function(org) {
                            $scope.organization = org;
                        });
                    // Get organization puis
                    var puiPromise = corpAdministrationService.getAllPuiOnOrganization(organizationTscid)
                        .then(function (puis) {
                            var puiNames = $.map(puis, function(pui) { return pui.name; });
                            selectedRolesService.selectPuiNames(puiNames);
                            $timeout(function() {
                                $scope.$apply(function() { $scope.organizationPuisInitialized = true; });
                            });
                        });

                    // Get custom data
                    var getOrganizationCustomData = function(propName) {
                        return userStorageService.getOrganisationProperty(organizationTscid, propName).then(function(data) { $scope.organizationCustom[propName] = data; });
                    };
                    var promises = [orgPromise, puiPromise];
                    for (var prop in $scope.organizationCustom) {
                        if ($scope.organizationCustom.hasOwnProperty(prop)) {
                            promises.push(getOrganizationCustomData(prop));
                        }
                    }

                    $q.all(promises).then(function() {
                        $scope.loading = false;
                    }, handleError);

                }
                 

                function initController() {
                    var organizationTscid = queryStringHelper.getQueryString();

                    selectedRolesService.organizationAdminMode = true;
                    selectedRolesService.organizationTscid = organizationTscid;
                    selectedRolesService.loadData();

                    if (organizationTscid > 0) {
                        // Mode: Edit existing organization
                        loadOrganization(organizationTscid);
                    } else {
                        // Mode: Create new organization
                        $scope.newOrganization = {};
                        $scope.loading = false;
                    }
                }

                initController();
            }
        ]);

        var init = function(element) {
            ng.bootstrap(element, ['manageOrganization']);
        };

        return {
            init: function(element) {
                init(element);
            }

        };

    });