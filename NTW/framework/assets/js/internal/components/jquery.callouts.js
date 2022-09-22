
;(function(document,$) {

    window.tsCallouts = window.tsCallouts || {};

////// Google Maps - Init

    tsCallouts.tsInit = function() {
       
		   
	   
         // Initial function to load on ready or load
    
//         tsGoogleMaps.tsFunction();
         
    };


////// Function

    tsCallouts.tsFunction = function () {

		var callouts = $("body").find('.tsCallout');
		var imgSrc;
		
        if (Modernizr.mq('only screen and (min-width: ' + mqMedium +  ')')) {
			callouts.each(function() {
				if ($(this).attr('data-src').length > 0) {
					imgSrc = $(this).data('src');
					$(this).prepend('<img src="' + imgSrc + '" alt="" />');
					$(this).removeAttr('data-src');					
				}
			})
        }            

		    
    };

//	tsCallouts.PopulateInfoWindow = function(marker,detailsBox) {
//	};



////// Load

    $(window).on('load', function() {

		        tsCallouts.tsFunction();

      
    });


////// Ready

    $(document).on('ready', function(){

        tsCallouts.tsInit();

    });


////// Scroll

    // $(document).on('scroll', function(){
    //         
    // });


////// Resize

//    $(window).smartresize(function(){

    $(window).on('resize', function() {
        tsCallouts.tsFunction();

        
    });


})(document,jQuery);





