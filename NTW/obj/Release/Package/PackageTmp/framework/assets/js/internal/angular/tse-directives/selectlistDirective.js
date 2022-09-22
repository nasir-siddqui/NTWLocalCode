
app.directive('tsSelectListTrigger', function($document){
  return {
    restrict: 'C',
    link: function(scope, elem, attrs, ctrl) {
      elem.bind('click', function(e) {
        // this part keeps it from firing the click on the document.
        e.stopPropagation();
      });
        $('body').bind('click', function() {
            angular.forEach(scope.selectlists, function(value, key){
              scope.selectlists[key] = false;
             });
             scope.$apply(); 
        });
      
    }
  }
});
app.directive('tsSelectList', function() {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
          var timeout = 300;
          if(attrs.ngModel != undefined)
          {
            scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
              if (newVal !== oldVal) {
                setTimeout(function(){
                  var elementOffset = getOffset(elem[0]).left;
                  var width = elem[0].offsetWidth / 2;
                  elem.css('margin-left',-width + 'px');

                  if(elementOffset < (width/2))
                  {
                    width = (width-10 + elementOffset);
                  }
                  elem.css('margin-left',-width + 'px');
                }, timeout);
              }
            }, false);
          }
        }
    };
});



