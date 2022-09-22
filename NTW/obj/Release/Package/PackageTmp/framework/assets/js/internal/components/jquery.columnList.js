/*global define*/
(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {
    $.fn.tsColumnList = function(options) {
        
        var defaults = {
            columns: 2,
            classPrefix: 'column-',
            listClassPrefix: 'columns-',
            childrenSelector: '> li',
            setLeftMargin: false,
            center: false
        };
        
        var setMarginTop = function() {
            $(this).css('margin-top', -$(this).position().top);
        };

        var centerList = function() {
            $(this).css('margin-top', Math.max(0, ($(this).parent().height() - $(this).height()) / 2));
        };

        if (typeof options === "string") {
            // function call
            if (options === "refresh") {
                
                return this.each(function() {
                    if (!this.tsColumnList) {
                        return;
                    }
                    var topItems = this.tsColumnList.topItems;
                    topItems.each(function() {
                        setMarginTop.apply(this);
                    });

                    if (this.tsColumnList.options.center) {
                        centerList.apply(this);
                    }

                });
            }

        } else {

            options = $.extend({}, defaults, options);

            return this.each(function() {
                var topItems = $();
                var list = $(options.childrenSelector, $(this).addClass(options.listClassPrefix + options.columns));
                var column = 0;
                var processedItems = 0;
                list.each(function(i) {
                    var itemsLeft = list.length - processedItems;
                    var columnsLeft = options.columns - column;
                    var itemsInThisColumn = Math.ceil(itemsLeft / columnsLeft);
                    if (i === processedItems + itemsInThisColumn) {
                        column += 1;
                        processedItems = itemsInThisColumn;
                        topItems = topItems.add(this);
                        setMarginTop.apply(this);
                    }
                    $(this).addClass(options.classPrefix + (column + 1));
                    if (options.setLeftMargin && column > 0) {
                        $(this).css('margin-left', (100 / options.columns * column) + '%');
                    }
                });
                if (options.center) {
                    centerList.apply(this);
                }
                this.tsColumnList = {
                    topItems: topItems,
                    options: options
                };
            });

        }

    };
});