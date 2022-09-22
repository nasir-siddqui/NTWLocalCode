// Collapse Widget

function initCollapse() {

    if ($("[data-widget=collapse]").length > 0) {
        
        var collapseWidgets = $("[data-widget=collapse]");

        collapseWidgets.each(function() {

            if ($(this).data('widget-type')) {
                var value = $(this).data('widget-type');
                if (value == "preview") {
                    $(this).attr('aria-expanded', 'false');
                    $(this).addClass('is-collapsed');

                    var previewbox = $(this).children('[data-widget-collapse=inner]');
                    var thispreview = $(previewbox[0]);
                    thispreview.attr('data-widget-previewheight', thispreview.css('maxHeight'));

                    var triggerHtmlFirst  = '<span data-widget-control="collapse-trigger">';
                    triggerHtmlFirst     += '<b data-widget-collapse="toggletext">' + $(this).data('widget-showtext') + '</b>';
                    var triggerHtmlLast  = '<i class=' + $(this).data('widget-icon') + '><b>';
                    triggerHtmlLast      += $(this).data('widget-icontext') + '</b></i></span>';

                    $(this).append(triggerHtmlFirst + triggerHtmlLast);

//                } else if (value == "ellipsis") {
                    
                } else { 
                  return; 
                }
            } else {            
                $(this).attr('aria-expanded', 'false');
                $(this).addClass('is-collapsed');
                $(this).attr('role', 'menu');
                var triggers = $(this).find("[data-widget-collapse=trigger]");
                var trigger = $(triggers[0]);

                var triggerHtmlFirst  = '<span data-widget-control="collapse-trigger">';
                triggerHtmlFirst     += '<b data-widget-collapse="toggletext">' + $(this).data('widget-showtext') + '</b>';
                var triggerHtmlLast  = '<i class=' + $(this).data('widget-icon') + '><b>';
                triggerHtmlLast      += $(this).data('widget-icontext') + '</b></i></span>';

                if (trigger.length > 0) {
                    trigger.html(triggerHtmlFirst + trigger.html() + triggerHtmlLast);
                } else {
                    $(this).prepend(triggerHtmlFirst + triggerHtmlLast);
                }    


            }
        });
    }
}

function collapse() {
    if ($("[data-widget=collapse]").length > 0) {
        var collapses = $("[data-widget=collapse]");
        collapses.each(function() {
            mediaqueries($(this));
            var collapseInner = $(this).find('[data-widget-collapse=inner]');
            if (!$(this).hasClass('is-disabled')) {
            
                if (!$(this).data('widget-type')) {
/*                    
                // Reset preview areas on resize too?
                    var value = $(this).data('widget-type');
                    if (value == "preview") {
                        
                    } else if (value == "ellipsis") {

                    }
                } else {
*/

                    // Reset only if the widget wasn't expanded
                    if (!$(this).hasClass('is-expanded')) {
                        collapseInner.slideUp(0, function() {
                            $(this).addClass('visuallyhidden').slideDown(0);
                            var elements = $(this).find('.is-expanded');
                            elements.each(function(){
                                $(this).removeClass('is-expanded');
                                $(this).addClass('is-collapsed');
                            });
                        });                    
                    }
                }
                
            } else { 
                collapseInner.removeClass('visuallyhidden').slideDown(0);              
            }
        });
    }
}

function toggleCollapse(collapse, method) {
    var expanded = collapse.attr('aria-expanded'),
        thisCollapse = $(collapse[0]),
        collapseInner = collapse.children('[data-widget-collapse=inner]'),
        thisCollapseInner = $(collapseInner[0]),
        toggletext = collapse.children('[data-widget-control=collapse-trigger]').find('[data-widget-collapse=toggletext]'),
        thisToggleText = $(toggletext[0]),
        triggercallback = window[thisCollapse.data('triggercallback')];

    // dev
/*    if ($('.testbox').length > 0) {
        $('.testbox').html(collapse.attr('test') + ", text: " + toggletext.html() + ", level: " + thisCollapseInner.attr('test'));
    };
*/
    
    if (!thisCollapse.hasClass('is-disabled')) {

        if (thisCollapse.data('widget-type')) {
            var value = collapse.data('widget-type');

            if (value == "preview") {
                var maxheight = thisCollapseInner.data('widget-previewheight');

                var height = thisCollapseInner.find('[data-widget-collapse=preview]').css("height");
                if (expanded == "false") {
                   thisCollapseInner.animate({maxHeight: height}, 300, function() {
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisToggleText.html(collapse.data('widget-hidetext'));
                        thisCollapseInner.css('maxHeight', 'none');
                        if(triggercallback != undefined)
                        {
                            collapsecallback(triggercallback);
                        }
                   });
                } else {
                    thisCollapseInner.css('maxHeight', thisCollapseInner.css('height'));
                    thisCollapseInner.animate({maxHeight: maxheight}, 300, function(){
                        if(triggercallback != undefined)
                        {
                            collapsecallback(triggercallback);
                        }
                    });
                    thisCollapse.attr('aria-expanded', 'false');
                    thisCollapse.removeClass('is-expanded').addClass('is-collapsed');
                    thisToggleText.html(collapse.data('widget-showtext'));                                            
                }
                
//            } else if (value == "ellipsis") {
                // only if a separate text ellipsis solution can be found
//                
            }
        } else {
        
            if (expanded == "false") {
                thisCollapseInner.slideUp(0, function() {
                    collapse.attr('aria-expanded', 'true');
                    collapse.removeClass('is-collapsed').addClass('is-expanded');
                    toggletext.html(collapse.data('widget-hidetext'));
                    $(this).removeClass('visuallyhidden').slideDown(300, function(){
                        if(triggercallback != undefined)
                        {
                            collapsecallback(triggercallback);
                        }
                    });
                   
                });
            } else {
                thisCollapseInner.slideUp(300, function() {
                    collapse.attr('aria-expanded', 'false');
                    collapse.removeClass('is-expanded').addClass('is-collapsed');
                    toggletext.html(collapse.data('widget-showtext'));
                    $(this).addClass('visuallyhidden').slideDown(0, function(){
                        if(triggercallback != undefined)
                        {
                            collapsecallback(triggercallback);
                        }
                    });
                });
            }
        }
      
    }

}
function collapsecallback(functionname)
{
    var callbackname = functionname.split('.');
    if (callbackname.length>1) {
         window[callbackname[0]][callbackname[1]]();
    }
    else{
         window[callbackname[0]]();
    }
}

$(document).ready(function() {
    initCollapse();
    $('body').on('click', '[data-widget-control=collapse-trigger]', function() {
            toggleCollapse($(this).parents('[data-widget=collapse]'));
    });
});

