/* global Modernizr:true, mediaqueriesMin:true, Chart:true, highestElement:true */


//Component
(function($) {
  "use strict";
  //Helpers
  function setElementsHight() {
    var reviewItems = [];
    if (mediaqueriesMin("mqSmall")) {
      reviewItems.push($('.tsReviewsChart')[0]);
      reviewItems.push($('.tsReviewsRating')[0]);
    }
    if (mediaqueriesMin("mqLarge")) {
      reviewItems = $('.tsReviewsRatings > li');
    }
    if (reviewItems.length > 0) {
      $(reviewItems).css('min-height', highestElement(reviewItems));
    }
  }
    
  $.fn.calculateChartHeight = function() {
    var height = $('[data-widget="ratingchart-container"]').outerWidth();
    $('[data-widget="ratingchart-container"]').height(height);
  };

  function addChart(value, maxvalue, canvas, ts) {
    var restValue = maxvalue - value;
    var data = [{
      value: value,
      color: "#1183bf"
    }, {
      value: restValue,
      color: "#fff"
    }];

    var options = {
      percentageInnerCutout: 90,
      animation: true,
      onAnimationComplete: setElementsHight
    };
    new Chart(document.getElementById(canvas).getContext("2d")).Doughnut(data, options);
    ts.calculateChartHeight();
  }

    $.fn.fetchReviews = function(phid) {
        var userName = 'telia.se';
        var key      = '7852t35b1r7kwxn7az1j9r5iw4v6k787';
        var prodID   = phid;
        var IDkind   = 'telia_id';

        var URLproduct  = location.protocol + '//api.alatest.com/v2/product/'+IDkind+'/'+prodID;

        var URLreviews  = location.protocol + '//api.alatest.com/v2/product/'+IDkind+'/'+prodID+'/review/pro';


        var handleError = function () {
          //console.log("Något hände...");
          var msg = 'Vi kan tyvärr inte visa några recensioner för den här produkten för tillfället, försök igen senare.';
          $('[data-review="container"]').html('<div class="tsBodyText">'+msg+'</div>');
        };

        /*
        ex: product
        http://api.alatest.com/v2/product/al_id/99?user_name=telia.se&key=7852t35b1r7kwxn7az1j9r5iw4v6k787

        ex: features
        http://insights.alatest.com/sentiments/feature_ratings?q=al_id:99&user_name=telia.se&key=7852t35b1r7kwxn7az1j9r5iw4v6k787&locale=sv_SE

        ex: user reviews
        http://api.alatest.com/v2/product/al_id/99/review/user?user_name=telia.se&key=7852t35b1r7kwxn7az1j9r5iw4v6k787&locale=sv_SE
        */

        // PRODUCT DETAILS
        var al_id=0;

        $.ajax({
          url: URLproduct,
          type: "GET",
          crossDomain: true,
          data: {user_name: userName, key: key, locale: "sv_SE"},
          dataType: "json",
          beforeSend: function() {
            if ($('[data-widget=ratingchart]').length > 0) {
                $('[data-widget=ratingchart]').each(function() {
                    $(this).append("<div class='tsLoading-icon-large'></div>");
                });
            }
            if ($('[data-review=info]').length > 0) {
                $('[data-review=info]').each(function() {
                    $(this).html("<div class='tsLoading-icon-large'></div>");
                });
            }
          },
          success: function (data) {
            if ($('[data-widget=ratingchart]').length > 0 && Modernizr.canvas) {
              $('[data-widget="ratingchart"]').attr('data-value',data.product.average_pro);
              $('[data-widget=ratingchart]').each(function(j) {
                var element = $(this),
                    value = element.data('value'),
                    maxValue = element.data('maxvalue'),
                    canvasId = "chart" + j;
                element.html('<div class="tsRatingChart-content" data-widget="ratingchart-container">'+
                                '<canvas class="tsRatingChart-canvas" id="' + canvasId + '" width="288px" height="288px"></canvas>'+
                                '<div class="tsRatingChart-labels">'+
                                    '<span class="tsRatingChart-value">' + value + '</span><span class="tsRatingChart-maxvalue">av ' + maxValue + '</span>'+
                                '</div>'+
                            '</div>');
                addChart(value, maxValue, canvasId, $(this));

                element.append('<div class="tsRatingChart-info"><span>Baserat på '+data.product.pro_count+' experttester</span></div>'); 

                var reviewInfo = '<p class="tsReviewsInfo-header">Baserad på en analys av expertrecensioner insamlade från hela världen</p>'+
                                 '<p>alaTest har samlat in och analyserat '+data.product.pro_count+' produkttester från tidningaroch webbsajter.</p>';

                $("[data-review=info]").html(reviewInfo);  

              });
            }
            al_id = data.product.al_id;
            //FEATURES
            var URLfeatures = location.protocol + '//insights.alatest.com/sentiments/feature_ratings?q=al_id:'+al_id;

            $.ajax({
              url: URLfeatures,
              type: "GET",
              crossDomain: true,
              data: {user_name: userName, key: key, locale: "sv_SE", language: "sv_SE"},
              dataType: "json",
              beforeSend: function() {
                if ($('[data-review=features]').length > 0) {
                  $('[data-review=features]').each(function() {
                    $(this).append("<div class='tsLoading-icon-large'></div>");
                  });
                }
              },
              success: function (data) {
                var feature = '';
                if(typeof data.feature_ratings !== "undefined") {
                  $.each(data.feature_ratings, function (index, value) {
                    var score = value.score*100;
                    feature += '<li class="tsRating-list-item">'+
                                  '<h4 class="tsRating-header">'+value.label+'</h4>'+
                                  '<div class="tsRating-bar" data-value="'+score.toFixed()+'" data-widget="rating-bar"></div>'+
                               '</li>';    
                  });
                  var featureList = '<ul class="tsRating-list">'+feature+'</ul>';
                  $('[data-review=features]').html(featureList);

                  if ($('[data-widget=rating-bar]').length > 0) {
                    $('[data-widget=rating-bar]').each(function() {
                      var element = $(this),
                          value = element.data('value'),
                          cssClass = "";
                      if (value === 100) {
                        cssClass = 'class="filled"';
                      }
                      element.append('<span style="width:' + value + '%" ' + cssClass + '></span>');
                    });
                  }
                } else {
                  $('[data-ratings=features]').html("För närvarande är det problem i kontakten med våra stödsystem. Försök gärna igen om en stund.");
                }
              },
              error: handleError
            });
          },
          error: handleError
        });

        // REVIEWS
        $.ajax({
          url: URLreviews,
          type: "GET",
          crossDomain: true,
          data: {user_name: userName, key: key, locale: "sv_SE"},
          dataType: "json",
          beforeSend: function() {
            if ($('[data-review=reviews]').length > 0) {
              $('[data-review=reviews]').each(function() {
                $(this).html('<div class="tsBodyText tsCenterAlign"><div class="tsLoading-icon-large"></div></div>');
              });
            }
          },
          success: function (data) {
            var review = '';
            $.each(data.pro_reviews, function (index, value) {
              if (index>=3) {
                return false;
              }
              var star = (value.source_review_rating/20);
                  review += '<li><div>'+
                            '<h3 class="h3 tsReviews-header">'+value.review_title+'</h3>'+
                            '<ul class="tsRating-points" data-widget="rating-points" data-value="'+star.toFixed()+'" data-maxvalue="5"></ul>'+
                            '<p class="tsReviews-subinfo">Recenserad av '+value.author+ 
                              " - "+value.review_date+'</p>'+
                            '<div class="tsReviews-textcontainer">'+
                              (value.review_summary !== '' ? '<p class="tsReviews-maintext">'+value.review_summary+'</p>' : '')+            
                              (value.review_verdict !== '' ? '<p class="tsReviews-subtext">'+value.review_verdict+'</p>' : '')+
                              (value.review_pros !== '' ? '<p class="tsReviews-subtext">Plus: '+value.review_pros+'</p>' : '')+
                              (value.review_cons !== '' ? '<p class="tsReviews-subtext">Minus: '+value.review_cons+'</p>' : '')+
                            '</div>'+
                        '</div></li>';
            }); 

            var reviewList= '<ul class="tsReviews">'+review+'</ul>';
            $('[data-review=reviews]').html(reviewList);
            if ($('[data-widget=rating-points]').length > 0) {
              $('[data-widget=rating-points]').each(function(i) {
                var element = $(this),
                    value = element.data('value'),
                    maxvalue = element.data('maxvalue');
                for (i = 1; i <= maxvalue; i++) {
                  var cssClass = "";
                  if (i <= value) {
                    cssClass = "active";
                  }
                  $(this).append('<li class="tsRating-point ' + cssClass + '"><i class="tsIcon-Star"></i></li>');
                }
              });
            }
          },
          error: handleError
        });
  };

}(jQuery));

//Loader
$(function() {
    
    function isIE () {
      var myNav = navigator.userAgent.toLowerCase();
      return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
    }

    if (isIE() && isIE() <= 9) {
        // hide reviews tabs for ie9 & ie8
        $('a[href=#recensioner]').parents('.tsResponsiveTabs-Tab').addClass('is-hidden');
    }
    else {
        $('[data-review="container"]').each(function() {
            $(this).fetchReviews($(this).data("product-id"));
        });


        $(window).resize(function() {
            $(this).calculateChartHeight();
        });
    }

});

