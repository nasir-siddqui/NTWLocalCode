/*global define, hash*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        window.ErrorKeyTranslation = factory(window.jQuery);
    }

})(function($) {

    /*[#import "/teliasonera/mybusiness/includes/errorHandling" as errorHandling]

    [#macro getAllErrorMessages]       
      [#local lang = ctx.lang!"sv"]
      [#if lang=="null"]
        [#local lang = "sv"]
      [/#if]
      [#local messageData = errorHandling.getMessageData(lang)]
      [#local errorlist = messageData?split("\n")]
      [#list errorlist as error]
        [#if !error?starts_with("#") && error?contains("=")]
          [#local errorKey = error?split("=")?first?trim/]
          [#local errorValue = error?split("=")?last?trim/]  
          [#if errorKey != "" && errorValue?? && errorValue != ""]
            "${errorKey}" : "${errorValue}"[#if error_has_next],[/#if]
          [/#if]
        [/#if]
      [/#list]
    [/#macro]

    var errorMessages = {
        [@getAllErrorMessages /]
    };

    var standardMessageKey = "${errorHandling.standardErrorKey}";*/

    var errorMessages = {
        "AGORA_ERROR_COMMON_GENERAL" : "Tillfälligt fel. Var god försök igen.",
        "AGORA_ERROR_COMMON_ERRORWITHPARAMETER" : "Det här: {0} är ett exempel på en parameter",
        "ERROR_FETCHING_PRICEINFORMATION": "Det gick inte att hämta prisinformation med id {0}",
        "ERROR_INVALID_VERIFICATION_CODE": "Felaktigt validerings-id.",
        "ERROR_ORGANISATION_NUMBER_MISMATCH": "Felaktigt organisationsnummer.",
        "ERROR_CANNOT_CREATE_MAIN_GROUP": "Det gick inte att spara huvudgruppen.",
    };

    var standardMessageKey = "AGORA_ERROR_COMMON_GENERAL";

    var addParameters = function(message, args) {
        if ($.isArray(args)){
            for(var i=0; i<args.length; i++){
                message = message.replace("{"+i+"}", args[i]);
            }
        }
        return message;
    };

    return {
        getMessage: function(errorKey, args){
            var message = "Tillfälligt fel. Var god försök igen.";
            if (typeof errorKey !== "undefined" && typeof errorMessages[errorKey] !== "undefined"){
                message = errorMessages[errorKey];
            } else if (typeof errorMessages[standardMessageKey] !== "undefined"){
                message = errorMessages[standardMessageKey];   
            }
            return addParameters(message, args);
        }
    };
});