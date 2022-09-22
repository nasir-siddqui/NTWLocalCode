app.directive('listHeight', function($timeout, $compile) {
    return {
        link: function(scope, element, attrs) {
                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                  if (newVal !== oldVal) {
                    $timeout(function() {
                            var  totalHeight = 0;
                            $(element).children('li').each(function(){
                                totalHeight += parseInt($(this).outerHeight()) + $(this).css('margin-top') +  $(this).css('margin-bottom');
                            });

                 element.css('height', totalHeight + 'px');
            }, 0);
                  }
                }, false);
                
           


      }
    };
});
var index = 0;
app.directive('toplistItem', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            if(element.hasClass('tsContentList-DefaultItem'))
            {
                element.removeClass('tsContentList-DefaultItem');
                var type = "";
                if(attrs.ngBind!=undefined)
                    type = attrs.ngBind.toString();

                if(attrs.ngBind != undefined && type.substring(0, 6) == 'guides')
                {
                    scope.guideToplist +=  element[0].outerHTML;
                }
                else
                {
                    if(scope.faqItems == undefined)
                    {
                        scope.faqItems = [];
                    }
                    scope.faqItems[index] ={checked: false};
                    index++;
                    scope.faqToplist += element[0].outerHTML;
                }
            }
        }
    };
});

app.directive('faq', ['$compile', '$parse', function($compile, $parse) {
    return {
        link: function(scope, element, attrs) {
            var parsed = $parse(attrs.ngBindHtml);
            function getStringValue() { 
                return (parsed(scope) || '').toString(); 
            }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {



                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves

                element.data('ng-class', '{active: }');

                 scope.loadingGuides = false;
                 scope.loadingFaq = false;

            });
      }
    };
}]);

//
app.directive('collapsePreview', ['$compile', '$parse', function($compile, $parse) {
    return {
        restrict: 'A',                
        link: function(scope, element, attrs) {

            scope.$watch(attrs.ngBindHtml, function(newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    if(!scope.toplist)
                    {
                        var small = mediaqueriesMin('mqXsmall') && mediaqueriesMax('mqLtMedium');
                        if(small)
                        {
                            if(element.closest('.tsModuleSpace').siblings('a').length == 0)
                            {
                                element.closest('.tsModuleSpace').after('<a data-ng-click="showMore()">Visa fler</a>');
                            }
                        }
                        else
                        {
                            if(element.closest('.tsContentSplit--Half').find('a').length == 0)
                            {
                                element.closest('.tsContentSplit--Half').append('<a class="" data-ng-click="showMore()">Visa fler</a>');
                            }
                        }
                    }
                }
            }, false);  
        }
    }
}]);