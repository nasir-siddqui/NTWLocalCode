/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

  $.fn.tsToggle = function(options) {
    options = $.extend({ target: null }, options);

    return this.each(function() {

      var selfVisible = $(this).is(':visible');
      var targetVisible = $(options.target).is(':visible');

      $(this).bind('fade.tsToggle', function() {
        selfVisible = !selfVisible;
        if (!selfVisible && targetVisible) {
          toggle();
        }
      });

      var toggle = function() {
        targetVisible = !targetVisible;
        if (options.onToggle) {
          options.onToggle(targetVisible);
        }
        var selector = $(options.target).selector;

        if (selector === ".tsExpand-container") {
          $(options.target).slideToggle('fast').trigger('fade.tsToggle');
        }
        else {
          $(options.target).fadeToggle('fast').trigger('fade.tsToggle');
        }

      };

      $(this).click(function(e) {
        e.preventDefault();
        toggle();
      });
      
    });
  };

  $.fn.tsToggleManage = function(options) {
    options = $.extend({ target: null }, options);
    return this.each(function() {

      var toggle = function() {
        $(options.target).toggle();
      };

      $(this).click(function(e) {
        e.preventDefault();
        toggle();
      });

    });

  };
 
});