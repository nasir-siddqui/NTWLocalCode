

var jQuery_1_9_1 = jQuery.noConflict(true);

jQuery_1_9_1(document).ready(function() {
    

    // Hides search input label on focus and on blur if the field is not empty

    jQuery_1_9_1('input[type=search]').focus(function() {
        jQuery_1_9_1(this).siblings('label').addClass('visuallyhidden');
    });

    jQuery_1_9_1('input[type=search]').blur(function() {
        if(!jQuery_1_9_1.trim(this.value).length) {
            jQuery_1_9_1(this).siblings('label').removeClass('visuallyhidden');
        }
    });
    if(!Modernizr.input.placeholder)
    {
        if(jQuery_1_9_1('[data-visual=placeholder]').length > 0)
        {
            jQuery_1_9_1('[data-visual=placeholder]').each(function(){   
                var div = '<div class="textinput-placeholder"></div>',
                text = '<label>' + jQuery_1_9_1(this).attr('placeholder') + '</label>';
                jQuery_1_9_1(this).wrap(div);
                jQuery_1_9_1(this).before(text);    
            });

            jQuery_1_9_1('[data-visual=placeholder]').focus(function(){
                jQuery_1_9_1(this).siblings('label').addClass('visibilityhidden');
            });

            jQuery_1_9_1('[data-visual=placeholder]').blur(function(){
                if(!jQuery_1_9_1.trim(this.value).length) {
                    jQuery_1_9_1(this).siblings('label').removeClass('visibilityhidden');
                }
            });
            jQuery_1_9_1('.textinput-placeholder').click(function(){
                jQuery_1_9_1(this).find('[data-visual=placeholder]').focus();                
            });
        }
    }


    
    
    // Prevents touch screen taps on Primary Navigation top level targets from following the link
    // Opens the Sublevel panel instead
    
    jQuery_1_9_1('body').on('click', '.tsNavPrimary-TopLevelTarget', function(e) {
        if (Modernizr.touch) e.preventDefault();
    });
    
    jQuery_1_9_1('.tsSearch-form-input').focus(function(){
        jQuery_1_9_1(this).closest('form').addClass('focus');
    });

    jQuery_1_9_1('.tsSearch-form-input').focusout(function(){
        jQuery_1_9_1(this).closest('form').removeClass('focus');
    });

    
    // 
    // // Used this implementation to limit the scrolling to specific elements. Otherwise it would
    // // try to scroll all # links.
    // jQuery_1_9_1('.scrollable').on('click', function(e){
    //     jQuery_1_9_1.scrollTo( jQuery_1_9_1(e.target).attr('href'),  400);
    // });
    // 

/*
    // Adds a hover event for the primary navigation top level in Medium size and up

//    jQuery_1_9_1(".tsNavPrimaryHover-TopLevelTarget").on(
    jQuery_1_9_1(".tsNavPrimaryHover-TopLevel").on(
        {
        mouseenter: function() {
            if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
//                toggleCollapse(jQuery_1_9_1(this).parent('[data-widget=collapse]'));
                toggleCollapse(jQuery_1_9_1(this));
//                toggleCollapse(jQuery_1_9_1(this).siblings());
            }
        },
        mouseleave: function() {
            if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
//                toggleCollapse(jQuery_1_9_1(this).parent('[data-widget=collapse]'));
                toggleCollapse(jQuery_1_9_1(this));
//                toggleCollapse(jQuery_1_9_1(this).siblings());
            }
        }
    });
*/

// 
//     //Makes iframes responsive
// //jQuery_1_9_1('iframe').responsiveIframe();
// 
//     jQuery_1_9_1('[name="loginRadioType"]').change( function(e) {
//         var formid = jQuery_1_9_1(this).data('formid');
//         jQuery_1_9_1('#tsLogin-submit').attr('form', formid);
//         jQuery_1_9_1('.tsLogin-form').removeClass('show');
//         jQuery_1_9_1('#'+formid).addClass('show');
//     });
// 
//     jQuery_1_9_1('body').on('click', '#tsLogin-submit', function(e){
//         e.stopPropagation();
//         var form  =jQuery_1_9_1(this).attr("form");
//         jQuery_1_9_1('#'+form).submit();
//     });
// 
// 
// 

    // 
    // //For Selectlist on productdetails page
    // jQuery_1_9_1('body').on('click', '[data-widget=selectList-trigger-alt]', function(e){
    //     e.stopPropagation();
    //     var list = jQuery_1_9_1(this).siblings('[data-widget=selectList]');
    //     var open = list.hasClass('hide');
    //     jQuery_1_9_1('.tsSelectList').addClass('hide');
    //     open ? list.removeClass('hide') : list.addClass('hide');
    //     open ? jQuery_1_9_1(this).addClass("active") : jQuery_1_9_1(this).removeClass("active");
    //   
    // });
    // //For Selectlist on productdetails page
    // jQuery_1_9_1('body').click(function() {     
    //     if(jQuery_1_9_1('[data-widget=selectList-trigger-alt]').hasClass("active"))
    //     {   
    //         jQuery_1_9_1('[data-widget=selectList-trigger-alt]').removeClass("active");
    //     }
    // });
    // 

//     if(!jQuery_1_9_1('body').hasClass("lt-ie8"))
//     {
// //ListFilter.InitFilter();
//     }
// //ListFilter.FilterOnHash();

//     if(!jQuery_1_9_1('body').hasClass("lt-ie8"))
//     {
//         
// //ListFilter.SetSelectListPositions();
// //ListFilter.CheckCookie();
//     }


    initCollapse();
    jQuery_1_9_1('body').on('click', '[data-widget-collapse=trigger],[data-widget-control=collapse-trigger]', function(e) {
        e.preventDefault();
        togglecollapse(jQuery_1_9_1(this).closest('[data-widget=collapse]'));
    });

});


