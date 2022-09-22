/*!
carousel.v1.fixes.js

Used for carousel hero in prod from March 2014

 */
(function ( $ ) {


    $.fn.carousel = function( options ) {
        var heroArray = [] ;
        var istablet = false;
        var _this = this; 

        var settings = $.extend({
          index :0
      }, options);

        var addArrowsToSlider = function (parent, parentIndex)
        {   
            parent.append('<div class="tsCarousel-Prev"><i class="tsIcon-Previous "><b>Nästa</b></i></div>');
            parent.append('<div class="tsCarousel-Next"><i class="tsIcon-Next "><b>Föregående</b></i></div>');

            parent.on('click', '.tsCarousel-Next', function() {
                heroArray[parentIndex].next();
            });
            parent.on('click', '.tsCarousel-Prev', function() {
                heroArray[parentIndex].prev();
            });

         /*  $(document).keydown(function(e) {

                switch (e.keyCode) {             
                    case 37:
                        heroArray[parentIndex].prev();
                        break;
                    case 39:
                        heroArray[parentIndex].next();
                        break;
                    }
            });*/

        }
        var addBulletsToSlider = function (count, parent, parentIndex, speed)
        {
            if(parent.find('.tsCarousel-nav').length == 0)
            {
                parent.append('<ul role="nav" class="tsCarousel-nav" data-parent="'+parentIndex+'"></ul>');
                var list =parent.find('.tsCarousel-nav');
                for (var i = 0; i < count; i++) {
                    var cssClass = 'tsCaroselbullet';
                    if (i==0) {
                        cssClass += ' on';
                    }
                    list.append('<li class="'+cssClass+'" data-index="'+i+'" ></li>');
                };
                //Only for absolute 
                //setBulletsToCenter(list);

                $('.tsCarousel-nav > li').on('click', function(){
                    var element = $(this),
                    index = element.data('index'),
                    parent = element.closest('ul').data('parent');
                    heroArray[parent].slide(index, speed);
                });
            }
        }
        // var  setBulletsToCenter = function(element){
        //     var width = element.width();
        //     element.css('margin-left',  -width/2);
        // }
        // function setElementsToMiddle(){
        //     var min = true;
        //     if(!$('body').hasClass('lt-ie9'))
        //     {
        //        min = mediaqueriesMin('mqMedium');
        //    }
        //    $('.tsHero-inner-item').each(function(){
        //        if($(this).hasClass('tsHero-textbox-coloured-left') || $(this).hasClass('tsHero-textbox-coloured-right') || !min)
        //        {
        //            $(this).removeAttr('style');
        //        }
        //        else
        //        {
        //          var height = $(this).height();
        //          $(this).css('margin-bottom', -height);

        //      }
        //  });
        // };
        


        // var update = function(){
                     
        //         }


        // This is the easiest way to have default options.
        
        
        return {
            add: function(){
             var swipeElement = _this;

             $(swipeElement).addClass('tsCarousel');
             swipeElement.data('widget-id', settings.index);

                    //Variables
                    var cssClassPrefix =swipeElement.data('widget-cssclass'), 
                        wrap = swipeElement.find('> div'),
                        bullets = wrap.find('> div').length,
                        name = cssClassPrefix + settings.index,
                        speed = swipeElement.data('widget-speed'),
                        auto =  swipeElement.data('widget-auto'),
                        continuous=swipeElement.data('widget-continuous');

                    if(bullets < 2)
                        return;

                        //Carousel    
                        heroArray.push(new Swipe(swipeElement[0], {              
                            speed: speed,
                            auto: auto,
                            continuous: continuous,
                            stopPropagation: false,        
                            callback: function(index, elem, direction) {
                                var items = $(elem).parent('div').parent('div').find('li');
                                items.removeClass('on');
                                items.eq(index).addClass('on');
                            }

                        }));
                        addBulletsToSlider(bullets, swipeElement, settings.index, speed);  
                        addArrowsToSlider(swipeElement, settings.index);
                    },
                    update: function(){
                        var element = _this;
                        var min = true;
                        if(!$('body').hasClass('lt-ie9'))
                        {
                           min = mediaqueriesMin('mqMedium');
                        }

                        linkurl = element.closest('.tsHero-imagecontainer--alt').find('.tsHero-link').attr('href');
                        if(min)
                        {
                            var sibling = element.siblings('.tsHero-outer--alt');
                            if(sibling.length > 0)
                            {
                                if(element.find('a').length > 0)
                                {
                                    element.find('a').children().unwrap('a');
                                }
                                sibling.find('[class*="tsHero-inner-image"]').after(element);
                            }  
                        }
                        else
                        {
                            if(element.siblings('[class*="tsHero-inner-image"]').length > 0)
                            {
                                if(element.find('a').length == 0)
                                {
                                    element.wrapInner('<a href="'+linkurl+'"/>');
                                }
                                element.closest('.tsHero-outer--alt').after(element);
                            }  

                        }
                    // });
                    }
                    
            };

        };

        }( jQuery ));





$(document).ready(function() {
    var hCarousels = $("[data-widget=hero-carousel]");
    if(hCarousels.length > 0)
    {
        hCarousels.each(function(i){
            $(this).carousel({'index':i}).add();
        });
    }
    

});


// $(window).on('load orientationchange', function() {
//     $('.tsHero-inner-item').each(function() {    
//            $(this).carousel().update();
//     });
// });
// $(window).on('resize', function() {
//     if(!$('body').hasClass('lt-ie9'))
//     {
//         $.carousel().update();
//                    // hCarousel();
//         }
//     });

// function addCarousel(swipeElement, ind) {



// }


// function hCarousel()
// {

// }






