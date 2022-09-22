/*global define, hash*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', "libs/hash/hash"], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.filterSort = function(options) {

        var container = $(this);

        var filters = [];

        var filter = function(index, type, name, value) {

            if (!filters[index]) {
                filters[index] = [];
            }
            var f = filters[index];

            if ((type === "single" && value !== null) || ((type === "multiple" || type === "limited") && $.isArray(value) && value.length > 0)) {
                var find = $.grep(f, function(item) { return item.key === name; });
                var o;
                if (find.length) {
                    o = find[0];
                    o.value = value;
                } else {
                    o = { key: name, value: value, and: type === "limited" };
                    f.push(o);
                }
            } else {
                filters[index] = $.grep(f, function(item) { return item.key !== name; });
            }

            if (typeof options.filter === "function") {
                options.filter(index, filters[index]);
            }

            var v = $.map(filters[index], function(item) { return item.key + "_" + ($.isArray(item.value) ? item.value.join("~") : item.value); }).join("_");
            if (v !== "") {
                hash.add({ "filter": v });
            } else {
                hash.remove("filter");
            }

        };

        var sort = function(index, name, order) {
            
            var o = typeof order !== "undefined" ? order : "asc";
            if (typeof options.sort === "function") {
                options.sort(index, name, o);
            }

            hash.add({ "sort": name + (typeof order !== "undefined" ? "_" + order : "") });

        };

        var filterElements = function(name, values){
            if (values.length === 0){
                container.find("[data-filter]").show();
                return;
            }

            container.find("[data-filter]").each(function(){
                var itemValues = $(this).data("filter")[name];
                if (typeof itemValues === "string"){
                    itemValues = [itemValues];
                }
                if ($(itemValues).filter(values).length > 0){
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

        };

        var methods = {




        };

        return this.each(function(i) {

            $("[data-widget='selectList-inline']", this).each(function(){
                var selectList = $(this);
                var filterName = $(this).data("filter-name");

                $(this).find("[data-value]").each(function(){
                    $(this).click(function() {
                        $(this).toggleClass("active");

                        var values = selectList.find(".active[data-value]").map(function() {
                            return $(this).data("value");
                        }).get();

                        var filter = [{ key: filterName, value: values, and: true }];

                        if (typeof options !== "undefined" && typeof options.filter === "function"){
                            options.filter(0, filter);
                        } else {
                            filterElements(filterName, values);
                        }

                        var v = $.map(filter, function(item) { return item.key + "_" + ($.isArray(item.value) ? item.value.join("~") : item.value); }).join("_");
                        if (typeof values !== "undefined" && values.length > 0) {
                            hash.add({ "filter": v });
                        } else {
                            hash.remove("filter");
                        }
                    });
                });

                $(".tsFluidGrid").on('click', 'a[data-single-filter]',function() {
                    if (typeof options !== "undefined" && typeof options.filter === "function"){
                        var filter = $(this).data("single-filter");
                        $.each(filter, function(_i, _item) {
                            selectList.find(".active[data-value]").removeClass("active");
                            selectList.find("[data-value='"+_item[0]+"']").addClass("active");
                            filter = [{ key: _i, value: _item, and: true }]
                            var v = $.map(filter, function(item) { return item.key + "_" + ($.isArray(item.value) ? item.value.join("~") : item.value); }).join("_");
                            hash.add({ "filter": v });
                            options.filter(0, filter);
                            return false;
                        });
                    }

                    return false;
                });
            });

            $("a.tsListFilter-sorting-trigger, .tsListFilter [data-widget='selectList-wrap'] a", this).click(function(e) {
                
                e.preventDefault();
                var $this = $(this);

                // when click a button set the class to active
                $(this).addClass('active').next('ul').each(function() {

                    // show the list and adjust the position
                    $(this).show();
                    if ($(this).is(':visible')) {
                        $(this).css('margin-left', -$(this).width()/2);
                    }

                    // add click event handler to the labels in the list
                    $("label", this).unbind('click').bind('click', function() {
                        var data = $(this).data('value');
                        var $label = $(this);

                        // hide the list when clicking an item in the list
                        var $ul = $(this).closest('ul').hide();
                        
                        // process the button linked to the list
                        $this.each(function() {

                            // check if it is a button
                            if ($(this).hasClass('tsBtnMulti--filter')) {
                                
                                var filtername = $this.closest("[data-widget='selectList-wrap']").data('filter-name');
                                var filtertype = $this.closest("[data-widget='selectList-wrap']").data('filter-type');

                                // check if it is a multifilter (multiple or limited)
                                if (filtertype === "multiple" || filtertype === "limited") {
                                    
                                    // hide the clicked label
                                    $label.addClass('tsHidden');

                                    var select = $(this).removeClass('active').closest("[data-widget='selectList-wrap']").before(
                                        // create a new button
                                        $("<a />", { "class": "tsBtn--filter-remove" }).append(
                                            $label.text(),
                                            " ",
                                            $("<i />", { "class": "tsIcon-Close" })
                                        ).click(function(e) {
                                            e.preventDefault();
                                            $(this).add($(this).next('span.tsFilter-prefix')).remove();
                                            $label.removeClass('tsHidden');
                                            //$ul.show();
                                            select.add(select.prev('span.tsFilter-prefix')).show();
                                            filter(i, filtertype, filtername, $.map($("label.tsHidden", $ul), function(item) { return $(item).data('value'); }));
                                       }),
                                        // separator
                                        " ",
                                        $("<span />", { "class": "tsFilter-prefix" }).text(filtertype === "multiple" ? "eller" : "och")
                                    );

                                    // do we need a separator?
                                    var separator = $("label:not(.tsHidden)", $ul).length > 0;

                                    // a click event handler to it 
                                    select.add(select.prev('span.tsFilter-prefix')).toggle(separator);

                                } else {
                                    

                                    $(this).toggleClass('active', typeof data !== "undefined").text($label.text());

                                    /*
                                     * SKIP THIS
                
                                    // if the label has data, change the content to the new data 
                                    if (typeof data !== "undefined") {
                                        // add the close button
                                        $(this).addClass('tsBtn--filter-remove active').empty().append(
                                            $label.text(),
                                            " ",
                                            $("<i />", { "class": "tsIcon-Close" })
                                        );
                                    }

                                    // it is the default value
                                    else {
                                        // change the content to just the default text
                                        $(this).removeClass('tsBtn--filter-remove active').html($label.text());
                                    }
                                     */

                                }

                                filter(i, filtertype, filtername, filtertype === "single" ? (typeof data !== "undefined" ? data : null) : $.map($("label.tsHidden", $ul), function(item) { return $(item).data('value'); }));

                            }
                            // it is the sort headline
                            else {
                                // remove the active class
                                $this.removeClass('active');

                                // just change the text
                                $("span", this).html($label.text());
                                sort.apply(window, [i].concat(data.split('|')));
                            }

                        });
                    });

                });
                
                var _onmousedown = function(e) {
                    $(this).unbind('mousedown', _onmousedown);
                    if (e.target === $this.get(0) || $(e.target).closest($this).length) {
                        // click on the button
                        // cancel the event
                        e.stopImmediatePropagation();
                    } else if ($(e.target).closest('ul').prev('a').get(0) !== $this.get(0)) {
                        // didn't click in the dropdown
                        $this.removeClass('active').next('ul').hide();
                    }
                };

                $(document).bind('mousedown', _onmousedown);

            });


            var data, key, value;

            // set initial filters
            var _filterStr = hash.get("filter");
            if (typeof _filterStr !== "undefined") {
                data = _filterStr.split("_");
                $.each(data, function(_i, _item) {
                    if (_i % 2 === 0) {
                        key = _item;
                    } else {
                        value = _item.split("~");

                        $.each(value, function(_i, _item) {
                            $(".tsListFilter [data-widget='selectList-wrap'][data-filter-name='" + key + "'] a").click().next("ul").find("label[data-value='" + _item + "']").click();
                            $(".tsListFilter [data-widget='selectList-inline'][data-filter-name='" + key + "'] a[data-value='" + _item + "']").click();
                        });

                    }
                });
                
            }

            // set initial sort
            var _sortStr = hash.get("sort");
            if (typeof _sortStr !== "undefined") {
                data = _sortStr.replace("_", "|");
                $("a.tsListFilter-sorting-trigger").click().next("ul").find("label[data-value='" + data + "']").click();
            } else {
                // if exist, set default sort
                if ($("a.tsListFilter-sorting-trigger").next("ul").find("label[data-sorting-default='true']").length > 0) {
                    $("a.tsListFilter-sorting-trigger").click().next("ul").find("label[data-sorting-default='true']").click();
                }
            }


            // listen to clicks on links with filter hash
            // and force a reload of the the page
            $("a[href*='#filter=']").click(function(e) {
                e.preventDefault();
                window.location.href = $(this).attr('href');
                window.location.reload();
            });

        });
        
    };

});

