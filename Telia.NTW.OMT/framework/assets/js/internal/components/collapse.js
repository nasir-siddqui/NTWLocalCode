// Collapse Widget
 /* global mediaqueries:true */

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
            } else {
                    collapseInner.each(function(){
                        if ($(this).hasClass('visuallyhidden'))  {
                            $(this).css('display','');
                            $(this).removeClass('visuallyhidden');
                    }
                });
            }
        });
    }
}

function closeNavPrimary(element, elements) {
    var selectedElements = elements.split(',');
    $.each(selectedElements, function(i) {
        if($(selectedElements[i]).hasClass('is-expanded'))
        {
            var href = $(selectedElements[i]).attr("href");
                subLevel = $(href),
                topLevel = $("#tsNavPrimary-TopLevel");
            $(selectedElements[i]).removeClass('is-expanded');
            NavPrimary.SlideUpSubLevel(topLevel,subLevel);
        }
    });
}

function togglecollapse(collapse, innerId) {
  var dataFunction = collapse.data('trigger-function');
  if(typeof dataFunction !== 'undefined') {
    window[dataFunction](collapse,collapse.data('trigger-function-values'));
  }

  var expanded = collapse.attr('aria-expanded'),
      thisCollapse = $(collapse[0]),
      toggletext = collapse.find('[data-widget-control=collapse-trigger]').find('[data-widget-collapse=toggletext]'),
      thisToggleText = $(toggletext[0]),
      toggleIcons = thisToggleText.siblings('i'),
      thisToggleIcon = $(toggleIcons[0]),
      triggercallback =thisCollapse.data('triggercallback');

  var collapseInner = collapse.find('[data-widget-collapse=inner]');
      thisCollapseInner = $(collapseInner[0]);
  if(typeof innerId !== 'undefined') {
    siblingCollapse = collapseInner.each(function() {
      if(!$(this).hasClass('visuallyhidden') && $(this).attr('id') !== '#'+innerId) {
        closeCollapse($(this), collapse, toggletext, $(this).attr('id').replace('#',''));
      }
    });
    thisCollapseInner = collapse.find('#' + innerId);
    expanded = !thisCollapseInner.hasClass('visuallyhidden');
  }
  if (!thisCollapse.hasClass('is-disabled')) {
    if (thisCollapse.data('widget-type')) {           
      previewactions(thisCollapseInner, thisCollapse, collapse, thisToggleText, thisToggleIcon,toggletext, expanded, triggercallback);
    } else {
      collapseActions(thisCollapseInner, collapse, toggletext, expanded, innerId);
    } 
  }
}

var closeCollapse = function (thisCollapseInner, collapse, toggletext, innerId) {
  if(typeof innerId !== 'undefined') {
    collapse.find('[rel='+innerId+']').removeClass('is-active');
  }

  thisCollapseInner.slideUp(300, function() {
    collapse.attr('aria-expanded', 'false');
    thisCollapseInner.attr('aria-hidden', 'true');
    collapse.removeClass('is-expanded').addClass('is-collapsed');
    toggletext.html(collapse.data('widget-showtext'));
    $(this).addClass('visuallyhidden').slideDown(0, function(){
        
    });
  });
};

var openCollapse = function (thisCollapseInner, collapse, toggletext, innerId) {
  if(typeof innerId !== 'undefined') {
    collapse.find('[rel='+innerId+']').addClass('is-active');
  }

  thisCollapseInner.slideUp(0, function() {
    collapse.attr('aria-expanded', 'true');
    thisCollapseInner.attr('aria-hidden', 'false');
    collapse.removeClass('is-collapsed').addClass('is-expanded');
    toggletext.html(collapse.data('widget-hidetext'));
    $(this).removeClass('visuallyhidden').slideDown(300, function(){
    });                   
  });
};

