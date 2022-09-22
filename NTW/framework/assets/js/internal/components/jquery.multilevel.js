/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.multilevel = function(options) {

        var _defaults = {
            checked: "checked",
            semichecked: "semichecked",
            parents: "ul.tsAccordion-list, ul.tsAccordion-alt-list, ul.tsAccordion-nestled-alt-list",
            attr: "[data-multilevel=true]"
        };

        options = $.extend({}, _defaults, options);

        return this.each(function() {
            var _this = this;
            $(options.attr, _this).click(function(e) {
                var parentDiv = $(this).closest('div');
                console.log(parentDiv);
                parentDiv.toggleClass(options.checked);

                // First listitem seem to also have outside-of-list, it shouldn't, leave for when you implement the solution through a template
                console.log('outside of list:' + $(this).data('outside-of-list'));
                e.stopPropagation();

                var parent, grandParent, checked, semichecked, all, some;
                if ($(this).data('outside-of-list') === true) {
                    grandParent = $(this).closest('ul');
                    parent = grandParent.find('ul').first();
                    if (parentDiv.hasClass(options.checked)) {
                        $.each(parent.find(options.attr), function() {
                            $(this).prop('checked', true);
                        });
                    }
                    else {
                        $.each(parent.find(options.attr), function() {
                            $(this).prop('checked', false);
                        });
                    }
                }
                else {
                    $(this).nextAll('ul').find(options.attr).closest('div').toggleClass(options.checked).hasClass(options.checked);
                    parent = $(this).closest('ul');
                }

                function checkChildren(children, notFirst) {
                    checked = children.filter("." + options.checked);
                    semichecked = children.filter("." + options.semichecked);
                    if (notFirst) {
                        var grandChildrenLength = children.length - 1;
                        var semiCheckedLength = semichecked.length - 1;
                        all = checked.length === grandChildrenLength;
                        some = checked.length > 0 || semiCheckedLength;
                    }
                    else {
                        all = checked.length === children.length;
                        some = checked.length > 0 || semichecked.length > 0;
                    }
                }
                var grandChildren = $(_this).find($(options.attr));
                var children = $(parent).find($(options.attr));

                checkChildren(children);

                $(parent).prevAll(options.attr).closest('div').toggleClass(options.checked, all).toggleClass(options.semichecked, some && !all);


                // When the top element is outside of a typical ul>li hierarchy
                var outsideOfList = $('[data-outside-of-list="true"]', _this);
                if (outsideOfList && ($(this).data('outside-of-list') !== true)) {
                    var notFirst = true;
                    checkChildren(grandChildren, notFirst);
                    if (all) {
                        console.log("all");
                        outsideOfList.closest('div').removeClass(options.semichecked);
                        outsideOfList.closest('div').addClass(options.checked);
                        outsideOfList.prop('checked', true);
                    }
                    else if (some) {
                        console.log("some");
                        outsideOfList.closest('div').removeClass(options.checked);
                        outsideOfList.closest('div').addClass(options.semichecked);
                        outsideOfList.prop('checked', false);

                    }
                    else {
                        console.log("none");
                        outsideOfList.closest('div').removeClass(options.checked);
                        outsideOfList.closest('div').removeClass(options.semichecked);
                        outsideOfList.prop('checked', false);

                    }
                }


            });


        });


    };


});