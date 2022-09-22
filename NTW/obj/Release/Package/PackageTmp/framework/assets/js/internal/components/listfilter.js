/* global isWithinInterval:true, mediaqueriesMin:true, hash:true, addCollapse:true, togglecollapse:true, getCookie:true, addCookie:true, scrollToElement:true, indexof:true */

var ListFilter;

var limitedFilter = {},
multiFilter = {},
packageFilter = {},
filterChanged = false,
animationtimer = 0;

if (typeof ListFilter === "undefined") {
  ListFilter = {};
}

var hashString = function(array) {
  var hstring = "";
  $.each(array, function(i) {
    if (array[i] !== "" && array[i] !== null) {
      hstring += array[i];
      if (i !== (array.length - 1)) {
        hstring += "|";
      }
    }
  });
  return hstring;
};

var checkIfArrayHasKeys = function(array, filter) {
  var rv = [];
  $.each(array, function(key) {
    if (typeof filter === "undefined") {
      rv.push(key);
    } else {
      if (key.indexOf(filter) > -1) {
        rv.push(key);
      }
    }
  });
  return rv;
};

ListFilter = function() {
    //FUNCTIONS TO GENERATE HTML FOR THE LISTFILTER
    var filterString = function(index, hideCollapse, filterText) {
      var firsthtml = '<div class="tsListFilter" data-widget="listFilter"></div>',
          html;
      filterText = (typeof filterText === "undefined") ? "Filtrera denna lista" : filterText;
      

      if (typeof hideCollapse === "undefined" || !hideCollapse) {
        html = '<div class="tsListFilter-collapse is-collapsed" data-index="' + index + '"';
        html += 'data-widget="collapse" aria-expanded="false" data-widget-showtext="" data-widget-hidetext="">';
        html += '<div class="tsListFilter-trigger">';
        html += '<div class="tsWrapInner tsCenterAlign"><div class="tsListFilter-filter" data-widget-control="collapse-trigger">' + filterText + '<i class="tsIcon-Filter"></i></div></div>';
        html += '</div><div class="tsListFilter-outer" data-widget-collapse="inner"><div class="tsWrapInner">';
        html += firsthtml;
        html += '</div></div></div>';
      } else {
        html = '<div class="tsListFilter-no-collapse tsListFilter-trigger-outer" data-index="' + index + '"><div class="tsWrapInner">';
        html += '<div class="tsListFilter-filter-trigger">';
        html += firsthtml;
        html += '</div></div></div></div>';
      }
      return html;
    };

    var sortingString = function(sortingList, index, sortingText) {
      sortingText = (typeof sortingText === "undefined") ? "Sortera lista" : sortingText;

      var html = '<div class="tsListFilter-sorting"><div data-widget="selectList-wrap">';
      html += '<a class="tsListFilter-sorting-trigger" data-widget="selectList-trigger" >';
      html += sortingText + '<i class="tsIcon-Sort"></i></a>';
      html += '<ul class="tsSelectList hide" data-widget="selectList">';

      for (var key in sortingList) {
        html += '<li class="tsSelectList-item">';
        html += '<label><input type="checkbox" data-widget="selectList-sorting-item" data-widget-index="' + index + '" value="' + key + '" name="sorting"/>' + sortingList[key] + '</li></label>';
      }
      html += '</ul></div></div>';
      return html;
    };

    var searchString = function(index, searchText) {
      searchText = (typeof searchText === "undefined") ? "Sök i listan" : searchText;
      var htmlString = '<div class="tsListFilter-search"><div class="tsListSearch"><input type="search" data-widget="listsearch" placeholder="' + searchText + '" data-visual=placeholder  name="listsearch" data-index="' + index + '" /></div></div>';
      return htmlString;
    };

    //FUNCTIONS TO INITIALZE THE DIFFERENT PARTS OF THE LISTFILTER
    var initFilter = function(filters) {
      if (filters.length > 0) {
        //Add filter before itemlist
        filters.each(function(index) {
          var filter = $(this),
          hideCollapseMin = filter.data('hide-collapse-mqmin'),
          hideCollapseMax = filter.data('hide-collapse-mqmax'),
          hideCollapse = isWithinInterval(hideCollapseMin, hideCollapseMax),
          filterid = filter.data('filter-id'),
          filterText = filter.data('filter-text');

          if (typeof filterid !== "undefined") {
            if (typeof window["collapsible" + filterid] !== "undefined") {
              hideCollapse = !window["collapsible" + filterid];
            }

            var html = filterString(index, hideCollapse, filterText);
            filter.before(html);
            var thisFilter = window["filters" + filterid];
            if (typeof thisFilter !== "undefined") {
              //Add filter for each list in filters array
              for (var i = 0; i < thisFilter.length; i++) {
                if (typeof thisFilter[i] !== "undefined") {
                  selectlist(filter, thisFilter[i], i, hideCollapse);
                }
              }
            }
          }
        });

        if (!$('body').hasClass('lt-ie9')) {
          $('[data-widget="listFilter"]').on('change', 'label', function() {
            filterChanged = true;
            addNewFilterItem($(this));
          });
        } else {
          //FIX for <= ie8
          $('[data-widget="listFilter"]').on('click', 'label', function() {
            filterChanged = true;
            addNewFilterItem($(this));
          });
        }

        //Removes filter on click
        $('[data-widget="listFilter"]').on('click', '[data-widget=remove-filter]', function(e) {
          e.stopPropagation();
          filterChanged = true;
          var filterlist = $(this).closest('.tsListFilter-collapse, .tsListFilter-no-collapse').next('[data-widget=filter]');
          removeFilterTab($(this), $(this).attr('name'), filterlist);
          var callback = filterlist.data('callback');
          callbackfunction(callback, filterlist);
        });

        $('body').on('click', '[data-disable="true"]', function() {
          filterChanged = true;
          enableSelectBox($(this));
        });
      }
    };

    var initSort = function(sortings) {
      //Region sort
      if (sortings.length > 0) {
        sortings.each(function() {
          var sorting = $(this),
              html,
              filterid = sorting.data('filter-id'),
              sortingId = window["sortingList" + filterid],
              sortingText = sorting.data('sorting-text'),
              hideCollapseMin = sorting.data('hide-collapse-mqmin'),
              hideCollapseMax = sorting.data('hide-collapse-mqmax'),
              hideCollapse = isWithinInterval(hideCollapseMin, hideCollapseMax);

          if (sorting.data('widget') === 'filter') {
            html = sortingString(sortingId, filterid, sortingText);
            sorting.parent().find('.tsListFilter-trigger, .tsListFilter-trigger-outer').children().first().append(html);
          } else {
            html = '<div class="tsListFilter-trigger-outer"><div class="tsWrapInner">';
            //Add sorting before itemlist
            html += sortingString(sortingId, filterid, sortingText);
            html += '</div></div>';
            sorting.closest("[data-widget=list-container]").prepend(html);
          }
        });

        if (!$('body').hasClass('lt-ie9')) {
          $('body').on('click', '[data-widget=selectList-sorting-item]', function(e) {
            e.stopPropagation();
            filterChanged = true;
            sortthis($(this));
          });
        } else {
          //Fix for <= ie8
          $('.tsListFilter-sorting').on('click', 'label', function(e) {
            e.stopPropagation();
            filterChanged = true;
            sortthis($(this).find("input"));
          });
        }
      }
    };

    var initSearch = function(searchs) {
      if (searchs.length > 0) {
        searchs.each(function() {
          var filterid = $(this).data('filter-id'),
          searchText = $(this).data('search-text'),
          html = searchString(filterid, searchText);

          if ($(this).data('widget') === 'filter') {
            $(this).parent().find('.tsListFilter-trigger, .tsListFilter-trigger-outer').children().first().append(html);
          } else {
            var parent = $(this).parent().find('.tsListFilter-trigger-outer > div');

            if (typeof parent === "undefined" || parent.length === 0) {
              html = '<div class="tsListFilter-trigger"><div class="tsWrapInner">' + html;
              html += '</div></div>';
            }
            $(this).closest("[data-widget=list-container]").prepend(html);
          }
        });

        var timer;
        var timeout = 400;
        $('body').on('keyup search', '[data-widget="listsearch"]', function() {
          var id = $(this).data('index'),
          parent = $('[data-filter-id="' + id + '"]'),
          type = parent.data('listtype'),
          value = $(this).val();
          var callback = parent.data("search-callback");

          clearTimeout(timer);
          timer = setTimeout(function() {
            searchItems(value, parent, type, callback);
              // Add hash
              var key = parent.data("filter-id"),
              arr = [];
              if (value !== "") {
                arr.push(value);
              }
              addOrRemoveHash(arr, key, "query");
            }, timeout);
        });
      }
    };

    //FUNCTIONS TO PERFORM THE OPERATIONS OF THE DIFFERENT PARTS OF THE LISTFILTER
    var filterItems = function(filterlist, callback) {
      var list = $(filterlist.find(filterlist.data('listtype'))[0]),
      items = list.children(),
      filterindex = $(filterlist).siblings('.tsListFilter-collapse, .tsListFilter-no-collapse').data('index'),
      thislimitedFilter = limitedFilter[filterindex],
      thismultiFilter = [],
      thispackageFilter = [],
      noElementsFoundText = window["noElementsFoundText" + filterlist.data("filter-id")];
      if (typeof thislimitedFilter === "undefined") {
        thislimitedFilter = [];
      }

      var keys = checkIfArrayHasKeys(multiFilter);
      $.each(keys, function(i) {
        if (keys[i].charAt(0) === filterindex) {
          thismultiFilter.push(multiFilter[keys[i]]);
        }
      });

      keys = checkIfArrayHasKeys(packageFilter);
      $.each(keys, function(i) {
        if (keys[i].charAt(0) === filterindex) {
          thispackageFilter.push(packageFilter[keys[i]]);
        }
      });

      var array = [],
      elementwidth = list.data('width');
      items.each(function() {
        var filterData = cleanContent($(this).data('filtertags'));
        var itemFilter = [];

        if (typeof filterData !== "undefined") {
                //console.log(filterData);
                itemFilter = filterData.split('|');
              }

              var limitedTemp = [],
              multiTemp = [],
              packageApprove = true;

              $.each(thislimitedFilter, function(i) {
                if ($.inArray(thislimitedFilter[i], itemFilter) > -1) {
                  limitedTemp.push(thislimitedFilter[i]);
                }
              });

              $.each(thismultiFilter, function(i) {
                $.each(thismultiFilter[i], function(j) {
                  if ($.inArray(thismultiFilter[i][j], itemFilter) > -1) {
                    multiTemp.push(true);
                  }
                });
              });

              $.each(thispackageFilter, function(i) {
                $.each(thispackageFilter[i], function(j) {
                  if ($.inArray(thispackageFilter[i][j], itemFilter) < 0) {
                    packageApprove = false;
                  }
                });
              });

              var isTheSame = comp(limitedTemp, thislimitedFilter),
              multiApprove = (thismultiFilter.length === 0 || multiTemp.length === thismultiFilter.length);
              if (isTheSame && multiApprove && packageApprove) {
                array.push($(this));
              }
            });
animatelist(array, items, list, elementwidth, noElementsFoundText, callback);
};

var sortItems = function(value, items, parent, type, callback) {
  var list = parent.find(type).eq(0),
  splitValue = value.split('-'),
  order = (splitValue.length > 1 ? splitValue[1] : "asc");

  items.tsort('', {
    data: 'sorting-' + splitValue[0],
    order: order
  });

  callbackfunction(callback, list);
};

var searchItems = function(value, parent, type, callback) {
        // If callback is defined, use that to search
        if (callback) {
          callbackfunction(callback, list);
        } else {
          var list = parent.find(type).eq(0),
          items = list.children(),
          noElementsFoundText = window["noElementsFoundText" + parent.data("filter-id")],
          pattern = new RegExp(/^.*value.*$/);
          pattern = pattern.source.replace('value', cleanContent(value).replace("+", "\\+"));

          var width = 0,
          array = [],
          elementwidth = list.data('width');

          items.each(function() {
            var tag = cleanContent($(this).data('sorting-name'));
            if (tag.match(pattern)) {
              width += elementwidth;
              array.push($(this)[0]);
            }
          });
          animatelist(array, items, list, elementwidth, noElementsFoundText, callback);
        }
      };

    //Generate HTML for a new visual filter select list
    var selectlist = function(thiselement, list, index, hideCollapse) {
      var cleanContentResult,
          type = list[2],
          thisList = list[1][0],
          keys = checkIfArrayHasKeys(thisList),
          buttonTitle = thisList[keys[0]],
          parent = thiselement.siblings().find('[data-widget="listFilter"]'),
          html = '<span class="tsSelectList-question">' + list[0] + "</span>";
      html += '<div data-widget="selectList-wrap">';
      if (type === 'single' || type === 'multi' || type === 'limited') {
        html += '<a class="tsBtnMulti--filter" data-widget="selectList-trigger">' + buttonTitle + '</a>';
        html += '<ul class="tsSelectList hide" data-widget="selectList" data-widget-selectid="' + index + '">';
        $.each(keys, function(i) {
          var key = keys[i],
          val = thisList[key];
          cleanContentResult = i === 0 ? 'default' : cleanContent(val);
          if (type === 'single' || i > 0) {
            html += '<li class="tsSelectList-item" >';
            html += '<label><input type="checkbox" data-widget-type="' + type + '" data-widget-index="' + index + '" data-widget="selectList-item" value="' + cleanContentResult + '" name="' + name + '"/>' + val + '</label></li>';
          }
        });
        html += '</ul></div>';
      } else if (type === 'package') {
        html += '<a class="tsBtnMulti--filter" data-widget="selectList-trigger" data-select-trigger="desktop"  style="display: none;">' + buttonTitle + '</a>';
            //Generate item list
            var catList = [];
            var itemListHtml = '<ul class="tsSelectPackageList" data-widget-type="packageList">';
            $.each(keys, function(i) {
              var key = keys[i],
              val = thisList[key],
              filtertags = val.split(":"),
              val = filtertags[0],
              img = filtertags[1],
              filtertags = filtertags[2];
                //Store all tags as categories
                if (typeof filtertags !== "undefined") {
                  var tags = filtertags.split("|");
                  $(tags).each(function(i) {
                    if ($.inArray(tags[i], catList) < 0) {
                      catList.push(cleanContent(tags[i]));
                    }
                  });
                }
                if (i !== 0) {
                  itemListHtml += '<label><input type="checkbox" data-widget="selectPackageItem-trigger" data-widget-type="package" data-widget-index="' + index + '" value="' + cleanContent(key) + '">';
                  itemListHtml += '<img class="tsSelectPackage-item" data-widget="selectPackageItem-pic" data-filtertags="' + filtertags + '" src="' + img + '" alt="' + val + '" title="' + val + '" width="35" height="35"></label>';
                }
              });
            itemListHtml += '</ul>';
            //Generate category list
            var categories = checkIfArrayHasKeys(catList);
            html += '<div class="tsSelectPackage hide" data-widget="selectList" data-widget-selectid="' + index + '">';
            html += '<div><ul class="tsSelectCategoryList">';
            $.each(categories, function(i) {
              var category = categories[i],
                  val = catList[category];
              html += '<li class="tsSelectCategoryList-item" data-widget="selectPackage-trigger" data-value="' + val + '">' + val + '</li>';
            });
            html += '</ul></div>';
            //Add item list
            html += itemListHtml + '</div></ul></div>';

            //Add a cellphone mode look
            html += '<div data-widget="selectList-wrap"><a class="tsBtnMulti--filter" data-widget="selectList-trigger" data-select-trigger="mobile">' + buttonTitle + '</a>';
            html += '<ul class="tsSelectList hide" data-widget="selectList" data-widget-selectid="' + index + '">';
            //Add default value to list
            html += '<li class="tsSelectList-item" >';
            html += '<label><input type="checkbox" data-widget-type="single" data-widget-index="' + index + '" data-widget="selectList-item" value="default" name="' + buttonTitle + '"/>' + buttonTitle + '</label></li>';
            $.each(categories, function(i) {
              var category = categories[i],
              name = catList[category],
              val = cleanContent(name);
              html += '<li class="tsSelectList-item" >';
              html += '<label><input type="checkbox" data-widget-type="single" data-widget-index="' + index + '" data-widget="selectList-item" value="' + val + '" name="' + name + '"/>' + name + '</label></li>';
            });
            html += '</ul></div>';
          }
          if (typeof list[3] !== "undefined" && list[3].length > 0) {
            html += '<span class="tsSelectList-question">' + list[3] + '</span>';
          }
          parent.append(html);

        //Locks the height of package lists to the current one (otherwise it will scale dynamically according to filter options)
        if (type === 'package') {
          var list = $(parent).find('.tsSelectPackage');
          list.css('height', list.height());
        }
      };

    //Removes filtervalues from selected filter
    var removeValue = function(value, type, key, hashkey, selectkey, parentoffset) {
      var thisSelectKey = key + '-' + selectkey,
          index,
          arr;
      if (type === "limited" || type === "single") {
        arr = limitedFilter[key];

        if (!Array.prototype.indexOf) {
          index = indexof(arr, value);
        } else {
          index = arr.indexOf(value);
        }

        if (index > -1) {
          arr.splice(index, 1);
        }
        limitedFilter[key] = arr;
        addOrRemoveHash(arr, key, type, parentoffset.top);
      } else if (type === "multi") {
        arr = multiFilter[thisSelectKey];
        if (!Array.prototype.indexOf) {
          index = indexof(arr, value);
        } else {
          index = arr.indexOf(value);
        }
        if (index > -1) {
          arr.splice(index, 1);
        }
        if (arr.length > 0) {
          multiFilter[thisSelectKey] = arr;
        } else {
          delete multiFilter[thisSelectKey];
        }
        addOrRemoveHash(arr, hashkey + '-' + selectkey, type, parentoffset.top);
      } else if (type === "package") {
        arr = packageFilter[thisSelectKey];
        if (!Array.prototype.indexOf) {
          index = indexof(arr, value);
        } else {
          index = arr.indexOf(value);
        }
        if (index > -1) {
          arr.splice(index, 1);
        }
        if (arr.length > 0) {
          packageFilter[thisSelectKey] = arr;
        } else {
          delete packageFilter[thisSelectKey];
        }
        addOrRemoveHash(arr, hashkey + '-' + selectkey, type, parentoffset.top);
      } else {
            //console.log("Incorrect filter type")
          }
        };

    //Add value to selected filter
    var addValue = function(value, type, element) {
      var collapse = element.closest(".tsListFilter-collapse, .tsListFilter-no-collapse"),
      key = collapse.data('index'),
      selectkey = element.closest('[data-widget=selectList]').data('widget-selectid'),
      hashkey = collapse.next('[data-widget=filter]').data('filter-id'),
      thisSelectKey = key + '-' + selectkey,
      parentoffset = element.closest('[data-widget="list-container"]').offset(),
      arr;
      if (type === "limited") {
        arr = limitedFilter[key];
        if (typeof arr === "undefined") {
          arr = [];
        }
        arr.push(value);
        limitedFilter[key] = arr;
        addFilterTab(element, value, type);
        addOrRemoveHash(arr, hashkey, type, parentoffset.top);
      } else if (type === "multi") {
        arr = multiFilter[thisSelectKey];
        if (typeof arr === "undefined") {
          arr = [];
        }
        arr.push(value);
        multiFilter[thisSelectKey] = arr;
        addFilterTab(element, value, type);
        addOrRemoveHash(arr, hashkey + '-' + selectkey, type, parentoffset.top);
      } else if (type === "package") {
        arr = packageFilter[thisSelectKey];
        if (typeof arr === "undefined") {
          arr = [];
        }
        arr.push(value);
        packageFilter[thisSelectKey] = arr;
        addOrRemoveHash(arr, hashkey + '-' + selectkey, type, parentoffset.top);
      } else {
        addOrRemoveValue(limitedFilter, element, value, key, hashkey, parentoffset.top);
      }
    };

    var addOrRemoveValue = function(filter, element, newValue, key, hashkey, parentoffset) {
      var arr = filter[key];
      if (typeof arr === "undefined") {
        arr = [];
      }

      var parentList = element.closest('ul'),
      currentValueElement = parentList.siblings('[data-widget=selectList-trigger]'),
      value = currentValueElement.attr('value'),
      index = -1;

      if (!Array.prototype.indexOf) {
        index = indexof(arr, value);
      } else {
        index = arr.indexOf(value);
      }
      if (index > -1) {
        arr.splice(index, 1);
      }
      if (newValue !== "default") {
        arr.push(newValue);
        setSelectedValueAndDisable(newValue, element, currentValueElement, parentList);
      }
      filter[key] = arr;

      currentValueElement.attr('value', newValue);

      addOrRemoveHash(arr, hashkey, "single", parentoffset);
    };

    var addOrRemoveHash = function(array, key, type, parentoffset) {
      var thispos = window.pageYOffset;
      var newarray = [];
      if (type === "single") {
        type = "limited";
      }

      hash.remove(type + "-" + key);
      if (array.length > 0) {
        newarray[type + "-" + key] = hashString(array);
        hash.add(newarray);
      }

      scrollToElement(parentoffset, thispos);
    };

    var toggleFilter = function(filter) {
      togglecollapse(filter.closest('[data-widget=collapse]'));
    };

    var checkAndSetValue = function(value, filter) {
      var listsItems = filter.find('input[value="' + value + '"]');
      listsItems.each(function() {
        var type = $(this).data('widget-type');
        addValue(value, type, $(this));
      });
    };

    var setSelectedValuesToSelectbox = function(value, element, currentValueElement, parentList) {
      parentList.find('li.visuallyhidden').removeClass('visuallyhidden');
      element.addClass('visuallyhidden');
      var icon = currentValueElement.find("i");
      currentValueElement.html(element.closest('label').text()).append(icon);
        //ListFilter.SetSelectListPositions();
      };

      var setSelectedValueToSearch = function(value) {
        var searchInput = $('[data-widget="listsearch"]');
        if (searchInput) {
          searchInput.val(value);
        }
      };

      var setSelectedValueAndDisable = function(value, element, currentValueElement, parentList) {
        parentList.find('li.visuallyhidden').removeClass('visuallyhidden');
        element.addClass('visuallyhidden');

        currentValueElement.html(element.closest('label').text() + '<i class="tsIcon-Close"></i>');
        currentValueElement.addClass("tsBtn--filter-remove");
        currentValueElement.attr('data-disable', 'true');
        parentList.addClass('disabled');
      };

      var enableSelectBox = function(element) {
        var list = element.siblings('[data-widget=selectList]'),
        defaultElement = list.find('[value=default]');

        addValue(defaultElement.val(), "single", defaultElement);

        element.removeClass("tsBtn--filter-remove");
        element.attr('data-disable', 'false');
        element.removeClass("active");
        element.html(defaultElement.closest('label').text());
        list.removeClass('disabled').addClass("hide");

        //Add filter (hide) to Itemlist
        var productList = list.closest('[data-widget="list-container"]').find('[data-widget="filter"], [data-sorting=true], [data-listsearch=true]'),
            callback = productList.data('callback');
            
        filterItems(productList, productList.data('item-callback'));    
        callbackfunction(callback, productList);
      };

    //Add filtertab before selected filter list
    var addFilterTab = function(element, value, type) {
      var prefix = type === "limited" ? "and" : "or";
      var selectedFilter = element.closest('[data-widget=selectList-wrap]');
      selectedFilter.before('<a class="tsBtn--filter-remove" data-widget="remove-filter" data-widget-type="' + type + '" name="' + value + '">' + element.closest('label').text() + '<i class="tsIcon-Close"></i> </a> <span class="tsFilter-prefix">' + prefix + '</span>');
      hideTabFromSelectList(element);
    };

    //Hide selected value in selected filter list
    var hideTabFromSelectList = function(element) {
      element.closest('li').addClass('visuallyhidden');
      checkIfSelectListHaveSelectableElements(element.closest('ul'));
    };

    //Removes selected filter tab
    var removeFilterTab = function(element, value, filterlist) {
      showTabInSelectList(element, value);
      var prev = filterlist.prev(".tsListFilter-collapse, .tsListFilter-no-collapse"),
      key = prev.data('index'),
      type = element.data('widget-type'),
      hashkey = prev.next('[data-widget=filter]').data('filter-id'),
      callback = filterlist.data('item-callback'),
      selectkey = 0,
      parentoffset = element.closest('[data-widget="list-container"]').offset(),
      selectkey = element.nextAll('[data-widget="selectList-wrap"]').eq(0).find('ul').data('widget-selectid');
      removeValue(value, type, key, hashkey, selectkey, parentoffset);
      element.next('span').remove();
      element.remove();
      filterItems(filterlist, callback);
    };

    //Show selected tab in filter list OBS! Catch value error on & sign
    var showTabInSelectList = function(element, value) {
      var parentElement = element.parent().find('input[value=' + value + ']');
      parentElement.removeAttr('checked');
      parentElement.closest('li').removeClass('visuallyhidden');
      checkIfSelectListHaveSelectableElements(parentElement.closest('ul'));
    };

    //Hides/shows filter list if has values
    var checkIfSelectListHaveSelectableElements = function(list) {
      var elements = list.find('li'),
      hiddenElements = list.find('li.visuallyhidden'),
      parent = list.closest('[data-widget="selectList-wrap"]'),
      trigger = parent.find('[data-widget="selectList-trigger"]');

      if (elements.length === hiddenElements.length) {
        parent.addClass('visuallyhidden');
        trigger.addClass('visuallyhidden');
        parent.prev('span').addClass('visuallyhidden');
      } else {
        parent.removeClass('visuallyhidden');
        trigger.removeClass('visuallyhidden');
        parent.prev('span').removeClass('visuallyhidden');
      }
    };

    var animatelist = function(list, items, parent, elementwidth, noElementsFoundText, callback) {
      if (callback) {
        callbackfunction(callback, list);
      } else {
        parent.animate({
          opacity: 0,
          height: 'auto'
        }, animationtimer, "linear", function() {

          items.removeClass('show');
          var collapse = parent.closest('[data-widget="collapse"]');

          $.each(list, function(i) {
            $(list[i]).addClass("show");
            if (i === list.length - 1) {
              noItemsFound(parent, items, parent.parent(), noElementsFoundText, collapse);
              addCollapse(collapse);
              parent.animate({
                opacity: 1,
                height: 'auto'
              }, animationtimer, "linear", function() {

              });
            }
          });

          if (list.length === 0) {
            noItemsFound(parent, items, parent.parent(), noElementsFoundText, collapse);
            parent.animate({
              opacity: 1,
              height: 'auto'
            }, animationtimer, "linear", function() {});
          }
        });
      }

    };

    //check if filterarrays are the same
    var comp = function(temp, pfilter) {
      temp.sort();
      pfilter.sort();
      return temp.join() === pfilter.join();
    };

    var addNewFilterItem = function(thiselement) {
      var element = thiselement.find("input"),
          type = element.data('widget-type'),
          filterlist = element.closest('.tsListFilter-collapse, .tsListFilter-no-collapse').next('[data-widget=filter]'),
          callback = filterlist.data('item-callback');

      if (typeof type !== 'undefined') {
            //Add remove filter
            addValue(element.val(), type, element);
            //Add filter (hide) to itemlist
            filterItems(filterlist, callback);
            callback = filterlist.data('callback');
            callbackfunction(callback, filterlist);
          }
        };

        var removeFilterItem = function(thiselement) {
          var element = thiselement.find('input'),
          filter = thiselement.closest('.tsListFilter-collapse, .tsListFilter-no-collapse'),
          filterlist = filter.next('[data-widget=filter]'),
          type = element.data("widget-type"),
          key = filter.data('index'),
          hashkey = filter.next('[data-widget=filter]').data('filter-id'),
          callback = filterlist.data('item-callback'),
          selectkey = 0,
          value = "",
          parentoffset = filter.offset();

          if (type === "package") {
            selectkey = thiselement.closest('[data-widget=selectList]').data('widget-selectid');
            value = element.val();
        } else { //Mobile fix
          selectkey = thiselement.find('ul').data('widget-selectid');
          value = thiselement.find('[data-select-trigger=mobile]').attr("value");
        }

        removeValue(value, type, key, hashkey, selectkey, parentoffset);
        filterItems(filterlist, callback);
        callback = filterlist.data('callback');
        callbackfunction(callback, filterlist);
      };

      var sortthis = function(element) {
        var value = element.val(),
        parentList = element.closest('[data-widget="list-container"]'),
        currentValueElement = parentList.siblings('[data-widget=selectList-trigger]'),
        sortList = element.closest('.tsListFilter-collapse, .tsListFilter-trigger-outer').next('[data-sorting="true"]'),
        callback = sortList.data('callback'),
        key = sortList.data("filter-id"),
        parentoffset = parentList.offset();

        var arr = [];
        arr.push(value);
        setSelectedValuesToSelectbox(value, element, currentValueElement, parentList, parentoffset);
        addOrRemoveHash(arr, key, "sorting");

        var p = sortList.find(sortList.data('listtype'))[0],
        items = $(p).children();

        sortItems(value, items, sortList, sortList.data('listtype'), callback);
      };

      var noItemsFound = function(list, items, parentList, noElementsFoundText, collapse) {
        var hiddenItems = $(list).children().not('.show');

        if (items.length === hiddenItems.length && typeof(noElementsFoundText) !== 'undefined') {
          if (parentList.find('.tsFilter-noElementsFoundText').length < 1) {
            parentList.prepend('<p class="tsFilter-noElementsFoundText">' + noElementsFoundText + '</p>');
          }
        } else {
          parentList.find('.tsFilter-noElementsFoundText').remove();
        }
        addCollapse(collapse);
      };

      var callbackfunction = function(callback, element) {
        if (typeof callback !== "undefined" && callback !== "") {
          callback = callback.split('.');
          if (callback.length > 1) {
            window[callback[0]][callback[1]](element);
          } else {
            window[callback[0]](element);
          }
        }
        filterChanged = false;
      };

      var removeSpaces = function(content) {
        content = content.replace(/\s/g, "");
        return content;
      };

    //Cleans filter values from space, åäö
    var cleanContent = function(content) {
      if (typeof content !== "undefined") {
        content = content.toLowerCase();
        content = content.replaceAll('å', 'a');
        content = content.replaceAll('ä', 'a');
        content = content.replaceAll('ö', 'o');
        content = content.replaceAll('-', '');
        content = content.replaceAll(',', '');
        content = removeSpaces(content);
      }
      return content;
    };

    return {
      SetElementHeights: function(parent) {
        var list = $(parent.find(parent.data('listtype'))[0]),
            element = $(list.children()[0]),
            eheight = element.outerHeight() + parseInt(element.css('margin-top')) + parseInt(element.css('margin-bottom')),
            ewidth = element.outerWidth() + parseInt(element.css('margin-right')) + parseInt(element.css('margin-left'));
      },

      FilterOnHash: function() {
        var hString = hash.get(),
            hasKeys = 'keys' in Object.prototype ? Object.keys(hString).length > 0 : checkIfArrayHasKeys(hString);

        if ($('[data-sorting=true]').length > 0) {
          $('[data-sorting=true]').each(function() {
            var filterlist = $(this),
                id = filterlist.data('filter-id'),
                sort = hString["sorting-" + id];
            if (typeof sort !== "undefined") {
              if (!hasKeys) {
                return;
              }
              var element = filterlist.siblings(".tsListFilter-trigger, .tsListFilter-collapse").find('input[value=' + sort + ']'),
              parentList = element.closest('ul'),
              currentValueElement = parentList.siblings('[data-widget=selectList-trigger]');
              setSelectedValuesToSelectbox(sort, element, currentValueElement, parentList);

              var p = filterlist.find(filterlist.data('listtype'))[0],
              items = $(p).children();
              sortItems(sort, items, filterlist, filterlist.data('listtype'), filterlist.data('callback'));

              items.addClass('show');
            }
          });
        }
        
        if ($('[data-widget=listFilter]').length > 0) {
          $('[data-widget=listFilter]').each(function() {
            var filterlist = $(this).closest('.tsListFilter-collapse, .tsListFilter-no-collapse').next('[data-widget=filter]'),
            filter = $(this),
            callback = filterlist.data("item-callback"),
            id = filterlist.data('filter-id');
            if (hasKeys) {
              var multi,
              keys = checkIfArrayHasKeys(hString, "multi-" + id);
              if (typeof keys !== 'undefined') {
                $.each(keys, function(i) {
                  multi = hString[keys[i]];
                  if (typeof multi !== "undefined") {
                    multi = multi.split('|');
                    $.each(multi, function(j) {
                      checkAndSetValue(multi[j], filter);
                    });
                  }
                });
              }

              var limited = hString["limited-" + id];
              if (typeof limited !== 'undefined') {
                limited = limited.split('|');
                $.each(limited, function(i) {
                  checkAndSetValue(limited[i], filter);
                });
              }

              var pack,
              keys = checkIfArrayHasKeys(hString, "package-" + id);
              if (typeof keys !== "undefined") {
                $.each(keys, function(i) {
                  pack = hString[keys[i]];
                  if (typeof pack !== "undefined") {
                    pack = pack.split('|');
                    var outer = $('.tsListFilter-trigger-outer'),
                    list = outer.find('.tsSelectPackage');
                    outer.css('height', list.height() + outer.height() + 10);
                    list.addClass('active');
                    list.removeClass('hide');
                    list.siblings('a').addClass('active');

                    $.each(pack, function(j) {
                      var trigger = filter.find('input[value="' + pack[j] + '"]');
                      trigger.siblings('[data-widget=selectPackageItem-pic]').addClass("active");
                      checkAndSetValue(pack[j], filter);
                    });
                  }
                });
              }
              filterItems(filterlist, callback);
              if (typeof multi !== "undefined" || typeof limited !== "undefined") {
                toggleFilter(filter);
              }
            }
          });
        }

        // Filter list
        if ($('[data-listsearch=true]').length > 0) {
          $('[data-listsearch=true]').each(function() {
            var filterlist = $(this),
            id = filterlist.data('filter-id'),
            callback = filterlist.data("search-callback"),
            search = hString["query-" + id];

            if (typeof search !== 'undefined' && hasKeys) {
              setSelectedValueToSearch(search);
              searchItems(search, filterlist, filterlist.data('listtype'), callback);
            }
          });
        }

        if (!hasKeys) {
          var list = filterlist.find(filterlist.data('listtype'))[0],
          items = $(list).children();
          items.addClass("show");
        }


        var keys = hash.get('prev');
        if (!hasKeys || hasKeys.length === 0 || (hasKeys.length > 0 && typeof keys !== "undefined" && keys.length > 0)) {
          $("[data-visual=productList]").each(function() {
                //var items = $(this).find("li.tsProductList-Item");
                //items.addClass("show");
              });
          $("[data-visual=masonry]").each(function() {
            var items = $(this).find(".tsFluidGrid-item");
            items.addClass("show");
          });
          $(".tsLibrary-small").each(function() {
            var items = $(this).find("> li");
            items.addClass("show");
          });
        }
      },

        //Sets the absolute position to selectLists
        SetSelectListPositions: function() {
            //var outerWidth = outerWidth = $('.tsListFilter-outer').width();
            $('[data-widget=selectList-wrap], .tsSelectList-wrap--alt').each(function() {


              var list = $(this).find(".tsSelectList"),
              listWidth = list.width() / 2;
                //console.log(list.width());
                //console.log(list);
                list.css("margin-left", -listWidth);
              });
          },

          CheckCookie: function() {
            var cookie = getCookie("showFilterHint");
            if (!cookie && typeof cookie !== "undefined") {
              if ($('[data-widget=filter]').length > 0) {
                    //Add filter before itemlist
                    $('[data-widget=filter]').each(function() {
                      var trigger = $(this).closest('[data-widget="list-container"]').find('[data-widget-control="collapse-trigger"]');
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
                if (isWithinInterval(hideCollapseMin, hideCollapseMax)) {
                  var filters = $('[data-widget=filter]'),
                  sortings = $('[data-sorting="true"]');

                  $('.tsListFilter-collapse').remove();
                  $('.tsListFilter-trigger').remove();
                  $('.tsListFilter-trigger-outer').remove();
                  $('.tsListFilter').remove();

                  initFilter(filters);
                  initSort(sortings);
                }

            //Change the look and feel of the packagefilter
            var desktop,
            mobile;
            if (mediaqueriesMin("mqLarge") && (ListFilter.displayMode === "mobile" || typeof ListFilter.displayMode === "undefined")) { //Desktop
              desktop = $('[data-select-trigger=desktop]');
              mobile = $('[data-select-trigger=mobile]');
              mobile.css('display', 'none');
              desktop.css('display', '');
              if (mobile.hasClass('active')) {
                mobile.siblings('ul').addClass('hide');
                mobile.removeClass('active');
              }
                //Clear filtersettings on mobile
                var mobileItems = $('[data-select-trigger=mobile]');
                $(mobileItems).each(function(i) {
                  if ($(mobileItems[i]).attr("value") !== "default" && typeof $(mobileItems[i]).attr("value") !== "undefined") {
                    enableSelectBox($(this));
                  }
                });
                ListFilter.displayMode = "desktop";
            } else if (!mediaqueriesMin("mqLarge") && (ListFilter.displayMode === "desktop" || typeof ListFilter.displayMode === "undefined")) { //Cellphone
              desktop = $('[data-select-trigger=desktop]');
              mobile = $('[data-select-trigger=mobile]');
              desktop.css('display', 'none');
              mobile.css('display', '');
              if (desktop.hasClass('active')) {
                desktop.siblings('div').addClass('hide');
                desktop.removeClass('active');
                $('.tsListFilter-trigger-outer').css('height', '');
              }
                //Clear filtersettings on desktop
                ListFilter.ResetPackageFilter();
                ListFilter.displayMode = "mobile";
              }
            },

            CheckCategories: function(element) {
              var items = element.closest('[data-widget=selectList]').find("img"),
              categories = element.closest('ul').find(".active[data-widget=selectPackage-trigger]");
            if (categories.length > 0) { //Some category is chosen
              $(items).each(function(i) {
                var filterData = cleanContent($(items[i]).data('filtertags'));
                if (typeof filterData !== "undefined") {
                  var itemFilter = filterData.split('|'),
                  show = false;
                        //Go through all categories and if any of them match the given items filter properties show it, otherwise hide it
                        $(categories).each(function(j) {
                          var cat = cleanContent($(categories[j]).data('value'));
                          if ($.inArray(cat, itemFilter) > -1) {
                            show = true;
                            return;
                          }
                        });
                        //Only change the object if it goes from hidden to visible or the opposite
                        if (show && $(items[i]).hasClass('visuallyhidden')) {
                          $(items[i]).removeClass('visuallyhidden');
                        } else if (!show && !$(items[i]).hasClass('visuallyhidden')) {
                          if ($(items[i]).hasClass('active')) {
                            removeFilterItem($(this).parent());
                            $(items[i]).removeClass("active");
                          }
                          $(items[i]).addClass('visuallyhidden');
                        }
                      } else if (!$(items[i]).hasClass('visuallyhidden')) {
                        if ($(items[i]).hasClass('active')) {
                          removeFilterItem($(this).parent());
                          $(items[i]).removeClass("active");
                        }
                        $(items[i]).addClass('visuallyhidden');
                      }
                    });
            } else { //No category is chosen, show all objects
              ListFilter.ClearCategories();
            }
          },

          ClearCategories: function() {
            var items = $('[data-widget=selectPackageItem-pic]');
            $(items).each(function(i) {
              if ($(items[i]).hasClass('visuallyhidden')) {
                $(items[i]).removeClass('visuallyhidden');
              }
            });
            var categories = $('[data-widget=selectPackage-trigger]');
            $(categories).each(function(i) {
              if ($(categories[i]).hasClass('active')) {
                $(categories[i]).removeClass('active');
              }
            });
          },

          ResetPackageFilter: function() {
            ListFilter.ClearCategories();
            var items = $('[data-widget=selectPackageItem-pic]');
            $(items).each(function(i) {
              if ($(items[i]).hasClass('active')) {
                removeFilterItem($(this).parent());
                $(items[i]).removeClass("active");
              }
            });
          },

          Init: function() {
            var filters = $('[data-widget=filter]'),
            searchs = $('[data-listsearch="true"]'),
            sortings = $('[data-sorting="true"]');

            initFilter(filters);
            initSort(sortings);
            initSearch(searchs);

            if (sortings.length > 0 || filters.length > 0 || searchs.length > 0) {
                //Activate/deactivate package lists
                $('body').on('click', '[data-widget=selectPackage-trigger]', function(e) {
                  e.stopPropagation();
                  filterChanged = true;
                  var trigger = $(this);
                  trigger.toggleClass('active');
                  ListFilter.CheckCategories(trigger);
                });

                //Select package items
                $('body').on('click', '[data-widget=selectPackageItem-pic]', function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                  filterChanged = true;
                  if ($(this).hasClass('active')) {
                    removeFilterItem($(this).parent());
                    $(this).removeClass("active");
                  } else {
                    addNewFilterItem($(this).parent());
                    $(this).addClass("active");
                  }
                });

                //Show/hide selectList
                $('body').on('click', '[data-widget=selectList-trigger]', function(e) {
                  e.stopPropagation();
                  var list = $(this).siblings('[data-widget=selectList]'),
                  open = list.hasClass('hide');
                  $('[data-widget=selectList-trigger]').removeClass("active");
                    //open ? $(this).addClass("active") : $(this).removeClass("active");

                    if (open && list.hasClass('tsSelectPackage')) {
                      var outer = $(this).closest('.tsListFilter-trigger-outer');
                      outer.css('height', list.height() + outer.height() + 10);
                    } else {
                      $(this).closest('.tsListFilter-trigger-outer').css('height', '');
                      ListFilter.ResetPackageFilter();
                    }

                    $('.tsSelectList, .tsSelectPackage').addClass('hide');
                    //open ? list.removeClass('hide') : list.addClass('hide');
                  });

                $('body').on('click', '.tsSelectPackage, a', function(e) {
                  e.stopPropagation();
                });

                //Close all select boxes on body click
                $('body').click(function() {
                  var list = $('.tsSelectList, .tsSelectPackage');
                  list.addClass('hide');
                  list.siblings('a').removeClass('active');
                  $('.tsListFilter-trigger-outer').css('height', '');
                  ListFilter.ResetPackageFilter();
                });
              }
            }
          };
        }();
