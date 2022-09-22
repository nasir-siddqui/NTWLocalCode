//Global variables
var ListFilter;

if (typeof ListFilter === "undefined") {
  ListFilter = {};
}
ListFilter = function () {


  var limitedFilter = {},
      multiFilter = {};
      animationtimer = 0;



	var filterString =  function (index, hideCollapse, filterText){
    
    var firsthtml = '<div class="tsListFilter tsWrapInner" data-widget="listFilter"></div>',
        filterText = (filterText == undefined) ? "Filtrera denna lista" : sortingText;

    if(hideCollapse == undefined || !hideCollapse)
    {
      var html = '<div class="tsListFilter-collapse is-collapsed" data-index="'+index+'"';
          html += 'data-widget="collapse" aria-expanded="false" data-widget-showtext="" data-widget-hidetext="">';
          html += '<div class="tsListFilter-trigger">';
          html += '<div data-widget-control="collapse-trigger"> ' + filterText + ' <i class="tsIcon-Filter"></i></div>';
          html += ' </div><div class="tsListFilter-outer" data-widget-collapse="inner">';
          html += firsthtml;
          html += '</div></div>';
    }
    else{
      html = firsthtml;
    }
    return html;  
  };
    //Add sorting html from array
    var sortingString =function(sortingList, index, sortingText){

      sortingText = (sortingText == undefined) ? "Sortera lista" : sortingText;

      var html  = '<div class="tsListFilter-sorting"><div data-widget="selectList-wrap">';
          html += '<a class="tsListFilter-sorting-trigger" data-widget="selectList-trigger" >';
          html += sortingText + '<i class="tsIcon-Sort"></i></a>';
          html += '<ul class="tsSelectList hide" data-widget="selectList">';

          for(var key in sortingList) {
            html += '<li class="tsSelectList-item" >';
            html += '<label ><input type="checkbox" data-callback="" data-widget="selectList-sorting-item" data-widget-index="'+index+'" value="' + key + '" name="sorting"/>'+sortingList[key]+'</label></li>'; 
          };
          html += '</ul></div></div>';
          return html;
    };
    //Add listserach html
    var searchString = function(index) {

      var htmlString  = '<div class="tsListSearch"><input data-widget="listsearch" placeholder="Sök i listan" data-visual=placeholder type="search" name="listsearch" data-index="'+index+'" /></div>';
      return htmlString;
    };
    //Add filters to listFilter
    var selectlist = function(thiselement, list, index, hideCollapse) {


      var type =  list[2],
          i = 0, 
          thisList = list[1][0], 
          keys = checkIfArrayHasKeys(thisList),
          parent = hideCollapse ? $(thiselement.siblings('[data-widget="listFilter"]')[0]):thiselement.siblings().find('[data-widget=listFilter]'),
          html = '<span class="tsSelectList-question">' + list[0] +"</span>";
          html+= '<div data-widget="selectList-wrap">';
          html+= '<a class="tsBtnMulti--filter" data-widget="selectList-trigger" >'+ thisList[keys[0]] +'</a>';
          html+= '<ul class="tsSelectList hide" data-widget="selectList" data-widget-selectid="'+index+'">';

          $.each(keys, function(i) {

            var key = keys[i],
            val = thisList[key];  

            cleanContentResult = i == 0 ? 'default' : cleanContent(key);

            if(type == 'single' || i > 0)
            {
              html += '<li class="tsSelectList-item" >';
              html += '<label><input type="checkbox" data-widget-type="'+type+'" data-widget-index="'+index+'" data-widget="selectList-item" value="' + cleanContentResult + '" name="'+name+'"/>'+ val +' </label></li>';
            }

      });  

          html += '</ul></div>';
          if(list[3]!= undefined && list[3].length > 0)
            html += '<span class="tsSelectList-question">' + list[3] + '</span>';

      parent.append(html);
    }; 
	//Removes filtervalues from selected filter
  var removevalue = function(value, type, key, hashkey, selectkey, parentoffset) {

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
      addOrRemoveHash(arr, key, type, parentoffset.top);
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
      addOrRemoveHash(arr, hashkey+'-'+selectkey, type, parentoffset.top);
    }
  };
    //Add value to selected filter
    var addValue = function (value, type, element) {
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
        addFilterTab(element,value, type);
        addOrRemoveHash(arr, hashkey, type,parentoffset.top);
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
        addFilterTab(element,value, type);
        addOrRemoveHash(arr, hashkey+ '-'+ selectkey, type,parentoffset.top);
      }
      else
      {
        addOrRemoveValue(limitedFilter,element, value, key, hashkey,parentoffset.top);   
      }
    };
    var addOrRemoveValue= function(filter, element, newValue, key, hashkey,parentoffset){
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
        setSelctedValueAndDisable(newValue, element, currentValueElement, parentList);
      }
      filter[key] = arr;

      currentValueElement.attr('value', newValue);
      
      addOrRemoveHash(arr, hashkey, "single",parentoffset);
    };
    var addOrRemoveHash= function(array, key, type, parentoffset){
      var thispos = window.pageYOffset;
      var newarray = [];
      if(type == "single")
        type= "limited";

      hash.remove(type + "-" + key);
      if(array.length > 0)
      {
        newarray[type + "-" + key] = hashString(array);;
        hash.add(newarray);
      }

      scrollToElement(parentoffset, thispos);
    };
    
    var toggleFilter = function(filter){
     togglecollapse(filter.closest('[data-widget=collapse]'));
   };
   var checkAndSetValue =function(value, filter){

     var listsItems = filter.find('input[value="'+value+'"]');
     listsItems.each(function(){
       var type = $(this).data('widget-type');
       addValue(value,type,$(this)); 
     });
   };
   var setSelctedValuesToSelectbox = function(value, element, currentValueElement, parentList) {

     parentList.find('li.hide').removeClass('hide');
     element.addClass('hide');     
     var icon = currentValueElement.find("i");     
     currentValueElement.html(element.closest('label').text()).append(icon);

      //ListFilter.SetSelectListPositions();
    };
    var setSelctedValueAndDisable = function(value, element, currentValueElement, parentList) {

      parentList.find('li.hide').removeClass('hide');
      element.addClass('hide');     

      currentValueElement.html(element.closest('label').text() + '<i class="tsIcon-Close"></i>');
      currentValueElement.addClass("tsBtn--filter-remove");
      currentValueElement.attr('data-disable', 'true');
      parentList.addClass('disabled');

    };
    var enableSelectBox = function(element) {

      var list = element.siblings('[data-widget=selectList]'),
      defaultElement =  list.find('[value=default]');

      addValue(defaultElement.val(), "single", defaultElement);

      element.removeClass("tsBtn--filter-remove");      
      element.attr('data-disable', 'false');
      element.removeClass("active");
      element.html(defaultElement.closest('label').text());
      list.removeClass('disabled').addClass("hide");

      //Add fitler (hide) to Itemlist
      var productList = list.closest('[data-widget="collapse"]').siblings('[data-widget="filter"]');
      filterItems(productList, productList.data('item-callback'));
      


      callback = productList.data('callback');
      
      callbackfunction(callback,productList);
      
    };

    //Add filtertab before selected fitler list
    var addFilterTab = function(element, value, type) {
      var prefix = type=="limited" ? and : or; 
      var selectedFilter = element.closest('[data-widget=selectList-wrap]');
      selectedFilter.before('<a class="tsBtn--filter-remove" data-widget="remove-filter" data-widget-type="'+type+'" name="'+value+'">' + element.closest('label').text() +'<i class="tsIcon-Close"></i> </a> <span class="tsFilter-prefix">'+prefix+'</span>');
      hideTabFromselectList(element);

    };

    //Hide selected value in selected filter list

    var hideTabFromselectList = function(element){
      element.closest('li').addClass('hide');
      checkIfSelectListHaveSelecableElements(element.closest('ul'));
    };

    //Remvoves selected fitler tab
    var removeFilterTab = function(element, value, filterlist) {
      showTabInselectList(element, value);
      var prev = filterlist.prev(".tsListFilter-collapse"),
      key =  prev.data('index'),
      hashkey = prev.next('[data-widget=filter]').data('filter-id');  
      callback = filterlist.data('item-callback'),
      selectkey = element.nextAll('[data-widget="selectList-wrap"]').eq(0).find('ul').data('widget-selectid'),
      parentoffset= element.closest(".tsProductListContainer--alt").offset();     

      removevalue(value, element.data('widget-type'), key, hashkey, selectkey, parentoffset);
      element.next('span').remove();
      element.remove();
      filterItems(filterlist, callback);
      
    };
     //Show selected tab in filter list OBS! Catch value error on & sign
     var showTabInselectList = function(element, value){
      var parentElement = element.next().next().find('input[value='+value+']');
      parentElement.removeAttr('checked');
      parentElement.closest('li').removeClass('hide');
      checkIfSelectListHaveSelecableElements(parentElement.closest('ul'));
    };
      //Hides/shows filter list if has values
      var checkIfSelectListHaveSelecableElements = function(list){
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
      };

    // Hide/shows items depending on filter
    var filterItems = function(filterlist, callback) {

      var list = $(filterlist.find(filterlist.data('listtype'))[0]),
          items = list.children(), 
          filterindex = filterlist.prev('.tsListFilter-collapse').data('index'), 
          thislimitedFilter = limitedFilter[filterindex],
          thismultiFilter = [],
          noElementsFoundText = window["noElementsFoundText"+filterlist.data("filter-id")];

      var keys = checkIfArrayHasKeys(multiFilter);
      $.each(keys, function(i){

        if(keys[i].charAt(0) == filterindex){
          thismultiFilter.push(multiFilter[keys[i]]);
        }
      });

      if(thislimitedFilter ==undefined)
      {
        thislimitedFilter=[];
      }
      var array = [],
      elementwidth = list.data('width');
      items.each(function() {
        var filterData = cleanContent($(this).data('filtertags'));
        var itemFilter = [];

        if(filterData!=undefined)
        {
          itemFilter = filterData.split('|');
        }

        var limitedTemp = [];
        var multiTemp = [];
        
        $.each(thislimitedFilter, function(i){
          if($.inArray(thislimitedFilter[i], itemFilter)> -1)
          {
            limitedTemp.push(thislimitedFilter[i]);       
          }
        });

        $.each(thismultiFilter, function(i){
        	$.each(thismultiFilter, function(j){
           if($.inArray(thismultiFilter[i][j], itemFilter) > -1 )
           {
             multiTemp.push(true);
             return false;
           }
         });
        });
        
        var isTheSame = comp(limitedTemp, thislimitedFilter);

        

        if((isTheSame && multiTemp.length == thismultiFilter.length) || (isTheSame && thismultiFilter.length == 0))
        {
            //$(this).removeClass('hide');  Use
            //$(this).addClass('show');
            array.push($(this));
          }
          /*else
          {
            $(this).removeClass('show');  
            //$(this).addClass('hide'); Use
          } */
        });
        animatelist(array,items, list,elementwidth, noElementsFoundText, callback);

    };
    var sortItems = function(value, items, parent, callback) {

        var splitedValue = value.split('-'),
        order = splitedValue.length > 1 ? splitedValue[1] : "asc";  

        items.tsort('',{data:'sorting-'+splitedValue[0] , order: order });
        callbackfunction(callback, parent);
        
    };

    var searchItems =function(value, parent, type, callback) {

    var list = parent.find(type).eq(0);
          items = list.children();
          noElementsFoundText = window["noElementsFoundText"+parent.data("filter-id")],
          pattern = new RegExp(/^.*value.*$/);
          pattern = pattern.source.replace('value', value);
      
      var width = 0,
          array = [],
          elementwidth = list.data('width');
      
          items.each(function(){
            var tag = $(this).data('sorting-name').toLowerCase();
              if(tag.match(pattern)) {
                  width += elementwidth;
                  array.push($(this)[0]);
              }
          });
          
        animatelist(array,items, list,elementwidth, noElementsFoundText);
        callbackfunction(callback, list);
    };
    var animatelist = function(list, items, parent, elementwidth,noElementsFoundText, callback) {

      parent.animate({
        opacity: 0,
        height: 'auto'
      }, animationtimer,  "linear", function() {

      items.removeClass('show');
      var collapse = parent.closest('[data-widget="collapse"]');

          $.each(list, function(i){
             $(list[i]).addClass("show");
            if(i == list.length-1)
            {
              noItemsFound(parent, items, parent.parent(), noElementsFoundText, collapse);
              addCollapse(collapse);
              parent.animate({
                opacity: 1,
                height: 'auto'
                }, animationtimer,  "linear", function() {
                  
                });
            }
        });
          
          if(list.length== 0)
          {
              noItemsFound(parent, items, parent.parent(), noElementsFoundText, collapse);
              parent.animate({
                opacity: 1,
                height: 'auto'
              }, animationtimer, "linear", function() {
                
            });
          }
    });
          
    callbackfunction(callback, list);
    };

    //check if filterarrays is the same
    var comp= function(temp, pfilter){
      temp.sort();
      pfilter.sort();
      return temp.join() === pfilter.join();
    };
    

    var addNewFilterItem = function  (thiselement) {
      var element = thiselement.find("input"),        
      type = element.data('widget-type'),
      filterlist = element.closest('.tsListFilter-collapse').next('[data-widget=filter]');
      callback = filterlist.data('item-callback'),
      list = filterlist.find();

      //Add remove filter
      addValue(element.val(), type, element);

      //Add fitler (hide) to Itemlist
      filterItems(filterlist,callback);

      //Closes active fitlerlist
      element.closest('ul').addClass('hide');

      callback = filterlist.data('callback');
      callbackfunction(callback,filterlist);
    };
    var sortthis = function(element)
    {
      var value = element.val(),
      parentList = element.closest('ul'),
      currentValueElement = parentList.siblings('[data-widget=selectList-trigger]'),
      sortList = element.closest('.tsListFilter-collapse, .tsListFilter-trigger-outer').next('[data-sorting="true"]'),
      callback = sortList.data('callback'),
      key = sortList.data("filter-id"),
      parentoffset = element.closest(".tsProductListContainer--alt").offset();

      var arr = []; 
      arr.push(value);  
      setSelctedValuesToSelectbox(value, element, currentValueElement, parentList, parentoffset);
      addOrRemoveHash(arr, key, "sorting");

      var p = sortList.find(sortList.data('listtype'))[0],
      items = $(p).children();

      sortItems(value, items, sortList, callback);

      
      //callbackfunction(callback,parentList);
    };

    var noItemsFound = function(list, items, parentList, noElementsFoundText, collapse)
    {
      var hiddenItems = $(list).children().not('.show');

      if(items.length == hiddenItems.length){
        if(parentList.find('.tsFilter-noElementsFoundText').length < 1)
          parentList.prepend('<p class="tsFilter-noElementsFoundText">'+noElementsFoundText+'</p>')
      }  
      else
      {
        parentList.find('.tsFilter-noElementsFoundText').remove();
      }
      addCollapse(collapse);
    };

    var initSort =function (sortings) {
    	
    	 //Region sort
       if(sortings.length > 0) {
        sortings.each(function(){

          var sorting = $(this),
              filterid = sorting.data('filter-id'),
              sortingId = window["sortingList"+filterid],
              sortingText = sorting.data('sorting-text'),
              hideCollapseMin = sorting.data('hide-collapse-mqmin'),
              hideCollapseMax = sorting.data('hide-collapse-mqmax'),
              hideCollapse = isWithinInterval(hideCollapseMin, hideCollapseMax);

          // if(sorting.data('widget') == 'filter' && !sorting.data('hide-collapse')) {
          if(sorting.data('widget') == 'filter' && !hideCollapse) {
            html = sortingString(sortingId, filterid, sortingText);
            sorting.siblings('.tsListFilter-collapse').find('.tsListFilter-trigger').append(html);
          }
          else {
            html = '<div class="tsListFilter-trigger-outer"><div class="tsWrapInner">',
            //Add sorting before itemlist
            html += sortingString(sortingId, filterid, sortingText);
            html += '</div></div>';

            var parent = sorting.parent()
            parent.prepend(html);
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
            sortthis($(this));
          });
        }
        else
        {
          //FIX for <= ie8
          $('.tsListFilter-sorting').on('click', 'label', function(e){
            e.stopPropagation();
            sortthis($(this).find("input"));
          });
        }
      }
      
    };
    var initSearch = function (searchs){
    	
    	if(searchs.length > 0) {
        searchs.each(function(){
          var filterid = $(this).data('filter-id'),
          html = searchString(filterid);


          if($(this).data('widget') == 'filter' && !$(this).data('hide-collapse')) {
            $(this).siblings('.tsListFilter-collapse').find('.tsListFilter-trigger').append(html);
          } 
          else {

            var parent = $(this).parent().find('.tsListFilter-trigger-outer > div');

            if(parent == undefined || parent.length == 0)
            {
              html = '<div class="tsListFilter-trigger-outer"><div class="tsWrapInner">' + html;
              html += '</div></div>';
              parent = $(this).parent();
            }

            parent.prepend(html);

          }
          
          


        });

        var timer;
        var timeout = 400;
        $('body').on('keyup search', '[data-widget="listsearch"]', function(){
            var id = $(this).data('index'),
                parent = $('[data-filter-id="'+id+'"]'),
                type= parent.data('listtype'),
                value = $(this).val();
                          
                clearTimeout(timer);
                timer = setTimeout(function(){
                    searchItems(value, parent, type);
                }, timeout);
        });
      }

    };
    var initFilter = function (filters) {

     if(filters.length > 0) {
	      //Add filter before itemlist
	      filters.each(function(index){
         var filter = $(this),
             hideCollapseMin = filter.data('hide-collapse-mqmin'),
             hideCollapseMax = filter.data('hide-collapse-mqmax'),
             hideCollapse = isWithinInterval(hideCollapseMin, hideCollapseMax),
             filterid = filter.data('filter-id'),
             filterText = filter.data('filter-text');
          
          // var hideCollapse = filter.data('hide-collapse');

         if (filterid!=undefined) {

           var html = filterString(index, hideCollapse, filterText);

           filter.before(html);
	          //showElemets($(this));

	          var thisFilter = window["filters"+filterid];
	          if(thisFilter != undefined)
	          {
	            //Add filter for each list in filters array
	            for (var i = 0; i < thisFilter.length; i++) {
               if(thisFilter[i] != undefined)
                 selectlist(filter, thisFilter[i], i, hideCollapse);
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
           //console.log("Data-attr: filter-Id not found!");
         } 
        

       });

        if(!$('body').hasClass('lt-ie9'))
        {
         $('[data-widget="listFilter"]').on('change','label', function(e) {
           addNewFilterItem($(this));
         });
         $('body').on('click', '[data-widget=selectList-sorting-item]', function(e){
           e.stopPropagation();
           sortthis($(this));
         });
        }
        else
        {
	          //FIX for <= ie8
           $('[data-widget="listFilter"]').on('click','label', function(e) {
            addNewFilterItem($(this));
          });
           $('.tsListFilter-sorting').on('click', 'label', function(e){
            e.stopPropagation();
            sortthis($(this).find("input"));
          });
         }

	        //Removes filter on click 
	        $('[data-widget="listFilter"]').on('click', '[data-widget=remove-filter]', function(e){
           e.stopPropagation();
           var filterlist = $(this).closest('.tsListFilter-collapse').next('[data-widget=filter]');
           removeFilterTab($(this), $(this).attr('name'), filterlist);
           var callback = filterlist.data('callback');
           callbackfunction(callback, filterlist);
         });

	        $('body').on('click', '[data-disable="true"]', function(e){
           enableSelectBox($(this));
         });
       }

     };
     
     var callbackfunction = function (callback, element){
       if(callback != undefined)
       {
         callback = callback.split('.');
         callback.length > 1 ? window[callback[0]][callback[1]](element): window[callback[0]](element);

       }
     };
     var removeSpaces = function(content){
       content = content.replace(/\s/g, "");
       return content;
     };

    //Cleans filter values from space, åäö 
    var cleanContent = function(content) {
    	if(content!= null)
    	{
    		content = content.toLowerCase();
    		content = content.replaceAll('å','a');
    		content = content.replaceAll('ä','a');
    		content = content.replaceAll('ö','o');        
    		content = removeSpaces(content);
    	}
    	return content;
    };



    // OnInit

    function _init() {


    }

    return {

      SetElementHeights: function (parent) {

        var list =$(parent.find(parent.data('listtype'))[0]),
            element = $(list.children()[0]),
            eheight = element.outerHeight() + parseInt(element.css('margin-top')) + parseInt(element.css('margin-bottom')),
            ewidth = element.outerWidth() + parseInt(element.css('margin-right')) + parseInt(element.css('margin-left'));


            list.data('height', eheight);
            list.data('width',  ewidth);

            //console.log(eheight +'|'+ ewidth );


     },

      FilterOnHash: function() {

        var hString = hash.get(),
        hasKeys = 'keys' in Object.prototype ? Object.keys(hString).length > 0 : checkIfArrayHasKeys(hString);

        if($('[data-sorting=true]').length > 0)
        {
          $('[data-sorting=true]').each(function(){

            var filterlist = $(this),
            id = filterlist.data('filter-id'),
            callback = filterlist.data("item-callback"),  
            sort = hString["sorting-" + id];
            if(sort != undefined) {
              if(!hasKeys)
                return

              var element = filterlist.siblings(".tsListFilter-trigger-outer, .tsListFilter-collapse").find('input[value='+sort+']'),
              parentList = element.closest('ul'),
              currentValueElement = parentList.siblings('[data-widget=selectList-trigger]');                

              setSelctedValuesToSelectbox(sort, element, currentValueElement, parentList);

              var p = filterlist.find(filterlist.data('listtype'))[0],
              items = $(p).children();

              sortItems(sort, items,filterlist, filterlist.data('callback'));

              items.addClass('show');

            }
          });
        }
        if($('[data-widget=listFilter]').length > 0)
        {
         $('[data-widget=listFilter]').each(function(){

          var filterlist = $(this).closest('.tsListFilter-collapse').next('[data-widget=filter]'),
          filter = $(this),
          callback = filterlist.data("item-callback"),
          id = filterlist.data('filter-id');    
          if(hasKeys)
          {
           var multi, 
           keys = checkIfArrayHasKeys(hString, "multi-" + id);
           if(keys!=undefined)
           {
            $.each(keys, function(i){

             multi = hString[keys[i]];
             if(multi!=undefined)
             {
              multi = multi.split('|')
              $.each(multi, function(j){                                
               checkAndSetValue(multi[j], filter);
             }); 
            }
          });
          }
          var limited = hString["limited-" + id];                      

          if(limited!=undefined)
          {
            limited = limited.split('|')
            $.each(limited, function(i){                
             checkAndSetValue(limited[i], filter);
           }); 
          }

          filterItems(filterlist, callback);
          if(multi != undefined || limited!=undefined)
            toggleFilter(filter);

        }
        else
        {
         var list = filterlist.find(filterlist.data('listtype'))[0],
         items = $(list).children();

         items.addClass("show");
       }
     });
    }


      var keys =hash.get('prev');

      if(!hasKeys || hasKeys.length == 0 || (hasKeys.length > 0 && keys!=undefined && keys.length >0))
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
      }},
      //Sets the absolute position to selectLists
      SetSelectListPositions: function(){
        var outerWidth = outerWidth = $('.tsListFilter-outer').width();
        $('[data-widget=selectList-wrap], .tsSelectList-wrap--alt').each(function(){
          var list = $(this).find("ul"),
          listWidth = list.width()/2;
          list.css("margin-left", -listWidth);
  /*
            var widest = widestElement(list.find('label'));
                
            
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
      
      CheckCollapse: function() {
        var hideCollapseMin = $(this).data('hide-collapse-mqmin'),
            hideCollapseMax = $(this).data('hide-collapse-mqmax');

            //console.log(isWithinInterval(hideCollapseMin, hideCollapseMax))

        if(isWithinInterval(hideCollapseMin, hideCollapseMax)) {
          var filters = $('[data-widget=filter]'),
              sortings = $('[data-sorting="true"]');

          $('.tsListFilter-collapse').remove();
          $('.tsListFilter-trigger').remove();
          $('.tsListFilter-trigger-outer').remove();
          $('.tsListFilter').remove();

          initFilter(filters);
          initSort(sortings);
        }
      },

      Init: function() {
      	
       var filters = $('[data-widget=filter]'),
           searchs  = $('[data-listsearch="true"]'),
           sortings = $('[data-sorting="true"]');

           initFilter(filters);
           initSort(sortings);
           initSearch(searchs);

       if(sortings.length > 0 || filters.length > 0 ||searchs.length > 0)
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
            //Close all selectboxes on body click
            $('body').click(function(){   
              var list = $('.tsSelectList');
              list.addClass('hide');
              list.siblings("a").removeClass("active");
            });
          }
        }
      }

    }();

    var hashString = function(array) {
      var hstring = "";
      $.each(array, function(i){
        if(array[i] !== "" && array[i] !== null)
        {
          hstring += array[i];
          if(i != (array.length-1))
          {
            hstring += "|";
          }
        }
      });
      return hstring;
    };
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
