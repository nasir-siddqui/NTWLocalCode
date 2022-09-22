/*global define */
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'helpers/serviceErrorHandling'], factory);
    } else if (window.jQuery && window.CustomerInvoicesApi) {
        factory(window.jQuery, window.CustomerInvoicesApi);
    }

})(function($, customerInvoicesApi, errorHandler) {
  
    $.fn.downloadFile = function(options) {
        var maxArguments = options.argumentList.length + 1; 
        $(this).click(function() {
            var $this = $(this);
            require([options.service, "dwr/engine"], function (service, dwr) {
                var method = service[options.method];
                var methodOptions = {
                    callback:function(url) {
                        dwr.openInDownload(url);
                        $this.trigger("reset");
                    },
                    errorHandler:function(){
                        $this.trigger("fail");
                    }
                }
                if (options.argumentList.length < maxArguments) {
                    options.argumentList.push(methodOptions);
                }
                method.apply(this, options.argumentList);
            });
        });
    };


    $("[data-id='downloadFile']").each(function() {
        var values = $(this).data("value");
        options = {
            service : values.service,
            method : values.method,
            argumentList : values.arguments
        };
        $("button", this).downloadFile(options);
    });

});

