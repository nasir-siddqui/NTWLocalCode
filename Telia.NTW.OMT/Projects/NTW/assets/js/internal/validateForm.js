(function($) {
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $(".tscForm").validate({
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

})(window.jQuery);