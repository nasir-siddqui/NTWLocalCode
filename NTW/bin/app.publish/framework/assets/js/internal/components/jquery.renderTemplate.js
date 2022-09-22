/*global define */
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.jsviews'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {
  
    $.fn.renderTemplate = function(options) {

        var defaults = {
            template: '#template',
            container: '#container',
            source: 'test/json-access.php'
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            var data = [];
            $.getJSON(options.source, function(result) {
                console.log(result);
                data = result;
                var template = $.templates(options.template);
                template.link(options.container, data);
            });

        });

    };


    $("[data-widget*=renderTemplate]").each(function() {

        var options = {
            template: $(this).data('template'),
            container: $(this).data('container'),
            source: $(this).data('source')
            //invoiceSettingsEditButton : $("[data-id='invoiceSettingsEditButton']", this),      
        };

        $(this).renderTemplate(options);

    });

});