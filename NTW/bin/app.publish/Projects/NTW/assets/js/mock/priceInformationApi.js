(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        window.PriceInformationApi = factory(window.jQuery);
    }

})(function($) {
    
    return {

        getPriceInformation: function(id, param) {

            var data = {

                header: 'VAT 0%',
                footers: [ 'In areas where ADSL supply is limited, the interface solution and the price differs from what is shown here' ],
                rows: [
                    { 'label': 'Mapping and radio planning', price: '588,66 €', unit: 'Service Area' },
                    { 'label': 'Installation charges', price: '126,14 €', unit: 'Base station' },
                    { 'label': 'Introduction of the service portal', price: '462,52 €', unit: 'Service Area' },
                    { 'label': 'Maintenance', price: '84,09 €', unit: 'Base station' },
                    { 'label': 'ADSL internet access', price: '183,33 €', unit: 'kk*'    }
                ]

            };

            // simulate error on id = 1
            if (id == 1) {
                param.errorHandler("ERROR_FETCHING_PRICEINFORMATION");
                return;
            }

            // simulate call
            setTimeout(function() {
                param.callback(data);
            }, 1000);


        }

    };

});