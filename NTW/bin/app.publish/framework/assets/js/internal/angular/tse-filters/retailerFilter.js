
mapApp.filter('retailerfilter', function() {
  return function(items, search) {
    if (!search) {
      return items;
    }
 	search = search.toLowerCase();
    return items.filter(function(element, index, array) {
      return element.streetaddr.toLowerCase().indexOf(search) > -1 || element.city.toLowerCase().indexOf(search) > -1 || element.zip.toLowerCase().indexOf(search) > -1;
    });

  };
});