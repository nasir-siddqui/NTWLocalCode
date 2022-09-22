$(function() {
	$('.tsIndex').on('click', '.in-active', function(e){
		e.preventDefault();
	});
	var indexs = $('[data-widget="index"]');
	if(indexs.length > 0)
	{
		indexs.each(function(){
			$(this).indexnav();
		});
	}
});

(function ( $ ) {
	$.fn.indexnav = function(options) {

		var $this = $(this);
		var settings = $.extend({
			selector: 'li'
		}, options);

		var html = '<div class="tsIndex-Wrap"><div><ul class="tsIndex">';

		$this.children(settings.selector).each(function(){
			var id = $(this).attr('id');
			html += '<li class="tsIndex-Item"><a href="#'+id+'" accesskey="'+id+'" class="indexscroll" data-hash="true">'+id+'</a></li>';
		});
		html += '</ul></div></div>';

		$this.before(html);
		var wrapelement = $this.siblings('.tsIndex-Wrap');
		var list = wrapelement.find('ul'), 
		height = list.height();
		wrapelement.height(height);

	 //        Modernizr.touch && listItems.on({
	 //        	mouseover: function(e) {
	 //        		listItems.removeClass('active');
	 //        		$(e.target).addClass('active')
	 //        	}
	 //            // touchmove: function (e) {
	 //            //     console.log(e.target.innerHTML);	
	 //            // },
	 //            // touchend: function (e) {

	 //            // 	//console.log(e);		                
	 //            //  //    list.removeClass("active"),
	 //            //  //    $this.click();
	 //            // }
	 //        });

	 //      //   function handle(t) {
		//      //    var n = t.originalEvent.touches[0],
		// 	    //         r = n.clientX,
		// 	    //         i = n.clientY,
		// 	    //         s = document.elementFromPoint(r, i);
		// 	    //     t.preventDefault(),
		// 	    //      t.cancelBubble = !0, 
		// 	    //      this.lastTarget !== undefined && this.lastTarget !== s && 
		// 	    //      (e(this.lastTarget).removeClass("active"), e(s).addClass("active")), this.lastTarget = s
		// 	    // };

		var addScroll = function(event) {
			$(window).scroll(function(e) {
				e.preventDefault();
				var element = $('.tsIndex-Wrap'),
	  		    header = $('.tsNavPrimary '),//$('.tsHeader'), <-- change this if new menu 
	  		    //headerfixed = $('.tsHeader-Fixed'),
	  		    scroll = $(document).scrollTop(),
	  		    top = element.offset().top - scroll;
	  		    footer = $('.tsFooter'),
	  		    footer = footer.length > 0 ? footer.offset().top - scroll - element.find('ul').height():0;

		    if(top <= 5 && element.offset().top > header.height() + 28 && footer > 0) {
		    	if(!element.hasClass('is-fixed'))
		    		element.addClass('is-fixed');
		    	if(element.hasClass('is-fixed-bottom'))
		    		element.removeClass('is-fixed-bottom');	
		    } else if(footer < 0){
		    	if(!element.hasClass('is-fixed-bottom'))
		    		element.addClass('is-fixed-bottom');
		    	if(element.hasClass('is-fixed'))
		    		element.removeClass('is-fixed');
		    } else {
		    	if(element.hasClass('is-fixed'))
		    		element.removeClass('is-fixed');
		    	if(element.hasClass('is-fixed-bottom'))
		    		element.removeClass('is-fixed-bottom');
		    }


		    var test =  $this.find('li').filter(function() {
		    	var position = $(this).offset().top - scroll;
		    	return (position > 0 || position + $(this).height() > 0);
		    });
		    var id = '#' + $(test[0]).attr('id');
		    if(window.location.hash != id)
		    {
		    	element.find('a').removeClass('active');
		    	element.find('[href="'+id+'"]').addClass('active');
		    	window.location.replace((''+window.location).split('#')[0] + id);
		    }
		  });
		}
		addScroll();
	}
}( jQuery ));