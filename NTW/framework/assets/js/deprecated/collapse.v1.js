// Collapse Widget

function collapse() {
    if ($("[data-widget=collapse]").length > 0) {
        var collapses = $("[data-widget=collapse]");
        collapses.each(function() {
            mediaqueries($(this));
            var collapseInner = $(this).find('[data-widget-collapse=inner]');
            if (!$(this).hasClass('is-disabled')) {
                
                if (!$(this).data('widget-type')) {

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
                else{
                    return;
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
        toggleIcons = thisToggleText.siblings('i'),
        thisToggleIcon = $(toggleIcons[0]),
        triggercallback = thisCollapse.data('triggercallback');


    
    if (!thisCollapse.hasClass('is-disabled')) {

        if (thisCollapse.data('widget-type')) {
            var value = collapse.data('widget-type');

                var maxheight = thisCollapseInner.data('widget-previewheight');

                var height = thisCollapseInner.find('[data-widget-collapse=preview]').css("height");
                if (expanded == "false") {
                   thisCollapseInner.animate({maxHeight: height}, 300, function() {
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisToggleText.html(collapse.data('widget-hidetext'));
                        thisToggleIcon.removeClass(thisCollapse.data('widget-iconshow')).addClass(thisCollapse.data('widget-iconhide'));
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
                    thisToggleIcon.removeClass(thisCollapse.data('widget-iconhide')).addClass(thisCollapse.data('widget-iconshow'));
                    
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


function initCollapse(){

    if ($("[data-widget=collapse]").length > 0) {
        
        var collapseWidgets = $("[data-widget=collapse]");
        collapseWidgets.each(function() {
    
            addCollapse($(this));
                    
        });
    }
}

function addCollapse(thiscollapse) {
        thiscollapse.attr('aria-expanded', 'false');
        thiscollapse.addClass('is-collapsed');
            
            
        if (thiscollapse.data('widget-type')) {
            var value = thiscollapse.data('widget-type');
    
    
    
                //This is used for the fadeout collapse thingie
    
                if (value == "preview") {
                    
                    var previewbox = thiscollapse.children('[data-widget-collapse=inner]');
                    var thispreview = $(previewbox[0]);
                    thispreview.attr('data-widget-previewheight', thispreview.css('maxHeight'));
                    
                    var triggerHtmlFirst = '<span data-widget-control="collapse-trigger">';
                        triggerHtmlFirst += '<span class="tsBtn--collapse">';
                        triggerHtmlFirst += '<b data-widget-collapse="toggletext">' + thiscollapse.data('widget-showtext') + '</b>';
                
                    var triggerHtmlLast = '<i class="' + thiscollapse.data('widget-iconshow') + '"><b>' + thiscollapse.data('widget-icontext') + '</b></i>';
                        triggerHtmlLast += '</span>';
                        triggerHtmlLast += '</span>';
    
                } else if (value == "gradient") {
    
                    var previewbox = thiscollapse.children('[data-widget-collapse=inner]');
                    var thispreview = $(previewbox[0]);
                    thispreview.attr('data-widget-previewheight', thispreview.css('maxHeight'));
    
                    var triggerHtmlFirst = '<span data-widget-control="collapse-trigger">';
                        
                    var triggerHtmlLast = '</span>';
    
                }
    
                thiscollapse.append(triggerHtmlFirst + triggerHtmlLast);
    
            } else {            
                
                //This is used for the mainmenu
    
                thiscollapse.attr('role', 'menu');
                var triggers = thiscollapse.children("[data-widget-collapse=trigger]");
                var trigger = $(triggers[0]);
    
               
    
                var triggerHtmlFirst = '<span data-widget-control="collapse-trigger">';    
                    triggerHtmlFirst += '<b data-widget-collapse="toggletext">' + thiscollapse.data('widget-showtext') + '</b>';
                
                var triggerHtmlLast = '<i class=' + thiscollapse.data('widget-icon') + '><b>' + thiscollapse.data('widget-icontext') + '</b></i>';
                    triggerHtmlLast += '</span>';
    
                if (trigger.length > 0) {
                    trigger.html(triggerHtmlFirst + trigger.html() + triggerHtmlLast);
                } else {
                    thiscollapse.prepend(triggerHtmlFirst + triggerHtmlLast);
                } 
            }
}


$(document).ready(function() {
    initCollapse();

     $('body').on('click', '[data-widget-control=collapse-trigger]', function() {
        toggleCollapse($(this).closest('[data-widget=collapse]'));
    });
});
