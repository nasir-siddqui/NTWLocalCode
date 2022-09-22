/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.validate.min'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    
    /*$.fn.tsFormValidation = function() {
        var v = $(this).validate({
            errorClass: "tscFormFeedback-error",
            errorElement: "span",
            rules: {
                firstName: "required",
                lastName: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                firstName: "Please enter your first name",
                lastName: "Please enter your last name",
                email: "Please enter a valid email address"
            },

            submitHandler: function(form) {
                form.submit();
            }

        });

        v.resetForm();
        
        return v;
    };*/

    $.fn.tsFormValidation = function() {
        return $(this).validate({
            errorClass: "tscFormFeedback-error",
            errorElement: "span",
            rules: {
                firstName: "required",
                lastName: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                firstName: "Please enter your first name",
                lastName: "Please enter your last name",
                email: "Please enter a valid email address"
            },

            submitHandler: function(form) {
                form.submit();
            }

        });
    };

});