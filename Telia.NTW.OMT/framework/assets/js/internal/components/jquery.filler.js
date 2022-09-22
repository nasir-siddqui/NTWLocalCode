/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.filler = function(param) {

        var _defaults = {
            referer: 'body'
        };

        var options = $.extend({}, _defaults, param);

        var setHeight = function() {

            var height = 0;
            var _this = this;

            $(options.referer).children(":not([class^=mgnl], [id^=mgnl])").each(function() {
                if (this !== _this && $(_this).closest(this).length === 0) {
                    height += $(this).outerHeight(true);
                }
            });

            $(this).css('height', $(window).height() - height);

        };

        return this.each(function() {

            setHeight.apply(this);

            var _this = this;
            $(window).resize(function() {
                setHeight.apply(_this);
            });

        });

    };

    $(function() {

        $("[data-widget=filler]").each(function() {
            $(this).filler($(this).data('widget-options'));
        });

    });

});
