(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'modules/collapser', 'service/priceInformationApi', 'helpers/serviceErrorHandling'], factory);
    } else {
        factory(window.jQuery, window.Collapser, window.PriceInformationApi, window.ErrorHandling);
    }

})(function($, Collapser, api, errorHandler) {


    $.fn.priceInformation = function(options) {


        // displays an error in the area
        var displayError = function(message) {

            console.log(this, message);
            $('.tscArea', this).empty().append($("<p />", { "class": "error" }).text(message));
        };

        // displays the priceinformation in the area
        var displayPriceInformation = function(data) {

            // lock the div height
            $(this).css('height', $(this).height()).css('overflow', 'hidden');

            // create the fetched data
            $('.tscArea', this).empty().append(
                $("<p />", { "class": "title" }).text(data.header),
                $("<div />", { "class": "tscRows" }).append(
                    $.map(data.rows, function(row) {
                        return $("<div />", { "class": "row" }).append(
                            $("<div />", { "class": "col-md-4" }).text(row.label),
                            $("<div />", { "class": "col-md-8" }).append(
                                $("<span />", { "class": "price" }).html("<strong>" + row.price + " / </strong>"),
                                $("<span />", { "class": "price" }).text(row.unit)
                            )
                        );
                    })
                ),
                $("<ul />", { "class": "tscList" }).append(
                    $.map(data.footers, function(item, index) {
                        return $("<li />").append(
                            $("<p />", { "class": "small" }).append(
                                $("<span />", { "class": "price" }).text(Array(index + 2).join('*')),
                                " ",
                                item
                            )
                        );
                    })
                )
            );

            // slide to content height
            $(this).animate({ height: $('.tscArea', this).outerHeight() });
        
        };


        return this.each(function() {

            var list = $(options.target, this);

            list.on('click', function(e) {
                
                e.preventDefault();

                // get the id for the price information
                var id = $(this).data(options.value);
                
                //check if the area is open
                if ($(this).next('div').length) {
                    // close it and remove the area
                    $(this).next('div').data('collapser').collapse(function() {
                        this.target.remove();
                    });
                    // return from the function, no need to continue
                    return;
                }

                // create the area element and add it after the link
                var area = $("<div />").append(
                    $("<div />", { id: "priceInfo-" + id, "class": "tscArea" }).append(
                        $("<div />", { "class": "tscAreaLoading" }).append(
                            $("<div />", { "class": "tsLoading-icon-large" })
                        )
                    )
                ).hide();
                $(this).after(area);

                // expand the element
                var c = new Collapser(null, { group: "priceInfo", target: area.get(0) });
                c.collapse();

                // save the collpaser in the div
                area.data('collapser', c);

                // generate service callbacks and use the area as the context
                var cb = errorHandler.serviceCallbacksWithContext(area.get(0), displayPriceInformation, displayError, [id]);

                // call the service
                api.getPriceInformation(id, cb);

            });

        });

    };

    $("[data-toggle='price-information']").each(function() {
        $(this).priceInformation({
            target: $(this).data('target') || null,
            value: $(this).data('value') || 'id'
        });
    });

});