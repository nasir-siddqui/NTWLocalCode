
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

	function map_recenter(latlng,offsetx,offsety) {
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
		        position: new google.maps.LatLng(markers[i][4], markers[i][5]),
		        map: map,
//				animation: google.maps.Animation.DROP,
				icon: icons[markers[i][3]].icon // Apply icon depending on marker type (store/retail)
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
						map_recenter(marker.getPosition(),0,80);
					}

					// Empty the info window if not empty before populating
					$("#retailerMapDetails:not(:empty)").empty();
					tsGoogleMaps.PopulateInfoWindow(markers[i],detailsBox);
					
					// Set the clicked marker icon to its selected state
					marker.setIcon(icons[markers[i][3]].iconSelected); // TODO: reset icon when infowindow is closed

					// Remember what marker was clicked, and what type it is
					currentMark = this;
					currentType = markers[i][3];
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
		if (marker[1] !== "") {
			infoContent += marker[1] + ', ';
		}
		infoContent += marker[0] + '</h3>';
		infoContent += '<p><strong>Telefon: </strong>' + marker[6] + '</p>';
		infoContent += '<p><strong>Besöksadress: </strong>' + marker[7] + '</p>';
		infoContent += '<p><strong>Postnr: </strong>' + marker[8] + '</p>';
		infoContent += '<p><strong>Öppettider: </strong> Mån-fre ' + marker[9] + '</p>';
		infoContent += '<p><strong>Lör: </strong>' + marker[10] + '</p>';
		infoContent += '<p><strong>Sön: </strong>' + marker[11] + '</p>';
		
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

	tsGoogleMaps.ClearInfoWindow = function(detailsBox) {
		detailsBox.empty();
	};


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





