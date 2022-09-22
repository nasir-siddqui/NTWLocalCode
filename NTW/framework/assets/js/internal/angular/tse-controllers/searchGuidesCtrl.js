

'use strict';

app.controller('searchGuidesCtrl', ['$scope', '$routeParams', '$location', '$q','$timeout', '$sce','$compile','json', function($scope, $routeParams, $location, $q, $timeout, $sce, $compile, json)  { 

  //#region variables
  // displayname variables url
  var searchName = 'search',
      pageGuideName =  'guidepage',
      pageFaqName =  'faqpage',
      categoryName = 'categories',
      tagName = 'tags';
      //,sortName = 'sort';
  // Timer
  var timer,
      timeout = 500,
      expectedRequestId = 0,
      notInit =true,
      init =true;
      //Urls

  var guidePageSize = 10;
  var guidePageSizeSmall = 3;
  var faqPageSize = 15;
  var faqPageSizeSmall = 3;


      var guideurl =  'http://131.116.53.5:41680/guideJson.html'; //magnolia
      var faqeurl =  'http://131.116.53.5:41680/guideJson.html'; //developer-computer
    
      $scope.guideToplist = "";
      $scope.faqToplist = "";

      $scope.guidePaging = {
        'current': 1,
        'max' : 0
      };
      $scope.faqPaging = {
        'current': 1,
        'max' : 0
      };

    
      $scope.filterCategories = {
        'categories' : ""
      }; 
      $scope.filterTags = {
        'selectedTags': ""
      };

      $scope.categories = [];
      $scope.tTags = [];

      $scope.toplist = true;
      $scope.faqItems = [];

  //#endregion     
    $scope.showMore = function()
    {
        alert('say what!');
    }
    $scope.collapseChange = function(value, model, index) {
      $scope[model][index].checked = !value;
        if(!$scope.$$phase) {
          $scope.$apply();
        };
    }


      var initGuideList = function (argument) {
         $scope.oldGuides = $scope.guides;
          //$scope.guides = null;
          $scope.loadingGuides = true;
          $scope.loadingFaq = true;
          if(!$scope.$$phase) {
                $scope.$apply();
          };
          loadData();
      }
       $scope.$watch('[categories, tTags, guidePaging.currentPage, faqPaging.currentPage]', function(newValue, oldValue){ 
        if(!init)
        {
            if(newValue !== oldValue)
            {
              initGuideList();
            }
          }
        }, function() { }, true);

       $scope.searchChange = function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
         initGuideList();
       }, timeout);
      };
     
      $scope.update = function(element) {
        if(element.header)
        {
            element.checked = false;
           
        } 
      };
      $scope.lastSelectElement = function(elements)
      {
        if(elements!=undefined)
        {
          var counter = 0;
          angular.forEach(elements, function(value, key){
            if(value.checked || value.header)
            {
              counter ++;
            }
          });
          return counter != elements.length;
        }
        return false;
      }


        //Init
      $scope.init = function(){
        $scope.isCollapsed = false;
          $location.path("/");

         
          $scope.search = $location.search()[searchName] != undefined ? $location.search()[searchName].replaceAll('+',' ') : '';
          
   
          filterValues();

          clearTimeout(timer);
          timer = setTimeout(function(){
         
            init = false;
            initGuideList();
            
          }, timeout);
          
      };
    
      var setUrl = function(parameters)
      {
        $location.search(parameters);
      }
      var fixParameters = function (parameters) {
         for(var key in parameters) {
          if(parameters[key] == "" || parameters[key] == null || parameters[key] == undefined) {
            delete parameters[key];
          }
        }
        return Object.keys(parameters).length > 0 ? parameters : [];
      }
    


    var location = function () {

      var locationParameter = {};
          locationParameter[searchName] = $scope.search.replaceAll(' ','+');
          locationParameter[categoryName] = $scope.filterCategories.name != undefined ? $scope.filterCategories.name.replaceAll(' ','-') : "";
          locationParameter[tagName] = $scope.filterTags.name!= undefined ? $scope.filterTags.name.replaceAll(' ','-') : "";
      locationParameter = fixParameters(locationParameter);
      setUrl(locationParameter);
    }




    var hasHashedValues = function()
    {
      var search = 0;
      if($scope.tTags!=undefined)
      {
        var selectedTags = $scope.tTags.filter(filterChecked);
         $scope.filterTags.selectedTags = selectedTags.length > 0 ? selectedTags:[]; 
      }
      if($scope.categories!=undefined)
      {
        var selectedCat = $scope.categories.filter(filterChecked);
        $scope.filterCategories.categories = selectedCat.length > 0 ? selectedCat : [];
      }
      if($scope.search!=undefined)
      {
        search = $scope.search;
      }
      return search.length > 0 || $scope.filterCategories.categories.length > 0 || $scope.filterTags.selectedTags.length > 0;

    };
    var faqParam = {};
    var guideParam = {};
    var getParameters = function() {

      var returnParameters = {};
      var small = isSmallSize();
      fixedTags();
      fixedCategories();
      
      faqParam = fixParameters({
        'searchQuery' : $scope.search.replaceAll(' ', '+'), 
        'category': $scope.filterCategories.values.replaceAll(' ', '+'), 
        'tag': $scope.filterTags.values.replaceAll(' ', '+'),
        'pageSize': small ? faqPageSizeSmall : faqPageSize
      });

      guideParam = fixParameters({
        'searchQuery' : $scope.search.replaceAll(' ', '+'), 
        'category': $scope.filterCategories.values.replaceAll(' ', '+'), 
        'tag': $scope.filterTags.values.replaceAll(' ', '+'),
        'pageSize': small ? guidePageSizeSmall : guidePageSize
        
      });

      
    }
    var fixedTags = function() {
      var selectedTags = $scope.filterTags.selectedTags, 
          tTags='',
          tTagsnames='';

      if(selectedTags != undefined)
      {
              for (var i = 0; i < selectedTags.length; i++) {
            tTags += selectedTags[i].value;
            tTagsnames += selectedTags[i].name.replaceAll(' ', '-');
            if(i != selectedTags.length-1)
            {
              tTags += "+";
              tTagsnames += "+";
            }
        }
      }
      $scope.filterTags = {
          tags:selectedTags,
          name: tTagsnames,
          values: tTags
      };

    };
    var fixedCategories = function() {
      var categories='', 
          categorynames='',
          selectedCategories = $scope.filterCategories.categories;

        if(selectedCategories != undefined)
        {
          for (var i = 0; i < selectedCategories.length; i++) {
              categories += selectedCategories[i].value;
              categorynames += selectedCategories[i].name.replaceAll(' ', '-');;

              if(i != selectedCategories.length-1)
              {
                  categories += "+";
                  categorynames += "+";
              }
          }
      }
      $scope.filterCategories = {
          categories: selectedCategories,
          name: categorynames,
          values: categories
      };
    };

    var loadData = function() {

      if(hasHashedValues())
      {
        expectedRequestId ++;
        getParameters();
       

        json.getJsonTwoCalls(faqeurl, faqParam, guideurl, guideParam).then(
            function(data) {
              getFaqs(data, faqParam);
              getGuides(data, guideParam);
              $scope.toplist = false;
            });
       
        location();  
      }
      else
      {
        $scope.errorguide = false;
        $scope.errorguide = false;
        $scope.guides = $sce.trustAsHtml($scope.guideToplist);
        $scope.faq = $sce.trustAsHtml($scope.faqToplist);

        $scope.toplist = true;
        $location.search({});
        $location.$$compose();
      }
      
      if(!$scope.$$phase) {
            $scope.$apply();
          };

    };

    var getFaqs = function(data, faqParam){
      $scope.faqPaging = {
        'max' : (data.nrOfPages * faqParam.pageSize)
      };

      $scope.faq = $sce.trustAsHtml(faqHtml(data[0].guide))
      $scope.setheight = true;
      $scope.loadingFaq = false;
      
    };

    var getGuides = function(data, guideParam){
      $scope.guidePaging = {
        'max' : (data.nrOfPages * guideParam.pageSize)
      };

      $scope.guides = $sce.trustAsHtml(guideHtml(data[1].guide));
      $scope.setheight = true;
      $scope.loadingGuides = false;
             
    };
    var isSmallSize = function (){
      return mediaqueriesMin('mqXsmall') && mediaqueriesMax('mqLtMedium');
    };

    //Clear open 
    var clearFaqStates = function(faq)
    {
      for (var i = 0; i < faq.length; i++) {
        $scope.faqItems[i] = { checked: false };
      };
    };
    //Dynamic guide template
     var guideHtml = function(guides){

      var html = '';
      if(guides != undefined)
      {
        for (var i = 0; i < guides.length; i++) {
          html +='<li class="tsAnimation--FadeIn"> <a class="tsContentList-Item" href="';
          html += guides[i].url;
          html +='">';
          html +='<div class="tsContentList-Inner"><span ng-bind="guide['+i+'].title">';
          html += guides[i].title;
          html +=   '</span><b ng-bind="guide['+i+'].title" class="tsContentList-Tag">';
          //Change to subname
          html += guides[i].title;
          html +=  '</b></div></a> </li>';
        };    
        return html;
      }
    }
    //Dynamic faq template
    var faqHtml = function(faq){
      clearFaqStates(faq);
      var html = '';
      if(faq != undefined)
      {
        for (var i = 0; i < faq.length; i++) {

          var icon =  "{'tsIcon-ArrowUp2': faqItems["+i+"].checked}";

          html += '<li class="tsAnimation--FadeIn">';
          html += '<a href="#" data-ng-click="faqItems['+i+'].checked = !faqItems['+i+'].checked"  data-ng-class="{active: faqItems['+i+'].checked}"  class="tsContentList-Item--Compact" >';
          html += '<span class="tsContentList-Inner" >'+ faq[i].title +' </span>';
          html += '<i class="tsIcon-ArrowDown2"></i>'; /* data-ng-class=' + icon+ '></i>';*/
          html += '</a><div data-collapse="!faqItems['+i+'].checked" data-ng-click="faqItems['+i+'].checked = !faqItems['+i+'].checked" class="tsContentList-Expandable"><div>'+ faq[i].title +'</div></div></li>';
        };    
        return html;
      }
    }
     //Filters
    var filterChecked = function(arr)
    {        
        return arr.checked;
    };

 //Get and set filters values
  var filterValues = function(){
        var tags = $location.search()[tagName] != undefined && $location.search()[tagName] != "" ? $location.search()[tagName].replaceAll('-',' ').split('+'): [];
        var categories = $location.search()[categoryName] != undefined && $location.search()[categoryName] != "" ? $location.search()[categoryName].replaceAll('-',' ').split('+') : [];

        json.getObjects('categories').then(
          function(data) { 
            $scope.categories = data;
            angular.forEach($scope.categories, function(value, key){
              if(categories.indexOf(value.name) != -1)
                $scope.categories[key].checked = true;
            });
          });
        json.getObjects('tags').then(
          function(data) { 
            $scope.tTags = data;
            angular.forEach($scope.tTags, function(value, key){
            if(tags.indexOf(value.name) != -1)
                $scope.tTags[key].checked = true;
          });
        });
     };

  }]);
