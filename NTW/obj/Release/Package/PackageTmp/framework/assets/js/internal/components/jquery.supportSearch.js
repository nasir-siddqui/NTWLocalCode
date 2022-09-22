/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'modules/jquery.filterTabs', 'modules/jquery.showMore', 'modules/jquery.positionList', 'imagesloaded/imagesloaded'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($, searchApi) {

    // this search function is for the b2b online support search
    $.fn.supportSearch = function(options) {

        var errorDiv;

        var defaults = {
            targetUrl: 'test/json-data.php?n=',
            errorTarget: '.tsFluidGrid-outer',
            targetLists: {},
            emptyMessage: "Inga resultat kunde erhållas",
            statusTarget: ".tsSearchResults-status",
            limit: 20
        };

        options = $.extend({}, defaults, options);

        var displayFaqs = function(target, data) {
            $.each(data, function(i) {
                var li = $("<li >").addClass("tsSearchResults-faqQuestion");
                var linkHtml = '<a href="" data-toggle="collapse" data-collapse-type="fade" data-collapse-duration="200" data-target="[data-id=answer'+i+'], [data-id=question'+i+'_close]"></a>';
                var closeLink = $(linkHtml);
                closeLink.text("Stäng");
                var close = $("<span />").addClass("tsSearchResults-close").addClass("tsHidden").attr("data-id","question"+i+"_close");
                close.append(closeLink);

                var h3 = $("<h3>");
                var header = $(linkHtml);
                header.text(" " + data[i].name + " ");
                var lbl = $("<span />").addClass("tsSearchResults-label").text(data[i].label);
                h3.append(header).append(lbl);

                var answer = $("<div />").addClass("tsSearchResults-faqAnswer").addClass("tsHidden").attr("data-id", "answer"+i);
                answer.append(data[i].answer);

                li.append(close);
                li.append(h3);
                li.append(answer);

                $(target).append(li);
            });
        };

        var displayGuides = function(target, data) {
            $.each(data, function(i) {
                var li = $("<li >").addClass("tsSpotlight-item").addClass("tsSpotlight-item--purpleHeader").attr("data-list-id", i).attr("data-id", data[i].uuid);
                var link = $("<a href='' />");
                var container = $("<div />").addClass("tsSpotlight-container");
                var headerDiv = $("<div />").addClass("tsSpotlight-header");
                var thumbnail = data[i].thumbnail;
                var content = $("<div />").addClass("tsSpotlight-content");
                var h2 = $("<h2 />").addClass("h2").addClass("small").text(data[i].headline);
                var label = $("<p />").text(data[i].label);

                headerDiv.append(thumbnail);
                content.append(h2).append(label);

                container.append(headerDiv).append(content);
                link.append(container);
                li.append(link);

                $(target).append(li);
            });
        };

        var displayDocuments = function(target, data) {
            $.each(data, function(i) {
                var li = $("<li >");
                var title = $("<span />").addClass("tsSearchResults-docTitle");
                var label = $("<span />").addClass("tsSearchResults-label").text(data[i].label);
                var link = $("<a />").attr("href", data[i].url).text(data[i].title);
               
                title.append(link);
                li.append(title).append(label);

                $(target).append(li);
            });
        };

        var functionMapping = {
            "faqs" : displayFaqs,
            "guides" : displayGuides,
            "documents" : displayDocuments
        };




        var handleResults = function(data){
            $("[class^=tsLoading-icon]").remove();
            var anyResult = false;

            $.each(options.targetLists, function(i, n) {
                if (data[i] && data[i].length > 0){
                    $(n).empty();
                    $("[data-filtertabs-id="+i+"]").removeAttr("data-filtertabs-disabled");
                    $("[data-filtertabs-id="+i+"]").show();
                    functionMapping[i](n, data[i]);
                    anyResult = true;
                }
            });

            if (!anyResult){
                setStatusText(options.emptyMessage);
                $(options.statusTarget).addClass("tsComponent");
                $(options.statusTarget).addClass("center");
                console.log($(options.statusTarget));
            }


            $(options.targetContainer).imagesLoaded().always(function(){
                $(window).trigger("resize");
                $("[data-toggle=filtertabs]").empty().filterTabs();
                $("[data-toggle=showmore]").trigger("repaint");
                $(document).trigger("init-collapse");
            });

            // Trigger jquery.toggleData.js
            var toggleData = $("[data-widget*=toggleData]");
            if (toggleData.length) {
                var jsonFile = toggleData.data("json-file");
                toggleData.toggleData({jsonFile: jsonFile });
            }

        };

        var handleError = function(data){
            var icon = $("<i />").addClass("tsIcon-Information");

            var heading = $("<strong />").addClass("tsAttention-heading").html("Fel:");
            var message = $("<span />").addClass("tsAttention-heading").html("Ett okänt fel uppstod. Vi beklagar och ber dig försöka igen.");
            var paragraph = $("<p />").append(heading).append(message);

            var innerContainer = $("<div />").addClass("tsAttention-Message").addClass("tsWrapInner");
            innerContainer.append(icon).append(paragraph);
            
            errorDiv = $("<div />").addClass("tsAttention--Panic");
            errorDiv.append(innerContainer);

            $(options.errorTarget).prepend(errorDiv);
            setStatusText(options.emptyMessage);
            $(options.statusTarget).addClass("tsComponent");
            $(options.statusTarget).addClass("center");
        };

        var setStatusText = function(text) {
            disableFilters();

            var status = $("<h2>").addClass("h2").text(text);
            $(options.statusTarget).empty().append(status).show().removeClass("tsComponent").removeClass("center");
        };

        var disableFilters = function() {
            $("[data-filtertabs-id]").hide();
            $("[data-filtertabs-id]").attr("data-filtertabs-disabled", "true");
            $("[data-toggle=filtertabs]").empty().filterTabs();
        }

        return $(this).submit(function(){
            if (typeof errorDiv !== "undefined"){
                errorDiv.remove();
            }
            
            setStatusText("*Sökresultat* för " + $("input[name='search']", this).val());
            $(options.statusTarget).append("<div class='tsLoading-icon-large'></div>");

            var data = {
                limit: options.limit,
                query: $(this).find('input[name="search"]').val()
            }
            
            $.getJSON(options.targetUrl, data, handleResults).error(handleError);
            return false;
        });
    };


    $("[data-search='supportSearch']").each(function() {
        var target = $(this).data("target-url");
        var targetLists = $(this).data("target-lists");
        var emptyMessage = $(this).data("empty-message");
        var statusTarget = $(this).data("status-target");
        var targetContainer = $(this).data("target-container");

        var options = {
            targetUrl: target,
            targetLists: targetLists,
            emptyMessage: emptyMessage,
            statusTarget: statusTarget,
            targetContainer: targetContainer
        };

        $(this).supportSearch(options);
    });

});