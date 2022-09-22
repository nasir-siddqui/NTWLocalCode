// Collapse Widget

function collapse() {
    if (jQuery_1_9_1("[data-widget=collapse]").length > 0) {
        var collapses = jQuery_1_9_1("[data-widget=collapse]");
        collapses.each(function() {
            mediaqueries(jQuery_1_9_1(this));
            var collapseInner = jQuery_1_9_1(this).find('[data-widget-collapse=inner]');
            if (!jQuery_1_9_1(this).hasClass('is-disabled')) {
                
            
                if (!jQuery_1_9_1(this).data('widget-type')) {
/*                    
                // Reset preview areas on resize too?
                    var value = jQuery_1_9_1(this).data('widget-type');
                    if (value == "preview") {
                        
                    } else if (value == "ellipsis") {

                    }
                } else {
*/

                    // Reset only if the widget wasn't expanded
                    if (!jQuery_1_9_1(this).hasClass('is-expanded')) {
                        collapseInner.slideUp(0, function() {
                            jQuery_1_9_1(this).addClass('visuallyhidden').slideDown(0);
                            var elements = jQuery_1_9_1(this).find('.is-expanded');
                            elements.each(function(){
                                jQuery_1_9_1(this).removeClass('is-expanded');
                                jQuery_1_9_1(this).addClass('is-collapsed');
                            });
                        });                    
                    }
                }
                
            } else {
                    collapseInner.each(function(){
                        if (jQuery_1_9_1(this).hasClass('visuallyhidden'))  {
                            jQuery_1_9_1(this).css('display','');
                            jQuery_1_9_1(this).removeClass('visuallyhidden');//.slideDown(0);
                    }
                });
            }
        });
    }
}

function closeNavPrimary(element, elements) {
    var selectedElements = elements.split(',');
    jQuery_1_9_1.each(selectedElements, function(i) {
        if(jQuery_1_9_1(selectedElements[i]).hasClass('is-expanded'))
        {
            var href = jQuery_1_9_1(selectedElements[i]).attr("href");
                subLevel = jQuery_1_9_1(href),
                topLevel = jQuery_1_9_1("#tsNavPrimary-TopLevel");
            jQuery_1_9_1(selectedElements[i]).removeClass('is-expanded');
            NavPrimary.SlideUpSubLevel(topLevel,subLevel);
        }
    });
}

function closeHeaderSearch(element, elements) {
    // nothing yet.
}

