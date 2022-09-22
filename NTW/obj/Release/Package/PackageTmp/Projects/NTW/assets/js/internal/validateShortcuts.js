(function($) {
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $(".tsShortCuts-add-url").validate({
        errorLabelContainer: $("#validateUrl"),
        errorElement: 'p',
        rules: {
            url: {
                url: true
            }
        }
    });

    $(".tsInputField, .tsShortCuts-add-url").keypress(function() {
        if ($("#shortcuts_url").hasClass("error")) {
            $("#add_bookmark").attr("disabled", "disabled");
        }
        else {
            $("#add_bookmark").removeAttr("disabled");
        }
    });

})(window.jQuery);