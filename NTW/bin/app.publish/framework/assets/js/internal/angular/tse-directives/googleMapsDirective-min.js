var map;

mapApp.directive("googleMaps", [ "$location", "$timeout", "Icons", function(e, t, n) {
    return {
        link: function(t, r, s) {
            var o = [], u;
            t.$watch("markers", function(e, i) {
                if (e !== i) {
                    var s = f();
                    u = new google.maps.Map(r[0], s);
                    var c = "/resources/templating-kit/themes/telia-se/css/gfx/", h = n.getIcon(), p = l(c);
                    t.toggle = !1;
                    var d = t.markers;
                    o = a(d, h, t);
                    var v = new MarkerClusterer(u, o, {
                        maxZoom: 10,
                        gridSize: 20,
                        styles: p
                    });
                }
            }, !0);
            var a = function(n, r) {
                var s = [];
                for (i = 0; i < n.length; i++) {
                    var o = t.details != undefined && t.details.length > 0 && t.details[0].city == n[i].city && t.details[0].streetaddr == n[i].streetaddr, a = new google.maps.Marker({
                        position: new google.maps.LatLng(n[i].lat, n[i].lng),
                        map: u,
                        icon: o ? r[n[i].type].iconSelected : r[n[i].type].icon
                    });
                    if (o) {
                        t.currentMark = a;
                        t.currentType = n[i].type;
                    }
                    google.maps.event.addListener(a, "click", function(i, s) {
                        return function() {
                            t.currentType != undefined && t.currentType !== "" && t.currentMark.setIcon(r[t.currentType].icon);
                            Modernizr.mq("only screen and (max-width: " + mqLtSmall + ")") && c(n[s].getPosition(), 0, 80);
                            var o = cleanContent(n[s].city), u = cleanContent(n[s].streetaddr);
                            e.path("/r/" + o + "/" + u);
                            i.setIcon(r[n[s].type].iconSelected);
                            t.currentMark = i;
                            t.currentType = n[s].type;
                            t.$$phase || t.$apply();
                        };
                    }(a, i));
                    s.push(a);
                }
                return s;
            }, f = function() {
                var e, n = 5;
                if (t.details != undefined && t.details[0] != undefined && t.details.length > 0) {
                    e = new google.maps.LatLng(t.details[0].lat, t.details[0].lng);
                    n = 12;
                } else {
                    e = new google.maps.LatLng(61.0094026, 14.5508748);
                    navigator.geolocation && navigator.geolocation.getCurrentPosition(h);
                }
                var r = {
                    zoom: n,
                    center: e,
                    mapTypeControlOptions: {
                        mapTypeIds: [ google.maps.MapTypeId.ROADMAP ]
                    },
                    mapTypeControl: !1,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                return r;
            }, l = function(e) {
                return [ {
                    textColor: "white",
                    textSize: 14,
                    url: e + "pin-large.png",
                    height: 80,
                    width: 35
                }, {
                    textColor: "white",
                    textSize: 14,
                    url: e + "pin-large.png",
                    height: 80,
                    width: 35
                }, {
                    textColor: "white",
                    textSize: 14,
                    url: e + "pin-large.png",
                    height: 80,
                    width: 35
                }, {
                    textColor: "white",
                    textSize: 14,
                    url: e + "pin-large.png",
                    height: 80,
                    width: 35
                }, {
                    textColor: "white",
                    textSize: 14,
                    url: e + "pin-large.png",
                    height: 80,
                    width: 35
                } ];
            }, c = function(e, t, n) {
                var r = u.getProjection().fromLatLngToPoint(e instanceof google.maps.LatLng ? e : u.getCenter()), i = new google.maps.Point((typeof t == "number" ? t : 0) / Math.pow(2, u.getZoom()) || 0, (typeof n == "number" ? n : 0) / Math.pow(2, u.getZoom()) || 0);
                u.setCenter(u.getProjection().fromPointToLatLng(new google.maps.Point(r.x - i.x, r.y + i.y)));
            }, h = function(e) {
                var t = e.coords.latitude, n = e.coords.longitude, r = new google.maps.LatLng(t, n);
                u.setCenter(r);
                u.setZoom(9);
            };
        }
    };
} ]);

mapApp.directive("tsMapClose", [ "$location", "Icons", function(e, t) {
    return {
        restrict: "C",
        link: function(n, r, i, s) {
            r.bind("click", function() {
                n.toggle = !1;
                e.path("/");
                var r = n.currentMark, i = "/resources/templating-kit/themes/telia-se/css/gfx/", s = t.getIcon(i);
                r.setIcon(s[n.details[0].type].icon);
                n.details = {};
                n.$$phase || n.$apply();
            });
        }
    };
} ]);

mapApp.directive("tsAutoCompleteSearch", [ "$location", "$rootScope", function(e, t) {
    return {
        restrict: "C",
        link: function(e, t, n, r) {
            e.autoindex = 0;
            var i;
            $(document).keydown(function(t) {
                if (t.keyCode == 38) {
                    var n = s();
                    n.length > 0 && e.autoindex--;
                }
                if (t.keyCode == 40) {
                    var n = s();
                    n.length > 0 && e.autoindex++;
                }
                if (t.keyCode == 13 && i != undefined) {
                    e.search = removeSpaces(i.text(), "");
                    e.autoindex = 0;
                    e.$$phase || e.$apply();
                }
            });
            var s = function() {
                var n = t.siblings("ul").find("li");
                n.removeClass("active");
                i = $(n[e.autoindex]);
                i.addClass("active");
                return n;
            }, o = function(e) {
                return e.city.toLowerCase() == "göteborg";
            };
        }
    };
} ]);

mapApp.factory("Icons", function() {
    var e = "/resources/templating-kit/themes/telia-se/css/gfx/";
    return {
        getIcon: function() {
            return {
                store: {
                    icon: e + "pin.png",
                    iconSelected: e + "pin-selected.png"
                },
                retail: {
                    icon: e + "pin-alt.png",
                    iconSelected: e + "pin-alt-selected.png"
                }
            };
        }
    };
});