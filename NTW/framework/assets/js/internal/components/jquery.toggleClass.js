/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $('[data-toggle-class]').click(function(e) {
        var curTarget = $(e.currentTarget);
        var toggleThisClass = $(this).attr("data-toggle-class");

        // Don't toggle accordian if box is unchecked
        if (curTarget.parent().hasClass("tsAccordian-list-item")) {

            if ((curTarget.hasClass(toggleThisClass)) && !curTarget.parent().hasClass("toggled")) {
                e.stopPropagation();
            }
            else if ((!curTarget.hasClass(toggleThisClass)) && curTarget.parent().hasClass("toggled")) {
                e.stopPropagation();
            }

        }

        $(this).toggleClass(toggleThisClass);
        $("input[type=hidden]", this).val($(this).hasClass(toggleThisClass));

    });

    // Toggle classes on another element than the clicked on
    $('[data-toggle-class-target]').click(function() {
        var toggleClassTarget = $(this).attr("data-toggle-class-target");
        var toggleAttr = toggleClassTarget.replace('[', '').replace(']', '');
        
        $.each($(toggleClassTarget), function() {
            $(this).toggleClass($(this).attr(toggleAttr));
        });
    });

});