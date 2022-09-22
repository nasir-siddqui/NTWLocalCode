// Nav Primary version 3
var NavPrimary;

if (typeof NavPrimary === "undefined") {
    NavPrimary = {};
}
NavPrimary = function () {

    // OnInit

    function _init() {
    }

    return {

    BuildNavPrimary: function(){
        var topLevel = jQuery_1_9_1('#tsNavPrimary-TopLevel'),
            navprimaryTopitems = topLevel.find('[data-widget-navprimary=topitem]'),
            navprimaryToplevel = jQuery_1_9_1('#tsNavPrimary-TopLevel'),
            wrapnavigation = jQuery_1_9_1('#tsWrapNavigation'),
           
        
        tabnavhtml =  '<ul class="tsNavPrimary-Tabs">';
        navprimaryTopitems.each(function() {
            tabnavhtml += '<li class="tsNavPrimary-TabsItem"><a href="' + jQuery_1_9_1(this).attr('href') + '">' + jQuery_1_9_1(this).find('b:not([data-widget-collapse="toggletext"])').html() + '</a></li>';
        });
        tabnavhtml += '</ul>';
//        navprimaryToplevel.before(tabnavhtml);
        wrapnavigation.append(tabnavhtml);
        
        topLevel.attr("data-navprimary-expanded", "");
        
        // Hide all sub levels accessibly
        var subLevels = topLevel.find('.tsNavPrimary-SubLevel');
        subLevels.each(function() {
            jQuery_1_9_1(this).attr("aria-hidden", "true");
            NavPrimary.AddCloseButtonsToSubLevel(jQuery_1_9_1(this));
        })
        //NavPrimary.SetSubNavPosition();
    },
    SetSubNavPosition: function () {
        var subNavs = jQuery_1_9_1('.tsNavPrimary-SubLevel');
        subNavs.each(function(){

            var element = jQuery_1_9_1(this),
                thisId = element.attr('id'),
                parentTrigger = jQuery_1_9_1('.tsNavPrimary-TopLevelItem').find('[hrefjQuery_1_9_1='+thisId+']');

            if(mediaqueriesMin('mqMedium')|| jQuery_1_9_1('body').hasClass('lt-ie9'))
            {
                if(parentTrigger.siblings('.tsNavPrimary-SubLevel').length > 0)
                {
                    var parent = jQuery_1_9_1('.tsNavPrimary').parent('div.tsWrapInner');
                    parent.after(element);

                }
                if(element.children('.tsWrapInner').length == 0)
                {
                    element.wrapInner('<div class="tsWrapInner"></div>');
                }
            }
            else
            {
                if(parentTrigger.siblings('.tsNavPrimary-SubLevel').length == 0)
                {
                   parentTrigger.after(element);
                }
                if(element.find('.tsWrapInner').length > 0)
                {
                    element.find('.tsWrapInner').children().unwrap('.tsWrapInner');
                }
            }
        })
        
    },
    AddCloseButtonsToSubLevel: function(subLevel){
          var parent = subLevel.closest('.tsNavPrimary-TopLevelItem'),
                closeText =  parent.data('widget-closetext'),
                closeIcon = parent.data('widget-closeicon');

            if(closeIcon !=undefined)
            {
                subLevel.append('<div class="tsNavPrimary-close"><a href="#" data-tab="'+subLevel.attr('id')+'">'+closeText+'<i class="'+ closeIcon+'"></i></a></div>');
            }            
    },

    SlideDownSubLevel: function(topLevel, subLevel, href) {
        subLevel.slideDown(function() {
            //console.log("sliding down " + subLevel.attr("id"));
            jQuery_1_9_1(this).attr("aria-hidden", "false");
            jQuery_1_9_1(this).addClass("is-expanded");
            topLevel.attr("data-navprimary-expanded", href);
            // Campaign area removed 2013-10-11 /pekkos
            // var childwidget = subLevel.data('child-widget-id');
            // if(childwidget!= undefined)
            // {
            //     jQuery_1_9_1('#' + childwidget).addClass('show');
            // }
        });
    },
    SlideUpSubLevel:function(topLevel, subLevel, callback) {
        // Campaign area removed 2013-10-11 /pekkos
        // var childwidget = subLevel.data('child-widget-id');
        // if(childwidget!= undefined)
        // {
        //     jQuery_1_9_1('#' + childwidget).removeClass('show');
        // }
        subLevel.slideUp(function() {
            //console.log("sliding up " + subLevel.attr("id"));
            jQuery_1_9_1(this).attr("aria-hidden", "true");
            jQuery_1_9_1(this).removeClass("is-expanded");
            topLevel.attr("data-navprimary-expanded", "");
           
            if (typeof(callback) == 'function') {
                callback();
            }

        });
    },
    ToggleSubLevel: function(trigger) {
        
        var headerSearch = jQuery_1_9_1(".tsHeader-Search");
        if (jQuery_1_9_1(headerSearch[0]).hasClass("is-expanded")) {
            togglecollapse(jQuery_1_9_1(headerSearch[0]));
        }

        if (trigger.hasClass("is-expanded")) {
            trigger.removeClass("is-expanded");
        } else {
            trigger.addClass("is-expanded");
        }
        var href = jQuery_1_9_1('body').hasClass('lt-ie8') ? '#' + trigger.attr('href').split('#')[1] : trigger.attr("href");
            subLevel = jQuery_1_9_1(href),
            topLevel = jQuery_1_9_1("#tsNavPrimary-TopLevel"),
            activeSubLevel = topLevel.attr("data-navprimary-expanded");

        if (activeSubLevel.length > 0) {
            //console.log("clicked: " + href + ", active: " + activeSubLevel);
            if (activeSubLevel === href) {
                NavPrimary.SlideUpSubLevel(topLevel, subLevel, href);
            } else {
                NavPrimary.SlideUpSubLevel(topLevel, jQuery_1_9_1(activeSubLevel), function() {
                    trigger.parent('li').siblings().children('a').removeClass('is-expanded');
                    NavPrimary.SlideDownSubLevel(topLevel, subLevel, href);
                });
               // jQuery_1_9_1(activeSubLevel).slideUp(function() {
               //     jQuery_1_9_1(this).attr("aria-hidden", "true");
               // });
                
            }
        } else {
                //console.log("clicked: " + href + ", active: " + activeSubLevel);
                if (!subLevel.attr("aria-hidden") == "false" || subLevel.attr("aria-hidden") == "true") {
                   NavPrimary.SlideDownSubLevel(topLevel, subLevel, href);
                } else {
                    NavPrimary.SlideUpSubLevel(topLevel, subLevel);
                }     
            }
        }
    }
}();