var collapseActions = function (thisCollapseInner, collapse, toggletext, expanded, innerId) {
  if (String(expanded) === "false") {
    openCollapse(thisCollapseInner, collapse, toggletext, innerId);
  } else {
    closeCollapse(thisCollapseInner, collapse, toggletext, innerId);
  }
};

var previewactions = function (thisCollapseInner, thisCollapse, collapse, thisToggleText, thisToggleIcon, toggletext, expanded, triggercallback) {
  var value = collapse.data('widget-type');
  var maxheight = thisCollapseInner.data('widget-previewheight');

  var height = thisCollapseInner.find('[data-widget-collapse=preview]').css("height");
  if (expanded === "false") {
    thisCollapseInner.animate({maxHeight: height}, 300, function() {
      thisCollapseInner.css('maxHeight', 'none');
      thisCollapse.attr('aria-expanded', 'true');
      thisCollapse.removeClass('is-collapsed').addClass('is-expanded');
      thisToggleText.html(collapse.data('widget-hidetext'));
      thisToggleIcon.removeClass(thisCollapse.data('widget-iconshow')).addClass(thisCollapse.data('widget-iconhide'));
      if(typeof triggercallback !== 'undefined') {
        var classfunction = triggercallback.split('.');
        if (classfunction.length>1) {
          window[classfunction[0]][classfunction[1]](thisCollapse);
        } else {
          window[classfunction[0]](thisCollapse);
        }
      }
    });
  } else {
    thisCollapseInner.css('maxHeight', thisCollapseInner.css('height'));
    thisCollapseInner.animate({maxHeight: maxheight}, 300, function(){ 
      $('html, body').animate({scrollTop:(toggletext.offset().top + -100)}, 0);
    });
    thisCollapse.attr('aria-expanded', 'false');
    thisCollapse.removeClass('is-expanded').addClass('is-collapsed');
    thisToggleText.html(collapse.data('widget-showtext'));                                            
    thisToggleIcon.removeClass(thisCollapse.data('widget-iconhide')).addClass(thisCollapse.data('widget-iconshow'));
    if(typeof triggercallback !== 'undefined') {
      var classfunction = triggercallback.split('.');
      if (classfunction.length>1) {
        window[classfunction[0]][classfunction[1]](thisCollapse);
      } else {
        window[classfunction[0]](thisCollapse);
      }
    }
  }
};
  

function gradient (endColor, startColor) {
  var result =  "background-color: "+startColor +";";
  result += "background-image: -webkit-gradient(linear, left top, left bottom, from("+startColor+"), to("+endColor+"));";
  result += "background-image: -webkit-linear-gradient(top, "+startColor+", "+endColor+");";
  result += "background-image: -moz-linear-gradient(top, "+startColor+", "+endColor+");";
  result += "background-image: -o-linear-gradient(top, "+startColor+", "+endColor+");";
  result += "background-image: linear-gradient(to bottom, "+startColor+", "+endColor+");";
  return result;
}


