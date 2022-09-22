/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.checkBookmarks = function(uuid) {

        var hasUuid = uuid;
        var defaults = {
            list1: '.tsShortCuts-links',
            attr1: 'href',
            list2: '.tsAccordion-list',
            attr2: 'data-url',
            icon: 'tsIcon-Add',
            icon2: 'tsIcon-Minus'
        };

        var options = $.extend({}, defaults);

        return this.each(function() {
            var _this = this;
            var list1 = $(options.list1 + " .tsShortCuts-deleteBookmark", _this);
            var list2 = $(options.list2 + " i." + options.icon, _this);
            var list2_deleteIcon = $(options.list2 + " i." + options.icon2, _this);

            // Iterate over all i-elements in list2
            $.each(list2, function() {
                var listItem2 = this;

                $.each(list1, function() {
                    var listItem1 = this;
                    if ($(listItem2).data("uuid") === $(listItem1).data("uuid")) {
                        $(listItem2).addClass('tsIcon-Minus').removeClass('tsIcon-Add');
                        $(listItem2).closest('li').addClass('addedBookmark');
                    }
                });
            });

            if (hasUuid) {
                $.grep(list2_deleteIcon, function(item) {
                    if ($(item).data("uuid") === uuid) {
                        $(item).addClass('tsIcon-Add').removeClass('tsIcon-Minus');
                        $(item).closest('li').removeClass('addedBookmark');
                    }
                });

            }


        });
        
    };


});