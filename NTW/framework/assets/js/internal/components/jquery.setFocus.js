/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.setFocus = function(options) {


        options = $.extend({}, options);

        return this.each(function() {
            var _this = this;
            $(_this).click(function() {
                $(options.focusTarget).focus();
            });
        });
        
    };

});