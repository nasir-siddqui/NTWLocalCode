/* global define */

define(["jquery", "service/ibData"], function($, data) {
    
    return {
        getHeaders: function() {
            var headers = [ "Typ", "Text", "Ext.ref.", "Startdatum", "Address" ];
            headers = headers.concat(data._KVAttributeKeys);
            if (data.hasTrueBAttributes) {
                headers.push("Extra tjänster");
            }
            return headers;
        },
        getData: function() {

            var _data = [];

            $.each(data.products, function(index, product) {

                var address = product.address.street + ", " + product.address.postalArea + " " + product.address.city;

                var row = [ product.alphaCategory, product.invoiceText, product.externalReference, product.activeStartDate, address ];

                $.each(data._KVAttributeKeys, function(a, b) {
                    var v = product.attributes._KVAttributeStrKey[b] || "";
                    row.push(v);
                });

                if (data.hasTrueBAttributes) {
                    var s = "";
                    $.each(product.attributes._BAttributesTrueOnly, function(a, b) {
                        s += b + "<br />";
                    });
                    row.push(s);
                }

                _data.push(row);

            });

            return _data;
        }
    };

});