/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    /**
     * [positionList - Positions the specified target in each item in the list so that it aligns on one row]
     * @param  {object} options - item - The css selector for the items in the list, typically the li
     *                            target - The css selector for the target that should be aligned within the item
     *                                     with the other targets in the items on the same row
     *                            css - The css property that should be used to position the target,
     *                                  typically 'padding-top' or 'margin-top'  
     * @return {object} The jQuery object for further chaining
     */
    $.fn.positionList = function(options) {
        var o = $.extend({
            item: '.item',
            target: '.target',
            css: 'margin-top',
            columnMatch: null,
            runOnResize: true,
            bottom: false
        }, options);

        var getLists = function(list) {
            var ret = [];
            var items = $(o.item, list);
            if (o.columnMatch) {
                $.each(new Array(o.columnMatch.columns), function(col) {
                    items.filter('.' + o.columnMatch.className.replace(/\{0\}/, col + 1)).each(function(i) {
                        if (!ret[i]) {
                            ret[i] = $();
                        }
                        ret[i] = ret[i].add(this);
                    });
                });
                return ret;
            } else {
                var start = 0;
                items.css('position', 'relative');
                items.each(function(i) {
                    var item = $(this);
                    var next = item.next();
                    if (!next.length || item.position().top !== next.position().top) {
                        ret.push(items.filter(function(index) { return index >= start && index <= i; }));
                        start = i + 1;
                    }
                }).css('position', '');
                return ret;
            }
        };

        var setPosition = function(list) {
            
            var lists = getLists(list);
            console.log(lists);
            $.each(lists, function(index, list) {
                list.css('position', 'relative');
                var pos = $.map(list, function(item) { return $(o.target, item).position().top + (o.bottom ? $(o.target, item).height() : 0); });
                var max = Math.max.apply(null, pos);
                $(o.target, list).each(function(i) {
                    if (pos[i] !== max) {
                        $(this).css(o.css, max - pos[i]);
                    }
                });
                list.css('position', '');
            });

        };

        /*var setHeight = function(list){

            var lists = getLists(list);
            console.log(lists);

        };*/

        return this.each(function() {
            var _this = this;
            if (options.runOnResize) {
                $(window).resize(function() { setPosition(_this); });
            }
            setPosition(this);
        });

    };

});