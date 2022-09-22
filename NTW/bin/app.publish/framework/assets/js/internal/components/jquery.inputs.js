/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    /**
     * Toggling the class tseCheckbox--checked on the checkbox.
    */
    jQuery.fn.initCheckbox = function() {
        if (!$(this).prop("checked") && $(this).hasClass("tseCheckbox--checked"))
        {
            $(this).prop('checked', true);
        }

        return $(this).change(function() {
            if($(this).prop('checked')) {
                $(this).addClass("tseCheckbox--checked");
            } else {
                $(this).removeClass("tseCheckbox--checked");
            }
        });
    };
 });