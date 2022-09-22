/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    var length = $('[data-hint]', '.tsAccordion-list').length;
    $('[data-hint]', '.tsAccordion-list').each(function(index) {
        if (index === length - 1) {
            $(this).addClass("lastChild");
        }
    });

    var onclick = function(speed, close, callback, force) {

        // prevent from closing an already open accordion item unless we force it
        /*if (!force && close && $(this).hasClass('toggled')) {
            return;
        }*/

        $(this).find('ul, .tsAccordionContainer').click(function(e){
            e.stopPropagation();
            //return false;
        });
        
        if (typeof $(this).attr('data-hint') !== "undefined") {
            if (!$(this).hasClass('lastChild')) {
                $(this).css('border-bottom', $(this).hasClass('toggled') ? '4px solid white' : 'none');
            }
        }
        
        $(this).toggleClass('toggled');

        // close others except in the case where the current item is forced to close
        var open = $(this).siblings('.toggled:not(.is-disabled)').get(0);
        if (!force && close && open) {
            onclick.apply(open, Array.prototype.slice.call(arguments, 0).concat(true));
        }

        if ($(this).find('.tsAccordionContainer').length) {
            $(this).find('.tsAccordionContainer').first().slideToggle(speed);
        }
        else {
            $(this).find('ul').first().slideToggle(speed, callback);
        }
        $(this).find('.arrowDown').first().toggleClass('showArrow');
        $(this).find('.arrowUp').first().toggleClass('showArrow');
    };

    $('[data-widget*=accordion]').each(function() {
        initAccordion($(this));
    });

    function initAccordion(element) {
        var $this = element;
        var close = typeof $this.data('widget-accordion-close') !== "undefined" && $this.data('widget-accordion-close');
        var callback = function () {
            $this.trigger('resized');
        };
        $this.find('> .tsAccordion-list-item:not(.is-disabled)').each(function () {
            var show = typeof $(this).data('widget-accordion-show') !== "undefined" && $(this).data('widget-accordion-show');
            if (show) {
                onclick.apply(this, [0, close, callback]);
            }
        }).click(function () { onclick.apply(this, ['fast', close, callback]); });
    }

    return initAccordion;

});