 /* global mediaqueriesMin:true, togglecollapse:true */

var NavPrimary;

if (typeof NavPrimary === "undefined") {
  NavPrimary = {};
}

NavPrimary = function () {
  return {
    BuildNavPrimary: function(){
      var topLevel = $('#tsNavPrimary-TopLevel'),
          navprimaryTopitems = topLevel.find('[data-widget-navprimary=topitem]'),
          wrapnavigation = $('#tsWrapNavigation'),
          tabnavhtml =  '<ul class="tsNavPrimary-Tabs">';

      navprimaryTopitems.each(function() {
        tabnavhtml += '<li class="tsNavPrimary-TabsItem"><a href="' + $(this).attr('href') + '"><b>' + $(this).find('b:not([data-widget-collapse="toggletext"])').html() + '</b></a></li>';
      });
      tabnavhtml += '</ul>';
      wrapnavigation.append(tabnavhtml);

      topLevel.attr("data-navprimary-expanded", "");

        // Hide all sub levels accessibly
        var subLevels = topLevel.find('.tsNavPrimary-SubLevel');
        subLevels.each(function() {
          $(this).attr("aria-hidden", "true");
          NavPrimary.AddCloseButtonsToSubLevel($(this));
        });
      },
      SetSubNavPosition: function () {
        var subNavs = $('.tsNavPrimary-SubLevel');
        subNavs.each(function() {
          var element = $(this),
          thisId = element.attr('id'),
          parentTrigger = $('.tsNavPrimary-TopLevelItem').find('[href$='+thisId+']');

          if(mediaqueriesMin('mqMedium') || $('body').hasClass('lt-ie9')) {
            if(parentTrigger.siblings('.tsNavPrimary-SubLevel').length > 0) {
              var parent = $('.tsNavPrimary').parent('div.tsWrapInner');
              parent.after(element);
            }
            if(element.children('.tsWrapInner').length === 0) {
              element.wrapInner('<div class="tsWrapInner"></div>');
            }
          } else {
            if(parentTrigger.siblings('.tsNavPrimary-SubLevel').length === 0) {
              parentTrigger.after(element);
            }
            if(element.find('.tsWrapInner').length > 0) {
              element.find('.tsWrapInner').children().unwrap('.tsWrapInner');
            }
          }
        });
      },
      
      AddCloseButtonsToSubLevel: function(subLevel){
        var parent = subLevel.closest('.tsNavPrimary-TopLevelItem'),
        closeText =  parent.data('widget-closetext'),
        closeIcon = parent.data('widget-closeicon');

        if(typeof closeIcon !== 'undefined') {
          subLevel.append('<div class="tsNavPrimary-close"><a href="#" data-tab="'+subLevel.attr('id')+'">'+closeText+'<i class="'+ closeIcon+'"></i></a></div>');
        }            
      },

      SlideDownSubLevel: function(topLevel, subLevel, href) {
        subLevel.slideDown(function() {
          $(this).attr("aria-hidden", "false");
          $(this).addClass("is-expanded");
          topLevel.attr("data-navprimary-expanded", href);
        });
      },

      SlideUpSubLevel:function(topLevel, subLevel, callback) {
        subLevel.slideUp(function() {
            $(this).attr("aria-hidden", "true");
            $(this).removeClass("is-expanded");
            topLevel.attr("data-navprimary-expanded", "");

            if (typeof(callback) === 'function') {
              callback();
            }

          });
      },

      ToggleSubLevel: function(trigger) {
        var headerSearch = $(".tsHeader-Search");
        if ($(headerSearch[0]).hasClass("is-expanded")) {
          togglecollapse($(headerSearch[0]));
        }

        if (trigger.hasClass("is-expanded")) {
          trigger.removeClass("is-expanded");
        } else {
          trigger.addClass("is-expanded");
        }
        var href = $('body').hasClass('lt-ie8') ? '#' + trigger.attr('href').split('#')[1] : trigger.attr("href"),
            subLevel = $(href),
            topLevel = $("#tsNavPrimary-TopLevel"),
            activeSubLevel = topLevel.attr("data-navprimary-expanded");

        if (activeSubLevel.length > 0) {
          if (activeSubLevel === href) {
            NavPrimary.SlideUpSubLevel(topLevel, subLevel, href);
          } else {
            NavPrimary.SlideUpSubLevel(topLevel, $(activeSubLevel), function() {
              trigger.parent('li').siblings().children('a').removeClass('is-expanded');
              NavPrimary.SlideDownSubLevel(topLevel, subLevel, href);
            });
          }
        } else {
          if (subLevel.attr("aria-hidden") !== "false" || subLevel.attr("aria-hidden") === "true") {
           NavPrimary.SlideDownSubLevel(topLevel, subLevel, href);
         } else {
          NavPrimary.SlideUpSubLevel(topLevel, subLevel);
        }     
      }
    }
  };
}();

$(document).ready(function() {
  // Create tab navigation for NavPrimary used on larger screens
  if ($('#tsNavPrimary').length > 0) {
    NavPrimary.BuildNavPrimary();
  }
  //Fix for # links ie7
  if($('body').hasClass('lt-ie8')) {
    $('body').on('click', '.tsNavPrimary-TabsItem > a', function(e) {
      if($(this).attr("href").indexOf('#') > 0) {
        e.preventDefault();
        NavPrimary.ToggleSubLevel($(this));
      }
    });
  }

  $('body').on('click', '.tsNavPrimary-TabsItem > a[href^="#"]', function(e) {
    e.preventDefault();
    NavPrimary.ToggleSubLevel($(this));
  });
  $('body').on('click', '.tsNavPrimary-close', function(e) {
    e.preventDefault();
    var expandedParent = $(this).find('a').data('tab');
    NavPrimary.ToggleSubLevel($('.tsNavPrimary-Tabs').find('a[href$="'+'#'+expandedParent+'"]'));
  });
});