/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define([],factory);
    } else {
        window.ErrorHandling = factory();
    }

})(function() {

    var translateToMessage = function(errorHandler, errorKey, args){
        if (typeof errorKey === "undefined"){
            errorKey = "AGORA_NO_ERROR_SPECIFIED";
        }
        
        var context = this;
        
        (function(run) {
            if (typeof define === "function" && define.amd) {
                require(['errorKeyTranslation'], run);
            } else {
                run(window.ErrorKeyTranslation);
            }
        })(function(errorKeyTranslation) {
            var errorMessage = errorKeyTranslation.getMessage(errorKey, args);
            errorHandler.call(context, errorMessage);
        });

    };

    return {

        /**
         * Function to be used for translating error keys to messages
         *
         * @param {string} errorKey - a string with the error key
         * @param {array} args - arguments to be passed to error message
         * @return {string} The translated error message
        */
        translateToMessage: function(errorHandler, errorKey, args){
            translateToMessage.call(this, errorHandler, errorKey);
        },


        /**
         * Function to be used for error handling  when calling services. 
         *
         * @param {function} successHandler - function to be run on a successful call
         * @param {function} errorHandler - function to be run on an unsuccessful call
         * @param {array} args - arguments to be passed to error message
         * @return {object} All arguments (functions) to dwr
        */
        serviceCallbacks: function(successHandler, errorHandler, args) {

            var standardSuccessHandler = function(){
            };

            var standardErrorHandler = function(errorMessage){
                console.error("Following error occurred: " + errorMessage);
            };

            if (typeof successHandler !== "function"){
                successHandler = standardSuccessHandler;
            }

            if (typeof errorHandler !== "function"){
                errorHandler = standardErrorHandler;
            }

            var wrappingErrorHandler = function(errorString) {
                translateToMessage.call(this, errorHandler, errorString, args);
            };

            return {
                callback: successHandler,
                errorHandler: wrappingErrorHandler
            };
        },

        /**
         * Function to be used for error handling when calling services. 
         *
         * @param {object} context - The context to be used in the callback function
         * @param {function} successHandler - function to be run on a successful call
         * @param {function} errorHandler - function to be run on an unsuccessful call
         * @param {array} args - arguments to be passed to error message
         * @return {object} All arguments (functions) to dwr
        */
        serviceCallbacksWithContext: function(context, successHandler, errorHandler, args) {

            var obj = this.serviceCallbacks(successHandler, errorHandler, args);

            // hi-jack the functions to call them with a specific context 
            return {
                callback: function() { obj.callback.apply(context, arguments); },
                errorHandler: function() { obj.errorHandler.apply(context, arguments); }
            };

        }



    };
     
 });