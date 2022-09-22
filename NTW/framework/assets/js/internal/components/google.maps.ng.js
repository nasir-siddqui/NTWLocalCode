
var module = angular.module("GoogleMapsApp", ["google-maps"]);


module.controller('GoogleMapsCtrl', function ($scope) {

	angular.extend($scope, {
		centerProperty: {
			lat: 57.8,
			lng: 12
		},
		zoomProperty: 8,
		markersProperty: [ {
				latitude: 57.5,
				longitude: 12.3
			}],
		clickedLatitudeProperty: null,	
		clickedLongitudeProperty: null,
	});



});

