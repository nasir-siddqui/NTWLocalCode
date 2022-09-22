/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.showMore = function(options) {

        var _defaults = {
            type: 'static',
            item: null,
            height: 500,
            content: null,
            target: null,
            showMore: 'Visa {0} mer',
            showLess: 'Visa mindre',
            displayStatus: null,
            step: null
        };

        options = $.extend({}, _defaults, options);

        return this.each(function() {

            var _this = this;
            var displayStatus;
            
            if (!options.content || !options.content.length) {
                options.content = options.target;
                options.content.wrap("<div />");
                options.target = options.content.parent('div');
            }

            if (!options.target || !options.content || !options.target.length || !options.content.length) {
                return;
            }
            options.target.css('overflow', 'hidden');

            this.ShowMore = {
                init: function() {
                    var steps = [ ];
                    var step = this.ShowMore.step || 0;
                    var statusString = options.displayStatus !== null ? options.displayStatus : '';
                    var items = $(options.item, this);

                    if (items.length) {
                        if (options.height >= items.length) {
                            return;
                        }
                        var _step = options.step || items.length;
                        var i = options.height;
                        while (i < items.length) {
                            var next =  Math.min(i + _step, items.length);
                            steps.push({
                                label: options.showMore.replace("{0}", (next - i)),
                                height: items.eq(i).position().top,
                                statusLabel: statusString.replace("{0}", i).replace("{1}", items.length)
                            });
                            i = next;
                        }
                        steps.push({ label: options.showLess, height: options.content.height(), statusLabel: statusString.replace("{0}", items.length).replace("{1}", items.length) });
                    } else {
                        if (options.height > options.content.height() || options.step !== null) {
                            return;
                        }
                        steps.push({ label: options.showMore, height: options.height});
                        steps.push({ label: options.showLess, height: options.content.height() });
                    }
                    this.ShowMore.step = step;
                    this.ShowMore.steps = steps;
                },
                setStep: function(init, last) {
                    if (last) {
                        this.ShowMore.step = this.ShowMore.steps.length - 1;
                    }
                    var more = this.ShowMore.step < this.ShowMore.steps.length - 1;
                    $(this).attr('aria-expanded', more);
                    $(".tsShowMore-button b", this).text(this.ShowMore.steps[this.ShowMore.step].label);
                    $(".tsShowMore-button i", this).attr("class", "tsIcon-Show" + (more ? "More" : "Less"));
                    var mh = (!more || $(options.item) ? $(".tsShowMore-button", this).outerHeight() + $(".tsShowMore-status", this).outerHeight() : 0);
                    var sh = this.ShowMore.steps[this.ShowMore.step].height;
                    var newHeight = sh + mh;
                    var _this = this;
                    var callback = function() {
                        if (_this.ShowMore.step === _this.ShowMore.steps.length - 1) {
                            options.target.css({ height: 'auto', 'padding-bottom': mh });
                        }
                    };
                    if (init) {
                        options.target.css('height', newHeight);
                        callback();
                    } else {
                        options.target.stop().animate({ height: newHeight }, { complete: callback });
                    }
                    $(".tsShowMore-statusText", this).text(this.ShowMore.steps[this.ShowMore.step].statusLabel);
                }
            };

            this.ShowMore.init.call(this);

            if (!this.ShowMore.steps){
                return;
            }

            if (options.displayStatus !== null){
                displayStatus = $("<span />", { "class": "tsShowMore-status"}).append(
                    $("<span />", { "class": "tsShowMore-statusText" }).text(options.displayStatus)
                );
                $(this).append(displayStatus);
                this.ShowMore.displayStatusElement = displayStatus;
            }

            var showMoreElement = $("<a />", { "class": "tsShowMore-button", "data-widget-control": "collapse-trigger", "href": "" }).append(
                    $("<span />", { "class": "tsBtn--collapse" }).append(
                        $("<b />", { "data-widget-collapse": "toggletext" }).text("Visa mer"),
                        $("<i />", { "class": "tsIcon-ShowMore" })
                    )
                ).click(function(e) {
                    e.preventDefault();
                    _this.ShowMore.step = (_this.ShowMore.step + 1) % _this.ShowMore.steps.length;
                    _this.ShowMore.setStep.call(_this);
                }).css("bottom", displayStatus === undefined ? 0 : displayStatus.outerHeight());

            $(this).append(showMoreElement);
            this.ShowMore.showMoreElement = showMoreElement;
            this.ShowMore.options = options;

            _this.ShowMore.setStep.call(this, true);
        });

    };

    // $.fn.resize = function(options) {

    //     options = $.extend({}, options);

    //     return this.each(function() {
    //         console.log("new height: " + options.newHeight);
    //         console.log("content: " + options.content);
    //         console.log("target: " + options.target);
    //         console.log("targetHeight: " + options.target.height());
    //         options.target.css('height', options.newHeight+50);
    //     });

    // };

    $(function() {

        $("[data-toggle='showmore']").each(function() {
            var options = {
                height: $(this).data('height'),
                target: $($(this).data('target'), this).first(),
                content: $(this).data('content') ? $($(this).data('content'), this).first() : null,
                item: $(this).data('item'),
                step: $(this).data('step') ? $(this).data('step') : null
            };
            if ($(this).data('height')) {
                options.height = $(this).data('height');
            }
            if ($(this).data('text-more')) {
                options.showMore = $(this).data('text-more');
            }
            if ($(this).data('text-less')) {
                options.showLess = $(this).data('text-less');
            }
            if ($(this).data('text-status')) {
                options.displayStatus = $(this).data('text-status');
            }
            $(this).showMore(options);

            // $("[data-toggle='showmore']").on("click", function() {
            //     var resizeOptions = {
            //         content: options.content,
            //         newHeight: options.content.height(),
            //         target: options.target
            //     };
            //     $(this).resize(resizeOptions);
            // });
            
            // Tip: You can trigger resize if you want to update the height of showmore
            // How to use: .trigger('resized')
            $(this).on('resized', function() {
                if (this.ShowMore.steps) {
                    this.ShowMore.init.call(this);
                    this.ShowMore.setStep.call(this, true);
                }
            });

            $(this).on('repaint', function() {
                if (this.ShowMore.options){
                    this.ShowMore.showMoreElement.remove();
                    this.ShowMore.displayStatusElement.remove();
                    this.ShowMore.options.target.css("height", "auto");
                    this.ShowMore.options.target.css("padding-bottom", 0);
                }
                $(this).showMore(options);
            });
        });
        
        if (location.hash) {
            location.href = location.hash;
        }

        $("[data-widget='collapse'][data-widget-type='preview']").each(function() {

            var options = {
                target: $("[data-widget-collapse='inner']", this),
                content: $("[data-widget-collapse='preview']", this),
                showMore: "Visa mer"
            };
            options.height = options.target.height() - 83;
            $(this).addClass('tsPreview--initialized').showMore(options);
        });


    });

});