/*
 Searchwidget
 Author: gdw132
 Description:
 Used to fetch and present search results on Telia.se
 */

 /* global s:true, mediaqueriesMin:true */

(function ($) {
  "use strict";
  var SearchWidget = function () {
    var wrapper,
      segment,
      searchTimeout,
      request,
      lastQuery = "",
      resultsArea,
      suggestionArea,
      loadingArea,
      filterArea,
      hitsArea,
      otherFilters,
      noOthers,
      current,
      filterUpdated = false,
      editMode = false,
      self = this,
      searchDelay = 800,
      mgnlEdit;

    this.Expand = function () {
      var component = $("[data-widget-search=main]");
      if (component.hasClass("visuallyhidden")) {
        if (!$('html, body').hasClass("tsSearch-noscroll")) {
          $('html, body').addClass('tsSearch-noscroll');
        }
        component.removeClass("tsHidden");
        component.fadeIn(400).removeClass("visuallyhidden").fadeIn(400, function () {
          window.scrollTo(0, 1);
          $("[data-widget-search=main]").focus();
        });
      }
      $("[data-widget-search=main]").find("[data-widget=search]").focus();

      //Fix to be able to modify component in editmode header search
      mgnlEdit = component.find(".mgnlEditorBar");
      if (mgnlEdit.length > 0) {
        mgnlEdit.removeAttr("style");
        editMode = true;
      }
    };

    this.Collapse = function () {
      var component = $("[data-widget-search=main]");
      if (!component.hasClass("visuallyhidden")) {
        $("[data-widget-search=header]").val("");
        component.fadeOut(400, function () {
          component.addClass("visuallyhidden");
          component.addClass("tsHidden");
        });
        if (typeof window.history.replaceState !== "undefined") {
          window.history.replaceState({}, "Privat - Telia.se", location.href.split('?')[0]);
        }
        if ($('html, body').hasClass("tsSearch-noscroll")) {
          $('html, body').removeClass('tsSearch-noscroll');
        } 
      }
      $(".lt-ie9").css("height", "auto"); //IE-fix
    };

    this.PostSearch = function (query, type) {
      //Type paremeter: all | product | support | other<number>
      new SearchWidget().Reset(wrapper);
      current.query = query;
      if (type !== "all") {
        current.page[type] = 1;
      } else {
        current.products = 1;
        current.support = 1;
        for (var i=0; i<noOthers; i++) {
          current.page["other"+i] = 1;
        }
      }
      self.AddSearchResults(query, type, 1, self.GetFilterString(), self.GetSortString());
    };

    this.AddSearchResults = function (query, type, page, filter, sort) {
      var hostName = "tuuli.stadi.sonera.fi",
          domainAddition = "",
          recommendations = "disabled",
          recommendedList = "",
          productList = "",
          supportList = "",
          otherList = "",
          ignoreProducts = ($(wrapper).find("[data-widget-search-type=products]").length === 0),
          ignoreSupport = ($(wrapper).find("[data-widget-search-type=support]").length === 0),
          partLoader,
          showMoreButton;
      if (window.location.href.indexOf("mgnl-author") > -1) {
        domainAddition = "mgnl-author.";
      }
      var url = location.protocol + '//' + domainAddition + 'www.telia.se/' + segment + '/sok/ajax';
      if ($(wrapper).find("[data-widget-search-recommended]").length > 0) {
        recommendations = $(wrapper).find("[data-widget-search-recommended]").data("widget-search-recommended");
      }
      lastQuery = query;
      //console.log("Will send request:" + url + "?query=" + query +"&type=" + type + "&page=" + page + "&filter=" + filter + "&sort=" + sort + "&otherFilters=" +  otherFilters + "&recommendations=" + recommendations + "&hostName=" + hostName + "&ignoreProducts=" + ignoreProducts + "&ignoreSupport=" + ignoreSupport);
      if (request) {
        request.abort();
      }
      request = $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        beforeSend: function() {
          if(typeof window.history.replaceState !== "undefined") {
            window.history.replaceState({}, "Sökresultat - Privat - Telia.se", location.href.split('?')[0] + "?sok="+query);
          }
          if(type==="all") {
            if($(wrapper).data("widget-search-wrapper") !== "support"){
              if(!resultsArea.hasClass("visuallyhidden")) {
                resultsArea.addClass("visuallyhidden");
              }
              if(!suggestionArea.hasClass("visuallyhidden")){
                suggestionArea.addClass("visuallyhidden");
              }
              if(!filterArea.hasClass("visuallyhidden")){
                filterArea.addClass("visuallyhidden");
              }
              if(!hitsArea.hasClass("visuallyhidden")) {
                hitsArea.addClass("visuallyhidden");
              }
            }
            loadingArea.html("<i class='tsLoading-icon-large'></i>Söker på telia.se...");
            if(loadingArea.hasClass("visuallyhidden")) {
              loadingArea.removeClass("visuallyhidden").fadeIn(400);
            }
          } else {
            partLoader = $(wrapper).find("[data-widget-search=loading-"+type+"]");
            showMoreButton = $(wrapper).find("[data-widget-search-showmore="+type+"]");
            if(!showMoreButton.hasClass("visuallyhidden")) {
              showMoreButton.addClass("visuallyhidden");
            } 
            if(partLoader.hasClass("visuallyhidden")) {
              partLoader.removeClass("visuallyhidden").fadeIn(400);
            } 
          }
          setTimeout(function () {
            resize();
          }, 1);
        },
        success: function (data) {
          var i = 0,
          suggestions = "";
          //Loading area
          if(typeof data === "undefined") {
            loadingArea.html("Söktjänsten fungerar inte just nu, försök igen senare.");
            return;
          } else if(typeof data.error !== "undefined") {
            loadingArea.html(data.error); 
            return;
          }

          //Query correction (faulty backend, uncomment when fixed)
          /*query = data.query;
          current.query = query;
          $("[data-widget-search=main]").val(query);
          $(wrapper).find("[data-widget=search]").val(query);*/
          if(query !== data.query) {
            suggestions += "Vi sökte på: <a href='#'>" + data.query + "</a> istället för <a href='#'>" + query + "</a>";
          }
          if(typeof data.suggestions !== "undefined" && data.suggestions.length > 0) {
            if(suggestions !== "") {
              suggestions += "<br>";
            }
            suggestions += "Sökningar relaterade till " + query + ": ";
            for(i = 0; i < data.suggestions.length; i++) {
              suggestions += "<a href='#'>" + data.suggestions[i] + "</a>";
            }
          }


          //suggestionArea.html(suggestions); Uncomment when function is available from backend

          //Search hits
          if (type === "all") {
            $(wrapper).find("[data-widget-search-hits=total]").html(data.hits.total);
            $(wrapper).find("[data-widget-search-hits=products]").html(data.hits.products + " söksvar");
            if($(wrapper).find("[data-adword]").length && typeof data.support !== "undefined"){
              var adwordHit = data.hits.support.replace(/\s/g, '');
              data.hits.support = parseInt(adwordHit) - 1;
            } else if($(wrapper).find("[data-adword]").length && typeof data.support === "undefined"){
              $(wrapper).find("[data-adword]").addClass("visuallyhidden");
            }
            $(wrapper).find("[data-widget-search-hits=support]").html(data.hits.support + " söksvar");
            $(wrapper).find("[data-widget-search-type*=other]").each(function(i) {
              $(wrapper).find("[data-widget-search-hits=other"+i+"]").html(data.hits.other[i].hits + " söksvar");
            });
          }
          if(typeof window.history.replaceState !== "undefined") {
            window.history.replaceState({}, "Sökresultat - Privat - Telia.se", location.href.split('?')[0] + "?sok="+query);
          }
          //Recommended
          var recommended = $(wrapper).find("[data-widget-search-recommended]");
          if(type === "all") {
            if (typeof $(wrapper).data("widget-search-wrapper") !== "undefined" && typeof data.recommended !== "undefined") {
              var filterString = $(wrapper).data("widget-search-wrapper");
              for(i = 0; i < data.recommended.length; i++) {
                var recObj = data.recommended[i];
                if(recObj.url.indexOf(filterString) === -1) {
                  data.recommended.splice(i, 1);
                }
              }
            }

            if(recommended.data("widget-search-recommended") === "enabled" && typeof data.recommended !== "undefined") {
              for(i = 0; i<data.recommended.length; i++) {
                var recHit = data.recommended[i];
                if(typeof recHit.title !== "undefined" && typeof recHit.url !== "undefined") {
                  recommendedList += "<li class='tsSearch-result-item'><h2><a href='"+recHit.url+"'>"+recHit.title+"</a></h2>";
                  recommendedList += "<div class='tsSearch-result-url'><a href='"+recHit.url+"'>"+createBreadcrumbsFromUrl(recHit.url)+"</a></div></li>";
                }
              }
              $(wrapper).find("[data-widget-search-type=recommended]").append($(recommendedList).fadeIn(400));
              if(recommended.hasClass("visuallyhidden")) {
                recommended.removeClass("visuallyhidden");
              } 
            } else {
              if(!recommended.hasClass("visuallyhidden")) {
                recommended.addClass("visuallyhidden");
              }
            }
          }

          //Products
          if(type==="products" || type==="all") {
            if(data.hits.products !== "0") {
              for(i in data.products) {
                if(typeof data.products[i] !== "undefined" && typeof data.products[i].title !== "undefined") {
                  var product = data.products[i];
                  productList += "<li class='tsSearch-result-item-image'>";
                  productList += "<div class='tsSearch-image-container'><a href='"+product.url+"'>";
                  if(product.img !== "") {
                    productList += "<img src='"+product.img+"' alt='"+product.imgalt+"'/>";
                  }
                  productList += "</a></div><div class='tsSearch-item-container'><h2><a href='"+product.url+"'>"+product.title+"</a></h2>";
                  productList += "<ul class='tsSearch-result-item-usp'><li>"+product.usp+"</li></ul>";
                  productList += "<div class='tsProductItem-Price--Primary tsSearch-result-item-price'>"+product.price+"</div>";
                  productList += "</div></li>";
                }
              }

              var showmore = $(wrapper).find("[data-widget-search-showmore=products]");
              if(data.hits.products <= page*10) {
                if(!showmore.hasClass("visuallyhidden")) {
                  showmore.addClass("visuallyhidden");
                } 
              } else {
                if(showmore.hasClass("visuallyhidden")) {
                  showmore.removeClass("visuallyhidden");
                } 
              }
            } else {
              productList += "<li>Ingen produkt hittades med det angivna sökordet</li>";
              $(wrapper).find("[data-widget-search-showmore=products]").addClass("visuallyhidden");
            }
            $(wrapper).find("[data-widget-search-type=products]").append($(productList).fadeIn(400));
          }

          //Support
          if(type === "support" || type === "all") {
            if(data.hits.support !== "0") {
              if($(wrapper).data("widget-search-wrapper") === "support") { //Top hit for SSOP search
                var topHit = $(wrapper).find("[data-adword]");
                if(topHit && typeof data.support !== "undefined") {
                  $(topHit).removeClass("visuallyhidden");
                  var firstHit = data.support[0];
                  $(topHit).find("[data-widget-search=results-list]").empty();
                  var content =
                    "<li class='tsSearch-result-item'>" +
                      "<div class='tsSearch-image-container'>" +
                      "<a href='" + firstHit.url + "'>" +
                      "<img src='" + firstHit.img + "' alt='" + firstHit.title + "'>" +
                      "</a>" +
                      "</div>" +
                      "<div class='tsSearch-item-container'>" +
                      "<h2>" +
                      "<a href='" + firstHit.url + "'>" + firstHit.title + "</a>" +
                      "</h2>" +
                      "<div class='tsSearch-result-url'><a href='" + firstHit.url + "'>" + firstHit.url + "</a></div>" +
                      "<p>"+firstHit.desc+"</p>" +
                      "</div>" +
                      "</li>";
                  $(topHit).find("[data-widget-search=results-list]").append(content);
                  data.support.splice(0, 1);
                }
              }

              for(i in data.support) {
                if(typeof data.support[i] !== "undefined" && typeof data.support[i].title !== "undefined") {
                  var supp = data.support[i];
                  supportList += "<li class='tsSearch-result-item'><h2><a href='"+supp.url+"'>"+supp.title+"</a></h2>";
                  supportList += "<div class='tsSearch-result-url'><a href='"+supp.url+"'>"+createBreadcrumbsFromUrl(supp.url)+"</a></div>";
                  supportList += "<p>"+supp.desc+"</p>";
                  if((supp.url.indexOf("mobiltelefoner?device") > -1 ||
                      supp.url.indexOf("surfplattor?device") > -1 ||
                      supp.url.indexOf("mobiltelefoner/?device") > -1 ||
                      supp.url.indexOf("surfplattor/?device") > -1) && supp.url.indexOf("section") < 0) {
                    supportList += "<ul class='tsSearch-result-item-tags'><li><a href='"+supp.url+"#tabMenu_0=usage''>Använd</a></li><li><a href='"+supp.url+"&section=felsok'>Felsök</a></li><li><a href='"+supp.url+"&section=teknisk-information'>Teknisk information</a></li></ul>";
                  } else if(endsWith(supp.url, "support/android") ||
                    endsWith(supp.url, "support/epostimobilen") ||
                    endsWith(supp.url, "support/homelesswirelesszone") ||
                    endsWith(supp.url, "support/iphone") ||
                    endsWith(supp.url, "support/mms") ||
                    endsWith(supp.url, "support/mobilabbonemang") ||
                    endsWith(supp.url, "support/spotifypremium") ||
                    endsWith(supp.url, "support/storytel") ||
                    endsWith(supp.url, "support/teliamobildela") ||
                    endsWith(supp.url, "support/mobilfamilj") ||
                    endsWith(supp.url, "support/mobilsvar") ||
                    endsWith(supp.url, "support/telianavigator") ||
                    endsWith(supp.url, "support/teliarefill") ||
                    endsWith(supp.url, "support/utomlands") ||
                    endsWith(supp.url, "support/vidarekoppling") ||
                    endsWith(supp.url, "support/wywallet") ||
                    endsWith(supp.url, "support/epost") ||
                    endsWith(supp.url, "support/mobiltbredband") ||
                    endsWith(supp.url, "support/sakersurf") ||
                    endsWith(supp.url, "support/bredbandviafiber") ||
                    endsWith(supp.url, "support/bredbandviatelejacket") ||
                    endsWith(supp.url, "support/elegitimation") ||
                    endsWith(supp.url, "support/teliasmart") ||
                    endsWith(supp.url, "support/uppringtinternet") ||
                    endsWith(supp.url, "support/aska") ||
                    endsWith(supp.url, "support/boxapp") ||
                    endsWith(supp.url, "support/inspelingsbardigitalbox") ||
                    endsWith(supp.url, "support/playplus") ||
                    endsWith(supp.url, "support/teliadigitaltv") ||
                    endsWith(supp.url, "support/tradlasdigitaltv") ||
                    endsWith(supp.url, "support/bredbandstelefoni") ||
                    endsWith(supp.url, "support/meddelandebox") ||
                    endsWith(supp.url, "support/rostbrevlada") ||
                    endsWith(supp.url, "support/sparrtjanster") ||
                    endsWith(supp.url, "support/teliabas") ||
                    endsWith(supp.url, "support/telesvar")) {
                    supportList += "<ul class='tsSearch-result-item-tags'><li><a href='"+supp.url+"#tabMenu_0=popular'>Populära guider</a></li><li><a href='"+supp.url+"#tabMenu_0=getGoing'>Kom igång</a></li><li><a href='"+supp.url+"#tabMenu_0=usage'>Använd</a></li><li><a href='"+supp.url+"#tabMenu_0=debug'>Felsök</a></li></ul>";
                  }
                  supportList += "</li>";
                }
              }

              var showmoreSupport = $(wrapper).find("[data-widget-search-showmore=support]");
              if(data.hits.support <= page*10) {
                if(!showmoreSupport.hasClass("visuallyhidden")) {
                  showmoreSupport.addClass("visuallyhidden");
                }
              } else {
                if(showmoreSupport.hasClass("visuallyhidden")) {
                  showmoreSupport.removeClass("visuallyhidden");
                } 
              }
            } else {
              supportList += "<li>Ingen supportträff hittades med det angivna sökordet</li>";
              $(wrapper).find("[data-widget-search-showmore=support]").addClass("visuallyhidden");
            }
            $(wrapper).find("[data-widget-search-type=support]").append($(supportList).fadeIn(400));
          }

          //Other
          var affectedList = 0;
          if(type.indexOf("other") > -1 || type==="all") {
            for(i = 0; i < data.hits.other.length; i++) {
              if(i!=="map") { //IE fix
                otherList="";
                if(type==="all") {
                  affectedList = i;
                } else {
                  affectedList = type.substring(5);
                }
                if(data.hits.other[i].hits !== "0") {
                  for(var j in data.others[i].data) {
                    if(typeof data.others[i].data[j] !== "undefined" && typeof data.others[i].data[j].title !== "undefined") {
                      var ot = data.others[i].data[j];
                      if(ot.img!=="") {
                        otherList += "<li class='tsSearch-result-item-image-other'>";
                        otherList += "<div class='tsSearch-image-container-other'><a href='"+ot.url+"'><img src='"+ot.img+"' alt='"+ot.title+"'/></a></div>";
                        otherList += "<div class='tsSearch-item-container-other'>";
                      } else if(ot.mime!=="null") {
                        otherList += "<li class='tsSearch-result-item-image-other'><div class='tsSearch-results-item-mime'>";
                        if(ot.mime === "[PDF]") {
                          otherList += "<i data-icon='&#xe040;'></i>";
                        } else if(ot.mime === "[MS POWERPOINT]") {
                          otherList += "<i data-icon='&#xe050;'></i>";
                        } else if(ot.mime === "[MS EXCEL]") {
                          otherList += "<i data-icon='&#xe049;'></i>";
                        } else if(ot.mime === "[MS WORD]") {
                          otherList += "<i data-icon='&#xe048;'></i>";
                        }
                        otherList += "</div><div class='tsSearch-item-container'>";
                      } else {
                        otherList += "<li class='tsSearch-result-item'>";
                      }
                      otherList += "<h2><a href='"+ot.url+"'>"+ot.title+"</a></h2>";
                      otherList += "<div class='tsSearch-result-url'><a href='"+ot.url+"'>";
                      if(ot.url.indexOf("trade.telia.se") > -1) {
                        otherList += "http://trade.telia.se/";
                      } else {
                        otherList += createBreadcrumbsFromUrl(ot.url);
                      }
                      otherList += "</a></div><p>"+ot.desc+"</p>";
                      otherList += "</li>";
                    }
                  }
                  var showmoreOther = $(wrapper).find("[data-widget-search-showmore=other"+affectedList+"]");
                  if(data.hits.other[i].hits <= page*10) {
                    if(!showmoreOther.hasClass("visuallyhidden")) {
                      showmoreOther.addClass("visuallyhidden");
                    }
                  } else {
                    if(showmoreOther.hasClass("visuallyhidden")) {
                      showmoreOther.removeClass("visuallyhidden");
                    }
                  }
                } else {
                  otherList += "<li>Ingen träff påträffades med det angivna sökordet.</li>";
                  $(wrapper).find("[data-widget-search-showmore=other"+affectedList+"]").addClass("visuallyhidden");
                }
                $(wrapper).find("[data-widget-search-type=other"+affectedList+"]").append($(otherList).fadeIn("slow"));
              }
            }
          }

          if(!loadingArea.hasClass("visuallyhidden")) {
            loadingArea.addClass("visuallyhidden");
          }
          if(suggestionArea.hasClass("visuallyhidden")){
            suggestionArea.removeClass("visuallyhidden");
          }
          if(filterArea.hasClass("visuallyhidden")) {
            filterArea.removeClass("visuallyhidden");
          }
          if(hitsArea.hasClass("visuallyhidden")) {
            hitsArea.removeClass("visuallyhidden");
          }
          if(resultsArea.hasClass("visuallyhidden")) {
            resultsArea.removeClass("visuallyhidden");
          }
          if(typeof partLoader !== "undefined" && !partLoader.hasClass("visuallyhidden")) {
            partLoader.addClass("visuallyhidden");
          }
          setTimeout(function() {
            resize();
          }, 1);

          if(s) {
            clearVars();
            s.channel  = segment;
            s.eVar1    = query;
            s.prop1    = query;
            s.prop2    = data.hits.total;
            s.events   = "event1";
            s.prop3    = "sok";
            s.prop4    = "";
            s.hier1    = segment+",sok";
            s.t();
          }
        },

        error: function() {
          loadingArea.html("Söktjänsten är för närvarande inte tillgänglig, försök igen senare.");
          if(loadingArea.hasClass("visuallyhidden")) {
            loadingArea.removeClass("visuallyhidden").fadeIn(400);
          }
          //xhr, ajaxOptions, thrownError
          //console.log("Status: " + xhr.status);
          //console.log("Message: " + thrownError);
        },
        data: {query: query, segment: segment, type: type, page: page, filter: filter, sort: sort, otherFilters: otherFilters, recommendations: recommendations, hostName: hostName, ignoreProducts: ignoreProducts, ignoreSupport: ignoreSupport}
      });
    };

    this.GetFilterString = function() {
      var result="",
        first = true,
        searchArea = $(wrapper).find("[data-widget-search-defaultfilter]");

      if(searchArea.attr("data-widget-search-defaultfilter")) {
        first = false;
        result += searchArea.attr("data-widget-search-defaultfilter");
      }

      $("[data-widget-search-filter=button]").each(function() {
        if($(this).children("label").attr("data-widget-search-default") !== "Sortera") {
          var filterPart = $(this).attr("data-widget-search-value");
          if(filterPart!=="default") {
            if(first) {
              first=false;
            } else {
              result += ".";
            }
            result += filterPart;
          }
        }
      });
      return result;
    };

    this.GetSortString = function() {
      var result = "relevance",
        sortLabel = $(wrapper).find("[data-widget-search-default=Sortera]");
      if(sortLabel) {
        var sort = sortLabel.parent().attr("data-widget-search-value");
        if(sort!=="default") {
          result = sort;
        }
      }
      return result;
    };

    this.GetNextPage = function(type) {
      current.page[type]++;
      self.AddSearchResults(current.query, type, current.page[type], self.GetFilterString(), self.GetSortString());
    };

    this.Reset = function(domObject) {
      $(domObject).find("[data-widget-search-hits=products]").empty();
      $(domObject).find("[data-widget-search-type=products]").empty();
      $(domObject).find("[data-widget-search-type=support]").empty();
      $(domObject).find("[data-widget-search-hits=support]").empty();
      $(domObject).find("[data-widget-search-type*=other]").each(function(i) {
        $(domObject).find("[data-widget-search-type=other"+i+"]").empty();
        $(domObject).find("[data-widget-search-hits=other"+i+"]").empty();
      });
      $(domObject).find("[data-widget-search-type=recommended]").empty();

      if(!$(domObject).find("[data-widget-search=results]").hasClass("visuallyhidden")) {
        $(domObject).find("[data-widget-search=results]").addClass("visuallyhidden");
      }
      if(!$(domObject).find("[data-widget-search=filter]").hasClass("visuallyhidden")) {
        $(domObject).find("[data-widget-search=filter]").addClass("visuallyhidden");
      }
      if(!$(domObject).find("[data-widget-search=hits]").hasClass("visuallyhidden")) {
        $(domObject).find("[data-widget-search=hits]").addClass("visuallyhidden");
      }
      if(!$(domObject).find("[data-widget-search=loading]").hasClass("visuallyhidden")) {
        $(domObject).find("[data-widget-search=loading]").addClass("visuallyhidden");
      } 
    };

    this.Init = function(domObject) {
      wrapper = domObject;
      if($(wrapper).data("widget-search") === "main") {
        $(wrapper).detach().prependTo("body");
        $(wrapper).find("[data-widget-search-wrapper]").attr("data-widget-init", true);
      }
      segment = $(wrapper).find("[data-widget=search]").data("widget-section");
      if(segment === 'null') { //jQuery workaround
        segment  = "privat";
      }
      searchTimeout   = null;
      request         = null;
      resultsArea     = $(wrapper).find("[data-widget-search=results]");
      suggestionArea = $(wrapper).find("[data-widget-search=suggestions]");
      loadingArea     = $(wrapper).find("[data-widget-search=loading]");
      filterArea      = $(wrapper).find("[data-widget-search=filter]");
      hitsArea        = $(wrapper).find("[data-widget-search=hits]");
      current         = {query:"", page: {"products":1, "support":1}};

      var others    = $(wrapper).find("[data-widget-search-type*=other]");
      otherFilters  = "";
      noOthers      = others.length;
      others.each(function(i) {
        otherFilters += $(this).attr("data-widget-search-filtered");
        if(i !== noOthers-1) {
          otherFilters += "_";
        }
      });

      if(window.location.href.indexOf("/sok") > -1) { //If landing page
        $(wrapper).find("[data-widget-search=close]").addClass("visuallyhidden");
      }

      setupListeners();
      if(window.location.href.indexOf("/support/sok") > -1) {
        if($(wrapper).data("widget-search") !== "main") {
          postSearch($(wrapper).find("[data-widget=search]").val(), 1);
        }
      } else {
        if(typeof $(wrapper).find("[data-widget=search]").val() !== 'undefined' && $(wrapper).find("[data-widget=search]").val()!=="") {
          $("[data-widget-search=header]").val($(wrapper).find("[data-widget=search]").val());
          postSearch($(wrapper).find("[data-widget=search]").val(), 1);
          self.Expand();
        }
      }
      setupFilter();
      resize();
      $(".lt-ie9").css("height", "auto"); //IE, mobile fix
    };

    this.InitNotAgora = function() {
      function goToLandingPage() {
        var url = location.protocol + '//www.telia.se/privat/sok';
        if($("[data-widget-search=header]").length && $("[data-widget-search=header]").val() !== "") {
          url +="?sok=" + decodeURI(encodeURIComponent($("[data-widget-search=header]").val()));
        }
        window.location.href = url;
      }

      $("body").on("click", "[data-widget-search=icon]", function() {
        goToLandingPage();
      });

      $("[data-widget-search=header]").keyup(function(e) {
        if(e.which === 13) {
          goToLandingPage();
        }
      });

      if($('[data-widget-search=header]').length > 0) {
        //console.log($('[data-widget-search=header]'));
        $('[data-widget-search=header]').autocomplete({
          source: function (request, response) {
            $.ajax({
              url:   "/resources/teliasonera/telia-se/assets/search/autocomplete-privat/binary.csv",
              headers: {
                Accept : "text/csv; charset=utf-8",
                "Content-Type": "text/csv; charset=utf-8"
              },
              success: function (data) {
                var re = $.ui.autocomplete.escapeRegex(request.term);
                var matcher = new RegExp(re + "+", "i");
                var split = $.csv.toObjects(data);
                response($.map(split, function(item) {
                  if(matcher.test(item.Value)) {
                    return {label: item.Value.replace(new RegExp("("+$.ui.autocomplete.escapeRegex(request.term)+")", "ig" ), "<b>$1</b>"), value: item.Value};
                  }
                }).slice(0, 5));
              }
            });
          },
          open: function () {
            $(this).autocomplete('widget').css('z-index', 5000);
            $(this).autocomplete('widget').css('width','400px');
            return false;
          },
          select: function (e, ui) {
            $(this).val(ui.item.value);
            $(this).blur();
          }
        }).data("ui-autocomplete")._renderItem = function(ul, item) { //Hack in jQuery to allow custom HTML in autocomplete
            return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
        };
      }
    };

    var postSearch = function(query, delay) {
      if(!editMode) {
        clearTimeout(searchTimeout);
        if(query.length>2) {
          searchTimeout = setTimeout(function() {
            new SearchWidget().Reset(wrapper);
            if(query !== "") {
              self.PostSearch(query, "all");
            }
          }, delay);
        }
      }
    };

    var resize = function() {
      //Fix for IE8, since it doesn't recalculate the DOM correctly...
      if($("body").hasClass("lt-ie9")) {
        var height = $(window).height();
        $("[data-widget-search=main]").css("height", height);
      }
    };

    var closeDropdowns = function() {
      $("[data-widget-search-filter=button] > ul").each(function() {
        var list = $(this);
        if(!list.hasClass("visuallyhidden")) {
          list.fadeOut(100, function() {
            list.addClass("visuallyhidden");
            list.siblings('label').removeClass("active");
          });
        }
      });
      if(filterUpdated) {
        postSearch(current.query, 1);
      }
      filterUpdated=false;
    };

    var setupListeners = function() {
      //Expand/collapse search page
      $("[data-widget-search=close]").click(function() {
        self.Collapse();
      });

      //IE-fix
      if($("html").hasClass("lt-ie9")) {
        $("body").on("click", function(e) {
          if(!$("[data-widget-search=main]").hasClass("visuallyhidden") && !$(e.target).parents('ul').hasClass('ui-autocomplete')) {
            self.Collapse();
          }
        });
      }

      if($(wrapper).data("widget-search") === "main" || $(wrapper).data("widget-search-wrapper") !== "support") {
        $("[data-widget-search=header]").keyup(function(e) {
          if($(wrapper).find("[data-widget=search]").length > 0) { //If Agora
            var char = String.fromCharCode(e.keyCode);
            if(char.match(/\w|[åäöüæø]/) || e.which === 13) {
              self.Expand();
              $(wrapper).find("[data-widget=search]").val($(this).val());
            }
          } else {
            if(e.which === 13) {
              self.Expand();
            }
          }
        });

        $(document).keyup(function(e) {
          if(e.keyCode === 27 && !$("[data-widget-search=main]").hasClass("visuallyhidden")) {
            self.Collapse();
          }
        });

        $(document).keydown(function(e) {
          var searchBox = $("[data-widget-search=main]").find("[data-widget=search]");
          if(e.keyCode === 8 && $("[data-widget-search=main]").length && !searchBox.is(":focus")) {
            if(!$("[data-widget-search=main]").hasClass("visuallyhidden")) {
              e.preventDefault();
              searchBox.focus();
              searchBox.val(searchBox.val().substr(0,searchBox.val().length-1));
            }
          }
        });

        $('.tsSearch-inner').click(function(e) {
          if(e.stopPropagation) {
            e.stopPropagation();
          } else { //IE-fix
            e.returnValue = false;
          }
        });

        $("[data-widget-search=main]").click(function() {
          self.Collapse();
        });

        $("[data-widget-search=main]").click(function() {
          self.Collapse();
        });

        $(wrapper).find("[data-widget=search]").on("keyup input", function(e) {
          var c = String.fromCharCode(e.keyCode);
          if (e.which === 13) { //If enter
            //clearTimeout(autocompleteTimeout);
            $(this).autocomplete("close");
            $(this).blur();
            return;
          } else if((c.match(/\w|[åäöüæø]/) || e.which === 8 || e.which === 46)) { //if input is a character, backspace or delete
            $("[data-widget-search=header]").val($(this).val());
            postSearch($(this).val(), searchDelay);
          }
          //clearTimeout(autocompleteTimeout);
          //autocompleteTimeout = setTimeout(function() {
            /*$(wrapper).find("[data-widget=search]").autocomplete("close");
            if($(wrapper).find("[data-widget=search]").val() !== lastQuery) {
              postSearch($(wrapper).find("[data-widget=search]").val(), searchDelay);
            }*/
          //}, 5000);
        });

        //Cancel a search
        $(wrapper).find('[data-widget=search]').click(function() {
          var elem = $(this);
          setTimeout(function() {
            if(elem.val() === "") {
              new SearchWidget().Reset(wrapper);
              $("[data-widget-search=header]").val("");
            }
          }, 1);
        });

        $(wrapper).find("[data-widget=search]").on("autocompleteselect", function() {
          $("[data-widget-search=header]").val($(this).val());
          postSearch($(this).val(), 100);
        });
      } else {
        //For [data-widget-search-wrapper]
        $(wrapper).find("[data-widget=search]").bind("keyup keypress", function(e) {
          var code = e.keyCode || e.which;
          if (code === 13 && $(this).data("landingpage")) {
            e.preventDefault();
            postSearch($(this).val(), searchDelay);
            $(this).autocomplete("close");
            return false;
          } else if (code === 13) {
            $(wrapper).find("form").submit();
          }
        });

        $(wrapper).find("[data-widget-search-button]").click(function(e) {
          e.preventDefault();
          postSearch($(wrapper).find("[data-widget=search]").val(), searchDelay);
          return false;
        });

        $(wrapper).find("[data-widget=search]").on("autocompleteselect", function(e, ui) {
          if($(this).data("landingpage")){
            e.preventDefault();
            postSearch(ui.item.value, 100);
            $(this).autocomplete("close");
            return false;
          }
        });

        $(wrapper).find("[data-widget=search]").on('autocompleteopen', function(e) {
          e.preventDefault();
          $(this).data("is_open", true);
          return false;
        });

        $(wrapper).find("[data-widget=search]").on('autocompleteclose', function(e) {
          var container = this;
          e.preventDefault();
          setTimeout(function() {
            $(container).data("is_open", false);
          }, 1);
          return false;
        });
      }

      //More results
      $(wrapper).find("[data-widget-search-showmore]").click(function() {
        self.GetNextPage($(this).data("widget-search-showmore"));
      });

      //Autocomplete
      var autocompletePath =  "/resources/teliasonera/telia-se/assets/search/autocomplete-"+segment+"/binary.csv";
      var autocompleteFile = $(wrapper).find("[data-widget=search]").data("widget-autocomplete-file");

      if(typeof autocompleteFile !== "undefined") {
        autocompletePath = "/resources/teliasonera/telia-se/assets/search/autocomplete-" + autocompleteFile + "/binary.csv";
      }

      if($('[data-widget=search]').length > 0) {
        $(wrapper).find('[data-widget=search]').autocomplete({
          source: function(request, response) {
            $.ajax({
              url:   autocompletePath,
              headers: {
                Accept : "text/csv; charset=utf-8",
                "Content-Type": "text/csv; charset=utf-8"
              },
              success: function(data) {
                var re = $.ui.autocomplete.escapeRegex(request.term);
                var matcher = new RegExp(re + "+", "i");
                var split = $.csv.toObjects(data);
                response($.map(split, function(item) {
                  if(matcher.test(item.Value)) {
                    return {label: item.Value.replace(new RegExp("("+$.ui.autocomplete.escapeRegex(request.term)+")", "ig" ), "<b>$1</b>"), value: item.Value};
                  }
                }).slice(0, 5));
              }
            });
          },
          open: function() {
            $(this).autocomplete('widget').css('z-index', 5000);
            $(this).autocomplete('widget').css('width','400px');
            return false;
          },
          select: function (e, ui) {
            $(this).val(ui.item.value);
            $(this).blur();
            postSearch(ui.item.value, 1);
          }
        }).data("ui-autocomplete")._renderItem = function (ul, item) { //Hack in jQuery to allow custom HTML in autocomplete
            return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
        };
      }

      //Fix for preventing a direct search with empty query in header
      $("body").on("click", "[data-widget-search=icon]", function(e) {
        var searchField = $(this).siblings("[data-widget-search=header]");
        if(mediaqueriesMin("mqLarge")) {
          if(e.stopPropagation) {
            e.stopPropagation();
          } else { //IE-fix
            e.returnValue = false;
          }
          if($("[data-widget=search]").length > 0) { //In Agora
            searchField.focus();
          } else {
            if(searchField.val() !=="") {
              self.Expand();
            } else {
              searchField.focus();
            }
          }
        } else if(window.location.href.indexOf("/support/sok") > -1) {
          self.Expand();
        } else if(window.location.href.indexOf("/sok") > -1) { //If on landing page
          $("[data-widget=search]").focus();
        } else {
          self.Expand();
        }
      });
    };

    var setupFilter = function() {
      $("[data-widget-search-filter=button] > ul").addClass("visuallyhidden");

      $("[data-widget-search-filter=button]").click(function(e) {
        if(e.stopPropagation) {
          e.stopPropagation();
        } else { //IE-fix
          e.returnValue = false;
        }
        closeDropdowns();
        var list = $(this).find("ul");
        var label = $(this).find("label");

        if(label.text() !== label.data("widget-search-default")) {
          label.text(label.data("widget-search-default"));
          list.parent().attr("data-widget-search-value", "default");
          if(label.hasClass("selected")) {
            label.removeClass("selected");
          }
          filterUpdated = true;
        }
        if(list.hasClass("visuallyhidden")) {
          list.fadeIn(100).removeClass("visuallyhidden").fadeIn(100);
          label.addClass("active");
        } else {
          label.removeClass("active");
          list.fadeOut(100, function() {
            list.addClass("visuallyhidden");
          });
        }
      });

      $("[data-widget-search-filter=selectable]").click(function(e) {
        if(e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.returnValue = false;
        }
        var selectable = $(this);
        var list = selectable.parent();
        var label = list.siblings('label');
        if(!list.hasClass("visuallyhidden")) {
          list.fadeOut(100, function() {
            list.addClass("visuallyhidden");
            label.removeClass("active");
            if(selectable.data("widget-search-value") !== "default") {
              label.html(selectable.html()+"<i class='tsSearch-filter-icon tsIcon-Close'></i>");
              if(!label.hasClass("selected")) {
                label.addClass("selected");
              }
            } else {
              label.text(label.data("widget-search-default"));
              if(label.hasClass("selected")) {
                label.removeClass("selected");
              }
            }
          });
        }
        list.parent().attr("data-widget-search-value", selectable.data("widget-search-value"));
        filterUpdated = false;
        postSearch(current.query, 1);
      });

      $('.tsSearch-inner').click(function() {
        closeDropdowns();
      });
    };

    var createBreadcrumbsFromUrl = function(url) {
      var result = url.substr(url.indexOf(".se/")+4, url.length);
      if(result.indexOf("?") > -1) {
        result = result.substr(0, result.indexOf("?"));
      }
      if (result.substring(result.length-1) === "/") {
        result = result.substring(0, result.length-1);
      }
      var crumbs = result.split("/");
      result = "Telia.se";
      for(var i=0; i<crumbs.length; i++) {
        if((i<2 || i === crumbs.length-1) && $.trim(crumbs[i]) !== "") {
          result += " > " + crumbs[i].charAt(0).toUpperCase() + crumbs[i].slice(1);
        } else if(i === 2) {
          result += " > ...";
        }
      }
      return result;
    };

    var clearVars = function () {
      var i;
      for (i=0; i < 75; i++) {
        s['prop'+i]='';
        s['eVar'+i]='';
        if(i<=5) {
          s['hier'+i]='';
        } 
      }
      var svarArr = ['pageName','channel','products','events','campaign','purchaseID','state','zip','server','linkName'];
      for (i = 1; i < svarArr.length; i++) {
        s[svarArr[i]]='';
      }
    };

    var endsWith = function (str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    return this;
  };

  $(document).ready(function() {
    var searchWidgets = $("[data-widget-search=main], [data-widget-search-wrapper]");
    if(searchWidgets.length > 0){
      for(var i = 0; i < searchWidgets.length; i++){
        if(!($(searchWidgets[i]).data("widget-init") && $(searchWidgets[i]).data("widget-search") !== "main")) {
          new SearchWidget().Init(searchWidgets[i]);
          new SearchWidget().Reset(searchWidgets[i]);
        }
      }
    } else {
      new SearchWidget().InitNotAgora();
    }
  });
})(jQuery);