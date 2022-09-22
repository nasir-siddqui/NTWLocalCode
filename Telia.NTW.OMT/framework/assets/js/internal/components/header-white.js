(function(factory) {

	if (typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else {
		window.Header = factory(window.jQuery);
	}

})(function($) {
	
	// add listener for menu collapse, mobile
	$(".tsHeader-Collapse-Menu").click(function(e) {
		e.preventDefault();
		$(".tsHeader").toggleClass('is-expanded');
	});

	// get the height of the foldout
	//var h = $('.tsHeader .tsHeader-FoldOut-Menu').height();

	// add listener to search button
	$('.tsHeader .tsHeader-Collapse-Search').on('mousedown', function(e) {
		e.preventDefault();
		// add class to wrapping div
		$(this).closest('.tsHeader-Search').toggleClass('is-expanded');
	});

	// add listener to focus/blur on search field
	$('.tsHeader input').on('focus blur', function(e) {
		// add is-expanded if focus
		$(this).closest('.tsHeader-Search').toggleClass('is-focused', e.type === "focus");
        if (e.type === "blur") {
            $(this).closest('.tsHeader-Search').removeClass('is-expanded');
        }
	});

	// add listener to user menu
	$('.tsHeader .tsHeader-Collapse-UserMenu').on('click', function(e) {
		e.preventDefault();
		
		var menu = $(this).closest('.tsHeader-UserMenu').toggleClass('is-expanded');
		if (menu.hasClass('is-expanded')) {
			$(document).on('mousedown.usermenu', function(e) {
				//console.log(e.target, menu, $(e.target).closest(menu).length);
				if (!$(e.target).closest(menu).length) {
					menu.removeClass('is-expanded');
					$(this).off('mousedown.usermenu');
				}
			});
		} else {
			$(document).off('mousedown.usermenu');
		}
	});

	// add event listener for fold out
	//$('.tsHeader .tsHeader-FoldOut > a, .tsHeader .tsHeader-FoldOut-Close a').on('click', function(e) {
		//e.preventDefault();
		//$(this).closest('.tsHeader').toggleClass('is-foldout');

	//});

	// add listener to change event for the collpase. Set the margin top of the submenu to the height of the foldout
    $(".tsHeader").on('change.collapse', function(e, h) {
        $("li.open .tsHeader-SubMenu", this).css('margin-top', h);
    });

	// set heights for css animation
	//$('.tsHeader.is-open .tsHeader-PrimaryMenu .open > a').css('margin-bottom', h);
	//$('.tsHeader:not(.is-open) .tsHeader-PrimaryMenu .tsHeader-FoldOut > a').css('margin-bottom', h);
	//$('.tsHeader .tsHeader-FoldOut-Menu').css('height', h);

	//$('.tsHeader').addClass('is-initialized');

	// run stuff for when a submenu is shown
	// fixed header
	/*if ($('.tsHeader').hasClass('is-open')) {

		// get the position of the subnavigation
		var pos = $('.tsHeader .tsHeader-PrimaryMenu .open ul').offset();
		$(window).resize(function() {
			pos = $('.tsHeader .tsHeader-PrimaryMenu .open ul').offset();
			//scroll();
		});

		var fixed = false;

		var scroll = function() {
			var top = $(this).scrollTop();
			var breakpoint = pos.top + ($('.tsHeader').hasClass('is-foldout') ? h : 0);
			if (!fixed && top > breakpoint) {
				//$('body').css('padding-top', $('.tsHeader').outerHeight(true));
				//$('.tsHeader').addClass('fixed');
				fixed = true;
			} else if (fixed && top <= breakpoint) {
				//$('body').css('padding-top', '');
				//$('.tsHeader').removeClass('fixed');
				fixed = false;
			}
		};

		$(window).scroll(scroll);
		scroll();

	}*/

	// copy the current submenu to a fixed header
	var sub = $(".tsHeader li.open .tsHeader-SubMenu, .tsHeader > .tsHeader-SubMenu");
	if (sub.length === 1) {
		// we will have a fixed header
		var h = $("<div />", { "class": "tsHeader-Fixed tsHeader-Fixed--White" }).append(
			$("<div />", { "class": "tsWrapInner" }).append(
                //$("<i />", { "class": "tsIcon-TeliaLogo logo" }),
				$("<div />", { "class": "tsHeader-SubMenu" }).append(
					$("ul", sub).clone()
				)
				//,
				//$(".tsHeader .tsHeader-UserMenu").clone(true, true),
				//$(".tsHeader .tsHeader-Search").clone(true, true)
			)
		);
		$(".tsHeader").after(h);

        var _blur = 0;
		var scroll = function() {
			var top = $(this).scrollTop();
			var breakpoint = sub.offset().top;
			var breakpoint2 = 300;

			var fixed = top > breakpoint;
            h.toggleClass('is-visible', fixed);
            if (!fixed && $(".tsHeader-Fixed .tsHeader-UserMenu").hasClass('is-expanded')) {
                $(".tsHeader-Fixed .tsHeader-Collapse-UserMenu").click();
            }
            if (fixed) {
                //console.log(Math.min(1, (top - breakpoint)/breakpoint2));
                var blur = Math.floor(Math.min(1, (top - breakpoint)/breakpoint2)*10);
                //console.log(blur, _blur, blur !== _blur);
                //var spread = Math.round(Math.min(1, (top - breakpoint)/breakpoint2)*3);
                //console.log(blur, spread, '0 0 ' + blur + 'px ' + spread + 'px #777');
                if (blur !== _blur) {
                    $(".tsHeader-Fixed").css('box-shadow', '0 0 ' + blur + 'px ' + '0 #777');
                    _blur = blur;
                    //_spread = spread;
                }
            }
		};

		$(window).scroll(scroll);
		scroll();
		



	}

	// return stuff here that can be useful for other modules
	return { };

});