// *** MOVED TO SHARE.JS TEMPORARILY //pekkos
// jQuery_1_9_1(window).load(function(){
//     loadShareScripts();
// });
//

//TODO Check instockstatus with ajax.?
function updateInstockStatus()
{
    return  true; // true : false;
}

// 
// function productlistAlignment() {
// 
//    /* if(jQuery_1_9_1('.tsProductList--Gallery').length > 0)
//     {
//         var items = jQuery_1_9_1('.tsProductList--Gallery').find('li');
//         if(items.length > 0)
//         {
//          //   jQuery_1_9_1(items).css('min-height', highestElement(items));
//         }
//     }*/
// 
// 
//     if (jQuery_1_9_1("[data-visual=productList]").length > 0) {
//         var lists = jQuery_1_9_1("[data-visual=productList]").not();
//         lists.each(function() {
//             var items = jQuery_1_9_1(this).find("li.tsProductList-Item");
//             //items.addClass("show");
// 
//             items = jQuery_1_9_1(this).find(".tsProductItem-Desc");
//             if(items.length > 0)
//             {
//                 jQuery_1_9_1(items).css('min-height', highestElement(items));
//             }
//                 
//              //Sets height on secondary prices
//             var secondaryPrices = jQuery_1_9_1(this).find('.tsProductItem-Price');
//             if(secondaryPrices.length > 0)
//             {
//                 var highest = highestElement(secondaryPrices);
//                 secondaryPrices.css('min-height', highest);
//                  
//             }
//             var tsProductItemDisclaimer = jQuery_1_9_1(this).find('.tsProductItem-Disclaimer');
//             if(tsProductItemDisclaimer.length > 0)
//             {
//                 var highest = highestElement(tsProductItemDisclaimer);
//                 tsProductItemDisclaimer.css('min-height', highest);
// 
//             }  
// 
//               
//             /*      
//            var tsProductListItem = jQuery_1_9_1('.tsProductList-Item');
//            tsProductListItem.push(jQuery_1_9_1('.tsProductList-Item--tsCampaign'));
//            tsProductListItem.push(jQuery_1_9_1('.tsProductList-Item--tsCampaign--double'));
//            if(tsProductListItem)
//            {
//                 var highest = highestElement(tsProductListItem);
//                 tsProductListItem.css('min-height', highest);
//            }*/
//            removeBorderFromLastElements(jQuery_1_9_1(this));
//            
//         });
//     }
// }
// 

