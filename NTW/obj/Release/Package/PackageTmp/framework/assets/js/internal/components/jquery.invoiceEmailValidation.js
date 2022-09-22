(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'service/billedAccountsApi', 'helpers/serviceErrorHandling'], factory);
    } else {
        factory(window.jQuery, window.PriceInformationApi, window.ErrorHandling);
    }

})(function ($, api, errorHandler) {
    $.fn.validateEmail = function () {
        var displayError = function(message) {
            $('input', this).attr('disabled', false);
            $("#errorFeedbackText").text(message);
            $("#errorFeedback").slideDown();
            //$('#validateEmail').removeAttr('disabled');
        };

        var validationSuccess = function (data) {
            $('#successFeedback').slideDown();
        };

        return $(this).submit(function(e) {
            e.preventDefault();

            $("#errorFeedback").slideUp();
            $('input', this).attr('disabled', true);
            
            var organisationNumber = $('#organisationNumber').val().replace("-", "");
            var verificationCode = $('#verificationCode').val();
            var tscID = $('#tscID').val();
            var emailAddress = $('#emailAddress').val();
            var emailAdressID = $('#emailAdressID').val();

            // generate service callbacks
            var cb = errorHandler.serviceCallbacksWithContext(this, validationSuccess, displayError, []);

            // call the service
            api.verifyEmailForInvoiceDelivery(organisationNumber, tscID, emailAddress, emailAdressID, verificationCode, cb);
        });

    };

    $('.tsInvoiceValidateEmailForm').validateEmail();
});