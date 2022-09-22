
function initialize() {
	
	var startLocation = new google.maps.LatLng(61.0094026, 14.5508748); // Mora, Dalarna
	
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

	
    var map = new google.maps.Map(document.getElementById("retailerMap"),
        mapOptions);

	var iconBase = '/resources/templating-kit/themes/telia-se/css/gfx/';

	var icons = {
	  store: {
	    icon: iconBase + 'pin.png'
		,iconSelected: iconBase + 'pin-selected.png'
	  },
	  retail: {
	    icon: iconBase + 'pin-alt.png'
		,iconSelected: iconBase + 'pin-alt-selected.png'
	  }
	};
	
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
	
	var detailsBox = $("#retailerMapDetails");
	var infowindow = new google.maps.InfoWindow(), marker, i;

	var mapMarkers = [];
	
	var currentMark;
	var currentType = "";

	for (i = 0; i < markers.length; i++) {  
	    marker = new google.maps.Marker({
	        position: new google.maps.LatLng(markers[i][4], markers[i][5]),
	        map: map,
//			icon: iconBase + 'pin.png'
			icon: icons[markers[i][3]].icon
	    });
	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
				if (currentType != "") { currentMark.setIcon(icons[currentType].icon); }
				var infoContent = '<div id="retailMapInfo">';
				infoContent += '<p>' + markers[i][0];
				infoContent += ', ' + markers[i][1]; + '</p>';
				infoContent += '<p><strong>Telefon: </strong>' + markers[i][6]; + '</p>';
				infoContent += '<p><strong>Besöksadress: </strong>' + markers[i][7]; + '</p>';
				infoContent += '<p><strong>Postnr: </strong>' + markers[i][8]; + '</p>';
				infoContent += '<p><strong>Öppettider: </strong>' + markers[i][9]; + '</p>';
				infoContent += '<p><strong>Lördag: </strong>' + markers[i][10]; + '</p>';
				infoContent += '<p><strong>Söndag: </strong>' + markers[i][11]; + '</p>';
				infoContent += "</div>";
	            // infowindow.setContent(infoContent);
	            // infowindow.open(map, marker);
	            detailsBox.append(infoContent);
				marker.setIcon(icons[markers[i][3]].iconSelected); // TODO: reset icon when infowindow is closed
				currentMark = this;
				currentType = markers[i][3];
	        }
	    })(marker, i));
		mapMarkers.push(marker);
//		mc.addMarker(marker); //add the marker to the MarkerClusterer
	}
		
	google.maps.event.addListener(infowindow,'closeclick',function(){
	   currentMark.setIcon(icons[currentType].icon);
//	   this.close(); //resets the marker icon
	});

	// var mc = new MarkerClusterer(map, mapMarkers),//MarkerClusterer-instance
	//     marker, i;

	// var mc = new MarkerClusterer(map, mapMarkers, {
	//           maxZoom: 4,
	//           gridSize: 4,
	//           styles: clusterStyles
	//         }),//MarkerClusterer-instance
	//     marker, i;

		var mc = new MarkerClusterer(map, mapMarkers, {
		          maxZoom: 12,
	  	          styles: clusterStyles
		        }),//MarkerClusterer-instance
		    marker, i;

			//	var mc = new MarkerClusterer(map, mapMarkers);

	// var mc = new MarkerClusterer(map, mapMarkers, {
	//           maxZoom: 4,
	//           gridSize: 4,
	//           styles: clusterStyles
	//         });



                        

/*		
		google.maps.event.addListener(map, 'idle', showMarkers);
		
		function showMarkers() {
		    var bounds = map.getBounds();

		    // Call you server with ajax passing it the bounds

		    // In the ajax callback delete the current markers and add new markers
		  }
*/
					
}


google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'resize', initialize);


