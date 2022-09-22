/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'masonry/masonry', 'imagesloaded/imagesloaded'], factory);
    } else if (window.Masonry && window.jQuery) {
        factory(window.jQuery, window.Masonry);
    }

})(function($, Masonry) {


    var defaults = {
        itemSelector: 'li, .tsFluidGrid-item',
        itemVisibleClass: 'show',
        columnWidthClass: 'fluid-grid-width'
    };

    var methods = {
        
        init: function(options, callback) {
 
            if (this.MasonryList) {
                $.error("jQuery.masonryList is already initialized");
                return;
            }

            if (typeof options === "function") {
                callback = options;
                options = {};
            }

            var opt = $.extend({}, defaults, options);

            var list = $(opt.itemSelector, this);
            if (opt.itemVisibleClass) {
                list.addClass(opt.itemVisibleClass);
            }
            
            $(this).imagesLoaded().always(function(instance) {

                var element = instance.elements[0];

                element.MasonryList = {
                    items: $.map(list, function(item) {
                        return { element: item, sort: $(item).data('sort'), filter: $(item).data('filter') };
                    }),
                    getItems: function(items) {
                        if (!items) {
                            items = element.MasonryList.items;
                        }
                        return $.map(items, function(item) { return item.element; });
                    },
                    options: opt,
                    filters: [],
                    msnry: new Masonry(element, {
                        itemSelector: opt.itemSelector,
                        columnWidth: ".fluid-grid-width"
                    })
                };

                if (typeof callback === "function") {
                    callback.call(element);
                }

            });

        },

        sort: function(sort, order) {

            var dir = typeof order !== "undefined" && order === "desc" ? 1 : -1;

            var clonedItems = $.map(this.MasonryList.items, function(item) { return $.extend({}, item, { element: $(item.element).clone().get(0) }); });

            clonedItems.sort(function(a, b) {


                if (typeof a.sort === "undefined" || typeof b.sort === "undefined") {
                    return 0;
                }
     
                if (a.sort[sort] < b.sort[sort]) {
                    return dir;
                } else if (a.sort[sort] > b.sort[sort]) {
                    return -dir;
                }

                return 0;

            });

            this.MasonryList.msnry.remove(this.MasonryList.getItems());
            $(this).prepend(this.MasonryList.getItems(clonedItems));
            $(this).imagesLoaded().always(function(instance) {
                var element = instance.elements[0];
                element.MasonryList.msnry.prepended(element.MasonryList.getItems(clonedItems));
                element.MasonryList.items = clonedItems;
            });

        },

        filter: function(filters) {

            this.MasonryList.filters = filters;
            methods._doFilter.apply(this);

            //console.log(filters);
        },

        addFilter: function(key, value, and) {
            
            var o = this.MasonryList;

            and = typeof and === "boolean" ? and : false;

            if (typeof key !== "string") {
                $.error("key need to be a string");
                return;
            }

            o.filters = $.grep(o.filters, function(filter) { return filter.key !== key; });
            o.filters.push({ key: key, value: value, and: and });

            methods._doFilter.apply(this);

        },

        removeFilter: function(key) {
            var o = this.MasonryList;
            if (typeof key === "undefined") {
                o.filters = [];
            } else {
                o.filters = $.grep(o.filters, function(filter) { return filter.key !== key; });
            }

            methods._doFilter.apply(this);
        },

        _doFilter: function() {

            var passed = $.extend([], this.MasonryList.items);

            $.each(this.MasonryList.filters, function(i, f) {
                console.log(f);
                passed = $.grep(passed, function(item) {
                    var data = item.filter || {};
                    var checkFilter = function(datavalue, filtervalue) {
                        if ($.isArray(datavalue)) {
                            var index = $.inArray(filtervalue, datavalue);
                            return index !== -1;
                        }
                        return datavalue === filtervalue;
                    };
                    if ($.isArray(f.value)) {
                        var matches = $.grep(f.value, function(value) {
                            return checkFilter(data[f.key] || '', value);
                        });
                        return f.and ? matches.length === f.value.length : matches.length > 0 || f.value.length === 0;
                    }
                    return checkFilter(data[f.key], f.value);
                });
            });

            $(this.MasonryList.getItems()).removeClass(this.MasonryList.options.itemVisibleClass);
            $(this.MasonryList.getItems(passed)).addClass(this.MasonryList.options.itemVisibleClass);
            this.MasonryList.msnry.layout();

        }

    };

    $.fn.masonryList = function(param) {

        var args = arguments;

        return this.each(function() {

            if (typeof param === "string") {
                methods[param].apply(this, Array.prototype.slice.call(args, 1));
            } else if ( typeof param === "function" || typeof param === "object" || !param) {
                // Default to "init" argument is a callback function
                methods.init.apply(this, args);
            } else {
                $.error( 'Method ' +  param + ' does not exist on jQuery.masonryList' );
            }

        });
    };

});