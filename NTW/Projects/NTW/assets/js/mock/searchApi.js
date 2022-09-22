/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'libs/jquery/jquery.csv-0.71.min'], factory);
    } else if (window.jQuery && window.jQuery.csv) {
        window.SearchApi = factory(window.jQuery);
    }

})(function($) {

    var url = 'data/search.csv';
    var e = $("[data-search-url]");
    if (e.length) {
        url = e.data('search-url');
    }
    
    return {
        search: function(search, callback) {

            $.ajax({
                url: url,
                headers: {
                    Accept : "text/csv; charset=utf-8", "Content-Type": "text/csv; charset=utf-8"
                },
                success: function( data ) {
                    
                    var splited = $.csv.toObjects(data);
                    var matcher = new RegExp(search, "i" );
                    var r = $.map(splited, function(item){
                        if (matcher.test(item.Value)) {
                            return {
                                label: item.Value,
                                value: item.Value,
                                category: item.Category,
                                id: item.Id
                            };
                        }
                    });
                    
                    callback(r);
                }
            });
        }
    };

});