function addCollapse(thiscollapse) {
  thiscollapse.attr('aria-expanded', 'false');
  thiscollapse.addClass('is-collapsed');
  thiscollapse.children('[data-widget-collapse=inner]').attr('aria-hidden', 'true');
  if (thiscollapse.data('widget-type')) {
      var value = thiscollapse.data('widget-type');

      //This is used for the fadeout collapse thingie
      if (value === "preview") {
          thiscollapse.removeClass('is-disabled');

          var previewbox =thiscollapse.children('[data-widget-collapse=inner]'),
              thispreview = $(previewbox[0]),
              maxHeight = thispreview.css('max-height');

		
          var gradientColorElement = thiscollapse.data("widget-gradient-color-item"),
              gradientColor = "";
          if(typeof gradientColorElement !== 'undefined') {
            gradientColor = 'style="'+ gradient($(gradientColorElement).css("background-color"), "rgba(255,255,255,0)")+'"';
          }

          var height = previewbox.height(),
              thisMaxHeight = maxHeight.replace('px','');

          if(height < thisMaxHeight) {
            thiscollapse.addClass('is-disabled');
          }

          var showtext = thiscollapse.data('widget-showtext'),
              iconshow = thiscollapse.data('widget-iconshow'),
              icontext = thiscollapse.data('widget-icontext');
              
          thispreview.attr('data-widget-previewheight', maxHeight);
          if(thiscollapse.find('[data-widget-control="collapse-trigger"]').length === 0) {
			
              var triggerHtmlFirst = '<span data-widget-control="collapse-trigger" ' + gradientColor + '>';

                  triggerHtmlFirst += '<span class="tsBtn--collapse">';
                  if(typeof showtext !== 'undefined') {
                      triggerHtmlFirst += '<b data-widget-collapse="toggletext">' + showtext + '</b>';
                  }
          
                  var triggerHtmlLast = '';
                  if(typeof iconshow !== 'undefined') {
                    triggerHtmlLast += '<i class="' +iconshow + '"><b>' + icontext + '</b></i>';
                  }
                  
                  triggerHtmlLast += '</span>';
                  triggerHtmlLast += '</span>';
          }

      } else if (value === "gradient") {
          var previewbox = thiscollapse.children('[data-widget-collapse=inner]');
          var thispreview = $(previewbox[0]);
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
          trigger = $(triggers[0]),    
          showtext = thiscollapse.data('widget-showtext'),
          iconshow = thiscollapse.data('widget-icon'),
          icontext = thiscollapse.data('widget-icontext'),
          triggerHtmlFirst = (typeof showtext !== 'undefined') ? '<b data-widget-collapse="toggletext">' + showtext  + '</b>' : "",
          triggerHtmlLast = (typeof iconshow !== 'undefined') ? '<i class=' +  iconshow + '><b>' + icontext + '</b></i>' : "";

      if (trigger.length > 0) {
          trigger.html(triggerHtmlFirst + trigger.html() + triggerHtmlLast);
      } else {
          thiscollapse.prepend('<a data-widget-collapse="trigger">' + triggerHtmlFirst + triggerHtmlLast + '</a>');
      } 
  }
}

function initCollapse() {
    if ($("[data-widget=collapse]").length > 0) {
        var collapseWidgets = $("[data-widget=collapse]");
        collapseWidgets.each(function() {
            var collapse = $(this);
            addCollapse(collapse);
        });
    }
}

//Only for filter 
function addCollapseHash(element) {
  var collapses = [],
      newarray = [];
  $('.tsProductListContainer--alt').each(function() {
    collapses.push($(this).find('[data-widget-type="preview"]').not('.is-collapsed').element.parent().data('filter-id'));
  });
 
  hash.remove('prev');
  if(collapses.length > 0) {
    newarray['prev'] = this.HashString(collapses);
    hash.add(newarray);
  }
}
//Only for filter 
function addCollapseHash(element) {
    var thisoffset = window.pageYOffset;
    hash.remove('prev');
    var collapses = [],
        newarray = [],
        elements = $('[data-widget="filter"]').find('.tsPageSection.is-expanded'),
        parentoffset = element.closest(".tsProductListContainer--alt").offset();

    if(elements.length >0)
    {
        for (var i = 0; i < elements.length; i++) {
            collapses.push($(elements[i]).parent().data('filter-id'));
        }

        if(collapses.length > 0) {
            newarray['prev'] = hashString(collapses);
            hash.add(newarray);
        }
        scrollToElement(parentoffset.top, thisoffset);
    }
}

//Only for filter 
function openCollapseFromHash() {
    var hashValues = hash.get('prev');
    if(typeof hashValues !== 'undefined') {
        hashValues = hashValues.split('|');
        for (var i = 0; i < hashValues.length; i++) {
            togglecollapse($('[data-filter-id="'+ hashValues[i]+'"]').find('.tsPageSection'));
        }
    }
}