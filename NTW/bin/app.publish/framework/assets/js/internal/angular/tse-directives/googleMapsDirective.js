var map;
var mapMarkers = [];
mapApp.directive('googleMaps', ['$location', '$timeout','$rootScope', 'Icons', function ($location, $timeout,$rootScope, Icons)  {

	return {
		//transclude: true,
		//scope: {}, // {} = isolate, true = child, false/undefined = no change
		link:  function (scope, element, attrs, ngModel) {
		
				
				// URL to gfx folder
				var iconBase = '/resources/templating-kit/themes/telia-se/css/gfx/';

				// Different marker pins depending on type (store/retail)
				var icons = Icons.getIcon();

				var smalldevice = Modernizr.mq('only screen and (max-width: ' + mqLtSmall + ')');

				scope.$watch('markers', function(newVal, oldVal) {

					if (newVal !== oldVal) {

						try
						{
							var mapOptions = getMapOptions();

								// Bind map to the map element
							map = new google.maps.Map(element[0], mapOptions);

								
								// Custom icons for Marker Clusters (same icon through small to large clusters)
							var clusterStyles = getClusterStyles(iconBase);

							scope.toggle = false;

							mapMarkers = addMarkers(newVal, icons, scope);

								// Show clusters for nearby located markers
							var mc = new MarkerClusterer(map, mapMarkers, {
								maxZoom: 10,
								gridSize: 20,
								styles: clusterStyles
							});//,marker, i;
						}
						catch(err)
						{
							console.log('Error:' + err);
							scope.message = "Ett fel uppstod, v.g försök senare";

							if(!scope.$$phase) {
								scope.$apply();
							};
						}
					}
				}, true);
				scope.$watch('details', function(newVal, oldVal) {
					if(newVal !== oldVal)
					{
						setDetails(scope.markers, icons);
					}
				});
				var setDetails = function(markers, icons)
				{
				
					var hasDetails = scope.details != undefined && scope.details.length > 0;
					if(hasDetails)
					{
						var details = scope.details[0];

						var thisMark =  $.grep(mapMarkers, function(n){
							var poslat = n.getPosition().lat();
							//var poslng = n.getPosition().lng();

							return poslat == details.lat //&& poslng == scope.details[0].lng;
							 
						});

						var selected = $.grep(mapMarkers, function(n){
							return n.icon.indexOf('selected') > -1;
						});

						for (var i = 0; i < selected.length; i++) {
							var alt = selected[i].icon.indexOf('alt') > -1;
							selected[i].setIcon(icons[alt ? 'retail':'store'].icon); 
						};

						var marker = thisMark[0];
						scope.currentMark = marker;
						scope.currentType = details.type;

						marker.setIcon(icons[details.type].iconSelected); 

						if(!$rootScope.clicked)
						{
							$timeout(function() {
								
						        	map.setCenter(marker.getPosition());	
	  								map.setZoom(11);
	  							
						    }, 500);
					    }

  						
					}
					
				}

			
				var addMarkers = function(markers, icons){
					var mapMarkers = [];
					// Parse through the Marker array and add markers to the mapMarkers array
					for (i = 0; i < markers.length; i++) {
						

						var marker = new google.maps.Marker ({
							position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
							map: map,
							//animation: google.maps.Animation.DROP,
							icon: /*hasDetails ? icons[markers[i].type].iconSelected :*/ icons[markers[i].type].icon  // Apply icon depending on marker type (store/retail)
						});
						

						// Event listener for showing an info window with details of the clicked marker
						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								if(scope.currentMark != marker)
								{
									// Reset a previously clicked marker icon to its unselected state
									if (scope.currentType != undefined && scope.currentType !== "") { 
										scope.currentMark.setIcon(icons[scope.currentType].icon); 
									}
									
									// Center the map to the clicked marker
									if (smalldevice) {
										mapRecenter(marker.getPosition(),0,80);
									}

									var city = cleanContent(markers[i].city);
									var street = cleanContent(markers[i].streetaddr);

									$location.path('/'+ city + '/' +street);

									// Remember what marker was clicked, and what type it is
									scope.currentMark = marker;
									scope.currentType = markers[i].type;
									$rootScope.clicked = true;
									if(!scope.$$phase) {
										scope.$apply();
									};
								}
							}
						})(marker, i));

						// Add marker to mapMarkers
						mapMarkers.push(marker);

					}
					return mapMarkers;
				}
				var getMapOptions = function() {
					var startLocation;
					var zoom = 5;
					if(scope.details != undefined && scope.details[0] != undefined && scope.details.length > 0)
					{
						startLocation = new google.maps.LatLng(scope.details[0].lat, scope.details[0].lng);
						// Set up map options
						zoom = 12;

					}
					else
					{
						// Define a map center location based on a default location
						startLocation = new google.maps.LatLng(61.0094026, 14.5508748); // Mora, Dalarna

						// Check if geolocation is present, and if successful; get user's current position
						if (navigator.geolocation) {
								navigator.geolocation.getCurrentPosition(geolocationSuccess);
							}
					}
					
					var options =	{
							zoom: zoom,
							center: startLocation,
							mapTypeControlOptions: {
								mapTypeIds: [google.maps.MapTypeId.ROADMAP]
							},
											mapTypeControl: false, // Hides the map type control
											zoomControlOptions: {
												style: google.maps.ZoomControlStyle.LARGE
											},
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};

					return options;	
				}
				var getClusterStyles = function(iconBase){
					return [
					{
						textColor: 'white',
						textSize: 14,
						url: iconBase + 'pin-large.png',
						height: 80,
						width: 35
					},
					{
						textColor: 'white',
						textSize: 14,
						url: iconBase + 'pin-large.png',
						height: 80,
						width: 35
					},
					{
						textColor: 'white',
						textSize: 14,
						url: iconBase + 'pin-large.png',
						height: 80,
						width: 35
					},
					{
						textColor: 'white',
						textSize: 14,
						url: iconBase + 'pin-large.png',
						height: 80,
						width: 35
					},
					{
						textColor: 'white',
						textSize: 14,
						url: iconBase + 'pin-large.png',
						height: 80,
						width: 35
					}
					];
				}
				var mapRecenter = function(latlng,offsetx,offsety) {
					var point1 = map.getProjection().fromLatLngToPoint(
						(latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
						);
					var point2 = new google.maps.Point(
						( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
						( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
						);  
					map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
						point1.x - point2.x,
						point1.y + point2.y
						)));
				}
				var geolocationSuccess = function(position) {
					var userLat = position.coords.latitude;
					var userLng = position.coords.longitude;
							var userLocation = new google.maps.LatLng(userLat, userLng); // User location
							map.setCenter(userLocation);
							map.setZoom(11);
				}
			}
			
		}
	
}]);    

