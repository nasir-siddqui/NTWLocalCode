//Shared apps
var jsonApp = angular.module('jsonModule',[]);

//Page apps
var app = angular.module("tse", ['ngRoute','ui.mask', 'ngResource','ngAnimate', 'ui.bootstrap', 'jsonModule'], function($routeProvider, $locationProvider) {
  //$locationProvider.html5Mode(true);
  $routeProvider
      .when('/:search/:tags/:cat/', {
        templateUrl: '/projects/ssop/_OLD/angularviews/guides.html',
       })
      .when('/:sort/:page/:search/:tags', {
        templateUrl: '/projects/ssop/_OLD//angularviews/guides.html',
       })
       .when('/:sort/:page/:search', {
        templateUrl: '/projects/ssop/_OLD//angularviews/guides.html',
       })
       .when('/:sort/:page', {
        templateUrl: '/projects/ssop/_OLD//angularviews/guides.html',
       })
       .when('/', {
        templateUrl: '/projects/ssop/_OLD//angularviews/guides.html',
       })
       
      

  $routeProvider.when('/topplista', {
        templateUrl: '/projects/ssop/_OLD//angularviews/topguides.html',
      });
  });


var mapApp = angular.module('GoogleMapsApp', ['ngRoute', 'jsonModule'], function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

     $routeProvider.when('/:city/:street', {
        templateUrl: '/projects/ssop/_OLD//angularviews/module-retailers-ng2.html'
     }).when('/', {
       template: '<span></span>'
     });
    // .otherwise({
    //     templateUrl: '/'
    //   }
    // );
    // $routeProvider.when('/retailers', {
    //   templateUrl: '/projects/support/angularviews/module-retailers-ng2.html',
    //   //controller: 'googleMapsCtrl'
    // });
    // $routeProvider.otherwise({
    //     redirectTo: '/retailers'
    //   });
    // .when('/', {
    //   templateUrl: 'angularviews/module-retailers-ng2.html',
    //   controller: 'googleMapsCtrl'
    // });

    // $routeProvider.when('/retailer', {
    //    templateUrl: '/projects/support/modules/module-retailers-ng2.html',
    // });
    // .when('/', {
    //     templateUrl: '',
    // });
   
});

