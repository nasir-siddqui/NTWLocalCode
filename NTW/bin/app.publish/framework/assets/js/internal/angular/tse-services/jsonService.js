
jsonApp.factory('json', function ($http, $q) {
  var cachedResult = [];
  return {
    getJsonCached: function(url)
    {
      if(cachedResult.length > 0 )
      {
        deferred.resolve(cachedResult);
        return deferred.promise;
      }
      var deferred = $q.defer();
      $http({method: 'GET', url: url}).
          success(function(data) {
            var returnData = JSON.stringify(data);
            cachedResult = returnData;
            deferred.resolve(returnData);
          }).
          error(function(data, status) {
             console.log('Error: ' + status);
          });
        return deferred.promise;
      
    },

    getJson: function(url, parameters, requestId, deferred) {
      var deferred = $q.defer()
      $http({method: 'GET', url: url, params: parameters}).
            success(function(data) {
                data.requestId = requestId;
               //var resolve = [{'data':data, 'requestId':requestId}];

              deferred.resolve(JSON.stringify(data));
           }).
           error(function(data, status) {
             console.log('Error: ' + status);
           });

      return deferred.promise;

    },
     getJsonTwoCalls: function(url1, parameters1, url2, parameters2) {
      return $q.all([
        $http.get(url1,{params: parameters1}),
        $http.get(url2,{params: parameters2})
      ])
      .then(function(results) {
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        return data;
      });
    },

    getObjects: function(objectName)
    {
      var deferred = $q.defer();
      var object = window[objectName];
      deferred.resolve(object);
      return deferred.promise;
      
    }
  }
});

