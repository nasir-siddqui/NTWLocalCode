/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {


    $.fn.iframe = function(options) {

        options = $.extend({ target: this, type: 'default' }, options);

        return this.each(function() {

            $("<iframe />", { "class": "iframe", "src": $(this).data('iframe'), "frameborder": 0 }).appendTo(options.target);
            if (options.type === "full") {
                $(this).css({'position': 'fixed', 'width': '100%', 'top': $(this).position().top, 'bottom': $('.tsFooter').height() });
                $(options.target).css({ 'height': '100%', 'padding-top': 20, 'padding-bottom': 20 });
                $('iframe', options.target).css({ 'height': '100%' });
                $('.tsFooter').css({ 'position': 'fixed', 'bottom': 0, 'width': '100%' });
                // listen to header collapse
                var $this = $(this);
                $('.header').on('change.collapse', function(e, h) {
                    $this.css('margin-top', h);
                });
            } else {
                $('iframe', options.target).css({ 'height': 600 });
            }

        });

    };

    $(function() {

        $("[data-iframe]").each(function() {
            var type = $(this).data('type');
            var target = $(this).data('target') ? $($(this).data('target'), this).get(0) : this;
            $(this).iframe({ target: target, type: type });
        });

    });


});