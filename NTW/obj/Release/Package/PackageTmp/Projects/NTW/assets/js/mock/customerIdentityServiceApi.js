/*global define*/
/*jshint unused: false*/

(function (factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        window.BookmarksApi = factory(window.jQuery);
    }

})(function ($) {

    var delay = function (func, delay) {
        setTimeout(function () {
            func();
        },
            delay
        );
    };


    return {

        lookupTscid: function (organizationsId, cb) {
            var ret = parseInt(organizationsId.substr(0, 5));
            console.log("MOCK: lookupTscid", organizationsId, ret);
            delay(function () {
                cb.callback(ret);
            }, 1000);
        }
    };

});
