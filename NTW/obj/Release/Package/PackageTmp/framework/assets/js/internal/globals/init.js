$(document).ready(function() {

    // Session timeout
    var sessionTimeout = $("[data-widget*=sessionTimeout]");
    if (sessionTimeout.length) {
        var millisecondsLeft = sessionTimeout.data("milliseconds-left");
        var warningMillisecondsLeft = sessionTimeout.data("warning-milliseconds-left");
        var url = sessionTimeout.data("url");
        var urlElement = sessionTimeout.data("url-element");
        var targetModal = sessionTimeout.data("target-modal");
        sessionTimeout.sessionTimeout({ millisecondsLeft: millisecondsLeft, warningMillisecondsLeft: warningMillisecondsLeft, url: url, urlElement: urlElement, targetModal: targetModal });
    }

  $('[data-widget="selectlist"]').each(function(){
        var element = $(this);
        var dynamicWidth = element.data("dynamic-width");
        var overflowCss = element.data("allowoverflowcss") ? " tsSelectBox-AllowOverflowCss" : "";

         
        element.selectBoxIt({
          autoWidth: dynamicWidth,
          dynamicPositioning: true,
          downArrowIcon: "tsIcon-ArrowDown2",
          upArrowIcon: "tsIcon-ArrowUp2",
          isMobile: function() {
            return false;
          },
          'theme': {
            'focus': 'tsSelectBox-focus',
            'hover': 'tsSelectBox-hover',
            'enabled': 'tsSelectBox-enabled',
            'disabled': 'tsSelectBox-disabled',
            'arrow': 'tsSelectBox-default-arrow',
            'button': 'tsSelectBox-btn',
            'list': 'tsSelectBox-list' + overflowCss,
            'container': 'tsSelectBox-container',
            'open': 'tsSelectBox-open'
          }
        });
    });

  //Placeholder IE8-9 
  $('input[type=search]').blur(function() {
      if(!$.trim(this.value).length) {
          $(this).siblings('label').removeClass('visuallyhidden');
      }
  });

  if(!Modernizr.input.placeholder)
    {
        if($('[data-visual=placeholder]').length > 0)
        {
            $('[data-visual=placeholder]').each(function(){
                var div = '<div class="textinput-placeholder"></div>',
                text = '<label>' + $(this).attr('placeholder') + '</label>';
                $(this).wrap(div);
                $(this).before(text);

                if ($(this).attr('value') !== '') {
                    $(this).focus();
                }
            });
            $('[data-visual=placeholder]').focus(function(){
                $(this).siblings('label').addClass('visibilityhidden');
            });
            $('[data-visual=placeholder]').blur(function(){
                if(!$.trim(this.value).length) {
                    $(this).siblings('label').removeClass('visibilityhidden');
                }
            });
            $('.textinput-placeholder').click(function(){
                $(this).find('[data-visual=placeholder]').focus();
            });
        }
    }

 /*Hover function for compare products page. Finds the column that the hovered td belongs to, 
 along with the bottom td of that column, and  and adds the hocerclass to them. */
if($(".tsCompareTable").length > 0){
    $(".tsCompareTable").delegate('td','mouseover mouseleave', function(e) {
        var bottomTd = $('td:nth-child('+ ($(this).index()+1) +')');
        var activeColumn = $("colgroup").eq($(this).index());
        if (e.type == 'mouseover') {
          activeColumn.addClass("hover");
          bottomTd.addClass("hover");
        } else {
          activeColumn.removeClass("hover");
          bottomTd.removeClass("hover");
        }
    });
    /* Additionally click events on a column will be forwarded as clickevents to the button at the bottom of the column.*/
    $('.tsCompareTable td').click(function(e){
      $('tr:last-child').find('td:nth-child('+ ($(this).index()+1) +')').find('a')[0].click();
    });
    $('.tsValidation-error a').click(function(e){
      e.preventDefault();
      $(this).closest('.tsValidation-error').addClass('visuallyhidden');
    });
  }



  // Prevents touch screen taps on Primary Navigation top level targets from following the link
  // Opens the Sublevel panel instead
  $('body').on('click', '.tsNavPrimary-TopLevelTarget', function(e) {
      if (Modernizr.touch) e.preventDefault();
  });

  $('.tsSearch-header').focus(function(){
      $(this).siblings('i').addClass('focus');
  });

  $('.tsSearch-header').focusout(function(){
      $(this).siblings('i').removeClass('focus');
  });


  $('body').on('click', '.scrolling',  function(e){
      e.preventDefault();
      var element =$(this);
      var target = element.attr('href');

      $('html,body').animate({scrollTop:$(target).offset().top - 80},500);
  });

  $('body').on('click', '.indexscroll',  function(e){
      e.preventDefault();
      var element =$(this);
      var target = element.attr('href');

      $('html,body').animate({scrollTop:$(target).offset().top}, 500
          // function(){
          //     if(element.data('hash'))
          //         window.location.hash = target.replace('#','');
          // }
          );
  });

  $('[name="loginRadioType"]').change(function(e) {
      var t = $(this).data("formid");
      $("#main-login-ms-elegtype1").removeAttr("checked");
      $("#main-login-ms-elegtype2").removeAttr("checked");
      $("#main-login-ms-elegtype3").removeAttr("checked");
        if (t == "tsLogin-eleg") {
        $("form#tsLogin-eleg #tsLogin-submit").addClass("disabled");
        $("#password").removeAttr("checked");
        }
        else {
        $("form#tsLogin-eleg #tsLogin-submit").removeClass("disabled");
        }
      $(".tsLogin-form").removeClass("show");
      $("#tsLogin-submit").attr("form", t);
      $("#" + t).addClass("show");
  });
  $('[name="elegChoice"]').change(function(e) {
      $("form#tsLogin-eleg #tsLogin-submit").removeClass("disabled");
  });
  $("body").on("click", "#tsLogin-submit", function(e) {
      if ($("form#tsLogin-eleg #tsLogin-submit").hasClass("disabled")) {
      e.preventDefault();
      } else {
      e.stopPropagation();
      var t = $(this).attr("form");
      $("#" + t).submit();
  }});
//    $('[name="loginRadio"]').change( function(e) {
//        var formid = $(this).data('formid');
//        $('#tsLogin-submit').attr('form', formid);
//        $('[class^=tsForm]').removeClass('show');
//        $('#'+formid).addClass('show');
//    });

// $('body').on('click', '#tsLogin-submit', function(e) {
//        e.stopPropagation();
//        var form  =$(this).attr("form");
//        $('#'+form).submit();
//    });


  // TODO: rewrite?
  if ($('body.lt-ie9 [class^=tscRadioBox]').length > 0) {
    $('body').on('click', '[class^=tscRadioBox] > label', function(e) {
      var radiobox = $(this).parent();
      var inputradio = $(this).siblings('input[type=radio]');
      var inputbox = $(this).siblings('input[type=checkbox]');

      if (inputradio.length > 0) {
        radiobox.siblings().each(function() {
          $(this).find('input[type=radio]').removeClass('is-checked');
        })
        inputradio.addClass('is-checked');
        return true;
      }

      if (inputbox.length > 0) {
        if (inputbox.hasClass('is-checked')) {
          inputbox.removeClass('is-checked');
        } else {
          inputbox.addClass('is-checked');
        }
      }

    });
  }

/*
//    if($('body').hasClass('lt-ie9')) {
//        $('body').on('change', '[class^=tsRadioBox] > input', function(){
      $('body').on('click', '[class^=tsRadioBox] > input', function(){
            if ($(this).attr('type')=='radio'){
                var radiogroup = $('[name="'+$(this).attr('name')+'"]');
                radiogroup.each(function() {
          $(this).removeClass('is-checked');
        });
            }
//            var label = $(this).siblings('label');
            $(this).is(':checked') ? $(this).addClass('is-checked') : $(this).removeClass('is-checked');
        });
//    }
*/



  //For Selectlist on productdetails page
  $('body').on('click', '[data-widget=selectList-trigger-alt]', function(e){
      e.stopPropagation();
      e.preventDefault();
      var list = $(this).siblings('[data-widget=selectList]');
      var open = list.hasClass('hide');
      $('.tsSelectList').addClass('hide');
      open ? list.removeClass('hide') : list.addClass('hide');
      open ? $(this).addClass("active") : $(this).removeClass("active");

  });
  //Reset items on body click
  $('body').click(function() {
      //reset selectboxes
      if($('[data-widget=selectList-trigger-alt]').hasClass("active"))
      {
          $('[data-widget=selectList-trigger-alt]').removeClass("active");
      }

      //Reset sliced submenu
      if($('.tsSubNavigation-sliced-link').hasClass("is-active"))
      {
          $('.tsSubNavigation-sliced-link').removeClass("is-active");
      }
      if(!$('.tsSubNavigation-sliced-list').hasClass("is-disabled")){
          $('.tsSubNavigation-sliced-list').addClass("is-disabled");
      }

  });


  if(!$('body').hasClass("lt-ie8"))
  {
      ListFilter.Init();
  }
  ListFilter.FilterOnHash();

  if(!$('body').hasClass("lt-ie8"))
  {

      //ListFilter.SetSelectListPositions();
      ListFilter.CheckCookie();
  }
  initCollapse();
  $('body').on('click', '[data-widget-collapse=trigger], [data-widget-control=collapse-trigger]', function(e) {
      //console.log("clicked a collapse trigger");
      e.preventDefault();
      var innerId;
      if($(this).attr('rel') != undefined && $(this).attr('rel').length > 0)
      {
          innerId =$(this).attr('rel');
      }

      togglecollapse($(this).closest('[data-widget=collapse]'), innerId);

  });
  openCollapseFromHash();

  $('.tsLibrary-small').find('li').each(function(){
      var element = $(this).find('.tsLibrary-item--alt'),
      title = element.data('title');

      element.append('<div class="tsLibrary-item-info"><span><span>'+title+'</span></span></div>');

  });

/*
      if($('body').hasClass('lt-ie9'))
      {
          $('body').on('change', '.tsRadioBox > input', function(){
              if ($(this).attr('type')=='radio'){
                  var radiogroup = $('[name="'+$(this).attr('name')+'"]');
                  radiogroup.siblings('label').removeClass('is-checked');
              }
              var label = $(this).siblings('label');
              $(this).is(':checked') ? label.addClass('is-checked') : label.removeClass('is-checked');
          });
      }
*/

  // Browser check test
  browserCheck(true);

  //Integrity poilicy cookie
  integrityCookie();

  // Responsive tables
  responsiveTable();

  // Test if user is on an Andoid
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf("android") > -1;
  var isIos = ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1;
  if(isAndroid || isIos) {
      $('[data-print-trigger]').hide();
  }

});


  function setAllLinksToSameHeight()
  {
     if($('.tsProductIntro > div').length > 0)
      {
        if(mediaqueriesMin("mqSmall"))
        {
          var elements =$('.tsProductIntro > .tsMediaSelector-Wrapper, .tsProductIntro > .tsProductIntro-Information')
          elements.css('min-height', highestElement(elements));
        }
      }
      if($('.tsProductItem-Purchase').length > 0)
      {
          var elements = $('.tsProductItem-Purchase');
          elements.css('min-height', highestElement(elements));
      }
      if($('.tsLogin-boxlist-item').length > 0)
      {
          var items = $('.tsLogin-boxlist-item > a');
          items.css('min-height', highestElement(items));
      }
      if(mediaqueriesMin('mqSmall') && $('.tsColumnBlock-block--alt').length > 0)
      {
          var items = $('.tsColumnBlock-block--alt');
          items.css('min-height', highestElement(items));
      }
      else {
          var items = $('.tsColumnBlock-block--alt');
          items.css('min-height','');
      }


  }

  function productlistAlignment() {

      /*if($('.tsListFilter-trigger').length >0)
      {
          $('.tsListFilter-trigger, .tsListFilter-trigger-outer').each(function()
          {
              var height = $(this).height();
              $(this).closest('.tsListFilter-collapse').css('margin-top', height);
              $(this).css('top', -height);

              var first = $(this).find('> div')[0];
              if(height > 53 && $(first).data('widget-control') == "collapse-trigger")
              {
                  $(first).appendTo($(this));
              }
              else
              {
                  $(first).prependTo($(this));
              }
          });
      }*/


              if ($("[data-visual=productList]").length > 0) {
                  var lists = $("[data-visual=productList]").not();
                  lists.each(function() {
                      var items = $(this).find("li.tsProductList-Item");
                      //items.addClass("show");

                      items = $(this).find(".tsProductItem-Desc");
                      if(items.length > 0 && mediaqueriesMin('mqLtSmall') || items.length > 0 && $(".tsProductList--alt").length == 0)
                      {
                          $(items).css('min-height', highestElement(items));
                      }

                       //Sets height on secondary prices
                       var secondaryPrices = $(this).find('.tsProductItem-Price');
                       if(secondaryPrices.length > 0 && mediaqueriesMin('mqLtSmall'))
                       {
                          var highest = highestElement(secondaryPrices);
                          secondaryPrices.css('min-height', highest);

                      }

                      var tsProductItemDisclaimer = $(this).find('.tsProductItem-Disclaimer');
                      if(tsProductItemDisclaimer.length > 0 && mediaqueriesMin('mqLtSmall'))
                      {
                          var highest = highestElement(tsProductItemDisclaimer);
                          tsProductItemDisclaimer.css('min-height', highest);

                      }

               var productCompare = $(this).find('.tsProductItem-Compare');
                      if (productCompare.length > 0 && mediaqueriesMin('mqLtSmall')) {
                        var heighest = highestElement(productCompare);
                        productCompare.css('min-height',heighest);
                      }


                      removeBorderFromLastElements($(this));
                  });
              }

  }

  function highestElement(elements)
  {
      var array = [];
      $.each(elements,function() {
          var height = $(this).outerHeight();

          array.push(height);
      });
      var max = Math.max.apply(null, array);
      return max;
  }

  function widestElement(elements)
  {
      var array = [];
      $.each(elements,function() {
          var width = $(this).width();

          array.push(width);
      });
      var max = Math.max.apply(null, array);
      return max;
  }
  //Removes border from last elements
  function removeBorderFromLastElements(list)
  {
      var elementsInRow = getElementsInRow(list.hasClass('tsProductList--Alt')),
      elements = list.find('[class*=tsProductList-Item].show'),
      elementLenght = elements.length,
      doubleelements = list.find('li.tsProductList-Item--tsCampaign--double , .tsProductList-Item--double'),
      modulus= (elementLenght + doubleelements.length) % elementsInRow;
      elements.removeClass('no-border-bottom');

      if(modulus==0)
      {
          modulus = elementsInRow;
      }

      var i = 0;
      while(modulus > i)
      {
       var elementhit = $(elements[elementLenght - (i+1)]);

       elementhit.addClass('no-border-bottom');
       if(elementhit.hasClass('tsProductList-Item--tsCampaign--double'))
       {
          i++;
      }

      i++;
  }
  if(!list.hasClass('tsProductList')) {
      removeBorderFromLastRigthElements(elements, elementsInRow);
  }
  }
  function removeBorderFromLastRigthElements(elements, elementsInRow){
      var counter = 1;
      elements.removeClass('no-border-right');
      elements.each(function(){
          if($(this).hasClass('tsProductList-Item--tsCampaign--double'))
          {
              counter++;
          }
          if(counter % elementsInRow === 0)
          {
              $(this).addClass('no-border-right');
          }
          counter++;
      });
  }
  function checkAddOrRemoveCollapse(list)
  {
      var parent = list.find('[data-widget-collapse=inner]');
      if(parent!=undefined)
      {
          //initCollapse();
          var collapse = parent.closest('[data-widget=collapse]'),
          trigger = collapse.siblings('[data-widget-control=collapse-trigger]'),
          previewheight = parent.data("widget-previewheight");

          if(trigger.length == 0)
          {
              addCollapse(collapse);
          }

          if(previewheight!=undefined)
              previewheight = previewheight.replace('px','');

          if(previewheight > list.find('ul').height())
          {
              if(collapse.hasClass("is-collapsed"))
              {
                  trigger.click();
              }
              trigger.addClass("hide");
          }
          else
          {
              trigger.removeClass("hide");
          }
      }
      removeBorderFromLastElements(list);
  }
  function getElementsInRow(altlist)
  {
      var inRow = 1;
      if(mediaqueriesMin("mqXsmall") && mediaqueriesMax("mqLtSmall"))
      {
       altlist ? inRow = 1 : inRow = 2;
   }
   else if(mediaqueriesMin("mqSmall") && mediaqueriesMax("mqLtMedium"))
   {
       inRow = 3;
   }
   else if(mediaqueriesMin("mqMedium") && mediaqueriesMax("mqLtLarge"))
   {
      inRow = 4;
  }
  else if(mediaqueriesMin("mqLarge"))
  {
      inRow = 5;
  }
  return inRow;
  }



  //Only used for < ie8
  function indexof(array, searchElement)
  {
      var n, k, t = array,
      len = t.length >>> 0;

      if (len === 0) {
        return -1;
    }
    n = 0;
    if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
  } else if (n != 0 && n != Infinity && n != -Infinity) {
      n = (n > 0 || -1) * Math.floor(Math.abs(n));
  }
  }
  if (n >= len) {
    return -1;
  }
  for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
    if (k in t && t[k] === searchElement) {
      return k;
  }
  }
  return -1;
  }


  function addCookie(name, value, days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          var expires = "; expires=" + date.toGMTString();
      }
      else var expires = "";
      document.cookie = name + "=" + value + expires + "; path=/";
  }
  function getCookie(name) {
      if (document.cookie.length > 0) {
          start = document.cookie.indexOf(name + "=");
          if (start != -1) {
              start = start + name.length + 1;
              end = document.cookie.indexOf(";", start);
              if (end == -1) {
                  end = document.cookie.length;
              }
              return unescape(document.cookie.substring(start, end));
          }
      }
      return "";
  }

  //TODO: Make this dynamic
  function checkBrowser() {
      return BrowserDetect.browser +'|'+ BrowserDetect.version;
  }
  var BrowserDetect =
  {
      init: function ()
      {
          this.browser = this.searchString(this.dataBrowser) || "Other";
          this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
      },

      searchString: function (data)
      {
          for (var i=0 ; i < data.length ; i++)
          {
              var dataString = data[i].string;
              this.versionSearchString = data[i].subString;

              if (dataString.indexOf(data[i].subString) != -1)
              {
                  return data[i].identity;
              }
          }
      },

      searchVersion: function (dataString)
      {
          var index = dataString.indexOf(this.versionSearchString);
          if (index == -1) return;
          return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
      },

      dataBrowser:
      [
      { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
      { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
      { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
      { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
      { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
      ]

  };
  // Initialize widgets and functions


function scrollToElement(parentoffset, thisoffset){
      var browser = checkBrowser();
      if(browser.split('|')[0].toLowerCase() == "explorer")
      {
         if(parentoffset!=undefined)
          $("html, body").animate({scrollTop: parentoffset + -62});
  }
  else
  {
   $("body, html").scrollTop(thisoffset);
  }
}

// Responsive tables
function responsiveTable(){
    var table, thead, rows, tr, td, colCount, firstRowAsTh, value;

    $('[class*="tsTableResponsive"]').each(function(){
        table = $(this);

        //extract thead
        thead = table.find('thead tr');
        //if there is no thead defined use the table's first row
        if(!thead){
            thead = table.children('tr:first');
            firstRowAsTh = true;
        }

        //nothing to do, there are no table headers
        if(!thead || !thead[0]){ return; }
        thead = thead[0];

        colCount = thead.children.length;

        //extract all the table rows
        rows = table.find('tbody tr');
        if(!rows){
            rows = table.children('tr');
        }


        rows.each(function(){
            if(firstRowAsTh){ return true; }

            tr = this;
            for(var i = 0; i < colCount; i++){
                value = thead.children[i].innerHTML;
                if(value){
                  //replace all br elements with commas ,
                  value = value.replace(/<.*?br.*?>/ig, ', ');
                  //remove all html tags
                  value = value.replace(/<.*?>/ig, '');
                }

                $(tr.children[i]).attr('data-label', value);
            }
        });

    });
}

    var setModalHeight = function(element){
      if (mediaqueriesMax("mqLtMedium")) {
          var header_height = element.find('.tsModal-header').outerHeight() || 0;
          var footer_height = element.find('.tsModal-header').outerHeight() || 0;
          var content_height = parseInt($(window).height() - header_height);
          var max_height = parseInt($(window).height() - header_height - footer_height);
          element.find('.tsModal-body').css({"height": content_height, "max-height": max_height});
        }
    };

// Initialize widgets and functions
$(window).on('load', function() {
//    navprimary();
BrowserDetect.init();
});


$(window).on('load orientationchange', function() {

    var links = $('.tsEasyToFind-links > li');
    links.find('a').css("height","");
    setAllLinksToSameHeight();
    productlistAlignment();
    //Feedback.feedbackPosition();
    ListFilter.SetSelectListPositions();
    $('.no-fouc').removeClass('no-fouc');
    //    NavPrimary.SetSubNavPosition();
    collapse();
    $('.tsHero-inner-item').each(function() {
           $(this).carousel().update();
    });

    // Add hide-collapse for filter...
    ListFilter.CheckCollapse();
    if($('.tsModal-wrapper').length >0)
    {
      $('.tsModal-wrapper').each(function(){
         setModalHeight($(this));
      })
    }
    

});

$(window).resize(function() {
    if(!$('body').hasClass('lt-ie9'))
    {
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 500);
    }
});

$(window).bind('resizeEnd', function() {
    // Add hide-collapse for filter...
    ListFilter.CheckCollapse();

    if(!$('body').hasClass('lt-ie9'))
    {
        productlistAlignment();
        setAllLinksToSameHeight();

        //Feedback.feedbackPosition();
        ListFilter.SetSelectListPositions();
        collapse();
        $('.tsHero-inner-item').each(function() {
            $(this).carousel().update();
        });
    }
    if($('.tsModal-wrapper').length >0)
    {
      $('.tsModal-wrapper').each(function(){
         setModalHeight($(this));
      });
    }

});


(function($) {

  $.fn.verticalLiText = function() {
        
        if(mediaqueriesMin("mqMedium")) {
            this.find('li').each(function(){

                $(this).find('img').on('load',function(){
                    var text_height = $(this).parent('.tsCampaign-img').siblings('.tsCampaignList-text').outerHeight();
                    $(this).parents('li').css('max-height',text_height+55);
                    
                    var img_height = $(this).height();
                    
                    var margin = (img_height - (text_height+55))/2;
                    //alert(img_height + ' / ' + text_height + ' / ' + margin);
                    
                    $(this).css('margin-top',-(margin+25));
                }).each(function() {
                    if(this.complete) 
                        $(this).load();
                });

            });
        }

    }
    
    $.fn.verticalText = function() {
        
        if(mediaqueriesMin("mqLarge")) {

            $(this).find('img').on('load',function(){
                var img_height = $(this).height();
                var text_height = $(this).parent('.tsCampaign-img').siblings('div').outerHeight();
                var margin = (img_height - text_height)/2;
                $(this).parent('.tsCampaign-img').siblings('div').css('margin-top',margin);
            }).each(function() {
                if(this.complete) 
                    $(this).load();
            });

        }

    }
     
}(jQuery));
                

$(function() {

    $('.tsCampaignList--alt').each(function(){
        $(this).verticalLiText();   
    });

    $('.tsCampaignList').each(function(){
        $(this).verticalLiText();   
    });

    $('.tsCampaignList--product').each(function(){
        $(this).verticalLiText();   
    });    

    $('.tsCampaignHero--left').each(function(){
        $(this).verticalText();   
    });
    
    $('.tsCampaignHero--right').each(function(){
        $(this).verticalText();   
    });
    
    
    // temp! move this to bankid-script later
	$('[data-ng-click="initMobileBankId()"]').click(function() {
        if ($('#launchBankID').prop('checked')) 
            $('[data-widget="BankIDlauncher"]').attr('src','bankid:///?redirect=null');
	});
     
});

    

