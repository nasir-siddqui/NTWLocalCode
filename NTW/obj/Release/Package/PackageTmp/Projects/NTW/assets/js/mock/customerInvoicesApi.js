(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        window.CustomerInvoicesApi = factory(window.jQuery);
    }

})(function($) {

    var delay = function(func, delay) {
        setTimeout(function() {
                func();
            },
            delay
        );
    };

    return {

        getPdfInvoice: function(orgNumber, invoiceId, billingAccount, billSystemID, callback) {
            console.log("getPdfInvoice");
            delay(function(){
                console.log("getPdfInvoice delay");
                console.log(callback);
                if (typeof callback === "object"){
                    var callbackSuccess = callback.callback;
                    var callbackError = callback.errorHandler;

                    //callbackError("ERRORKEY");
                    console.log("TEST");
                    callbackSuccess("/dms/templating-kit/themes/telia-se/types/Telia-Icon-Glyphs-eot/Telia-Icon-Glyphs-eot.eot");
                }
            }, 1000);
        }

    };

});