/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.validate.min'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    
    $.fn.tsShortcutsValidation = function() {
        return $(this).validate({
            errorLabelContainer: $("#validateUrl"),
            errorElement: 'p',
            rules: {
                url: {
                    url: true
                }
            }

        });

        $(".tsInputField", this).keypress(function() {
            if ($("#shortcuts_url").hasClass("error")) {
                $("#add_bookmark").attr("disabled", "disabled");
            }
            else {
                $("#add_bookmark").removeAttr("disabled");
            }
        });
    };

});