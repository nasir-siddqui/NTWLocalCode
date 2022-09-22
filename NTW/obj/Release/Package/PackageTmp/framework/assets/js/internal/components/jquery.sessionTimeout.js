(function($) {

    $.fn.sessionTimeout = function(options) {

        var defaults = {
            millisecondsLeft: '20000',
            warningMillisecondsLeft: '2000',
            url: 'http://www.telia.se/privat',
            urlElement: '#btn',
            targetModal: "#modal1"
        };

        options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            var showWarningMillisecondsLeft = options.millisecondsLeft - options.warningMillisecondsLeft;

            // Show warning
            setTimeout(function() {
                $(_this).show();
            }, showWarningMillisecondsLeft);

            // Show modal
            setTimeout(function() {
                $(options.targetModal).show();
                $(options.urlElement).attr("href", options.url);
            }, options.millisecondsLeft);
        });
        
    }
})(jQuery);