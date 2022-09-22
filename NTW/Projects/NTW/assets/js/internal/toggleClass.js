$(document).ready(function() {
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

    });
});