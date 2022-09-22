/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.resize = function(options) {

        var defaults = {
            container: '.tsComponent--inset',
            targetContainer: '.tscList'
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            var max = $(_this).width() || 940;
            var w = $(window).width();
            var container = $(options.container, _this);
            var targetContainer = $(options.targetContainer);
            var margin = -Math.max(0, (w - max)/2);
            container.css({ 'margin-left': margin, "margin-right": margin });
            targetContainer.css({
                'width': max,
                'margin': '0 auto',
                'position': 'relative'
            });
        });
        
    };


});