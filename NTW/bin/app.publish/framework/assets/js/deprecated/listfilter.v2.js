//Global variables
var ListFilter,
limitedFilter = {},
multiFilter = {};

if (typeof ListFilter === "undefined") {
  ListFilter = {};
}
ListFilter = function () {

    // OnInit

    function _init() {


    }

    return {
      //Add filter html from
      FilterString:function (index){
        var htmlString = '<div class="tsListFilter-collapse is-collapsed" data-index="'+index+'"';
        htmlString += 'data-widget="collapse" aria-expanded="false" data-widget-showtext="" data-widget-hidetext="">';
        htmlString += '<div class="tsListFilter-trigger">';
        htmlString += '<div data-widget-control="collapse-trigger">Filtrera denna lista <i class="tsIcon-Filter"></i></div>';
        htmlString += ' </div><div class="tsListFilter-outer" data-widget-collapse="inner">';
        htmlString += '<div class="tsListFilter tsWrapInner" data-widget="listFilter"></div></div></div>';
        return htmlString;
      },
    //Add sorting html
    SortingString: function(sortingList, index){
      var htmlString  = '<div class="tsListFilter-sorting"><div data-widget="selectList-wrap">';
      htmlString += '<a class="tsListFilter-sorting-trigger" data-widget="selectList-trigger" >';
      htmlString += 'Sortera lista<i class="tsIcon-Sort"></i></a>';
      htmlString += '<ul class="tsSelectList hide" data-widget="selectList" data-extra-top="10">';
      for(var key in sortingList) {
        htmlString += '<li class="tsSelectList-item" >';
        htmlString += '<label ><input type="checkbox" data-callback="" data-widget="selectList-sorting-item" data-widget-index="'+index+'" value="' + key + '" name="sorting"/>'+sortingList[key]+'</label></li>'; 
      };
      htmlString += '</ul></div></div>';
      return htmlString;
    },
    SearchString: function(index) {

      var htmlString  = '<div class="tsListSearch"><input data-widget="listsearch" placeholder="Sök i listan" data-visual=placeholder type="search" name="listsearch" data-index="'+index+'" /></div>';
      return htmlString;
    },
    //Add filters to listFilter
    Selctlist: function(thiselement,list, index) {
      var type =  list[2],
      i = 0, 
      thisList = list[1][0], 
      keys = checkIfArrayHasKeys(thisList),
      parent = thiselement.siblings().find('[data-widget=listFilter]'),
      htmlString = '<span class="tsSelectList-question">' + list[0] +"</span>";
      htmlString+= '<div data-widget="selectList-wrap">';
      htmlString+= '<a class="tsBtnMulti--filter" data-widget="selectList-trigger" >'+ thisList[keys[0]] +'</a>';
      htmlString+= '<ul class="tsSelectList hide" data-widget="selectList" data-widget-selectid="'+index+'">';


      for (var i = 0; i < keys.length; i++) {

        var thisKey = keys[i],
        thisValue = thisList[thisKey];  

        cssClass = i == 0 ? '' : '';
        cleanContentResult = i == 0? 'default' : ListFilter.CleanContent(thisKey);

        if(type == 'single' || i > 0)
        {
          htmlString += '<li class="tsSelectList-item ' + cssClass + '" >';
          htmlString += '<label><input type="checkbox" data-widget-type="'+type+'" data-widget-index="'+index+'" data-widget="selectList-item" value="' + cleanContentResult + '" name="'+name+'"/>'+ thisValue +' </label></li>';
        }

      };  

      htmlString += '</ul></div>';
      if(list[3]!=undefined && list[3].length > 0)
        htmlString += '<span class="tsSelectList-question">' + list[3] + '</span>';
      parent.append(htmlString);

    },    
      //Sets the absolute position to selectLists
      SetSelectListPositions: function(){
        var outerWidth = outerWidth = $('.tsListFilter-outer').width();
        $('[data-widget=selectList-wrap], .tsSelectList-wrap--alt').each(function(){
          var list = $(this).find("ul"),
          listWidth = list.width()/2;
          list.css("margin-left", -listWidth);

          var widest = widestElement(list.find('label'));
              
          /*
          if(widest > outerWidth)
          {
              list.width(outerWidth + 'px');
          } 
          else   
          {
            list.width(widest + 'px');
          }*/
        });
      },
    //Removes filtervalues from selected filter
    Remove: function(value, type, key, hashkey, selectkey, parentoffset) {

      var thisSelectKey = key +'-'+ selectkey;

      if(type == "limited" || type == "single") {
        var arr = limitedFilter[key];
        var index;
        if (!Array.prototype.indexOf) {
          index = indexof(arr, value);
        }
        else
        {
          index = arr.indexOf(value);
        }
        
        if(index > -1)
          arr.splice(index, 1);

        limitedFilter[key] = arr;
        this.AddOrRemoveHash(arr, key, type, parentoffset.top);
      }
      else {
        var arr = multiFilter[thisSelectKey];
        if (!Array.prototype.indexOf) {
          index = indexof(arr, value);
        }
        else
        {
          index = arr.indexOf(value);
        }
        if(index > -1)
          arr.splice(index, 1);

        if(arr.length > 0)
        {
          multiFilter[thisSelectKey] = arr;
        }
        else
        {
          delete multiFilter[thisSelectKey];
        }
        this.AddOrRemoveHash(arr, hashkey+'-'+selectkey, type, parentoffset.top);
      }
    },
    //Add value to selected filter
    Add: function (value, type, element) {
      var collapse = element.closest(".tsListFilter-collapse"), 
      key =  collapse.data('index'),
      selectkey = element.closest("ul").data('widget-selectid'),
      hashkey =  collapse.next('[data-widget=filter]').data('filter-id'),
      thisSelectKey = key +'-'+ selectkey,
      parentoffset = element.closest(".tsProductListContainer--alt").offset();  

      if(type == "limited")
      {
        var arr = limitedFilter[key];
        if(arr==undefined)
        {
          arr = [];
        }
        arr.push(value);
        limitedFilter[key] = arr;
        ListFilter.AddFilterTab(element,value, type);
        this.AddOrRemoveHash(arr, hashkey, type,parentoffset.top);
      }
      else if(type == "multi")
      {
        var arr = multiFilter[thisSelectKey];
        if(arr==undefined)
        {
          arr = [];
        }
        arr.push(value);
        multiFilter[thisSelectKey] = arr;
        ListFilter.AddFilterTab(element,value, type);
        this.AddOrRemoveHash(arr, hashkey+ '-'+ selectkey, type,parentoffset.top);
      }
      else
      {
        ListFilter.AddOrRemoveValue(limitedFilter,element, value, key, hashkey,parentoffset.top);   
      }
    },
    AddOrRemoveValue: function(filter, element, newValue, key, hashkey,parentoffset){
      var arr = filter[key];
      if(arr == undefined)
        arr = [];

      var parentList = element.closest('ul');
      currentValueElement = parentList.siblings('[data-widget=selectList-trigger]'),
      value = currentValueElement.attr('value'),
      index = -1;

      if (!Array.prototype.indexOf) {
        index = indexof(arr, value);
      }
      else
      {
        index =  arr.indexOf(value);
      }


      if(index > -1)
      {   
        arr.splice(index, 1);
      }
      if(newValue != "default")
      {
        arr.push(newValue);
        ListFilter.SetSelctedValueAndDisable(newValue, element, currentValueElement, parentList);
      }
      filter[key] = arr;

      currentValueElement.attr('value', newValue);
      
      this.AddOrRemoveHash(arr, hashkey, "single",parentoffset);

    },
    AddOrRemoveHash: function(array, key, type, parentoffset)
    {
      var thispos = window.pageYOffset;
      var newarray = [];
      if(type == "single")
        type= "limited";

      hash.remove(type + "-" + key);
      if(array.length > 0)
      {
        newarray[type + "-" + key] = this.HashString(array);;
        hash.add(newarray);
      }

      scrollToElement(parentoffset, thispos);

    },
    HashString: function(array) {
      var hashString = "";
      $.each(array, function(i){
        if(array[i] !== "" && array[i] !== null)
        {
          hashString += array[i];
          if(i != (array.length-1))
          {
            hashString += "|";
          }
        }
      });
      return hashString;

    },
    FilterOnHash: function() {
      var hashString = hash.get(),
      hasKeys = 'keys' in Object.prototype ? Object.keys(hashString).length > 0 : checkIfArrayHasKeys(hashString);

      if($('[data-widget=listFilter]').length > 0)
      {
        $('[data-widget=listFilter]').each(function(){

          var filterlist = $(this).closest('.tsListFilter-collapse').next('[data-widget=filter]'),
          filter = $(this),
          callback = filterlist.data("item-callback"),
          id = filterlist.data('filter-id');    
          if(hasKeys)
          { 
            var keys = checkIfArrayHasKeys(hashString, "multi-" + id);
            if(keys!=undefined)
            {
              for (var i = 0; i < keys.length; i++) {
                var multi = hashString[keys[i]];
                if(multi!=undefined)
                {
                  multi = multi.split('|')
                  $.each(multi, function(j){                                
                    ListFilter.CheckAndSetValue(multi[j], filter);
                  }); 
                }
              };
            }
            var limited = hashString["limited-" + id];                      
            
            if(limited!=undefined)
            {
              limited = limited.split('|')
              $.each(limited, function(i){                
                ListFilter.CheckAndSetValue(limited[i], filter);
              }); 
            }

            ListFilter.FilterItems(filterlist, callback);
            if(multi != undefined || limited!=undefined)
              ListFilter.ToggleFilter(filter);

          }
          else
          {
            var list = filterlist.find(filterlist.data('listtype'))[0],
            items = $(list).children();

            items.addClass("show");
          }
        });
}

if($('[data-sorting=true]').length > 0)
{
  $('[data-sorting=true]').each(function(){

    var filterlist = $(this),
    id = filterlist.data('filter-id'),
    callback = filterlist.data("item-callback"),  
    sort = hashString["sorting-" + id];
    if(sort != undefined) {
      if(!hasKeys)
        return

      var element = filterlist.siblings(".tsListFilter-trigger-outer").find('input[value='+sort+']'),
      parentList = element.closest('ul'),
      currentValueElement = parentList.siblings('[data-widget=selectList-trigger]');                

      ListFilter.SetSelctedValuesToSelectbox(sort[0], element, currentValueElement, parentList);
      ListFilter.SortItems(sort, filterlist, "productlistAlignment");

    }
  });
}
var keys =hash.get('prev');
if(!hasKeys || hasKeys.length == 0 || (hasKeys.length > 0 && (keys!=undefined || keys.length > 0)))
{
  $("[data-visual=productList]").each(function() {
    var items = $(this).find("li.tsProductList-Item");
    items.addClass("show");
  });
  $("[data-visual=masonry]").each(function(){
    var items = $(this).find(".tsFluidGrid-item");
    items.addClass("show");
  });
    $(".tsLibrary-small").each(function(){
    var items = $(this).find("> li");
    items.addClass("show");
  });          
}

},
ToggleFilter: function(filter){
  togglecollapse(filter.closest('[data-widget=collapse]'));
},
CheckAndSetValue:function(value, filter){

  var listsItems = filter.find('input[value="'+value+'"]');
  listsItems.each(function(){
    var type = $(this).data('widget-type');
    ListFilter.Add(value,type,$(this)); 
  });

},
SetSelctedValuesToSelectbox: function(value, element, currentValueElement, parentList) {

  parentList.find('li.hide').removeClass('hide');
  element.addClass('hide');     
  var icon = currentValueElement.find("i");     
  currentValueElement.html(element.closest('label').text()).append(icon);


      //ListFilter.SetSelectListPositions();
    },
    SetSelctedValueAndDisable: function(value, element, currentValueElement, parentList) {

      parentList.find('li.hide').removeClass('hide');
      element.addClass('hide');     

      currentValueElement.html(element.closest('label').text() + '<i class="tsIcon-Close"></i>');
      currentValueElement.addClass("tsBtn--filter-remove");
      currentValueElement.attr('data-disable', 'true');
      parentList.addClass('disabled');

    },
    EnableSelectBox: function(element) {

      var list = element.siblings('[data-widget=selectList]'),
      defaultElement =  list.find('[value=default]');

      ListFilter.Add(defaultElement.val(), "single", defaultElement);

      element.removeClass("tsBtn--filter-remove");      
      element.attr('data-disable', 'false');
      element.removeClass("active");
      element.html(defaultElement.closest('label').text());
      list.removeClass('disabled').addClass("hide");

      //Add fitler (hide) to Itemlist
      var productList = list.closest('[data-widget="collapse"]').siblings('[data-widget="filter"]');
      ListFilter.FilterItems(productList, productList.data('item-callback'));
      
      callback = productList.data('callback');
      if(callback!=undefined)
      {
        window[callback](productList);
      }
      
    },
    //Add filtertab before selected fitler list
    AddFilterTab: function(element, value, type) {
      var prefix = type=="limited" ? and : or; 
      var selectedFilter = element.closest('[data-widget=selectList-wrap]');
      selectedFilter.before('<a class="tsBtn--filter-remove" data-widget="remove-filter" data-widget-type="'+type+'" name="'+value+'">' + element.closest('label').text() +'<i class="tsIcon-Close"></i> </a> <span class="tsFilter-prefix">'+prefix+'</span>');
      ListFilter.HideTabFromselectList(element);

    },

    //Hide selected value in selected filter list

    HideTabFromselectList: function(element){
      element.closest('li').addClass('hide');
      ListFilter.CheckIfSelectListHaveSelecableElements(element.closest('ul'));
    },

    //Remvoves selected fitler tab
    RemoveFilterTab: function(element, value, filterlist) {
      ListFilter.ShowTabInselectList(element, value);
      var prev = filterlist.prev(".tsListFilter-collapse"),
      key =  prev.data('index'),
      hashkey = prev.next('[data-widget=filter]').data('filter-id');  
      callback = filterlist.data('item-callback'),
      selectkey = element.nextAll('[data-widget="selectList-wrap"]').eq(0).find('ul').data('widget-selectid'),
      parentoffset= element.closest(".tsProductListContainer--alt").offset();     

      ListFilter.Remove(value, element.data('widget-type'), key, hashkey, selectkey, parentoffset);
      element.next('span').remove();
      element.remove();
      ListFilter.FilterItems(filterlist, callback);
      
    },

    //Show selected tab in filter list OBS! Catch value error on & sign
    ShowTabInselectList: function(element, value){
      var parentElement = element.next().next().find('input[value='+value+']');
      parentElement.removeAttr('checked');
      parentElement.closest('li').removeClass('hide');
      ListFilter.CheckIfSelectListHaveSelecableElements(parentElement.closest('ul'));
    },

    //Hides/shows filter list if has values
    CheckIfSelectListHaveSelecableElements: function(list){
      var elements = list.find('li'),
      hiddenElements = list.find('li.hide'),
      parent = list.closest('[data-widget="selectList-wrap"]'),
      trigger = parent.find('[data-widget="selectList-trigger"]');

      if(elements.length == hiddenElements.length)
      {
        parent.addClass('hide');
        trigger.addClass('hide');
        parent.prev('span').addClass('hide');
      }
      else
      {
        parent.removeClass('hide');
        trigger.removeClass('hide');
        parent.prev('span').removeClass('hide');
      }
    },
    // Hide/shows items depending on filter
    FilterItems: function(filterlist, callback) {
      var list = filterlist.find(filterlist.data('listtype'))[0],
      items = $(list).children(), 
      filterindex = filterlist.prev('.tsListFilter-collapse').data('index'), 
      thislimitedFilter = limitedFilter[filterindex],
      thismultiFilter = [],
      noElementsFoundText = window["noElementsFoundText"+filterlist.data("filter-id")];

      var keys = checkIfArrayHasKeys(multiFilter);

      for (var i = 0; i < keys.length; i++) {
        if(keys[i].charAt(0) == filterindex){
          thismultiFilter.push(multiFilter[keys[i]]);
        }
      };

      if(thislimitedFilter ==undefined)
      {
        thislimitedFilter=[];
      }

      items.each(function() {
        var filterData =ListFilter.CleanContent($(this).data('filtertags'));
        var itemFilter = [];
        if(filterData!=undefined)
        {
          itemFilter = filterData.split('|');
        }
        var limitedTemp = [];
        var multiTemp = [];
        
        for (var i = 0; i <thislimitedFilter.length; i++) {
          if($.inArray(thislimitedFilter[i], itemFilter)> -1)
          {
            limitedTemp.push(thislimitedFilter[i]);       
          }
        };

        for (var i = 0; i < thismultiFilter.length; i++) {
          for (var j = 0; j < thismultiFilter[i].length; j++) { 
            if($.inArray(thismultiFilter[i][j], itemFilter) > -1 )
            {
              multiTemp.push(true);
              break;
            }
          }
        };
        
        var isTheSame = ListFilter.Comp(limitedTemp, thislimitedFilter);

        if((isTheSame && multiTemp.length == thismultiFilter.length) || (isTheSame && thismultiFilter.length == 0))
        {
            //$(this).removeClass('hide');  Use
            $(this).addClass('show');
          }
          else
          {
            $(this).removeClass('show');  
            //$(this).addClass('hide'); Use
          } 
        });

          ListFilter.NoItemsFound(list, items, filterlist, noElementsFoundText);


if(callback != undefined)
{
  callback = callback.split('.');
  callback.length > 1 ? window[callback[0]][callback[1]](list): window[callback[0]](list);

}
},
SortItems: function(value, parent, callback) {

  var p = parent.find(parent.data('listtype'))[0],
  items = $(p).children(),  
  splitedValue = value.split('-'),
  order = splitedValue.length > 1 ? splitedValue[1] : "asc";  

  items.tsort('',{data:'sorting-'+splitedValue[0] , order: order });

  if(callback != undefined)
  {
    callback = callback.split('.');
    callback.length > 1 ? window[callback[0]][callback[1]](parent) : window[callback[0]](parent);

  }
},
SearchItems: function(value, parent, type) {

  var list = parent.find(type).eq(0);
      items = list.prop('tagName') == 'ul' ? list.find('li') : list.children();
      noElementsFoundText = window["noElementsFoundText"+parent.data("filter-id")];


  var timer =0;
  items.each(function(i){

    var tag = $(this).data('sorting-name');
    var pattern = new RegExp(/^value/i);
    pattern = pattern.source.replace('value', value);

    timer = timer + 20;

    if(tag.match(pattern)) {
      $(this).addClass('show');
    }
    else {
     $(this).removeClass('show');
   }
 });
  
  ListFilter.NoItemsFound(list, items, parent, noElementsFoundText);
/*
  var collapse = parent.find('[data-widget="collapse"]')
  if(collapse.hasClass('is-collapsed'))
  {
    togglecollapse(collapse);
  }*/
},

RemoveSpaces: function(content){
  content = content.replace(/\s/g, "");
  return content;
},

    //Cleans filter values from space, åäö 
    CleanContent: function(content) {
      if(content!= null)
      {
        content = content.toLowerCase();
        content = content.replaceAll('å','a');
        content = content.replaceAll('ä','a');
        content = content.replaceAll('ö','o');        
        content = ListFilter.RemoveSpaces(content);
      }
      return content;
    },

    //check if filterarrays is the same
    Comp: function(temp, pfilter)
    {
      temp.sort();
      pfilter.sort();
      return temp.join() === pfilter.join();
    },
    CheckCookie: function(){

      var cookie = getCookie("showFilterHint");
      if(!cookie && cookie!=undefined)
      { 
        if($('[data-widget=filter]').length > 0)
        {
        //Add filter before itemlist
        $('[data-widget=filter]').each(function(index){
          var trigger = $(this).closest('.tsProductListContainer--alt, .tsProductListContainer').find('[data-widget-control="collapse-trigger"]');
          trigger.click();
          setTimeout(function() {
            trigger.click();
          }, 500);
        });
      }     
      addCookie("showFilterHint", true, 7);
    }

  },

  AddNewFilterItem: function  (thiselement) {
    var element = thiselement.find("input"),        
    type = element.data('widget-type'),
    filterlist = element.closest('.tsListFilter-collapse').next('[data-widget=filter]');
    callback = filterlist.data('item-callback'),
    list = filterlist.find();

      //Add remove filter
      ListFilter.Add(element.val(), type, element);

      //Add fitler (hide) to Itemlist
      ListFilter.FilterItems(filterlist,callback);

      //Closes active fitlerlist
      element.closest('ul').addClass('hide');

      callback = filterlist.data('callback');
      if(callback != undefined)
      {
        callback = callback.split('.');
        callback.length > 1 ? window[callback[0]][callback[1]](filterlist) : window[callback[0]](filterlist);

      }
    },
    Sort: function(element)
    {
      var value = element.val(),
      parentList = element.closest('ul'),
      currentValueElement = parentList.siblings('[data-widget=selectList-trigger]'),
      callback = element.data("callback"),
      sortList = element.closest('.tsListFilter-collapse, .tsListFilter-trigger-outer').next('[data-sorting="true"]'),
      key = sortList.data("filter-id"),
      parentoffset = element.closest(".tsProductListContainer--alt").offset();

      var arr = []; 
      arr.push(value);  
      ListFilter.SetSelctedValuesToSelectbox(value, element, currentValueElement, parentList, parentoffset);
      ListFilter.AddOrRemoveHash(arr, key, "sorting");
      ListFilter.SortItems(value, sortList);

      callback = sortList.data('callback');
      if(callback != undefined)
      {
        callback = callback.split('.');
        callback.length > 1 ?window[callback[0]][callback[1]](parentList) : window[callback[0]](parentList);

      }
    },

    NoItemsFound:function(list, items, parentList, noElementsFoundText)
    {
      var hiddenItems = $(list).children().not('.show');

     if(items.length == hiddenItems.length){
        if(parentList.find('.tsFilter-noElementsFoundText').length < 1)
          parentList.find('> div').prepend('<p class="tsFilter-noElementsFoundText">'+noElementsFoundText+'</p>')
      }  
      else
      {
        parentList.find('.tsFilter-noElementsFoundText').remove();
      }
    },

    InitFilter:function (){
    //Close all selectboxes on body click
    $('body').click(function(){   
      var list = $('.tsSelectList');
      list.addClass('hide');
      list.siblings("a").removeClass("active");
    });

    var filters = $('[data-widget=filter]'),
    sortings = $('[data-sorting="true"]'),
    searchs  = $('[data-listsearch="true"]');

    if(filters.length > 0) {
      //Add filter before itemlist
      filters.each(function(index){

        var filter = $(this),
        filterid = filter.data('filter-id');

        if (filterid!=undefined) {

          var htmlFilterString = ListFilter.FilterString(index);

          filter.before(htmlFilterString);
          //showElemets($(this));

          var thisFilter = window["filters"+filterid];
          if(thisFilter != undefined)
          {
            //Add filter for each list in filters array
            for (var i = 0; i < thisFilter.length; i++) {
              if(thisFilter[i] != undefined)
                ListFilter.Selctlist(filter, thisFilter[i], i);
            };
          }
         /* if(filter.data("sorting") == undefined || filter.data("sorting")===false)
          {
            var parent = filter.parent();
            parent.prepend('<div class="tsListFilter-trigger-outer"></div>');
            parent.find(".tsListFilter-trigger-outer").addClass("tsSolo");
            filter.siblings().find('.tsListFilter-trigger').addClass("tsSolo");

          }*/
        }
        else
        {
          console.log("Data-attr: filter-Id not found!");
        } 
      });

        if(!$('body').hasClass('lt-ie9'))
        {
          $('[data-widget="listFilter"]').on('change','label', function(e) {
            ListFilter.AddNewFilterItem($(this));
          });
          $('body').on('click', '[data-widget=selectList-sorting-item]', function(e){
            e.stopPropagation();
            ListFilter.Sort($(this));
          });
        }
        else
        {
          //FIX for <= ie8
          $('[data-widget="listFilter"]').on('click','label', function(e) {
            ListFilter.AddNewFilterItem($(this));
          });
          $('.tsListFilter-sorting').on('click', 'label', function(e){
            e.stopPropagation();
            ListFilter.Sort($(this).find("input"));
          });
        }

        //Removes filter on click 
        $('[data-widget="listFilter"]').on('click', '[data-widget=remove-filter]', function(e){
          e.stopPropagation();
          var filterlist = $(this).closest('.tsListFilter-collapse').next('[data-widget=filter]');
          ListFilter.RemoveFilterTab($(this), $(this).attr('name'), filterlist);
          var callback = filterlist.data('callback');
          if(callback != undefined)
          {
            callback = callback.split('.');
            callback.length > 1 ?  window[callback[0]][callback[1]](list) : window[callback[0]](list);

          }
        });



        $('body').on('click', '[data-disable="true"]', function(e){
          ListFilter.EnableSelectBox($(this));
        });
    }
      
      //Region sort
      if(sortings.length > 0) {
        sortings.each(function(){

          var sorting = $(this),
              filterid = sorting.data('filter-id'),
              sortingId = window["sortingList"+filterid];

          if(sorting.data('widget') == 'filter') {
            htmlFilterString = ListFilter.SortingString(sortingId, filterid);
            sorting.siblings('.tsListFilter-collapse').find('.tsListFilter-trigger').append(htmlFilterString);
          } 
          else {
            htmlFilterString = '<div class="tsListFilter-trigger-outer"><div class="tsWrapInner">',
            //Add sorting before itemlist
            htmlFilterString += ListFilter.SortingString(sortingId, filterid);
            htmlFilterString += '</div></div>';

            var parent = sorting.parent()
            parent.prepend(htmlFilterString);
          }
          
          /*
          if(sorting.data('widget') == undefined)
          { 
            parent.find('.tsListFilter-trigger-outer,.tsListFilter-sorting').addClass("tsSolo");
          }*/

        });

        if(!$('body').hasClass('lt-ie9'))
        {
          $('body').on('click', '[data-widget=selectList-sorting-item]', function(e){
            e.stopPropagation();
            ListFilter.Sort($(this));
          });
        }
        else
        {
          //FIX for <= ie8
          $('.tsListFilter-sorting').on('click', 'label', function(e){
            e.stopPropagation();
            ListFilter.Sort($(this).find("input"));
          });
        }
      }
      if(searchs.length > 0) {
        searchs.each(function(){
          var filterid = $(this).data('filter-id'),
              htmlFilterString = ListFilter.SearchString(filterid);


          if($(this).data('widget') == 'filter') {
            $(this).siblings('.tsListFilter-collapse').find('.tsListFilter-trigger').append(htmlFilterString);
          } 
          else {

            var parent = $(this).parent().find('.tsListFilter-trigger-outer > div');

            if(parent == undefined || parent.length == 0)
            {
              htmlFilterString = '<div class="tsListFilter-trigger-outer"><div class="tsWrapInner">' + htmlFilterString;
              htmlFilterString += '</div></div>';
              parent = $(this).parent();
            }

            parent.prepend(htmlFilterString);

          }

        });


        $('body').on('keyup search', '[data-widget="listsearch"]', function(){


          var id = $(this).data('index'),
          parent = $('[data-filter-id="'+id+'"]'),
          type= parent.data('listtype'),
          value = $(this).val();
          
          ListFilter.SearchItems(value,parent, type);


        });

      }


      if(sortings.length > 0 || filters.length > 0)
      {
        //Show/hide selectList
        $('body').on('click', '[data-widget=selectList-trigger]', function(e){
          e.stopPropagation();
          var list = $(this).siblings('[data-widget=selectList]'),
          open = list.hasClass('hide');
          $('[data-widget=selectList-trigger]').removeClass("active");
          open ?  $(this).addClass("active") : $(this).removeClass("active");
          $('.tsSelectList').addClass('hide');
          open ? list.removeClass('hide') : list.addClass('hide');
        });
      } 
    }
  }
}();


$(document).ready(function(){
  $('.tsLibrary-small > li:last-child').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
      function() {
        var collapse = $(this).closest('[data-widget="collapse"]');
        addCollapse(collapse);
    });

    // $('.tsProductList-Item.show:last-child').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
    //   function() {
    //     var collapse = $(this).closest('[data-widget="collapse"]');
    //     addCollapse(collapse);
    //     productlistAlignment();
        
    //     alert('tjoho');
    // });
  
});

//Global
var checkIfArrayHasKeys = function(array, filter) {
  var rv = [];
  $.each(array, function(key) { 
    if(filter== undefined)
      {rv.push(key);} 
    else
    {
      if(key.indexOf(filter) > -1)
        {rv.push(key);}     
    }
  });
  return rv;
};



//Document ready functions -- MOVED TO INIT.V2.JS
/*
$(document).ready(function() {
  if(!$('body').hasClass("lt-ie8"))
  {
    ListFilter.InitFilter();
  }
  ListFilter.FilterOnHash();

  if(!$('body').hasClass("lt-ie8"))
  {
    
    ListFilter.SetSelectListPositions();
    ListFilter.CheckCookie();
  }
});*/

