//Shared apps
var jsonApp = angular.module("jsonModule", []), app = angular.module("tse", [ "ngRoute", "ui.mask", "ngResource", "ngAnimate", "ui.bootstrap", "jsonModule" ], function(e, t) {
    e.when("/:search/:tags/:cat/", {
        templateUrl: "/projects/ssop/_OLD/angularviews/guides.html"
    }).when("/:sort/:page/:search/:tags", {
        templateUrl: "/projects/ssop/_OLD/angularviews/guides.html"
    }).when("/:sort/:page/:search", {
        templateUrl: "/projects/ssop/_OLD/angularviews/guides.html"
    }).when("/:sort/:page", {
        templateUrl: "/projects/ssop/_OLD/angularviews/guides.html"
    }).when("/", {
        templateUrl: "/projects/ssop/_OLD/angularviews/guides.html"
    });
    e.when("/topplista", {
        templateUrl: "/projects/ssop/_OLD/angularviews/topguides.html"
    });
}), mapApp = angular.module("GoogleMapsApp", [ "ngRoute", "jsonModule" ], function(e, t) {
    e.when("/r/:city/:street", {
        templateUrl: "/projects/ssop/_OLD/angularviews/module-retailers-ng2.html"
    }).when("/", {
        template: "<span></span>"
    });
});