// 
// String.prototype.replaceAll = function (stringToFind, stringToReplace) {
//     if (stringToFind === stringToReplace) return this;
//         var temp = this;
//         var index = temp.indexOf(stringToFind);
//         while (index != -1) {
//             temp = temp.replace(stringToFind, stringToReplace);
//             index = temp.indexOf(stringToFind);
//         }
// 
//     return temp.toString();
//  };
// 

// 
// function highestElement(elements)
// {
//     var array = [];
//     jQuery_1_9_1.each(elements,function() {
//         var height = jQuery_1_9_1(this).outerHeight();
//         
//         array.push(height);
//     });
//     var max = Math.max.apply(null, array);
//     return max;
// }
// 
// 


// 
// //Removes border from last elements
// function removeBorderFromLastElements(list)
// {
//         var elementsInRow = getElementsInRow(list.hasClass('tsProductList--Alt')),
//             elements = list.find('[class*=tsProductList-Item].show'),
//             elementLenght = elements.length,
//             doubleelements = list.find('li.tsProductList-Item--tsCampaign--double , .tsProductList-Item--double'),
//             modulus= (elementLenght + doubleelements.length) % elementsInRow;
//             elements.removeClass('no-border-bottom');
// 
//         if(modulus==0)
//         {
//             modulus = elementsInRow;
//         }
// 
//         var i = 0;
//         while(modulus > i)
//         {
//            var elementhit = jQuery_1_9_1(elements[elementLenght - (i+1)]);
// 
//            elementhit.addClass('no-border-bottom');
//            if(elementhit.hasClass('tsProductList-Item--tsCampaign--double'))
//            {
//                 i++;
//            }
//            
//             i++;
//         }
//         if(!list.hasClass('tsProductList')) {
//             removeBorderFromLastRigthElements(elements, elementsInRow);
//         }
//     }
//     
    
//     
// function removeBorderFromLastRigthElements(elements, elementsInRow){
//     var counter = 1;
//     elements.removeClass('no-border-right');
//     elements.each(function(){
//         if(jQuery_1_9_1(this).hasClass('tsProductList-Item--tsCampaign--double'))
//         {
//             counter++;
//         }
//         if(counter % elementsInRow === 0)
//         {
//             jQuery_1_9_1(this).addClass('no-border-right');
//         }
//         counter++;
//     });
// }


// 
// function checkAddOrRemoveCollapse(list)
// {
//     var parent = list.find('[data-widget-collapse=inner]');
//     if(parent!=undefined)
//     {
// //        initCollapse();
//         var collapse = parent.closest('[data-widget=collapse]'),
//             trigger = parent.siblings('[data-widget-control=collapse-trigger]'),
//             previewheight = parent.data("widget-previewheight");
// 
//         if(trigger.length > 0 )
//         {
//             addCollapse(collapse);
//         }
// 
//         if(previewheight!=undefined)
//             previewheight = previewheight.replace('px','');
// 
//         if(previewheight > list.find('ul').height())
//         {
//             if(collapse.hasClass("is-collapsed"))
//             {
//                 trigger.click();
//             }
//             trigger.addClass("hide");
//         }
//         else
//         {
//             trigger.removeClass("hide");
//         }
//     }
//     removeBorderFromLastElements(list);
// }
// 
// 
// 
// function getElementsInRow(altlist)
// {
//     var inRow = 1;    
//     if(mediaqueriesMin("mqXsmall") && mediaqueriesMax("mqLtSmall"))
//     {
//        altlist ? inRow = 1 : inRow = 2;
//     }
//     else if(mediaqueriesMin("mqSmall") && mediaqueriesMax("mqLtMedium"))
//     {
//        inRow = 3;
//     }
//     else if(mediaqueriesMin("mqMedium") && mediaqueriesMax("mqLtLarge"))
//     {
//         inRow = 4;
//     }
//     else if(mediaqueriesMin("mqLarge"))
//     {
//         inRow = 5;
//     }
//     return inRow;
// }
// 

