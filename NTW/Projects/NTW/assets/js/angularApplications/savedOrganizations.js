/*global define*/
define([
    'jquery',
    'angular',
    'underscore',
    'constants',
    'translationSavedOrganizations',
    'local/angularApplications/services/savedOrganizationsService',
    'local/angularApplications/services/corpAdministrationService',
    'local/angularApplications/commonDirectives',
    'local/angularApplications/customTable',
    'local/angularApplications/templates'
    ], function ($, ng, _, constants, translation) {
    "use strict";
    var app = ng.module('savedOrganizations', ['savedOrganizationsService', 'commonDirectives', 'customTable', 'templates-main']);

    app.directive('tsSavedOrganizations', function () {
        return {
            templateUrl: constants.savedOrganizationsTemplateUrl,
            replace: 'true',
            scope: {},
            controller: ['$scope', '$attrs', '$q', 'savedOrganizationsService', 'corpAdministrationService', function ($scope, $attrs, $q, savedOrganizationsService, corpAdministrationService) {

                $scope.newOrganization = null;
                $scope.orgIdRegex = /^(\d{6})(\-)?(\d{4})$/;
                $scope.isSearching = false;
                $scope.savedOrganizations = null;
                $scope.hideResults = false;

                $scope.texts = {
                    header: translation.translate($attrs.header || "HEADER"),
                    manage: translation.translate($attrs.manage || "MANAGE"),
                    close: translation.translate($attrs.close || "CLOSE"),
                    noResult: translation.translate($attrs.noResult || "NO_RESULT"),
                    add: translation.translate($attrs.add || "ADD")
                };

                var _readOnly = ($attrs["readOnly"] && $attrs["readOnly"] === "true") || false;

                $scope.toggleOrganization = function (organization) {
                    if (organization.$selected) {
                        $scope.removeOrganization(organization);
                    } else {
                        $scope.addOrganization(organization);
                    }
                };

                $scope.addOrganization = function (organization) {
                    organization.$selected = true;
                    $scope.hideResults = true;
                    $scope.savedOrganizations.push(organization);
                    savedOrganizationsService.updateSavedOrganizations($scope.savedOrganizations, _readOnly);
                    $scope.organiziationId = "";
                };

                $scope.removeOrganization = function (organization) {
                    organization.$selected = false;
                    $scope.hideResults = false;
                    $scope.savedOrganizations = $.grep($scope.savedOrganizations, function (o) { return o.organizationTscid !== organization.organizationTscid; });
                    savedOrganizationsService.updateSavedOrganizations($scope.savedOrganizations);
                };

                $scope.getOrganization = function (organizationNumber) {
                    $scope.isSearching = true;
                    $scope.newOrganization = null;
                    $scope.notFound = false;

                    corpAdministrationService.getOrganizationByOrgNr(organizationNumber.replace("-", "")).then(function (organization) {
                        if (organization === null) {
                            $scope.notFound = true;
                        } else {
                            organization.$selected = $.grep($scope.savedOrganizations, function(o) {
                                return o.organizationNumber === organization.organizationNumber;
                            }).length > 0;

                            $scope.newOrganization = organization;
                        }
                        $scope.isSearching = false;

                    }, function () {
                        $scope.isSearching = false;
                        $scope.notFound = true;
                    });

                };

                $scope.goOrganizationUrl = function(organizationTscid, manageOrganizations) {
                    if (manageOrganizations === false) {
                        window.location.href = constants.adminManageOrganizationUrl.substituteUrlParameters({ organizationTscid: organizationTscid });
                    }
                };

                $scope.$watch("organiziationId", function (organiziationId) {
                    if (organiziationId === undefined || organiziationId === '') {
                        return;
                    }


                    $scope.searchResult = true;
                    $scope.getOrganization(organiziationId);

                });

                function handleError(message) {
                    $scope.errorMessage = message;
                    throw new Error(message);
                }

                function initController() {
                    
                    var init = true;

                    var transform = function(data) {
                        var current = _.map($scope.savedOrganizations, function(x) { return { organizationTscid: x.organizationTscid }; });
                        if (!_.isEqual(current, data) || init) {
                            init = false;
                            var promises = $.map(data, function(savedOrganization) { return corpAdministrationService.getOrganization(savedOrganization.organizationTscid); });
                            return $q.all(promises).then(function(organizations) {
                                $scope.savedOrganizations = $.grep(organizations, function(organization) { return organization !== null; }) || [];
                                $scope.isSearching = false;
                            });
                        } else {
                            return $scope.savedOrganizations;
                        }
                    };

                    // get the saved organisations from the service
                    /*savedOrganizationsService.getSavedOrganizations()
                        .then(transform)
                        .catch(handleError);
                    */
                    // respond to added organisations from the service
                    savedOrganizationsService.getOrganizations(transform);

                }

                initController();
            }]
        };
    });

    app.controller("SavedOrganizationsController", [
        '$scope', 'savedOrganizationsService', function ($scope, savedOrganizationsService) {
            $scope.savedOrganizationsService = savedOrganizationsService;
        }
    ]);

    var init = function (element) {
        ng.bootstrap(element, ['savedOrganizations']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };
});