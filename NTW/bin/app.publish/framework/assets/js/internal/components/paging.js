/* global mediaqueriesMax:true, hash:true */

var Paging;

if (typeof Paging === "undefined") {
    Paging = {};
}

Paging = function () {
  function addPagingItems(allitems, list) {
    var maxitems = (allitems <= 100 ? allitems : 100),
        showitems = mediaqueriesMax('mqLtSmall') ? 5 : 10,
        page = hash.get().page,
        current = ((typeof page !== 'undefined' && parseInt(page) <= maxitems && parseInt(page) > 1) ? parseInt(page) : 1),
        startitem = Math.max(Math.min((current) - (mediaqueriesMax('mqLtSmall') ? 2 : 5), maxitems - showitems + 1), 1),
        lastItem = startitem + showitems;
    for(var i = startitem; i < lastItem; i++) {
      var cssClass = "";
      if(i === current) {
        cssClass += " selected";
      }
      if(i <= maxitems) {
        if(i === startitem && i !== 1 && !mediaqueriesMax('mqLtSmall')) {
          if(i-1 > 1) {
            list.append('<li class="tsPaging-list-item '+ cssClass +'"><a style="cursor: pointer" data-widget="selectPage" data-widget-page="1">1</a></li>');
          }
          list.append('<li class="tsPaging-list-item"><a style="cursor: pointer" data-widget="selectPage" data-widget-page="' + (i - 1) + '">...</a></li>');
        }
        list.append('<li class="tsPaging-list-item '+ cssClass +'"><a style="cursor: pointer" data-widget="selectPage" data-widget-page="' + i + '">'+ i +'</a></li>');
        if(i === (lastItem-1) && i !== maxitems && !mediaqueriesMax('mqLtSmall')) {
          list.append('<li class="tsPaging-list-item"><a style="cursor: pointer" data-widget="selectPage" data-widget-page="' + (i + 1) + '">...</a></li>');
          if(maxitems > i+1) {
            list.append('<li class="tsPaging-list-item '+ cssClass +'"><a style="cursor: pointer" data-widget="selectPage" data-widget-page="'+maxitems+'">'+ maxitems +'</a></li>');
          }
        }
      }
    }
    var priv = list.siblings('.tsPaging-arrow-prev'),
        next = list.siblings('.tsPaging-arrow-next');

    priv.attr('data-widget-page', (current > 1 ? current - 1 : 1));
    next.attr('data-widget-page', (current < maxitems ? current + 1 : maxitems));

    $('body').off('click', '[data-widget=selectPage]');
    $('body').on('click', '[data-widget=selectPage]', function() {
      var callback = $(this).closest('[data-widget="paging"]').data("callback"),
          page = $(this).data("widget-page");
      Paging.SetPage(page);
      if(typeof callback !== 'undefined') {
        callback = callback.split('.');
        if(callback.length > 1) {
          window[callback[0]][callback[1]]();
        } else {
          window[callback[0]]();
        } 
      }
    });
  }

  return {
    Load: function() {
      if($('[data-widget=paging]').length > 0) {
        $('[data-widget=paging]').each(function(){
          $(this).html('<a class="tsPaging-arrow-prev" style="border-radius: 20px; cursor: pointer" data-widget="selectPage"><i class="tsIcon-Previous"></i></a><ul class="tsPaging-list"> </ul><a class="tsPaging-arrow-next" style="border-radius: 20px; cursor: pointer" data-widget="selectPage"><i class="tsIcon-Next"></i></a>');
        });
      }

      if($('[data-widget=paging]').find('.tsPaging-list').length > 0) {
        $('[data-widget=paging]').find('.tsPaging-list').each(function() {
          var pagesize = $(this).closest('.tsPaging').data('page-size');
          addPagingItems(pagesize, $(this));
        });
      }
    },

    SetPage: function(page) {
      var url = location.href.split('#'),
          savedFlags="";
      if(typeof url[1] !== 'undefined') {
        var flags = url[1].split('&');
        for(var i = 0; i < flags.length; i++) {
          var flag = flags[i].split('=');
          if(flag[0] !== "page" && i !== length-1) {
            savedFlags+="&"+flags[i];
          }
        }
      }
      location.hash = "page=" + page + savedFlags;
    }
  };
}();

$(document).ready(function() {
  Paging.Load();
});