// 
// //Only used for < ie8
// function indexof(array, searchElement)
// {
//     var n, k, t = array,
//         len = t.length >>> 0;
// 
//     if (len === 0) {
//       return -1;
//     }
//     n = 0;
//     if (arguments.length > 1) {
//       n = Number(arguments[1]);
//       if (n != n) { // shortcut for verifying if it's NaN
//         n = 0;
//       } else if (n != 0 && n != Infinity && n != -Infinity) {
//         n = (n > 0 || -1) * Math.floor(Math.abs(n));
//       }
//     }
//     if (n >= len) {
//       return -1;
//     }
//     for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
//       if (k in t && t[k] === searchElement) {
//         return k;
//       }
//     }
//     return -1;
// }
// 
// 
// function addCookie(name, value, days) {
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         var expires = "; expires=" + date.toGMTString();
//     }
//     else var expires = "";
//     document.cookie = name + "=" + value + expires + "; path=/";
// }
// 
// 
// function getCookie(name) {
//     if (document.cookie.length > 0) {
//         start = document.cookie.indexOf(name + "=");
//         if (start != -1) {
//             start = start + name.length + 1;
//             end = document.cookie.indexOf(";", start);
//             if (end == -1) {
//                 end = document.cookie.length;
//             }
//             return unescape(document.cookie.substring(start, end));
//         }
//     }
//     return "";
// }
// 
// 
// 
// //TODO: Make this dynamic
// function checkBrowserSupport() {
//     if((BrowserDetect.browser == 'Explorer' && BrowserDetect.version < 9) || (!Modernizr.touch && BrowserDetect.browser == 'Safari')){    
//         return true;
//     }
//     else {
//         return false;
//     }
// }
// 
// var BrowserDetect =
// {
//     init: function ()
//     {
//         this.browser = this.searchString(this.dataBrowser) || "Other";
//         this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
//     },
// 
//     searchString: function (data)
//     {
//         for (var i=0 ; i < data.length ; i++)   
//         {
//             var dataString = data[i].string;
//             this.versionSearchString = data[i].subString;
// 
//             if (dataString.indexOf(data[i].subString) != -1)
//             {
//                 return data[i].identity;
//             }
//         }
//     },
// 
//     searchVersion: function (dataString)
//     {
//         var index = dataString.indexOf(this.versionSearchString);
//         if (index == -1) return;
//         return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
//     },
// 
//     dataBrowser:
//     [
//         { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
//         { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
//         { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
//         { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
//         { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
//     ]
// 
// };



// Initialize widgets and functions


jQuery_1_9_1(window).on('load', function() {
//    navprimary();
//    BrowserDetect.init();
});

jQuery_1_9_1(window).on('load orientationchange', function() {

//    var links = jQuery_1_9_1('.tsEasyToFind-links > li');
//    links.find('a').css("height","");
//    setAllLinksToSameHeight();
//    productlistAlignment();
//Feedback.feedbackPosition();
   // ListFilter.SetSelectListPositions();
    jQuery_1_9_1('.no-fouc').removeClass('no-fouc');
//    NavPrimary.SetSubNavPosition();
    collapse();
//Carousel.Fix();

});

jQuery_1_9_1(window).resize(function() {
    if(!jQuery_1_9_1('body').hasClass('lt-ie9')) {
        if(this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function() {
                jQuery_1_9_1(this).trigger('resizeEnd');
        }, 500);
    }
});

jQuery_1_9_1(window).bind('resizeEnd', function() {
    if(!jQuery_1_9_1('body').hasClass('lt-ie9')) {
//        productlistAlignment();
//        setAllLinksToSameHeight();
        
       
//Feedback.feedbackPosition();
     //   ListFilter.SetSelectListPositions();
        collapse();

//        NavPrimary.SetSubNavPosition();
//        var hCarousels = jQuery_1_9_1("[data-widget=hero-carousel]");
//        if(hCarousels.length > 0)
//        {            
//Carousel.Init(hCarousels);
//        }
       
    }
});


