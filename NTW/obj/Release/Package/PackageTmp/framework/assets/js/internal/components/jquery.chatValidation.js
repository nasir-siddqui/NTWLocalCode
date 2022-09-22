/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.validate.min'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    
    $.fn.initChatFormValidation = function() {
        return $(this).validate({
            errorContainer: $(this).find(".tsInlineFeedback"),
            errorLabelContainer: $(this).find(".tsInlineFeedback-error"),
            errorElement: "span",
            messages: {
                firstName: {
                    required: "Name is required",
                },
                email: {
                    required: "Email is required",
                    email: "Your email must be in the format of name@domain.com"
                }
            },
            rules: {
                email: {
                    required: {
                        depends: function(element) {
                            return $(".tsChatForm #sendSummaryId:checked").length;
                        }
                    }
                }
            }
        });
    };

});