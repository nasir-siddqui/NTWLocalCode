var Refill;

if (typeof Refill === "undefined") {
  Refill = {};
}

Refill = function () {

    // OnInit

    function _init() {

    }

    return {
     AddRefillSlider: function(element, index) {

      var target = element.find('ul');
      if(!$('html').hasClass('lt-ie8'))
      {
        var parent = element.parent(),
        arrowLeft = parent.find('.arrow-left'),
        arrowRight = parent.find('.arrow-right'),
        mask = '.slidermask',              
        bullets = parent.find('.bullets'),
        itemclass ='listItem'+index;

        target.find("li").addClass(itemclass);



        element.responsiveCarousel({
         target : target,
         arrowLeft: arrowLeft,
         arrowRight: arrowRight,
         unitElement: 'li.' + itemclass,
         unitWidth: 'individual',
         mask: mask,        			
         infinite:     false,
         dragEvents :  Modernizr.touch,
         ondragend: function(i){
          Refill.ColorBullets(bullets,target);
        }
      });
        this.AddBulletsToList(bullets, target.find('li').length); 
        

        if(Modernizr.touch)
        {
          var width = window.screen.width > 534 ? (window.screen.width - 110) : (window.screen.width -40);
          parent.find(mask).css('max-width',width + 'px');
        }
        this.ColorBullets(bullets,target);
      }
      else
      {
        var width = 0;
        target.find('li').each(function(){
          width += $(this).width();
        })
        target.css('width', width);
      }
    },
    AddBulletsToList: function(list, length) {            
      for (var i = 0; i < length; i++) {
        list.append('<li data-slide="'+ i +'"></li>')
      };

    },
    ColorBullets: function (bullets, list) {        
      bullets.find('li').removeClass('selected');
      list.find('li').each(function(){
        var maskoffset = list.closest('.tsRefill-list-mask');

        if($(this).offset().left >= maskoffset.offset().left && ($(this).offset().left+$(this).outerWidth()) <= (maskoffset.offset().left + maskoffset.outerWidth()))
        {
          var slideId =$(this).data('slide');
          bullets.find('[data-slide='+slideId+']').addClass("selected");
        }
      });
    },
    CheckObjects: function(){
      if($('[data-widget=slider]').length > 0)
      {
        $('[data-widget=slider]').each(function(index){
          var element = $(this),
          target = element.find('ul'),             
          parent = element.parent(),              
          bullets = parent.find('.bullets');              
          Refill.ColorBullets(bullets, target); 
        })
      }
    }
  }
} ();



$(function () {

 if($('[data-widget=slider]').length > 0)
 {
  $('[data-widget=slider]').each(function(index){
   Refill.AddRefillSlider($(this), index); 
 })
}
});

if(!$('html, body').hasClass('lt-ie9'))
{
  if($('[data-widget=slider]').length > 0)
 {
 window.addEventListener("message", receiveMessage, false);
 
 function receiveMessage(evt) {
     $(".slidermask").css('max-width', evt.data + 'px');
 }
 }
}