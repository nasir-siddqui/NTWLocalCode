'use strict';

app.controller('searchVideosCtrl', ['$scope', '$resource', '$sce', '$filter','$timeout', function($scope, $resource, $sce, $filter, $timeout)  {
  $scope.Math = Math;

  $scope.movies = [];
  $scope.fetchingVideos = false;
  $scope.currentpage = 1;
  $scope.searchResults = 0;

  $scope.fetchMovies = function() {
    // Reset the current page and movies since we want a whole new search
    $scope.currentpage = 1;
    $scope.movies = [];
    _fetchMovies();
  };

  $scope.fetchSimilar = function(video) {
    if (!video.similar || video.similar.length <= 0) {
      var start = new Date().getTime();
      var fetchRequest = $resource($scope.searchUrl,
        { similar : video.name, 
          resultSize : $scope.noOfSimilar },
          {
            get : {
              method : 'GET',
              headers:{'Accept':'text/html, application/json, */*; charset=UTF-8'}
            }
          }
        );
      fetchRequest.get(
        function(result) {
          video.similar = result.similar;

          // If it took less than 600 ms, we have to wait for the foldout
          // animation to stop before adding the movies
          var timeSpent = new Date().getTime() - start;
          var timeout = timeSpent < 600 ? 600 : 0;
          _replaceSimilarHtml(video, timeout);
        },
        function(error) {
          video.similar = [];
          var timeSpent = new Date().getTime() - start;
          var timeout = timeSpent < 600 ? 600 : 0;
          _replaceSimilarHtml(video, timeout)
        }
      );
    } else {
      _replaceSimilarHtml(video, 600);
    }
  };

  $scope.getMoreMovies = function(){
    // Javscript function that is defined in the videobutiken page
    closeFoldout();
    $scope.currentpage += 1;
    _fetchMovies();
  };

  var _fetchMovies = function() {
    $scope.fetchingVideos = true;
    $scope.requestId = new Date().getTime();
    var parameters = _extractParameters();
    console.log(parameters);
    var fetchRequest = $resource(
      $scope.searchUrl,
      {
        page : $scope.currentpage,
        pageSize : $scope.pageSize,
        categories: parameters.categories,
        feature : parameters.feature,
        sort : parameters.sorting,
        searchQuery : parameters.query,
        requestId : $scope.requestId },
        {
          get : {
            method : 'GET',
            headers:{'Accept':'text/html, application/json, */*; charset=UTF-8'}
          }
        }
      );
    fetchRequest.get(
      function(result) {
        // Check that the response is the response from the latest request, otherwise don't update anything
        // The !result.requestId is for testing in local
        if (!result.requestId || result.requestId == $scope.requestId) {
          var videos = result.videos;
          var noOfPages = Math.ceil(result.searchResults / $scope.pageSize);
          $scope.noOfPages = noOfPages;
          $scope.searchResults = result.searchResults;

          // Create a category string and a description html text
          for (var i = 0; i < videos.length; i++) {
            var movie = videos[i];
            // To avoid long descriptions, the "visa mer.." takes the user to the video page
            var movieDesc = $filter('clipText')(movie.description, 500, ' ... <a href="' + $scope.videoItemUrl + '?video=' + movie.name  + '">visa mer</a>');
            movie.descriptionAsHtml = $sce.trustAsHtml(movieDesc);
            var categories = movie.categories;
            movie.categoryString = _createCategoryString(categories);
          }
          // Add the result to $scope.movies
          [].push.apply($scope.movies, videos);
          $scope.fetchingVideos = false;

          $timeout(function(){
            productlistAlignment();
          }, 500);
        } else {
          console.log($scope.requestId + " is not the same as " + result.requestId);
        }
      },
      function(error) {
        $scope.fetchingVideos = false;
      }
    );
  };

    // Extract the parameters from the location hash
  var _extractParameters = function() {
    var params = decodeURIComponent(location.hash).replace("#", "").split("&");
    var result = {};
    for (var i = 0; i < params.length; i++) {
      // The filterId variable is declared in the data-ng-init method
      var keyValue = params[i].split("=");
      switch(keyValue[0]) {
        case "multi-" + $scope.filterId + "-0":
          result.categories = keyValue[1].replace(/\|/g, ",");
          break;
        case "sorting-" + $scope.filterId:
          result.sorting = keyValue[1];
          break;
        case "limited-" + $scope.filterId:
          result.feature = keyValue[1];
          break;
        case "query-" + $scope.filterId:
          result.query = keyValue[1];
          break;
      }
    };
    return result;
  };

  var _createCategoryString = function(categories) {
    var cats = "";
    for (var j = 0; j < categories.length; j++) {
      cats = cats + categories[j].label + (j < categories.length - 1 ? " - " : "");
    }
    return cats;
  };

  var _replaceSimilarHtml = function(video, timeout) {
    var html = _createSimilarHtml(video.similar);
      $timeout(function() {
        // Javscript function that is defined in the videobutiken page
        replaceSimilarHtml(html, video.name);
      }, timeout);
  }

  var _createSimilarHtml = function(similars) {
    var html = '<ul class="tsMovieList">'
    for (var i = 0; i < similars.length; i++) {
      var similar = similars[i];
      html += '<li class="tsMovieList-Item">'
      html += '<a href="' + $scope.videoItemUrl + '/' + similar.name + '" class="tsMovieItem">'
      html += '<div class="tsMovieItem-Img">';
      html += '<img src="' + similar.img + '" alt="" />';
      html += '</div>';
      html += '<div class="tsMovieItem-Info">';
      html += '<div class="tsMovieItem-Desc">';
      html += '<h3 class="tsMovieItem-Name h4">' + $filter("clipText")(similar.title, 25, "...") + '</h3>'
      html += '<span class="tsProductItem-Price--Primary">' + similar.price + ' kr</span>';
      if (similar.storeId == "1") {
        html += '<span class="tsProductItem-Price--Secondary"><img src="' + $scope.sfAnyTimeLogo + '" /></span>'
      }
      html += '</div></div>'
      html += '</a>'
      html += '</li>'
    }
    html += "</ul>";
    return html;
  }

}]);




