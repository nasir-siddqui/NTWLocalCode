  app.filter('clipText', function() {
    return function(input, letters, postFix) {
      return input && input.length > letters ? input.substring(0, letters) + (postFix ? postFix : ' ...') : input;
    };
  });