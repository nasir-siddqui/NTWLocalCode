app.directive('tsSelect', function($timeout) {
  return {
    restrict: 'C',
    template: '<option data-ng-repeat="item in items" value="{{item.value}}" data-ng-bind="item.label" data-repeat-done="refresh()" data-text="{{item.htmlText}}"></option>',
    transclude: true, 
    scope: {
      items: "=",
      defaultItem: "=",
      select: "=",
      callback: "&onChanged",
      options: "=",
      ngDisabled: "=",
      ngClass: "="
    },
    link: function (scope, elem, attrs) {

      var defaults = {
        //Add dynamic width to dropdown
        dynamicWidth: false,
        //Used for overflow css inside list
        overflowCss: false, 
        //Sets automatic positioning
        dynamicPositioning: true,
        //Allows dropdown to use mobile select
        mobile: true
      };

      var options = $.extend(defaults, scope.options); 
      var element = $(elem);
      var ready = false;

      scope.initiate = function() {

        var overflowClass = options.overflowCss ? " tsSelectBox-AllowOverflowCss" : "";

        var ua = navigator.userAgent || navigator.vendor || window.opera;
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices 
        var isMobileDev = (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);

        element.selectBoxIt({
          autoWidth: options.dynamicWidth,
          dynamicPositioning: options.dynamicPositioning,
          downArrowIcon: "tsIcon-ArrowDown2",
          upArrowIcon: "tsIcon-ArrowUp2",
          isMobile: function() {
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices 
            return options.mobile ? isMobileDev : false;

          },

          'theme': {
            'focus': 'tsSelectBox-focus',
            'hover': 'tsSelectBox-hover',
            'enabled': 'tsSelectBox-enabled',
            'disabled': 'tsSelectBox-disabled',
            'arrow': 'tsSelectBox-default-arrow',
            'button': 'tsSelectBox-btn',
            'list': 'tsSelectBox-list' + overflowClass,
            'container': 'tsSelectBox-container',
            'open': 'tsSelectBox-open'
          },

          create: function() {
            scope.$watch('select', function() {
              scope.refresh();
            });

            ready = true;
          }
        });

        element.bind({
          "open": function() {
            if(isMobileDev)
            {
              $(".tsSelect").each(function(){
                var select = $(this).data("selectBox-selectBoxIt");
                if(select)
                {
                  select.disable();
                }
              });
              element.data("selectBox-selectBoxIt").enable();
            }
          },
          "close": function() {
            if(isMobileDev)
            {
               $(".tsSelect").each(function(){
                  var select = $(this).data("selectBox-selectBoxIt");
                  if(select)
                  {
                    select.enable();
                  }
              });            
            }
          }
        });
      };

      scope.refresh = function() {
        if(ready) {
          // jQuery hack to select option
          if(scope.select && !element.hasClass("ng-dirty")) { 
            element.val(scope.select);
          }

          ///Reload select box it, when all repeated
          element.data("selectBoxSelectBoxIt").refresh();
        } 
      }

      scope.initiate();
    }
  }
});

app.directive('repeatDone', function($timeout) {
  return {
    link: function (scope, elem, attrs) {
      // Hack to make it last call
      if (scope.$last) { $timeout(function() { scope.$eval(attrs.repeatDone); }, 0); }
    }
  }
});
