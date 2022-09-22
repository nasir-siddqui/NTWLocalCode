/*global define */
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {
  
    $.fn.manageRole = function(options) {

        var defaults = {
            test: 'la'
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            /*console.log(_this);
            console.log(options.test);*/
        });

    };


    $("[data-widget*=manageRole]").each(function() {
        var options = {
            //invoiceSettingsEditButton : $("[data-id='invoiceSettingsEditButton']", this),      
        };

        $(this).manageRole(options);
    });

});

