define(['jquery', 'angular', 'constants', 'helpers/common', 'errorKeyTranslation', 'local/queryStringHelper', 'underscore', 'local/angularApplications/services/userStorageService', 'local/angularApplications/customTable', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/commonDirectives', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/accessTree'],
    function ($, ng, constants, common, errorKeyTranslation, queryStringHelper, _) {

        var app = ng.module('manageOrganization', ['userStorageService', 'commonDirectives', 'corpAdministrationService', 'selectedRolesService', 'accessTree', 'customTable']);

        app.controller('ManageOrganizationController', [
            '$scope', '$q', '$timeout', 'corpAdministrationService', 'selectedRolesService', 'userStorageService',
            function ($scope, $q, $timeout, corpAdministrationService, selectedRolesServiceWrapper, userStorageService) {

                var selectedRolesService = selectedRolesServiceWrapper.getInstance();

                var contacts = [];
                var tscid = null;

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

                $scope.loadingContacts = true;
                $scope.contacts = [];

                var loadContacts = function() {
                    userStorageService.getOrganisationProperty(tscid, 'contacts').then(function(data) {
                        data = data || '[]';
                        $scope.contacts = ng.fromJson(data);
                        contacts = ng.fromJson(data);
                        $scope.loadingContacts = false;
                    });
                };

                /*$scope.contacts = [
                    {
                        n: "Christian Nagorka",
                        e: "christian.nagorka@teliasonera.com",
                        p: "0708471451"
                    },
                    {
                        n: "Lasse Kongo",
                        e: "lasse.kongo@teliasonera.com",
                        p: "0123456787"
                    }
                ];*/

                $scope.$watch('contacts', function(val, old) {
                    $scope.saveContactsDisabled = _.isEqual(contacts, val);
                }, true);

                $scope.newContact = { n: "", e: "", p: "" };

                $scope.addContact = function() {
                    $scope.contacts.push($scope.newContact);
                    $scope.newContact = {};
                };

                $scope.removeContact = function(index) {
                    $scope.contacts.splice(index, 1);
                };

                $scope.saveContacts = function() {

                    var data = ng.toJson($scope.contacts);
                    $scope.saveContactsDisabled = true;
                    contacts = ng.fromJson(data);
                    userStorageService.setOrganisationProperty(tscid, 'contacts', data).then(function() {

                    });
                };

                $scope.saveCustomInformation = function () {
                    // Save all custom data
                    console.log('saveCustomInformation');

                    var saveOrganizationCustomData = function(propName, data) {
                        return userStorageService.setOrganisationProperty($scope.organization.organizationTscid, propName, data);
                    };
                    var promises = [];
                    for (var prop in $scope.organizationCustom) {
                        if ($scope.organizationCustom.hasOwnProperty(prop)) {
                            promises.push(saveOrganizationCustomData(prop, $scope.organizationCustom[prop]));
                        }
                    }

                    $q.all(promises)['catch'](handleError);
                };

                /*$scope.$watch(
                    function() { return selectedRolesService.selectedPuiNames; },
                    function (puis) {
                        if (!$scope.organizationPuisInitialized || $scope.organization === null) {
                            return;
                        }

                        selectedRolesService.accessReadOnly = true;
                        corpAdministrationService.setPuisOnOrganization($scope.organization.organizationTscid, puis)
                            .then(function() { selectedRolesService.accessReadOnly = false; }, handleError);
                    }
                );*/
                var puichange = null;
                var org = null;
                // listen for change of organization
                $scope.$watch("organization", function(val) {
                    if (val && !org) {
                        org = val;
                        // listen for change in pui names
                        selectedRolesService.getSelectedPuiNames(function(data) {
                            // ignore first time
                            if (puichange) {
                                selectedRolesService.accessReadOnly = true;
                                corpAdministrationService.setPuisOnOrganization($scope.organization.organizationTscid, data).then(function() {
                                    selectedRolesService.accessReadOnly = false;
                                }, handleError);
                            } else {
                                puichange = true;
                            }
                        });
                    }
                });

                function handleError(message) {
                    $scope.errorMessage = message;
                    $scope.loading = false;
                    //throw new Error(message);
                }

                $scope.createOrganization = function () {
                    $scope.newOrganization.failedAlreadyExists = false;
                    $scope.newOrganization.failedMissingInAlpha = false;
                    $scope.newOrganization.disabled = true;
                    
                    if ($scope.newOrganization && $scope.newOrganization.orgNo) {
                        corpAdministrationService.getOrganizationByOrgNr($scope.newOrganization.orgNo)
                            .then(function(organization) {
                                if (organization !== null) {
                                    $scope.newOrganization.disabled = false;
                                    return $q.reject(errorKeyTranslation.getMessage("ORGANIZATION_ALREADY_EXISTS"));
                                }
                            }, handleError)
                            .then(function() {
                                corpAdministrationService.createOrganizationIfNotExists($scope.newOrganization.orgNo)
                                    .then(function(organizationTscid) {
                                        if (organizationTscid === null) {
                                            return $q.reject(errorKeyTranslation.getMessage("AGORA_ERROR_ORGANISATION_DOES_NOT_EXIST_IN_ALPHA"));
                                        }
                                        window.location.href = constants.adminManageOrganizationUrl.substituteUrlParameters({ organizationTscid: organizationTscid });
                                    })
                                    ['catch'](function(error) {
                                        $scope.newOrganization.disabled = false;
                                        handleError(error);
                                    });
                            }, handleError);
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
                            selectedRolesService.setSelectedPuiNames(puiNames);
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

                    tscid = organizationTscid;

                    selectedRolesService.organizationAdminMode = true;
                    //selectedRolesService.organizationTscid = organizationTscid;
                    selectedRolesService.setTscId(organizationTscid);
                    selectedRolesService.loadData();

                    console.log(organizationTscid);

                    if (organizationTscid !== "ny") {
                        // Mode: Edit existing organization
                        loadOrganization(organizationTscid);
                        loadContacts();
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