(function(factory) {

	if (typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else {
		window.Header = factory(window.jQuery);
	}

})(function($) {
	
	// add listener for menu collapse, mobile
	$(".tsHeader-Collapse-Menu").click(function(e) {
		if(e.stopPropagation) {
      e.stopPropagation();
    } else { //IE-fix
      e.returnValue = false;
    }
		$(".tsHeader").toggleClass('is-expanded');
	});

	// add listener to search button
	$('.tsHeader .tsHeader-Collapse-Search').on('mousedown', function(e) {
		if(e.stopPropagation) {
        e.stopPropagation();
    } else { //IE-fix
      e.returnValue = false;
    }
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

	// add listener to change event for the collpase. Set the margin top of the submenu to the height of the foldout
    $(".tsHeader").on('change.collapse', function(e, h) {
        $("li.open .tsHeader-SubMenu", this).css('margin-top', h);
    });

	// copy the current submenu to a fixed header
	var sub = $(".tsHeader li.open .tsHeader-SubMenu, .tsHeader > .tsHeader-SubMenu");
	if (sub.length === 1) {
		// we will have a fixed header
		var h = $("<div />", { "class": "tsHeader-Fixed" }).append(
						$("<div />", { "class": "tsWrapInner" }).append( 
            $("<i />"  , { "class": "tsIcon-TeliaLogo logo" }),
						$("<div />", { "class": "tsHeader-SubMenu" }).append(
						$("ul", sub).clone()
				),
				$(".tsHeader .tsHeader-UserMenu").clone(true, true),
				$(".tsHeader .tsHeader-Search").clone(true, true)
			)
		);
		$(".tsHeader").after(h);

		var scroll = function() {
			var top = $(this).scrollTop();
			var breakpoint = $('.tsHeader').outerHeight(true) + $(".tsHeader").position().top;
			var fixed = top > breakpoint;
            h.toggleClass('is-visible', fixed);
            if (!fixed && $(".tsHeader-Fixed .tsHeader-UserMenu").hasClass('is-expanded')) {
                $(".tsHeader-Fixed .tsHeader-Collapse-UserMenu").click();
            }
		};

		$(window).scroll(scroll);
		scroll();
	}

	// return stuff here that can be useful for other modules
	return { };
});