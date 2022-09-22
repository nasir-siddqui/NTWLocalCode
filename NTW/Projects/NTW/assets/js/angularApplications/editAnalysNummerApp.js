/*global define */
define(['jquery', 'angular', 'angular-resource'],
    function ($, ng, constants) {
        "use strict";

        var app = ng.module('editAnalysNummerApp', ['ngResource']);

        app.controller('editAnalysNummerCtrl', [
            '$scope', 'NummerData',
            function ($scope, NummerData) {
                $scope.init = function (advanceExtId) {
                    $scope.nummerData = NummerData.get({ advanceExtId: advanceExtId }, function () {
                        var created = new Date($scope.nummerData.created);
                        $scope.nummerData.created = formatDate($scope.nummerData.created);
                        $scope.nummerData.changed = formatDate($scope.nummerData.changed);
                    });
                }

                $scope.$watch("nummerData.bolagViewLevel", function () {
                    if ($scope.nummerData.anvandare !== undefined) {
                        for (var i = 0; i < $scope.nummerData.anvandare.length; i++) {
                            if ($scope.nummerData.anvandare[i].viewLevel > $scope.nummerData.bolagViewLevel) {
                                $scope.nummerData.anvandare[i].viewLevel = $scope.nummerData.bolagViewLevel;
                            }
                        }
                    }
                });

                $scope.$watch("nummerData.radata", function () {
                    if ($scope.nummerData.anvandare !== undefined) {
                        for (var i = 0; i < $scope.nummerData.anvandare.length; i++) {
                            if ($scope.nummerData.anvandare[i].radata && $scope.nummerData.radata == false) {
                                $scope.nummerData.anvandare[i].radata = false;
                            }
                        }
                    }
                });

                $scope.save = function() {
                    $scope.nummerData.$save(function (response) {
                        var redirectController = angular.fromJson(response);
                        window.location.href = redirectController.path;
                    });
                }

                function formatDate(dateString) {
                    var date = new Date(dateString);
                    return date.getFullYear() + "-" + twoDigits(date.getMonth()) + "-" + twoDigits(date.getDate()) + " "
                        + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds());

                }

                function twoDigits(number) {
                    if (number < 10) {
                        return "0" + number;
                    } else {
                        return number;
                    }
                }
            }
        ]);

        //        Default actions:
        //        { 'get':    {method:'GET'},
        //          'save':   {method:'POST'},
        //          'query':  {method:'GET', isArray:true},
        //          'remove': {method:'DELETE'},
        //          'delete': {method:'DELETE'} };
        app.factory('NummerData', ['$resource',
          function ($resource) {
              return $resource('Hantera_Bolag_Nummer_Edit_Data', {}, {
              });
          }]);

        var init = function (element) {
            ng.bootstrap(element, ['editAnalysNummerApp']);
        };

        return {
            init: function (element) {
                init(element);
            }

        };
    }
);