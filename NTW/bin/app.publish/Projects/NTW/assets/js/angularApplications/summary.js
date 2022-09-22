define(['jquery', 'angular', 'constants', 'helpers/common', 'translationStart', 'underscore', 'local/angularApplications/services/DCFService', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/savedOrganizationsService', 'local/angularApplications/templates'],
    function($, ng, constants, common, translation, _) {
        "use strict";

        var app = ng.module('summary', ['DCFService', 'corpAdministrationService', 'savedOrganizationsService', 'templates-main']);

        app.directive('tsSummary', function() {
            return {
                templateUrl: constants.summaryTemplateUrl,
                replace: 'true'
            };
        });


        app.controller('SummaryController', ['$scope', '$q', '$attrs', 'DCFService', 'corpAdministrationService', 'savedOrganizationsService', function ($scope, $q, $attrs, DCFService, corpAdministrationService, savedOrganizationsService) {
            $scope.translation = translation;
            $scope.ordersAssignedToMeLength = 0;
            $scope.savedOrdersLength = 0;
            $scope.pendingRequestsLength = 0;
            $scope.loading = true;
            $scope.accessRequests = $attrs.requestsEnabled;
            $scope.ordersAssignedToMeUrl = constants.ordersAssignedToMeUrl;
            $scope.savedOrderUrl = constants.savedOrderUrl;
            $scope.pendingRequestsUrl = constants.pendingRequestsUrl;

            function handleError(message) {
                throw new Error(message);
            }

            function getOrdersAssignedToMe() {
                return DCFService.getOrdersAssignedToMe(common.orgnr)
                    .then(function (orders) {
                        $scope.ordersAssignedToMeLength = orders.length;
                    }, handleError);
            }

            function getSavedOrders() {
                return DCFService.getSavedOrders(common.orgnr)
                    .then(function (orders) {
                        $scope.savedOrdersLength = orders.length;
                    }, handleError);
            }

            // Requests from users to join organization
            function getPendingRequests() {
                if ((common.orgnr === "0000000000") && ($scope.accessRequests === "true")) {
                    $scope.pendingRequestsUrl = constants.adminPendingRequestsUrl;
                    return savedOrganizationsService.getSavedOrganizations()
                        .then(function(organizations) {
                            var promises = [];
                            $.each(organizations, function(i, organization) {
                                promises.push(corpAdministrationService.getPendingRequestsOrganization(organization.organizationTscid)
                                    .then(function (requests) {
                                        $scope.pendingRequestsLength = $scope.pendingRequestsLength + requests.length;
                                    }, handleError));
                            });
                            return $q.all(promises);
                        }, handleError);
                }
                else if ($scope.accessRequests === "true") {
                    return corpAdministrationService.getPendingRequestsOrganization(common.orgTscid)
                        .then(function (requests) {
                            $scope.pendingRequestsLength = requests.length;
                        }, handleError);
                }
                else {
                    $scope.pendingRequestsLength = 0;
                }
            }

            function initController() {

                var success = 0;
                var total = 0;

                var promises = [getOrdersAssignedToMe(),getSavedOrders(),getPendingRequests()];

                // run all the promises
                // when all of them are resolved or rejected, show the results 
                // maybe it is possible to have some sort of any function here? // nagorka
                _.each(promises, function(item) {
                    item.then(function() {
                        success++;
                    })['finally'](function() {
                        total++;
                        if (total === promises.length) {
                            //$scope.loading = false;
                        }
                    });
                });

            }

            initController();

        }]);

        var init = function (element) {
            ng.bootstrap(element, ['summary']);
        };

        return {

            init: function (element) {
                init(element);
            }

        };

    });