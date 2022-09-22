define(['angular', 'constants', 'underscore', 'translationGroup', 'angular-route', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/manageGroupNgService', 'local/angularApplications/accessTree', 'local/angularApplications/services/validationService', 'local/angularApplications/services/selectedRolesService'], function(ng, constants, _, translation) {
   
    var app = ng.module('manageGroup', ['ngRoute', 'corpAdministrationService', 'manageGroupNgService', 'accessTree', 'validationService', 'selectedRolesService']);

    app.config(['$routeProvider', function($routeProvider) {

        if (constants.manageGroupUrlRegexp.test(window.location.href)) {
            $routeProvider.when('/collect', {
                templateUrl: constants.manageGroupCollectTemplateUrl,
                controller: "ManageGroupCollectController"
            }).when('/main', {
                templateUrl: constants.manageGroupMainTemplateUrl,
                controller: "ManageGroupMainController"
            });
        }

    }]);

    /*app.directive('tsManageGroup', [function() {
        return {
            controller: "ManageGroupController",
            templateUrl: constants.manageGroupTemplateUrl
        };
    }]);*/

    app.directive('tsManageGroupOrganisations', function() {
        return {
            templateUrl: constants.manageGroupOrganisationsTemplateUrl
        };
    });

    app.directive('tsManageGroupSearch', ['$timeout', 'corpAdministrationService', 'manageGroupNgService', function($timeout, corpAdministrationService, manageGroupNgService) {
        return {
            templateUrl: constants.manageGroupSearchTemplateUrl,
            link: function(scope) {
                scope.searchText = "";
                var searches = [];
                var searchSize = 0;
                var promise = null;
                var preventCall = false;
                scope.searchResult = [];
                scope.searching = false;

                var match = function() {
                    corpAdministrationService.organizationSearch(scope.searchText).then(function(data) {
                        angular.forEach(data, function(item) {
                            item.listed = false;
                            item.alreadyInMainGroup = false;

                            if (item.containsInMasterGroup === true) {
                                item.alreadyInMainGroup = true;
                            }

                            angular.forEach(scope.organisationNumbers, function(listItem) {
                                if (item.organizationNumber === listItem) {
                                    item.listed = true;
                                }
                            });
                        });

                        scope.searchResult = data;
                        scope.searchPerformed = true;
                        scope.searching = false;
                    });
                };

/*
                var timeoutPromise;
                var delayInMs = 300;
                scope.$watch('searchText', function(text) {
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = $timeout(function() {
                        scope.searchResult = [];
                        if (text.length < 3) {
                            return;
                        }
                        match();
                    }, delayInMs);
                });
*/

                scope.search = function(text){
                    match();
                    scope.searchPerformed = false;
                    scope.searching = true;
                    scope.searchResult = [];
                };

                scope.deleteOrganization = function(organization) {
                    manageGroupNgService.removeOrganization(organization.organizationTscid);
                };

            }
        };
    }]);

    app.directive('tsManageGroupBatch', ['corpAdministrationService', '$q', function(corpAdministrationService, $q) {
        return {
            templateUrl: constants.manageGroupBatchTemplateUrl,
            link: function(scope) {

                scope.organisationsText = "";

                scope.getOrganisations = function(text) {

                    scope.getOrganisationsSuccess = "";
                    scope.getOrganisationsError = "";
                    scope.getOrganisationsStatus = "LOADING";

                    var match = text.match(/\b(\d{6}\-?\d{4})\b/g);
                    var deferred = $q.defer();
                    if (match && match.length) {

                        var orgs = _.map(match, function(item) {
                            return item.replace("-", "");
                        });

                        corpAdministrationService.getOrganizations(orgs).then(function(data) {
                            
                            if (data.organisations && data.organisations.length) {
                                deferred.resolve(data);
                            } else {
                                deferred.reject("NO_VALID_ORGAINSATIONS");
                            }
                        });

                    } else {
                        deferred.reject("NO_VALID_ORGAINSATIONS");
                    }

                    deferred.promise.then(function(data) {
                        scope.getOrganisationsSuccess = "ADDED_ORGANISATIONS";
                        if (data.errors && data.errors.length) {
                            scope.getOrganisationsError = "SOME_INVALID_ORGANISATIONS";
                        }
                        scope.addOrganisations(data.organisations);
                    }, function(message) {
                        scope.getOrganisationsError = message;
                    })['finally'](function() {
                        scope.getOrganisationsStatus = "FINISHED";
                    });

                    scope.resetError = function(error) {
                        if (typeof v === "object") {
                            v.error = null;
                        } else if (typeof v === "string") {
                            scope[v] = null;
                        }
                    };

                };

            }
        };
    }]);

    app.controller('ManageGroupController', ['$scope', '$attrs', '$route', '$location', '$http', 'manageGroupNgService', '$q', 'corpAdministrationService', function($scope, $attrs, $route, $location, $http, manageGroupNgService, $q, corpAdministrationService) {

        var group = $attrs.group || "";

        $scope.organisationNumbers = [];

        $scope.translationGroup = translation;

        if (!group) {
            $location.path('/collect');
        } else {
            $location.path('/main');
        }

        $scope.$on('$locationChangeStart', function(e, location) {
            if (!/#\/(?:collect|main)$/.test(location)) {
                e.preventDefault();
            }
            $scope.isInitialized = true;
        });

        $scope.addOrganization = function(organization) {
            manageGroupNgService.addOrganization(organization);
        };

        $scope.addOrganisations = function(list) {
            var filteredList = _.filter(list, function(item) {
                return _.find($scope.organisationNumbers, function(listItem) {
                    return item.organizationNumber !== listItem;
                });
            });
            console.log(filteredList);
            if (filteredList.length) {
                list = filteredList;
            }
            manageGroupNgService.addOrganizations(list);
        };

        manageGroupNgService.getOrganizations({ callback: function(data) {
            $scope.organisationNumbers = _.pluck(data, 'organizationNumber');
        }});

        $scope.columns = [
            { name: translation.translate("TABLE_NUMBER"), fieldName: "organizationNumber" },
            { name: translation.translate("TABLE_NAME"), fieldName: "name" }
        ];

    }]);

    app.controller('ManageGroupMainController', ['$scope', 'corpAdministrationService', 'validationService', 'selectedRolesService',  function($scope, corpAdministrationService, validationService, selectedRolesService) {

        var rolesService = selectedRolesService.getInstance();
        rolesService.organizationAdminMode = true;
        rolesService.loadData();

        $scope.handleError = function(message) {
            $scope.errorMessage = message;
            $scope.loading = false;
            //throw new Error(message);
        };

        $scope.createMasterGroup = function () {
            // Save all custom data
            rolesService.getSelectedPuiNames(function(data) {
                var selectedPUIs = data;
                corpAdministrationService.createMasterGroup($scope.organisationNumbers, $scope.organizationCustom.name, $scope.organizationCustom.phone, $scope.organizationCustom.website, $scope.organizationCustom.cost, $scope.organizationCustom.afNumber, $scope.organizationCustom.contactPerson, $scope.organizationCustom.profabilitySegment, selectedPUIs).then(function() {
                    $scope.isError = false;
                    $scope.isSuccess = true;
                    $scope.hideGroupAttention = false;
                })['catch'](function(error) {
                    $scope.errorMessage = error;
                    $scope.isError = true;
                    $scope.isSuccess = false;
                    $scope.hideGroupAttention = false;
                }, $scope.handleError);

            });
        };

    }]);

    app.controller('ManageGroupCollectController', ['$scope', '$q', 'corpAdministrationService', '$location', function($scope, $q, corpAdministrationService, $location) {

        $scope.next = function() {
            $location.path('/main');
        };

    }]);

});