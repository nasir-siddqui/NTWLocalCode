var heroArray = [] ;
var istablet = false;    
$(document).ready(function() {
    var hCarousels = $("[data-widget=hero-carousel]");
    if(hCarousels.length > 0)
    {
        addHeroCarousels(hCarousels);
    }
});
function addHeroCarousels(items)
{
    for (var i = 0; i < items.length; ++i) {

        var swipeElement =$(items[i]);
        addCarousel(swipeElement, i);
    }
}
function addCarousel(swipeElement, ind) {
    
    $(swipeElement).addClass('tsCarousel');
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
            addBulletsToSlider(bullets, swipeElement, ind); 
    
}


function addBulletsToSlider(count, parent, parentIndex)
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
        setBulletsToCenter(list);

        $('.tsCarousel-nav > li').on('click', function(){
            var element = $(this),
            index = element.data('index'),
            parent = element.closest('ul').data('parent');
            heroArray[parent].slide(index, 700);
        });
    }
}
function setBulletsToCenter(element){
    var width = element.width();
    element.css('margin-left',  -width/2);
}
function setElementsToMiddle(){
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
  };
  function hCarousel()
 {
    var min = true;
    if(!$('body').hasClass('lt-ie9'))
    {
       min = mediaqueriesMin('mqMedium');
    }
    
     $('.tsHero-inner-item').each(function() {        
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


$(window).on('load orientationchange', function() {
    hCarousel();
});
$(window).on('resize', function() {
    if(!$('body').hasClass('lt-ie9'))
    {
        hCarousel();
    }
});