jQuery_1_9_1(document).ready(function() {
    // Create tab navigation for NavPrimary used on larger screens
    if (jQuery_1_9_1('#tsNavPrimary').length > 0) {
        NavPrimary.BuildNavPrimary();
    }
    //Fix for # links ie7
    if(jQuery_1_9_1('body').hasClass('lt-ie8'))
    {
        jQuery_1_9_1('body').on('click', '.tsNavPrimary-TabsItem > a', function(e) {
            if(jQuery_1_9_1(this).attr("href").indexOf('#') > 0)
            {
                e.preventDefault();
                NavPrimary.ToggleSubLevel(jQuery_1_9_1(this));
            }
        });
    }


    jQuery_1_9_1('body').on('click', '.tsNavPrimary-TabsItem > a[href^="#"]', function(e) {
        e.preventDefault();
        NavPrimary.ToggleSubLevel(jQuery_1_9_1(this));
    });
     jQuery_1_9_1('body').on('click', '.tsNavPrimary-close ', function(e) {
        e.preventDefault();
        var expandedParent = jQuery_1_9_1(this).find('a').data('tab');
        NavPrimary.ToggleSubLevel(jQuery_1_9_1('.tsNavPrimary-Tabs').find('a[hrefjQuery_1_9_1="'+'#'+expandedParent+'"]'));
    });

});


//    jQuery_1_9_1('#handla-handle').prepend('<span class="trigger-text">Show me</span>');






/*
jQuery_1_9_1('#navPrimaryV2-TopLevel').delegate("a", "keydown",
  function (e) {
    switch (e.which) {
      case 37: case 38:
        if (jQuery_1_9_1(this).parent().prev().length!=0) {
          jQuery_1_9_1(this).parent().prev().find(">a").click();
        } else {
          jQuery_1_9_1(tabsList).find("li:last>a").click();
        }
        break;
      case 39: case 40:
        if (jQuery_1_9_1(this).parent().next().length!=0) {
          jQuery_1_9_1(this).parent().next().find(">a").click();
        } else {
          jQuery_1_9_1(tabsList).find("li:first>a").click();
        }
        break;
    }
  }
);
*/


