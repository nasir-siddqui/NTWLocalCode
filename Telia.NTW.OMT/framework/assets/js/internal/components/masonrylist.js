 /* global Masonry:true, checkBrowser:true, Modernizr:true */

 var MasonryList;

 if (typeof MasonryList === "undefined") {
  MasonryList = {};
}

MasonryList = function () {
  //Move fullsize elements if has position 0,1,2
  var checkMasonryElements = function(element)  {
    var type = element.get(0).tagName.toLowerCase() === "ul" ? "li" : "div",
    children = element.children(type);

      //Check if child 0,1,2 hasclass fullsize
      //if has, move element to at least position 4
      children.each(function(index) {
        if(index !== 0) {
          if($(this).is('[class$="--fullsize.show"]')) {
            $(this).insertAfter(children.eq(3));
          }
          if (index === 2) {
            return false;
          }
        }
      });
      addMasonry(element);    
    };

  //Adding masony to list
  var addMasonry = function(element) {
    var con = element[0];
    var items = element.data('itemselector');
    var margin = 0;

    ///TODO-Fix this look at browsersupport
    var bSupport = checkBrowser().split('|'),
        browser = bSupport[0],
        version = bSupport[1];
    bSupport = (browser === 'Explorer' && version < 9) || (!Modernizr.touch && browser === 'Safari');

    if(bSupport) {
      margin = getStaticMargin(element, items);
    }

    if($(items).length < 1) {
      items = '.tsFilter-noElementsFoundText';
    }

    if(!$('body').hasClass('lt-ie8')) {
      /*
      $(element).masonry({
          itemSelector: items,
          gutter: margin
      });
      var msnry = $(element).data('masonry');
      */
      var msnry = new Masonry(con, {
        itemSelector: items,
        gutter: margin
      });
      if(bSupport) {
        msnry.bindResize();
      }
      window.msnry = msnry;
    }
  };

  var getStaticMargin = function (element,items) { 
    var margin = 0;
    var it = element.find(items);
    it.css({'margin-left': '', 'margin-right': ''});
    margin = (element.outerWidth() * 0.01515)*2;
    return margin;
  };

  /*var updateMargin = function(){
    if($("[data-visual=masonry]").length > 0)
    {
      $("[data-visual=masonry]").each(function(){
        var items = $(this).data('itemselector');
        getStaticMargin($(this), items);
      });
    }
  };*/

  return {
    Add: function(element) {
        //var selector = element.data('itemselector').replace('.show','');
        //var items = element.find(selector);

        setTimeout(function() { 
          checkMasonryElements(element);
        }, 500); 
      },

      RearrangeList: function(list) {
        setTimeout(function() {
          checkMasonryElements(list);
        }, 50);
      }
    };
  }();

  $(window).load(function(){
    if($("[data-visual=masonry]").length > 0) {
      $("[data-visual=masonry]").each(function() {
       MasonryList.Add($(this));
     });
    }
  });
