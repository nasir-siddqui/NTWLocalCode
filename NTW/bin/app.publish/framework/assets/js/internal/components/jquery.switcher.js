/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.switcher = function(options) {

        var _defaults = {
            sliderElement: ".switchSlider",
            switchElement1: ".switchOption1",
            switchElement2: ".switchOption2"
        };

        options = $.extend({}, _defaults, options);

        return this.each(function() {
            var slideToRight = ($(this).outerWidth() == 0 ? 68 : $(this).outerWidth()) - 27;
            var slideToLeft = 3;

            var isToggled = "false";
            if ($(this).hasClass('active')) {
                isToggled = "true";
                $(options.sliderElement, this).css('left', slideToRight);
                $(options.switchElement2, this).show();
            }
            $(this).click(function(e) {
                slideToRight = ($(this).outerWidth() == 0 ? 68 : $(this).outerWidth()) - 27;
                slideToLeft = 3;
                e.preventDefault();
                if (isToggled === "false") {
                    $(options.sliderElement, this).animate({left:slideToRight}, 200);
                    $(options.switchElement2, this).fadeIn(200);
                    isToggled = "true";
                }
                else {
                    $(options.sliderElement, this).animate({left:slideToLeft}, 200);
                    $(options.switchElement2, this).fadeOut(200);
                    isToggled = "false";
                }
                $("input[type=hidden]", this).val(isToggled);
            });

        });


    };


});