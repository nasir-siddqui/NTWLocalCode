/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    
    /**
     * Function to be used for redrawing and initializing the select element. Supports
     *     variations of dropdowns. 
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
    jQuery.fn.initDropdown = function (customClasses) {
        var newDefaultClasses = {
            wrapper: "tseDropdown",
            selected: "tseDropdown-selected",
            label: "tseDropdown-label",
            arrow: "tseDropdown-arrow",
            list: "tseDropdown-list",
            listId: "tseList",
            listItem: "tseDropdown-listItem",
            listItemSelected: "tseDropdown-listItem--selected"
        };
        var classes = $.extend(newDefaultClasses, customClasses);

 
        this.each(function() {
            var events = $._data(this, 'events');
            var d = $(this).drawDropdown(classes);
            if (events && events.change) {
                var _this = this;
                $('li', d).click(function(e) {
                    $.each(events.change, function(a, b) {
                        $(_this).val($(e.target).data('value'));
                        b.handler.call(_this, e);
                    });
                })
            }
        });

        return $('.' + classes.wrapper + ':not(.tsInitiated)').dropdown(classes);        

        // Created as a element instead of module


    };

    /**
     * Function for redrawing the select element. Extended to support variations of dropdowns but still
     *     with the backwards compatibility. No support for custom classes for the colorwheel etc. but
     *     can easily be added by extending the classes object.
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
    jQuery.fn.drawDropdown = function (customClasses) {

        var oldDefaultClasses = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList"
        };

        var classes = $.extend(oldDefaultClasses, customClasses);

        // ..for every browser except ie7 or lower
        if (!$('html').is('.ie7', '.lt-ie7')) {
    
            var list_i = $('[data-id^="' + classes.listId + '"]').length;
            
            var draw = function() {
                var attr = '';
                if ($(this).attr('data-colorwheel') == "true") {
                    attr = '<span class="tsDropdown-colour"></span><i class="tsPict-colorwheel"></i>';
                }

                var container = $("<div />").addClass(classes.wrapper).attr("data-name", $(this).attr("name") || "");
                var selectedSpan = $("<span />").addClass(classes.selected).attr("data-value","");
                var labelSpan = $("<span />").addClass(classes.label);
                var arrowDiv = $("<div />").addClass(classes.arrow);
                selectedSpan.append(labelSpan).append(arrowDiv);
                var dropdown = $("<ul />").addClass(classes.list).attr("data-id", classes.listId + list_i);
                container.append(selectedSpan).append(dropdown);

                var placeholder = $(this).attr('data-placeholder');
                if (typeof placeholder !== "undefined"){
                    labelSpan.text(placeholder);
                }

                $.each($(this).data(), function(key, value){
                    // Added some exceptions, possibly rewrite the above instead.
                    if (key !== "placeholder" && key !== "class"){
                        container.attr("data-"+key, value);
                    }
                });
                $(this).before(container);
                
                selectedSpan.attr("data-value", "");
                labelSpan.text($(this).data("emptytext"));
                $(this).children('option').each(function() {
                    var li = $("<li />").addClass(classes.listItem).text($(this).text()).attr("data-value", $(this).val());
                    dropdown.append(li);
                    if ($(this).is(":selected") && typeof placeholder === "undefined"){
                        li.addClass(classes.listItemSelected);
                        selectedSpan.attr("data-value", $(this).val());
                        labelSpan.text($(this).text());
                    }
                    $.each($(this).data(), function(key, value){
                        li.attr("data-"+key, value);
                    });
                });
                
                list_i++;
                
                var ret = $(this).prev().get(0);

                $(this).remove();

                return ret;

            };

            return $.map(this, function(item) {
                return draw.call(item);
            });
        
        }
    }
    
    
    /**
     * Activates the dropdown object.
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
    jQuery.fn.dropdown = function (customClasses) {
    
        var defaultClasses = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList",
            listItemSelected: "selected"
        };

        var classes = $.extend(defaultClasses, customClasses);

        var defaults = {
            button: null,
            list: null,
            items: null,
            selected: null,
            arrow: null,
            visible: false
        };
            
        return this.each(function () {
            $(this).data("customClasses", customClasses);
            $(this).addClass('tsInitiated');
                
            var options = $.extend({}, defaults, options);
            $(this).data("options", options);
    
            options.button = $(this);
            options.list = $(this).find('.'+classes.list);
            options.selected = $(this).find('.'+classes.selected);
            options.items = $(this).find('.'+classes.list+' li');
            options.arrow = $(this).find('.'+classes.arrow);
    
             
            $(document).click(lift);
             
            // close dropdown on esc
            $(document).keydown(function (e) {
                if (e.keyCode == 27){
                    lift();
                }
            });


            options.selected.find('.tsDropdown-colour').hide(); 
              
            // set the color samples
            options.items.each(function(){
                if ($(this).attr('data-color') !== undefined ) {
                    if ($(this).attr('data-color') != 'wheel') {
                        if ($(this).attr('data-color') == 'white' || $(this).attr('data-color') == '#ffffff'|| $(this).attr('data-color') == '#fff') {
                            $(this).prepend('<span class="tsDropdown-colour" style="background: white; border: 1px solid #c7c2ba"></span>');    
                        } else {
                            $(this).prepend('<span class="tsDropdown-colour" style="background:'+$(this).attr('data-color')+' "></span>');
                        }
                    } else {
                       $(this).prepend('<i class="tsPict-colorwheel"></i>');
                    }

                    $(this).append('<i class="tsPict-'+$(this).attr('data-stock')+'"></i>');    
                }
            });
                         
    
            options.button.click(function (e) {
                if (!$(this).hasClass('tsDropdown-disabled') && typeof $(this).attr("disabled") === "undefined") { 
                    options.list.is(':visible') ? lift() : drop();
                    e.stopPropagation();
                }
            });
    

            options.items.click(function () {
                onItemClick.call(this, options);
            });


            $(this).on("init-item", function(e, item) {
                $(item).click(onItemClick);
            });
    
            var onItemClick = function() {
                if ($(this).hasClass('tsOverlay-opener')) {
                    // todo: open overlay
                } else if ($(this).attr('data-stock') != 'na')  { // should not be able to select n/a-items
                    options.selected.find('.' + classes.label).text($(this).text());

                    $(this).siblings().removeClass(classes.listItemSelected);
                    $(this).addClass(classes.listItemSelected);


                    options.selected.attr('data-value', $(this).attr('data-value'));
                    options.selected.find('.tsDropdown-colour').css('background',$(this).attr('data-color'));


                    if (options.selected.find('.tsPict-colorwheel').length > 0) {
                        options.selected.find('.tsPict-colorwheel').hide();
                        options.selected.find('.tsDropdown-colour').show(); 
                    }


                    // white background? set a grey border
                    if ($(this).attr('data-color') == 'white' || $(this).attr('data-color') == '#ffffff'){
                        options.selected.find('.tsDropdown-colour').css('border','1px solid #c7cdba');
                    } else {
                        options.selected.find('.tsDropdown-colour').css('border','0px');
                    }


                    if ($(this).parents('[data-behaviour="checkbox"]')) {
                        $(this).parents('[data-behaviour="checkbox"]').addClass('tsItem--selected');
                    }
                }
            }

            function drop() {
                $('.' + classes.wrapper).removeClass('open');
                $('.' + classes.list).hide();
                // if (options.button.parents('.tsProductAttribute').length > 0) {
                //     options.button.css('position', 'absolute');
                //     if(mediaqueriesMin('mqMedium') || $('body').hasClass('lt-ie9'))
                //             options.button.css('right', '12px');    
                // }
                options.button.addClass('open');
                options.list.show();
            }

            function lift() {
                options.list.hide();
                options.button.removeClass('open');
                // if (options.button.parents('.tsProductAttribute').length > 0) {
                //     options.button.css('position', 'relative');
                //     if(mediaqueriesMin('mqMedium') || $('body').hasClass('lt-ie9'))
                //          options.button.css('right', '0');  
                // }   
            }
        });
    };

    /**
     * Defines the val function on the dropdown
     *
     * @param {string} value - a string for setting the value
     * @return {string} If value parameter isn't set, the selected value
    */
    jQuery.fn.dropdownVal = function(value) {
        if (typeof $(this).data("customClasses") === "undefined"){
            return;
        }
        var selectedClass = "." + $(this).data("customClasses")["selected"];
        
        if (typeof value === "undefined"){
            var value = $(selectedClass, this).attr("data-value");
            return value;
        }

        var selectUl = $("ul", this);
        var toSelectLi = $("[data-value='" + value + "']" , selectUl);
        if (toSelectLi.length){
            if (!selectUl.is(":visible")){
                $(this).trigger("click");
            }
            toSelectLi.trigger("click");
        }
    };

    /**
     * Remove item in dropdown function
     *
     * @param {string} value - a string for the value to be removed
    */
    jQuery.fn.dropdownRemove = function(value){
        if (typeof $(this).data("customClasses") === "undefined"){
            return;
        }
        var selectedClass = "." + $(this).data("customClasses")["selected"];
        var labelClass = "." + $(this).data("customClasses")["label"];

        var selectUl = $("ul", this);
        $("[data-value='" + value + "']" , selectUl).remove();
        
        var selectedValue = $(selectedClass, this).attr("data-value");
        if (selectedValue === value){
            var selectedSpan = $(selectedClass, this);
            selectedSpan.attr("data-value", "");
            $(labelClass, selectedSpan).text($(this).data("emptytext") || "No item selected");
        }
    };


    /**
     * Get text value of the dropdown
     *
     * @return {string} The text of the selected value
    */
    jQuery.fn.dropdownText = function(){
        if (typeof $(this).data("customClasses") === "undefined"){
            return;
        }
        var selectedClass = "." + $(this).data("customClasses")["selected"];
        
        if (typeof value === "undefined"){
            var value = $(selectedClass, this).text();
            return value;
        }
    };

    /**
     * Add a value to the list
    */
    jQuery.fn.dropdownAddValue = function(key, value){
        var li = $("<li />").addClass($(this).data("customClasses")["listItem"]).text(value).attr("data-value", key);
        var list = $("." + $(this).data("customClasses")["list"], this).append(li);
        $(this).trigger("init-item", li);
        return this;
    };
    
    
    /**
     * Select item via key-value
    */
    jQuery.fn.dropdownSelect = function(key){
        
        var thisItem     = $('[data-value="'+key+'"]');
        var selected     = thisItem.parents('.tsDropdown').find('.tsDropdown-selected');

        selected.find('.tsDropdown-label').text(thisItem.text());
        selected.attr('data-value', key);
        thisItem.siblings().removeClass('selected');
        thisItem.addClass('selected');

        return this;
    };

     
    // For backward compatibility
    $('.tsSelectDropdown').drawDropdown();  
    $('.tsDropdown:not(.tsInitiated)').dropdown();
    

     
 });