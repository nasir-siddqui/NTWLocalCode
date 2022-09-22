/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {
    
    $.fn.passwordValidation = function() {

        return this.each(function() {
            var newPassword = $("#newPassword");
            var repeatPassword = $("#repeatPassword");
            var newIconContainer = $(newPassword).siblings(".tsIconBackground");
            var repeatIconContainer = $(repeatPassword).siblings(".tsIconBackground");

            $("#newPassword, #newPasswordText, #repeatPassword, #repeatPasswordText").bind("keyup", function() {
                var id = $(this).attr('id');

                if (id.match(/^new/)) {
                    setNewPasswordValid($(this).val().length > 5);
                }

                setRepeatPasswordValid($("#newPassword").val() === $("#repeatPassword").val() && $("#repeatPassword").val().length > 5);


            });


            // Show validation icons

            function setNewPasswordValid(bool) { bool ? newPasswordValid() : newPasswordInvalid(); }
            function setRepeatPasswordValid(bool) { bool ? repeatPasswordValid() : repeatPasswordInvalid(); }
            function newPasswordValid() {
                newIconContainer.addClass("valid");
                newIconContainer.removeClass("invalid");
            }
            function newPasswordInvalid() {
                newIconContainer.addClass("invalid");
                newIconContainer.removeClass("valid");
            }
            function repeatPasswordValid() {
                repeatIconContainer.addClass("valid");
                repeatIconContainer.removeClass("invalid");
            }
            function repeatPasswordInvalid() {
                repeatIconContainer.addClass("invalid");
                repeatIconContainer.removeClass("valid");
            }

        });
    };
});