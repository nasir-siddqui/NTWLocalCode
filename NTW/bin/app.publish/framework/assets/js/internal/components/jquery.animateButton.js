/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.animateButton = function() {

        var defaults = {
            progress: 'tsAnimateButton-progress',
            button: 'tsAnimateButton',
            bar: 'tsAnimateButton-bar'
        };

        var options = $.extend({}, defaults, options);

        return this.each(function() {
            var _this = this;
            var button = $('.' + options.button, _this);
            var buttonClass = button.attr("class");
            var value = $(_this).data('content');

            // Required
            var progress = $(_this).data('progress');
            var finish = $(_this).data('finish');
            var fail = $(_this).data('fail');
            var maxTime = $(_this).data('max-time');

            // Optional
            var finishLink = $(_this).data('finish-link');
            var reset = $(_this).data('reset');
            var backwards = $(_this).data('backwards');
            var noFinish = $(_this).data('no-finish');

            if (backwards) {
                $(_this).addClass('backwards');
            }

            var progressBar = $('<span />', { 'class': options.progress });
            var placeholder = $('<span />', { 'class': buttonClass + ' placeholder' }).text(progress);
            var bar = $('<span />', { 'class': buttonClass + ' ' + options.bar }).text(progress);
            var noBackground = $('<span />', { 'class': buttonClass, 'href': '/' }).text(progress);
            if (finishLink) {
                noBackground = $('<a />', { 'class': buttonClass, 'href': '/' }).text(progress);
            }

            var animateProgress = function() {
                if($(_this).attr('disabled') || button.attr('disabled')){
                    return;
                }
                var direction = "left";
                $(_this).find(':first-child').hide();
                progressBar.empty();
                progressBar.append(placeholder);
                noBackground.addClass('noBackground');

                $(_this).append(
                    progressBar,
                    bar,
                    noBackground
                );

                var barWidth = bar.outerWidth();

                if (backwards === true) {
                    bar.css(direction, barWidth);
                }
                else {
                    bar.css(direction, -barWidth);
                }

                bar.animate({ left: '0' }, maxTime, function() {
                    if (reset === true) {
                        resetButton();
                    }
                    else if (finish && !noFinish) {
                        finishProgress();
                    }

                });

            };

            var finishProgress = function() {
                placeholder.text(finish);
                bar.text(finish);
                bar.finish();
                noBackground.text(finish);
                if (finishLink) {
                    noBackground.attr('href', finishLink);
                }
            };

            var resetButton = function() {
                bar.stop();
                $(_this).empty();
                $(_this).append(button);
                button.removeAttr("disabled");
                bar.text(progress);
                noBackground.text(progress);
                button.show();
                button.val(value).text(value);
                button.on('click', function() {
                    animateProgress(_this);
                });
            };

            var progressFailed = function() {
                resetButton();
                button.val(fail).text(fail); // To support both input and a href buttons
            };

            // Start animation
            button.on('click', function() {
                animateProgress(_this);
            });

            $(_this).on('animate', function() {
                animateProgress(_this);
            });

            $(_this).on('finish', function() {
                finishProgress();
            });

            $(_this).on('reset', function() {
                resetButton();
            });

            $(_this).on('fail', function(e) {
                progressFailed();
                e.stopPropagation();
            });

        });
        
    };

});