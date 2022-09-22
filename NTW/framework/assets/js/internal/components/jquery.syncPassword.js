/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.syncPassword = function(options) {

        var _defaults = {
            valid: "valid",
            invalid: "invalid"
        };

        options = $.extend({}, _defaults, options);

        return this.each(function() {
            var _this = this;
            var passwordValue = "";

            $('input', _this).bind('keyup', function() {
                passwordValue = this.value;
                $.each($('input', _this), function() {
                    var inputField = this;
                    inputField.value = passwordValue;
                });
            });
        });
        
    };


});