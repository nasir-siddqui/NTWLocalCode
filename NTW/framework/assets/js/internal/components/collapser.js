/*globals define*/
/*jshint nonew: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        
        define(['jquery'], factory);
    
    } else if (window.jQuery) {

        window.Collapser = factory(window.jQuery);
    }

})(function($) {

    var Collapser = function(element, options) {

        if (element && element.Collapser) {
            return;
        } else if (element) {
            element.Collapser = { };
        }

        var _defaults = {
            group: "default",
            collapseType: "slide",
            collapseDuration: 200,
            collapseHide: "none",
            pusherPosition: "append",
            preventDefault: "true"
        };

        options = $.extend({}, _defaults, options);
        this.options = options;

        this.trigger = $(element);
        this.target = $(options.target);

//        this.pusherSelector = typeof $(element).attr('data-pusher') !== "undefined" ? $(element).attr('data-pusher') : null;
//        this.pusherClass = typeof $(element).attr('data-pusher-class') !== "undefined" ? $(element).attr('data-pusher-class') : null;

        this.pusherSelector = options.pusherSelector || null;
        this.pusherClass = options.pusherClass || null;
        
        //this.active = this.target.is(':visible') && this.trigger.is(':visible');
        //this.initActive = this.active;
        
        this.pusher = null;
        
//        this.change = typeof $(element).attr('data-change') !== "undefined" ? $($(element).attr('data-change')) : null;
//        this.group = typeof $(element).attr('data-collapse-group') !== "undefined" ? $(element).attr('data-collapse-group') : "default";

        this.change = options.change ? $(options.change) : null;
        this.group = options.group;

        this.init();
    };
    
    Collapser.list = [];

    Collapser.prototype.isActive = function() {
        return this.target.is(':visible') && (this.trigger.length === 0 || this.trigger.is(':visible'));
    };

    Collapser.getActive = function(group) {
        if (group === "default") {
            return null;
        }
        var list = $.grep(Collapser.list[group], function(item) { return item.isActive(); });
        if (list.length > 0) {
            return list[0];
        }
        return null;
    };

    Collapser.prototype.collapse = function(callback) {
        var _this = this;
        var active = Collapser.getActive(_this.group);

        //console.log("active: " + active);
        if (active && active.target.get(0) !== _this.target.get(0)) {
            active.toggle(function() {
                _this.toggle(callback);
            });
        } else {
            _this.toggle(callback);
        }
    };
    
    Collapser.prototype.init = function() {
        if (typeof Collapser.list[this.group] === "undefined") {
            Collapser.list[this.group] = [];
        }
        Collapser.list[this.group].push(this);
        var _this = this;
        this.trigger.click(function(e) {
            if (_this.options.preventDefault === "true") {
                e.preventDefault();
            }
            if (_this.options.trigger) {
                $(_this.options.trigger).click();
            } else {
                _this.collapse();
            }
        });

    };

    Collapser.prototype._onMouseDown = function(e) {
        if (!(e.target === this.trigger.get(0) ||
            $(e.target).closest(this.trigger).length ||
            e.target === this.target.get(0) ||
            $(e.target).closest(this.target).length)) {
            this.toggle();
        }
    };
    
    Collapser.prototype.toggle = function(callback) {
                        
        //this.active = !this.active;
        //console.log(this.isActive());
        
        var active = !this.isActive();

        if (active) {
            if (this.options.collapseHide === "auto") {
                $(document).bind('mousedown', $.proxy(this._onMouseDown, this));
            }

            this.trigger.addClass('active');
            if (this.pusherSelector) {
                $(this.pusherSelector + "> .pusher").remove();
                this.pusher = $("<div />").addClass('pusher').addClass(this.pusherClass);
                if (this.options.pusherPosition === 'after')
                    $(this.pusherSelector).first().after(this.pusher);
                else if (this.options.pusherPosition === 'before') {
                    $(this.pusherSelector).first().before(this.pusher);
                } else {
                    $(this.pusherSelector).first().append(this.pusher);
                }
            }
        } else {
            if (this.options.collapseHide === "auto") {
                $(document).unbind('mousedown', $.proxy(this._onMouseDown, this));
            }
        }
        
        var _this = this;
        this.target.parent().removeClass('expanded');

        var complete = function() {

            if (!active) {
                if (_this.pusher) {
                    _this.pusher.remove();
                }
                _this.trigger.removeClass('active');
            } else {
                if (_this.pusher && _this.pusher.is(':hidden')) {
                    _this.target.parent().addClass('expanded');
                }
            }
            _this.trigger.trigger('resized');
            if (callback) {
                callback.call(_this);
            }
        };
        var step = function(value, info) {
            if (info.prop === 'height') {
                $(_this.change).each(function() {
                    $(this).trigger('change.collapse', value);
                });
                if (_this.pusher) {
                    _this.pusher.css('height', value);
                }
            }
            if (info.prop === 'opacity') {
                var height = $(this).height();
                $(_this.change).each(function() {
                    $(this).trigger('change.collapse', height);
                });
                if (_this.pusher) {
                    _this.pusher.css('height', height);
                    _this.pusher.css('opacity', value);
                }
            }
        };

        var duration = this.options.collapseDuration;

        if (this.options.collapseType === "slide") {
            this.target.slideToggle({
                duration: duration,
                complete: complete,
                step: step
            });
        } else if (this.options.collapseType === "fade") {
            this.target.fadeToggle({
                duration: duration,
                complete: complete,
                step: step
            });
        }


    };

    $.fn.collapser = function(options) {

        return this.each(function() {

            var o = {
                target: $(this).data('target'),
                collapseType: $(this).data('collapse-type') || "slide",
                collapseDuration: $(this).data('collapse-duration') || 200,
                collapseHide: $(this).data('collapse-hide') || "none",
                pusherSelector: $(this).data('pusher') || null,
                pusherClass: $(this).data('pusher-class') || null,
                change: $(this).data('change') || null,
                group: $(this).data('collapse-group') || "default",
                trigger: $(this).data('trigger') || null,
                preventDefault: $(this).data('prevent-default'),
                pusherPosition: $(this).data('pusher-position') || "append"
            };

            new Collapser(this, $.extend({}, options, o));
        });

    };

    $(function() {

        $("[data-toggle='collapse']").collapser();

        $(document).bind('init-collapse', function() {
            $("[data-toggle='collapse']").collapser();
        });

    });

    return Collapser;

});
