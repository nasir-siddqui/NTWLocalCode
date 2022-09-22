"use strict";

mapApp.controller("googleMapsCtrl", [ "$scope", "$routeParams", "$timeout", "$location", "json", function(e, t, n, r, i) {
    var s = "/projects/support/json/retailers.json";
    e.markers = [];
    e.markers.length == 0 && i.getJsonCached(s).then(function(t) {
        var n = JSON.parse(t);
        e.markers = n;
        e.$$phase || e.$apply();
    });
    e.selectAddress = function(t) {
        e.search = t.city + ", " + t.streetaddr;
    };
    e.searchAddress = function() {
        var t = e.search;
        if (t != undefined && t.length > 0) {
            t = removeSpaces(t, "").split(",");
            var n = $.grep(e.markers, function(e) {
                var n = removeSpaces(e.city, ""), r = removeSpaces(e.streetaddr, "");
                return t.indexOf(n) > -1 && t.indexOf(r) > -1;
            });
            if (n != undefined && n.length > 0) {
                r.path("/r/" + cleanContent(n[0].city) + "/" + cleanContent(n[0].streetaddr));
                e.$$phase || e.$apply();
            }
        }
    };
} ]);

mapApp.controller("googleMapsCtrl2", [ "$scope", "$routeParams", "$timeout", "$location", "$rootScope", "json", function(e, t, n, r, i, s) {
    var o = "/projects/support/json/retailers.json", u = [], a, f = t.city, l = t.street, c = function(e) {
        var t = cleanContent(e.city) == f && cleanContent(e.streetaddr) == l;
        return t;
    };
    if (e.markers == undefined) s.getJson(o).then(function(t) {
        var n = JSON.parse(t);
        if (f != undefined && n != undefined) {
            var r = n.filter(c);
            e.toggle = !0;
            e.details = r;
            e.$$phase || e.$apply();
        } else {
            e.details = [];
            e.toggle = !1;
        }
        e.markers = n;
    }); else {
        var h = e.markers.filter(c);
        e.details = h;
        e.toggle = !0;
        e.$$phase || e.$apply();
    }
} ]);