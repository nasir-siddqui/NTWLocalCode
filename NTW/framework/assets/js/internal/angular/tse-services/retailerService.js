
mapApp.factory('Icons',function(){		
	// URL to gfx folder
	var iconBase = '/resources/templating-kit/themes/telia-se/css/gfx/';
    return {
        getIcon: function(){
	          return {
				store: {
					icon: iconBase + 'pin.png',
					iconSelected: iconBase + 'pin-selected.png'
				},
				retail: {
					icon: iconBase + 'pin-alt.png',
					iconSelected: iconBase + 'pin-alt-selected.png'
				}
			};
        }
    };
});


mapApp.factory('Details', function($rootScope) {

    var sharedService = {};

    sharedService.prepForBroadcast = function(details) {
        this.details = details;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});
