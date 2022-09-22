/**
 * Create a sitecatalyst module
 */
angular.module('sitecatalyst', [])

.factory('SiteCatalystService', ['$q', '$log', '$window', '$timeout', function($q, $log, $window, $timeout) {		
	
	$log.debug('Check if sitecatalyst exist on current page');

	var CONFIG_TIMEOUT = 0;

	/* MOCK
	$window.s = Object.create(Object.prototype);
	$window.s.eVar6  = "";
	$window.s.eVar24 = "";
	$window.s.prop6  = "";
	$window.s.events = "";
	$window.s.t = function() {
		console.log("Send data to Sitecatalyst", this);
	}
	*/

	var sitecatalystInitiated = function() {
		return $window.s !== undefined;
	}

	/**
	 * Control data sent to sitecatalyst
	 */
	var setSitecatalystParameters = function(data) {

		var linkTrackVars = [];

		var append = function(id) {
			if(data.hasOwnProperty(id))  {
				$window.s[id]  = data[id]; 
				linkTrackVars.push(id);

				if(id == 'events') {
					s.linkTrackEvents = data[id];
				}
			} 
		};

		// Check for specific variables values
		append('eVar6');
		append('eVar24');

		append('prop6');

		append('events');

		$window.s.linkTrackVars   = linkTrackVars.join(',');
	}

    return {
    	push: function(data) {
    		if(sitecatalystInitiated()) {
    			setSitecatalystParameters(data);

    			$log.debug('Sitecatalyst', data);

    			s.tl(true, 'o', 'Teliasonera sitecatalyst AJAX');
    		}
    	}   
    };
}]);