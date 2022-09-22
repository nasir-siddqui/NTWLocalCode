/*global define, hash*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', "libs/hash/hash"], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.filterTabs = function() {

        var initTabs = function($tabContainer, $targetContainer, $targets){
            var $list = $("<ul />").appendTo($tabContainer).addClass("tsTabs-list");

            var showAllOption = $tabContainer.data("filtertabs-alloption");
            if (showAllOption){
                $link = $("<a />").text("Alla").attr("href","");
                $("<li />").appendTo($list).addClass("active").append($link);
                $link.click(function() {
                    $tabContainer.find(".tsTabs-list").children().removeClass("active");
                    $(this).parent().addClass("active");
                    $targets.filter("[data-filtertabs-disabled!='true']").show();
                    return false;
                });
            }

            $targets.each(function() {
                var $target = $(this);
                var textValue = $(this).data("filtertabs-value");
                var disabled = $(this).attr("data-filtertabs-disabled");
                $link = $("<a />").text(textValue).attr("href","");
                $("<li />").appendTo($list).append($link);
                if (!disabled){
                    $link.click(function() {
                        $tabContainer.find(".tsTabs-list").children().removeClass("active");
                        $(this).parent().addClass("active");
                        $targets.hide();
                        $target.show();
                        return false;
                    });
                } else {
                    $target.hide();
                    $link.addClass("disabled").click(function() {
                        return false;
                    });
                }
            });
        };

        return this.each(function() {
            
            var $targetContainer = $($(this).data("target"));
            if (!$targetContainer.length){
                $(this).remove();
                return;
            }

            var $tabTargets = $targetContainer.find("[data-filtertabs-value]");

            if (!$tabTargets.length){
                $(this).remove();
                return;
            }

            initTabs($(this), $targetContainer, $tabTargets);
        });
        
    };

});

