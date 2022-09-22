/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.addIframe = function(options) {

        var defaults = {
            target: ".tsAddIframe-button",
            container: "tsAddIfame-container",
            colspan: "2",
            iframeHeight: "400px"
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            $(options.target).on('click', function() {
                var button = this;
                var link = $(button).data('iframe-link');
                var row = $(this).closest('tr');
                var container = $('<tr />').append(
                    $('<td />', { 'class': options.container + ' tsPaddingTop tsPaddingBottom', 'colspan': options.colspan }).append(
                        $('<iframe />', { 'class': 'iframe', 'src': link, 'style': 'height: ' + options.iframeHeight, 'frameborder': '0'})
                    )
                );
                if ($(button).hasClass('toggled')) {
                    row.next().remove();
                }
                else {
                    container.insertAfter(row);
                }
                $(button).toggleClass('toggled');
            });
        });
        
    };

});