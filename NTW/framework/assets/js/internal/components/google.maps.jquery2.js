
;(function(document,$) {

    window.tsGoogleMaps = window.tsGoogleMaps || {};


	// Define a map center location based on a default location
	var startLocation = new google.maps.LatLng(61.0094026, 14.5508748); // Mora, Dalarna
		
	// Set up map options
	var mapOptions = {
		center: startLocation,
		zoom: 5,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP]
		},
		mapTypeControl: false, // Hides the map type control
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	// Bind map to a map element
	var mapContainer = $("body").find('[data-map="container"]');
	var mapObject = mapContainer.find('[data-map="map"]');
	var mapElement = mapObject[0];
	var map = new google.maps.Map(mapElement, mapOptions);

	// URL to gfx folder
	var iconBase = '/resources/templating-kit/themes/telia-se/css/gfx/';

	// Different marker pins depending on type (store/retail)
	var icons = {
	  store: {
	    icon: iconBase + 'pin.png',
		iconSelected: iconBase + 'pin-selected.png'
	  },
	  retail: {
	    icon: iconBase + 'pin-alt.png',
		iconSelected: iconBase + 'pin-alt-selected.png'
	  }
	};

	// Custom icons for Marker Clusters (same icon through small to large clusters)
	var clusterStyles = [
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
	
	// Marker details window
	var detailsBox = mapContainer.find('[data-map="details"]');

	// Set up array for Markers 
	var mapMarkers = [];
	
	// Used when a marker is clicked
	var currentMark;
	var currentType = "";
	
	// Array of locations for search
	var location = [];
	var locations = [];

	var htmlResult = "";

////// Google Maps - Init

    tsGoogleMaps.tsInit = function() {
       
         // Initial function to load on ready or load
    
//         tsGoogleMaps.tsFunction();
         
    };


////// Function

	function mapRecenter(latlng,offsetx,offsety) {
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

    tsGoogleMaps.tsFunction = function () {

		// Parse through the Marker array and add markers to the mapMarkers array
		for (i = 0; i < markers.length; i++) {
		    marker = new google.maps.Marker({
		        position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
		        map: map,
//				animation: google.maps.Animation.DROP,
				icon: icons[markers[i].type].icon // Apply icon depending on marker type (store/retail)
		    });

			// Event listener for showing an info window with details of the clicked marker
		    google.maps.event.addListener(marker, 'click', (function(marker, i) {
		        return function() {
					
//					markers[0].setVisible(false);
					
					// Reset a previously clicked marker icon to its unselected state
					if (currentType !== "") { currentMark.setIcon(icons[currentType].icon); }
					
					// Center the map to the clicked marker
//					map.setCenter(marker.getPosition());
					if (Modernizr.mq('only screen and (max-width: ' + mqLtSmall + ')')) {
						mapRecenter(marker.getPosition(),0,80);
					}

					// Empty the info window if not empty before populating
					$("#retailerMapDetails:not(:empty)").empty();
					tsGoogleMaps.PopulateInfoWindow(markers[i],detailsBox);
					
					// Set the clicked marker icon to its selected state
					marker.setIcon(icons[markers[i].type].iconSelected); // TODO: reset icon when infowindow is closed

					// Remember what marker was clicked, and what type it is
					currentMark = this;
					currentType = markers[i].type;
		        };
		    })(marker, i));

			// Add marker to mapMarkers
			mapMarkers.push(marker);
			
		}
		
		
		// Show clusters for nearby located markers
		var mc = new MarkerClusterer(map, mapMarkers, {
			maxZoom: 10,
			gridSize: 20,
			styles: clusterStyles
		}),
		marker, i;

		// 
		// google.maps.event.addListener(infowindow,'closeclick',function(){
		//    currentMark.setIcon(icons[currentType].icon);
		// });
		    
    };

	tsGoogleMaps.PopulateInfoWindow = function(marker,detailsBox) {
		// Build info view content
		var infoContent = '<h3 class="h3">';
		if (marker.name !== "") {
			infoContent += marker.name + ', ';
		}
		infoContent += marker.city + '</h3>';
		infoContent += '<dl><dt>Telefon:&nbsp;</dt><dd>' + marker.phone + '</dd></dl>';
		infoContent += '<dl><dt>Besöksadress:&nbsp;</dt><dd>' + marker.streetaddr + '</dd></dl>';
		infoContent += '<dl><dt>Postnr:&nbsp;</dt><dd>' + marker.zip + '</dd></dl>';
		infoContent += '<dl><dt>Öppettider:&nbsp;</dt><dd> Mån-fre ' + marker.open + '</dd></dl>';
		infoContent += '<dl><dt>Lör:&nbsp;</dt><dd>' + marker.opensat + '</dd></dl>';
		infoContent += '<dl><dt>Sön:&nbsp;</dt><dd>' + marker.opensun + '</dd></dl>';
		
		// Append info view content to the Marker details info window
        detailsBox.append(infoContent);
		detailsBox.prepend('<span class="tsMap-Close" data-map="details-close"><b>Stäng detaljvy</b></span>');
		
	    $('body').on('click', '[data-map="details-close"]', function(e) {
	       e.preventDefault();
		   $(this).parents('[data-map="details"]').empty();
		   currentMark.setIcon(icons[currentType].icon);
	//       NavPrimary.ToggleSubLevel($('.tsNavPrimary-Tabs').find('a[href$="'+'#'+expandedParent+'"]'));
	   });
		
	};

	//This will sort your array
	// function SortByName(a, b){
	//   var aName = a.name.toLowerCase();
	//   var bName = b.name.toLowerCase(); 
	//   return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
	// }


	
	
	tsGoogleMaps.ClearInfoWindow = function(detailsBox) {
		detailsBox.empty();
	};
	
	for (i = 0; i < markers.length; i++) {
		location = {
			"id": i, // Marker ID
			"city": markers[i].city, // City
			"name": markers[i].name, // Name
			"streetaddr": markers[i].streetaadr, // Street address
			"zip": markers[i].zip // Zip code
		};
		locations.push(location);
	}
	
	console.log("location: " + locations.length);

	// locations.sort(function(a, b)
	// {
	//     // a and b will here be two objects from the array
	//     // thus a[1] and b[1] will equal the names
	// 
	//     // if they are equal, return 0 (no sorting)
	//     if (a[1] == b[1]) { return 0; }
	//     if (a[1] > b[1])
	//     {
	//         // if a should come after b, return 1
	//         return 1;
	//     }
	//     else
	//     {
	//         // if b should come after a, return -1
	//         return -1;
	//     }
	// });
	
	// locations.sort(function(a, b){
	//     var a1= a[1], b1= b[1];
	//     if(a1== b1) return 0;
	//     return a1> b1? 1: -1;
	// });

	locations.sort(function(a, b) { 
	  return a.city.localeCompare(b.city)  ||  a.name.localeCompare(b.name);
	});	

	// function compareName(a, b)
	// {
	// 
	//   if (a.city < b.city) return -1;
	//   if (a.city > b.city) return 1;
	//   return 0;
	// }
	// locations.compareName();
	
	htmlResult += "<ul>";
	for (i = 0; i < locations.length; i++) {
		htmlResult += "<li>";
		htmlResult += locations[i].id + ", ";
		htmlResult += locations[i].city + ", ";
		htmlResult += locations[i].name + ", ";
		htmlResult += locations[i].streetaddr + ", ";
		htmlResult += locations[i].zip + ", ";
		htmlResult += "</li>";
	}
	htmlResult += "</ul>";
	
	$('body').append('<div class="tsMap-Result">Butiker:<br>' + htmlResult + '</div>');
	

////// Load

    $(window).on('load', function() {

		        tsGoogleMaps.tsFunction();

      
    });


////// Ready

    $(document).on('ready', function(){

        tsGoogleMaps.tsInit();

		function geolocationSuccess(position) {
			var userLat = position.coords.latitude;
			var userLng = position.coords.longitude;
			var userLocation = new google.maps.LatLng(userLat, userLng); // User location
			map.setCenter(userLocation);
			map.setZoom(9);
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(geolocationSuccess);
		}

    });


////// Scroll

    // $(document).on('scroll', function(){
    //         
    // });


////// Resize

//    $(window).smartresize(function(){
    $(window).on('resize', function() {
        tsGoogleMaps.tsFunction();

        
    });


})(document,jQuery);





