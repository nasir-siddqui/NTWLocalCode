/*global define*/
/*jshint unused: false*/

(function (factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        window.userStorageApi = factory(window.jQuery);
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

        getUserProperty: function (keyName, cb) {
            var data = localStorage.getItem("_" + keyName);
            console.log("MOCK: getProperty", keyName, data);
            delay(function () {
                cb.callback(data);
            }, 1000);
        },
        setUserProperty: function (keyName, data, cb) {
            console.log("MOCK: setProperty", keyName, data);
            delay(function () {
                localStorage.setItem("_" + keyName, data);
                cb.callback();
            }, 1000);
        },
        getProfileProperty: function (id, keyName, cb) {
            var data = localStorage.getItem(id + "_" + keyName);
            console.log("MOCK: getProperty", id, keyName, data);
            delay(function () {
                cb.callback(data);
            }, 1000);
        },
        setProfileProperty: function (id, keyName, data, cb) {
            console.log("MOCK: setProperty", id, keyName, data);
            delay(function () {
                localStorage.setItem(id + "_" + keyName, data);
                cb.callback();
            }, 1000);
        },
        getOrganisationProperty: function (id, keyName, cb) {
            var data = localStorage.getItem(id + "_" + keyName);
            console.log("MOCK: getProperty", id, keyName, data);
            delay(function () {
                cb.callback(data);
            }, 1000);
        },
        setOrganisationProperty: function (id, keyName, data, cb) {
            console.log("MOCK: setProperty", id, keyName, data);
            delay(function () {
                localStorage.setItem(id + "_" + keyName, data);
                cb.callback();
            }, 1000);
        }


    };

});