mapApp.directive('tsMapClose', ['$location', 'Icons', function ($location, Icons)  {
	return{
		restrict: 'C', 
		link: function($scope, iElm, iAttrs, controller) {
			iElm.bind('click', function(){
				
				$scope.toggle = false;
				$location.path('/');
			
				var marker = $scope.currentMark;
				
				var iconBase = '/resources/templating-kit/themes/telia-se/css/gfx/';

				// Different marker pins depending on type (store/retail)
				var icons = Icons.getIcon(iconBase);

				// Set the clicked marker icon to its selected state
				marker.setIcon(icons[$scope.details[0].type].icon);  // TODO: reset icon when infowindow is closed
				$scope.details = {};
				$scope.search = '';
				map.setZoom(7);

				if(!$scope.$$phase) {
			        $scope.$apply();
			    };

			});
		}
	}
}]);


mapApp.directive('tsAutoCompleteSearch', ['$location', function ($location)  {
	return{

		restrict: 'C',
		link: function($scope, iElm, iAttrs, controller) {
			$scope.autoindex = -1;

			var element;

			$(document).keydown(function(e){

				var lists = iElm.siblings('ul').find('li');

				if (e.keyCode == 38) {
					if(lists.length > 0){
						$scope.autoindex = $scope.autoindex != 0 ? $scope.autoindex-1 : 0;
						setList(lists);
					}
				}	
			    if (e.keyCode == 40) { 
					
					if(lists.length > 0){
						$scope.autoindex = $scope.autoindex != lists.length -1 ? $scope.autoindex + 1 : lists.length -1;
						setList(lists);
					}
			    }
			    if(e.keyCode == 13)
			    {
			    	if(element!=undefined) {
			    		$scope.search = $.trim(element.text());
			    		$scope.autoindex = 0;
			    		$scope.searchAddress();
				    	if(!$scope.$$phase) {
							$scope.$apply();
						};
					}
			    }
			});


			var setList = function (lists)
			{
				lists.removeClass('active');
				element = $(lists[$scope.autoindex]);
			    element.addClass('active');
			}
		}
	}
}]);



