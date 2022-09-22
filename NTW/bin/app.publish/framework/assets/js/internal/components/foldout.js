var foldoutIsOpen   = false,
    openLock        = false,
    viewport        = 'xsmall';

$(document).ready(function() {
  $('[data-widget=foldout]').on('click', '[data-js=foldout-item]', function(e) {

    // Stop the browser from following the link
    e.preventDefault();
    
    if (openLock && $('.lt-ie9').length == 0) return false;
    
    if (Modernizr.mq('(min-width: 31em)')) viewport = 'small';
    if (Modernizr.mq('(min-width: 44em)')) viewport = 'medium';
    if (Modernizr.mq('(min-width: 56em)')) viewport = 'large';

    var indexToInsert = 0,
    clickedItem = $(this),
    clickedItemIndex = clickedItem.index(),
    list = clickedItem.parent(),
    listItems = list.children();

    // Identify where to insert the foldout
    listItems.each(function() {
      var thisItem = $(this);
      if (thisItem.index() > clickedItem.index()) {
        if (thisItem.offset().top > clickedItem.offset().top) {
          if (indexToInsert == 0) {
            indexToInsert = thisItem.index();
          }
        }
      } 
    });

    // Foldout HTML
    var foldoutImg = clickedItem.find('a').attr('href');
    var foldoutContent = clickedItem.find('[data-js="content"]');
    var foldoutHtml = '<li class="tsFoldout is-collapsed" data-js="foldout" aria-expanded="false" data-itemexpanded="' + clickedItemIndex + '">';

    if(foldoutContent.length > 0) {
      foldoutHtml += foldoutContent.html();
    } else {
      foldoutHtml += '<div class="tsFoldout-Inner">';
      foldoutHtml += '<b class="tsFoldout-Close" data-js="foldout-close">X</b>';
      foldoutHtml += '<img class="tsFoldout-img" src="' + foldoutImg + '">';
      foldoutHtml += '</div>';
    }
    foldoutHtml += '</li>';

    var $foldoutObj = $(foldoutHtml);
    // Find opened foldout
    var openFoldouts = list.find(".tsFoldout");

    // If a foldout is opened
    if (openFoldouts.length > 0) {
      var $existingFoldout = $(openFoldouts[0]),
      expandedItem = list.find('[data-js=foldout-item].is-expanded'),
      expandedItemIndex = $existingFoldout.data('itemexpanded');

      if (clickedItem.hasClass('is-expanded')) {
        openLock = true;
        $existingFoldout.slideUp(500, function() {
          $(this).remove();

          foldoutIsOpen = false;
          openLock = false;
        });
        clickedItem.removeClass('is-expanded');
        return;
      }

      if (parseInt($(listItems[expandedItemIndex]).offset().top) == parseInt(clickedItem.offset().top)) {
        if(clickedItem.find('.tsFoldout--channel, .tsProductItem--movie').length <= 0) {
          $existingFoldout.find('.tsFoldout-img').fadeOut(300, function() {
            expandedItem.removeClass('is-expanded');
            $(this).attr('src', foldoutImg);
            checkImageHeight($(this));
            $(this).fadeIn(500, function() {
              clickedItem.addClass('is-expanded');
            });
          });
        } else {
          $existingFoldout.find('.tsFoldout--channel, .tsProductItem--movie').fadeOut(500, function() {
            clickedItem.addClass('is-expanded');
            $existingFoldout.html(clickedItem.find('[data-js="content"]').html());
            $existingFoldout.find('.tsFoldout--channel, .tsProductItem--movie').fadeIn(500, function() {
              expandedItem.removeClass('is-expanded');
            });
          });
        }
        $existingFoldout.attr('data-itemexpanded', clickedItemIndex);
        $existingFoldout.show().removeClass('is-collapsed').removeClass('visuallyhidden').addClass('is-expanded');
      } else {
        // If the clicked item is NOT on the same row as the expanded
        expandedItem.removeClass('is-expanded');
        $existingFoldout.slideUp(300, function() {
          $(this).attr('aria-expanded', 'false');
          $(this).removeClass('is-expanded').addClass('is-collapsed');
          expandedItem.removeClass('is-expanded');
          $existingFoldout.find('.tsFoldout-img').attr('src', '');
          $(this).remove();
        });
        // Insert the foldout element into the list at the identified position,
        // or last if it's the last row
        if (indexToInsert > 0) {
          $(listItems[indexToInsert]).before($foldoutObj);
        } else {
          list.append($foldoutObj);
        }

        if (Modernizr.csstransitions) {
          // Show the foldout and let CSS transition affect the height
          $foldoutObj.hide(function() {
            $(this).removeClass('is-collapsed visuallyhidden').addClass('is-expanded');
            $(this).attr('aria-expanded', 'true');
            clickedItem.addClass('is-expanded');
            $(this).show();
            checkImageHeight($(this).find('.tsFoldout-img'));
          });
        } else {
          // If no css transitions, slide it in with jquery
          $foldoutObj
          .removeClass('is-collapsed visuallyhidden')
          .addClass('is-expanded')
          .attr('aria-expanded', 'true');
          clickedItem.addClass('is-expanded');
        }
      }
    } else { // If no foldout is open    
      // Insert the foldout element into the list at the identified position,
      // or last if it's the last row
      var collapsed = $(this).closest('[data-widget=collapse]').attr('aria-expanded');
      if(collapsed === 'false'){
      togglecollapse($(this).closest('[data-widget=collapse]'));
      }

      if (indexToInsert > 0) {
        $(listItems[indexToInsert]).before($foldoutObj);
      } else {
        list.append($foldoutObj);
      }

      if (Modernizr.csstransitions) {
        // Show the foldout and let CSS transition affect the height
        $foldoutObj.hide(function() {
          $(this).removeClass('is-collapsed').removeClass('visuallyhidden').addClass('is-expanded');
          $(this).attr('aria-expanded', 'true');
          clickedItem.addClass('is-expanded');
          $(this).show();
          checkImageHeight($(this).find('.tsFoldout-img'));
        });
      } else {
        $foldoutObj.hide();
        $foldoutObj.removeClass('is-collapsed').addClass('is-expanded');
        $foldoutObj.attr('aria-expanded', 'true');
        clickedItem.addClass('is-expanded');
        $foldoutObj.removeClass('visuallyhidden').slideDown(300, function() {
          if(clickedItem.find('.tsFoldout--channel, .tsProductItem--movie').length <= 0) {
            checkImageHeight($(this).find('.tsFoldout-img'));
          }
        });
        
      }

      openLock = true;
      setTimeout(function() {
        foldoutIsOpen = true;
        openLock = false;
      }, 300);
    }
     //scroll to top depending on window height
    setTimeout(function(){
      //if the clicked item is of the channel type, and the foldout list is not larger than the window height, and window width is larger than 410 ,the parent (the foldout list) will b scrolled to the top
      if(window.innerWidth > 410 && list.height() < window.innerHeight && clickedItem.find('.tsFoldout--channel').length > 0){
        $('html, body').animate({
          scrollTop:  $(list).offset().top
        }, 500);   
      //if each element is smaller than 25% of the window height, and the window with is larger than 410, the row above the clicked item will be scrolled to the top
      }else if(window.innerWidth > 410 && $(clickedItem).height() < (window.innerHeight)*0.25){
        $('html, body').animate({
          scrollTop:  ($(clickedItem).offset().top)-($(clickedItem).height())
        }, 500);
      // if its not a channel list and the elements are larger than 25% of the window height, the clicked item will be scrolled to the top
      }else{
        $('html, body').animate({
          scrollTop:  $(clickedItem).offset().top
        }, 500);
      }
    }, 300);
    
  });


  $(document).on('click', '[data-js=foldout-close]', function(e) {
    e.preventDefault();
    var foldoutItems = $(this).parents('[data-js=foldout]');
    $foldoutItem = $(foldoutItems[0]);        

    var list = $foldoutItem.parent();
    var expandedItem = list.find('[data-js=foldout-item].is-expanded');        
    $foldoutItem.slideUp(500, function() {
      $(this).attr('aria-expanded', 'false');
      $(this).removeClass('is-expanded').addClass('is-collapsed');
      expandedItem.removeClass('is-expanded');
      $foldoutItem.find('.tsFoldout-img').attr('src', '');

      $(this).remove();
    });
  });

  $(document).on('click', function(e) {
    if(foldoutIsOpen){
      if ($(e.target).closest('[data-widget="foldout"]').length <= 0) {
        openLock = true;
        $('[data-js="foldout"]').slideUp(500, function(){
          $(this).remove();
          openLock = false;
        });
        $('[data-js="foldout-item"].is-expanded').removeClass('is-expanded');
      }
    }
  });

  $(window).on('resize', function() {
    if(foldoutIsOpen) {
      newViewport = false;
      switch (viewport) {
        case 'xsmall':
        if (!Modernizr.mq('(max-width: 30.99em)')) newViewport = true;
        break;
        case 'small':
        if (!Modernizr.mq('(min-width: 31em) and (max-width: 43.99em)')) newViewport = true;
        break;
        case 'medium':
        if (!Modernizr.mq('(min-width: 44em) and (max-width: 55.99em)')) newViewport = true;
        break;
        case 'large':
        if (!Modernizr.mq('(min-width: 56em)')) newViewport = true;
        break;
      }

      if(newViewport) {
        if (Modernizr.mq('(max-width: 30.99em)')) viewport = 'xsmall';
        if (Modernizr.mq('(min-width: 31em)')) viewport = 'small';
        if (Modernizr.mq('(min-width: 44em)')) viewport = 'medium';
        if (Modernizr.mq('(min-width: 56em)')) viewport = 'large';

        openLock = true;
        $('[data-js="foldout"]').slideUp(500, function() {
          $(this).remove();
          openLock = false;
        });
        $('[data-js="foldout-item"].is-expanded').removeClass('is-expanded');
      }
    }
  });
});

function checkImageHeight($img) {
  var diff = $img.parent().height() - $img.height();
  $img.css('margin-top', diff/2);
}