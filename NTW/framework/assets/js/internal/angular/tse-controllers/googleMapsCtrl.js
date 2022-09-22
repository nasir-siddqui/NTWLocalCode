'use strict';
mapApp.controller('googleMapsCtrl', ['$scope', '$routeParams','$timeout','$location','$rootScope', 'json', 'Details', function($scope, $routeParams,$timeout,$location,$rootScope, json, Details) {
   var mapUrl = '/projects/ssop/_OLD/json/retailers.json';

      $scope.markers = [];
 
      if($scope.markers.length == 0)
      {
            json.getJsonCached(mapUrl).then(
              function(data) { 
                var mMarkers = JSON.parse(data);
                $scope.markers = mMarkers;

                if(!$scope.$$phase) {
                  $scope.$apply();
                }
            });
      }

      $scope.selectAddress = function(address){
          $scope.autoindex = 0;
          $scope.search = address.city + ', ' + address.name + ', ' + address.streetaddr;
          searchAddress();
      };
       $scope.searchAddress = function(){
          searchAddress();
       }
       var searchAddress = function(){
        var searchWords = $scope.search;
        $rootScope.clicked = false;
        if(searchWords != undefined && searchWords.length > 0)
        {

          searchWords = removeSpaces(searchWords, '').split(',');
          var resultSet = $.grep($scope.markers, function (e) {
            var city = removeSpaces(e.city, '');
            var addr = removeSpaces(e.streetaddr, '');
            return searchWords.indexOf(city) > -1 && searchWords.indexOf(addr) > -1;
          });

          if(resultSet != undefined && resultSet.length > 0)
          {
            $location.path('/' + cleanContent(resultSet[0].city) + '/' + cleanContent(resultSet[0].streetaddr));
            if(!$scope.$$phase) {
              $scope.$apply();
            }
          }
        }
      };
      $scope.$on('handleBroadcast', function() {
          $scope.details = Details.details;
      });
}]);


mapApp.controller('googleMapsCtrl2', ['$scope', '$routeParams','$timeout','$location', '$rootScope', 'json', 'Details', function($scope, $routeParams,$timeout,$location, $rootScope, json, Details) {

    var mapUrl = '/projects/ssop/_OLD/json//retailers.json';

    // Set up array for Markers 
    var mapMarkers = [];
    var map;  

          var city = $routeParams.city;
          var street = $routeParams.street;

          var detailsFilter = function (element) {
              var test = cleanContent(element.city) == city && cleanContent(element.streetaddr) == street; 
              return test;
          };

          if($scope.markers == undefined)
          {
            json.getJson(mapUrl).then(
              function(data) { 
                var mMarkers = JSON.parse(data);
                if(city != undefined && mMarkers!=undefined)
                {
                  var details = mMarkers.filter(detailsFilter);
                  $scope.toggle = true;
                  $scope.details = details;
                  if(!$scope.$$phase) {
                    $scope.$apply();
                  };
              }
              else
              {
                $scope.details = [];
                $scope.toggle = false;
              }
              $scope.markers = mMarkers;
            });
      }
      else
      {
        var details = $scope.markers.filter(detailsFilter);
   
        $scope.details = details;
        $scope.toggle = true;
        
        Details.prepForBroadcast(details);

        if(!$scope.$$phase) {
            $scope.$apply();
        };
      }
    // });

}]);

