var Navigation;

if (typeof Navigation === "undefined") {
	Navigation = {};
}
Navigation = function () {
		var section = function() {
			if(($('[data-widget="section-nav"]').length > 0 && $('.tsSection-nav').length == 0)  && mediaqueriesMin('mqMedium') && !$('body').hasClass("lt-ie9"))
			{
				var elements = $('[data-widget="section-nav"]');
				if(elements.length > 0)
				{
					var html  = '<nav class="tsSection-nav"><ul role="navigation">';

					elements.each(function(i) {
					var //id = $(this).attr('id'),
					name = $(this).data('friendly-label')!=undefined && $(this).data('friendly-label').length > 0 ? $(this).data('friendly-label') : $(this).text();
					html += '<li class="tsSection-nav-link" role="link" data-section-id="'+i+'"><span class="tsSection-nav-link-label">'+name+'</span><span class="tsSection-nav-link-dot"></span></li>'
				});
					html += '</nav></ul>'; 
					$('body').append(html);

					$('.tsSection-nav').css('margin-top', -$('.tsSection-nav').height() / 2);

			}
			$('.tsSection-nav').on('click', 'li', function(){
				var elementId = $(this).data("section-id"),
				element = $('[data-widget="section-nav"]')[elementId];
				if(element!= undefined)
				{
					
					$('html, body').animate({scrollTop: $(element).offset().top - 60 }, 500);
				}
			});
		}
	};
	
	return {
		Init: function (){
			if(mediaqueriesMin('mqMedium') || $('body').hasClass("lt-ie9"))
			{
				section();
			}
		}
};

}();