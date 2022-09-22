(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        window.BilledAccountsApi = factory(window.jQuery);
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
        addEmailForInvoiceDelivery: function(orgnr, inputEmailAddress, callback) {
            delay(function(){
                var returnEmailAddress = {
                    emailAddressID : "emailid3",
                    emailAddress : inputEmailAddress,
                    status : "REGISTERED "
                };

                if (typeof callback === "object"){
                    var callbackSuccess = callback.callback;
                    var callbackError = callback.errorHandler;
                    
                    if (inputEmailAddress === "a@a.se"){
                        callbackError("ERRORKEY");
                    } else {
                        callbackSuccess(returnEmailAddress);
                    }
                        

                }
            }, 1000);
        },

        deleteEmailForInvoiceDelivery: function(orgnr, inputEmailAddress, callback) {
            delay(function(){
                if (typeof callback === "object"){
                    var callbackSuccess = callback.callback;
                    var callbackError = callback.errorHandler;
                    
                    callbackSuccess();
                    //callbackError("ERRORKEY");
                }
            }, 1000);
        },

        updateBillingAddress: function(orgnr, billingAccounts, billingAddress, callback) {
            delay(function(){
                if (typeof callback === "object"){
                    var callbackSuccess = callback.callback;
                    var callbackError = callback.errorHandler;
                    if (billingAddress.postalCode === "1"){
                        callbackSuccess([
                            {
                                "billingAccount" : billingAccounts[0],
                                "responseCode" : "Major problem here"
                            },
                            {
                                "billingAccount" : billingAccounts[0],
                                "responseCode" : "Major problem here as well"
                            }
                        ]);
                    } else {
                        callbackSuccess([]);
                    }
                }
            }, 2000);
        },

        updateDeliverMethodConfiguration: function(orgnr, billingAccounts, emailAddressID, contactName, deliveryMethod, telephoneNumber, callback) {
            delay(function(){
                if (typeof callback === "object"){
                    var callbackSuccess = callback.callback;
                    var callbackError = callback.errorHandler;
                    
                    if (contactName === "1"){
                        callbackError("ERRORKEY");
                    } else if (contactName === "2") {
                        callbackSuccess([
                            {
                                "billingAccount" : billingAccounts[0],
                                "errorCode" : "Major problem here"
                            },
                            {
                                "billingAccount" : billingAccounts[0],
                                "errorCode" : "Major problem here as well"
                            }
                        ]);
                    } else {
                        callbackSuccess([]);
                    }
                }
            }, 2000);
        },

        verifyEmailForInvoiceDelivery: function(organizationNumber, tscID, emailAddress, emailAdressID, verificationCode, callback) {
            delay(function() {
                if (verificationCode == 1) {
                    callback.errorHandler("ERROR_INVALID_VERIFICATION_CODE");
                    return;
                }

                // Simulate orgno mismatch on orgno = "1"
                if (organizationNumber == "1") {
                    callback.errorHandler("ERROR_ORGANISATION_NUMBER_MISMATCH");
                    return;
                }
                
                callback.callback();
            }, 3000);
        }

    };

});