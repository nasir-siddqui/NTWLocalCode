
// Nav Primary version 2
var Carousel,
    heroArray = [];

if (typeof Carousel === "undefined") {
    Carousel = {};
}
Carousel = function () {

    // OnInit

    function _init() {
    }

    return {

    Init: function()
    {
        var items = $("[data-widget=hero-carousel]");
        if(items.length > 0)
        {                
            items.each(function(i){
                var element = $(this),
                    min = false , max = false,
                    parent = element.closest("[data-widget=hero-carousel]"),
                    isCarousel = parent.data('is-carousel');
                    /*,
                    isColorElements = parent.data('is-colorelements');*/

                if(!$('body').hasClass("lt-ie9"))
                {
                    min = mediaqueriesMin(parent.data('min-width'));
                    max = mediaqueriesMax(parent.data('max-width'));
                }



                if(min && max && (isCarousel == undefined || isCarousel == false))
                {
                    Carousel.Add(element, i);
                }
                else if(max === false && isCarousel == true)
                {
                    Carousel.Remove(element, i);
                }
                else if(max === false || min === false)
                {
                    element.find('.tsCarousel-inner').removeAttr("style");
                    element.find('.tsCarousel-inner').children().removeAttr("style");
                }
                else if(isCarousel==true)
                {
                    var index = element.find('.on').data('index');
                    heroArray[i].slide(index, 0);
                }

              /*  if(isColorElements && !isCarousel && max === false)
                    Carousel.SetOutsideColor(element);*/
        });
    }
},

/*SetOutsideColor: function (element)
{ 
    var parent = element.closest(".tsCarousel--alt-wrapper"), 
        firstColor = element.find(">div > div:first-child").find(".tsHero-inner-item").css('background-color'),
        lastColor = element.find(">div > div:last-child").find(".tsHero-inner-item").css('background-color'),
        newFirstColor = LightenDarkenColor(colorToHex(firstColor), -0.05),
        newLastColor =  LightenDarkenColor(colorToHex(lastColor), -0.05);
                
    parent.find('.tsCarousel--alt-wrapper-first').css('background-color', newFirstColor.length > 6 ? newFirstColor : firstColor);                    
    parent.find('.tsCarousel--alt-wrapper-last').css('background-color', newLastColor.length > 6 ? newLastColor : lastColor);
                
},*/

Remove: function(element, i)
{               
    this.Split(element);
    this.Fix();
    heroArray[i].kill();
    element.data('is-carousel', false);
    if(element.find('.tsCarousel-nav').length > 0)
        element.find('.tsCarousel-nav').remove();
    element.find('.tsCarousel-inner').removeAttr("style");
    element.find('.tsCarousel-inner').children().removeAttr("style");
},

    Add:function(swipeElement, ind) {
        this.Fix();
        this.Merge(swipeElement);
        
        swipeElement.addClass('tsCarousel');
        swipeElement.data('widget-id', ind);
        
        //Variables
        var cssClassPrefix =swipeElement.data('widget-cssclass'), 
            wrap = swipeElement.find('> div'),
            bullets = wrap.find('> div').length,
            name = cssClassPrefix+ind,
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
                disableScroll: false,
                stopPropagation: false,        
                callback: function(index, elem, direction) {
                    var items = $(elem).parent('div').parent('div').find('li');
                    items.removeClass('on');
                    items.eq(index).addClass('on');

                }
                    
            }));



            swipeElement.data('is-carousel', true);
            this.AddBullets(bullets, swipeElement, ind); 
},
Merge: function(carousel)
{   
    var siblingHeros = carousel.closest('.tsCarousel--alt-wrapper').siblings(".tsCarousel");

    if(siblingHeros.length == 0)
        return;

    siblingHeros.each(function(){
        var carouselElement = $(this).find(".tsCarousel-inner > div");
        carousel.find(".tsCarousel-inner").prepend(carouselElement);
    });
    
},
Split: function(carousel)
{
    carousel.find(".tsCarousel-inner > div").removeAttr("style");
    
    var siblingHeros = carousel.closest('.tsCarousel--alt-wrapper').siblings(".tsCarousel");

    if(siblingHeros.length > 0)
    {
        siblingHeros.each(function(){
           var firstInner = carousel.find(".tsCarousel-inner > div:first-child");
           $(this).find(".tsCarousel-inner").prepend(firstInner);
        });

    }
},
AddBullets: function(count, parent, parentIndex)
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
        this.SetBulletsToCenter(list);

        $('.tsCarousel-nav > li').on('click', function(){
            var element = $(this),
            index = element.data('index'),
            parent = element.closest('ul').data('parent');
            heroArray[parent].slide(index, 700);
        });
    }
},
SetBulletsToCenter: function(element){
    var width = element.width();
    element.css('margin-left',  -width/2);
},
SetElementsToMiddle: function(){
    var min = true;
    if(!$('body').hasClass('lt-ie9'))
    {
       min = mediaqueriesMin('mqMedium');
    }
  $('.tsHero-inner-item').each(function(){
       if($(this).hasClass('tsHero-textbox-coloured-left') || $(this).hasClass('tsHero-textbox-coloured-right') || !min)
        {
           $(this).removeAttr('style');
        }
        else
        {
             var height = $(this).height();
            $(this).css('margin-bottom', -height);
            
        }
    });
  },

  //use for 100% heros...

    Fix: function()
    {
        var min = true;
        if(!$('body').hasClass('lt-ie9'))
        {
           min = mediaqueriesMin('mqMedium');
           $('.tsCarousel, .tsCarousel--alt-wrapper').each(function(){
                var allelements = $(this).find('.tsHero-inner-item');
                if(allelements.length > 0)
                { 
                    allelements.css('min-height', highestElement(allelements)); 
                }  
            });
        }
            var elements = $('.tsCarousel').not('.tsCarousel--alt').find('.tsHero-inner-item');
            $(elements).each(function() {        
                var element = $(this),
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

            });
        }
    }
}();

$(document).ready(function() {
    var hCarousels = $("[data-widget=hero-carousel]");
    if(hCarousels.length > 0)
    {
        Carousel.Fix();
        Carousel.Init(hCarousels);
    }
});


