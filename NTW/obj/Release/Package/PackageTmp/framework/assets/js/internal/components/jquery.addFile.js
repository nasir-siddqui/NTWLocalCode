/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.addFile = function() {

        return this.each(function() {
            var _this = this;
            var addFileWidget = "";

            addFileWidget = $(_this);

            var fileContainer = $(addFileWidget.data("file-container"), _this);
            var inputFile = $(addFileWidget.data("file-input"), _this);

            inputFile.on("change", function() {
                var chosenFile = inputFile.val();
                var fileName = chosenFile.split("\\").pop();
                fileContainer.prepend(
                    $("<div />", { "class": "tscAppend-item", "data-file": chosenFile }).append(
                        $("<div />", { "class": "tscAppend-placeholder" }).append(
                            $("<div />", { "class": "tscIconBackground" }).append(
                                $("<i />", { "class": "tsIcon-Delete"}).click(remove)
                            )
                        ),
                        $("<span />", { "class": "tscLabel" }).text(fileName)
                    )
                );
            });

            var remove = function() {
                $(this).closest(".tscAppend-item").remove();
            };


        });
        
    };

    $("[data-widget*='addFile']").each(function() {
        $(this).addFile();
    });


});