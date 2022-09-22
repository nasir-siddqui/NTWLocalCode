  app.filter('selectlistFilter', function() {
    return function(items) {

      if(items!=undefined)
      {
        return items.filter(function(element, index, array) {
          return !element.checked || element.header;
        });
      }
      return false;
    };
  });
  app.filter('selectlistReverse', function() {
    return function(items) {
     if(items!=undefined)
     {
      return items.filter(function(element, index, array) {
        return element.checked && !element.header;
      });
    }
    return false;
  };
});