function togglecollapse(collapse, method) {

    var dataFunction = collapse.data('trigger-function');
    if(dataFunction!=undefined) {
        window[dataFunction](collapse,collapse.data('trigger-function-values'));
    }

    var expanded = collapse.attr('aria-expanded'),
        thisCollapse = jQuery_1_9_1(collapse[0]),
        collapseInner = collapse.children('[data-widget-collapse=inner]'),
        thisCollapseInner = jQuery_1_9_1(collapseInner[0]),
//        toggletext = collapse.children('[data-widget-control=collapse-trigger]').find('[data-widget-collapse=toggletext]'),
        toggletext = collapse.children('[data-widget-control=collapse-trigger]').find('[data-widget-collapse=toggletext]'),
        thisToggleText = jQuery_1_9_1(toggletext[0]),
        toggleIcons = thisToggleText.siblings('i'),
        thisToggleIcon = jQuery_1_9_1(toggleIcons[0]),
        triggercallback = window[thisCollapse.data('triggercallback')];
        triggercallback =thisCollapse.data('triggercallback');

    // dev
/*    if (jQuery_1_9_1('.testbox').length > 0) {
        jQuery_1_9_1('.testbox').html(collapse.attr('test') + ", text: " + toggletext.html() + ", level: " + thisCollapseInner.attr('test'));
    };
*/
    if (!thisCollapse.hasClass('is-disabled')) {

        if (thisCollapse.data('widget-type')) {
            var value = collapse.data('widget-type');

            //if (value == "preview") {
                var maxheight = thisCollapseInner.data('widget-previewheight');

                var height = thisCollapseInner.find('[data-widget-collapse=preview]').css("height");
                if (expanded == "false") {
                   thisCollapseInner.animate({maxHeight: height}, 300, function() {
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisCollapse.attr('aria-expanded', 'true');
                        thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
                        thisToggleText.html(collapse.data('widget-hidetext'));
//                        thisToggleIcon.removeClass('tsIcon-ShowMore').addClass('tsIcon-ShowLess');
                        thisToggleIcon.removeClass(thisCollapse.data('widget-iconshow')).addClass(thisCollapse.data('widget-iconhide'));
                        thisCollapseInner.css('maxHeight', 'none');
                   });
                } else {
                    thisCollapseInner.css('maxHeight', thisCollapseInner.css('height'));
                    thisCollapseInner.animate({maxHeight: maxheight}, 300);
                    thisCollapse.attr('aria-expanded', 'false');
                    thisCollapse.removeClass('is-expanded').addClass('is-collapsed');
                    thisToggleText.html(collapse.data('widget-showtext'));                                            
                    thisToggleIcon.removeClass(thisCollapse.data('widget-iconhide')).addClass(thisCollapse.data('widget-iconshow'));
                }
                
//            } else if (value == "ellipsis") {
                // only if a separate text ellipsis solution can be found. TBD?
//                
            //}

        } else {
        
            if (expanded == "false") {

                thisCollapseInner.slideUp(0, function() {
                    collapse.attr('aria-expanded', 'true');
                    thisCollapseInner.attr('aria-hidden', 'false');
                    collapse.removeClass('is-collapsed').addClass('is-expanded');
                    toggletext.html(collapse.data('widget-hidetext'));
                    jQuery_1_9_1(this).removeClass('visuallyhidden').slideDown(300, function(){
                        if(triggercallback != undefined)
                        {
                          var classfunction = triggercallback.split('.');
                          if (classfunction.length>1) {
                            window[classfunction[0]][classfunction[1]]();
                          }
                          else
                          {
                            window[classfunction[0]]();
                          }
                        }
                    });                   
                });

            } else {

                thisCollapseInner.slideUp(300, function() {
                    collapse.attr('aria-expanded', 'false');
                    thisCollapseInner.attr('aria-hidden', 'true');
                    collapse.removeClass('is-expanded').addClass('is-collapsed');
                    toggletext.html(collapse.data('widget-showtext'));
                    jQuery_1_9_1(this).addClass('visuallyhidden').slideDown(0);
                });

            }
        }
      
    }

}
function addCollapse(thiscollapse) {
      thiscollapse.attr('aria-expanded', 'false');
            thiscollapse.addClass('is-collapsed');

            thiscollapse.children('[data-widget-collapse=inner]').attr('aria-hidden', 'true');
            
            
            if (thiscollapse.data('widget-type')) {
                var value = thiscollapse.data('widget-type');
    
    
    
                //This is used for the fadeout collapse thingie
    
                if (value == "preview") {
                    var previewbox =thiscollapse.children('[data-widget-collapse=inner]'),
                        thispreview = jQuery_1_9_1(previewbox[0]),
                        maxHeight = thispreview.css('maxHeight');

                    var height = previewbox.height(),
                        thisMaxHeight = maxHeight.replace('px','');

                    if(height < thisMaxHeight)
                        return;

                    var showtext = thiscollapse.data('widget-showtext'),
                        iconshow = thiscollapse.data('widget-iconshow'),
                        icontext = thiscollapse.data('widget-icontext');
                        
                    thispreview.attr('data-widget-previewheight', maxHeight);
    
                    var triggerHtmlFirst = '<span data-widget-control="collapse-trigger">';

                        triggerHtmlFirst += '<span class="tsBtn--collapse">';
                        if(showtext!=undefined)
                            triggerHtmlFirst += '<b data-widget-collapse="toggletext">' +showtext+ '</b>';
                
                        var triggerHtmlLast = '';
                        if(iconshow!=undefined)
                            triggerHtmlLast += '<i class="' +iconshow + '"><b>' + icontext + '</b></i>';
                        
                        triggerHtmlLast += '</span>';
                        triggerHtmlLast += '</span>';
    
                } else if (value == "gradient") {
    
                    var previewbox = thiscollapse.children('[data-widget-collapse=inner]');
                    var thispreview = jQuery_1_9_1(previewbox[0]);
                    thispreview.attr('data-widget-previewheight', thispreview.css('maxHeight'));
                    var triggerHtmlFirst = '<span data-widget-control="collapse-trigger">';                        
                    var triggerHtmlLast = '</span>';
                    // NEEDS CHANGES HERE!!    
                }
               
    
                thiscollapse.append(triggerHtmlFirst + triggerHtmlLast);
    
            } else {            
                
                //This is used for the mainmenu
    
                thiscollapse.attr('role', 'menu');
                var triggers = thiscollapse.children('[data-widget-control=collapse-trigger], [data-widget-collapse=trigger]'),
                    trigger = jQuery_1_9_1(triggers[0]),    
                    showtext = thiscollapse.data('widget-showtext'),
                    iconshow = thiscollapse.data('widget-icon'),
                    icontext = thiscollapse.data('widget-icontext'),
                    triggerHtmlFirst = showtext != undefined ? '<b data-widget-collapse="toggletext">' + showtext  + '</b>' : "",
                    triggerHtmlLast = iconshow != undefined ? '<i class=' +  iconshow + '><b>' + icontext + '</b></i>' : "";
    
                if (trigger.length > 0) {
                    trigger.html(triggerHtmlFirst + trigger.html() + triggerHtmlLast);
                } else {
                    thiscollapse.prepend('<a data-widget-collapse="trigger">' + triggerHtmlFirst + triggerHtmlLast + '</a>');
                }
            }        
}

function initCollapse() {

    if (jQuery_1_9_1("[data-widget=collapse]").length > 0) {
        
        var collapseWidgets = jQuery_1_9_1("[data-widget=collapse]");
    
        collapseWidgets.each(function() {
            
            addCollapse(jQuery_1_9_1(this));
          
        });
    }
}


