/*global define */
define(['jquery', 'angular', 'angular-resource'],
    function ($, ng, constants) {
        "use strict";

        var app = ng.module('editBolagApp', ['ngResource']);

        app.controller('editBolagCtrl', [
            '$scope', 'Contact',
            function($scope, Contact) {
                $scope.init = function(analysContactUserId, webstyrningContactUserId, levinfoContactUserId) {
                    $scope.analysContactUserId = analysContactUserId;
                    $scope.webstyrningContactUserId = webstyrningContactUserId;
                    $scope.levinfoContactUserId = levinfoContactUserId;
                }

                $scope.$watch("analysContactUserId", function () {
                    $scope.analysContact = Contact.get({ 'userId': $scope.analysContactUserId });
                });

                $scope.$watch("webstyrningContactUserId", function () {
                    $scope.webstyrningContact = Contact.get({ 'userId': $scope.webstyrningContactUserId });
                });

                $scope.$watch("levinfoContactUserId", function () {
                    $scope.levinfoContact = Contact.get({ 'userId': $scope.levinfoContactUserId });
                });
            }
        ]);

        //        Default actions:
        //        { 'get':    {method:'GET'},
        //          'save':   {method:'POST'},
        //          'query':  {method:'GET', isArray:true},
        //          'remove': {method:'DELETE'},
        //          'delete': {method:'DELETE'} };
        app.factory('Contact', ['$resource',
          function ($resource) {
              return $resource('Hantera_Bolag_Contact', {}, {});
          }]);

        var init = function (element) {
            ng.bootstrap(element, ['editBolagApp']);
        };

        return {
            init: function (element) {
                init(element);
            }

        };
    }
);