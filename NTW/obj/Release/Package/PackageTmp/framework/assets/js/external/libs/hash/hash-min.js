(function(e, t) {
    "use strict";
    var n = function() {
        var n = function() {
            var t = e.location.hash ? e.location.hash.substr(1).split("&") : [], n = {};
            for (var r = 0; r < t.length; r++) {
                var i = t[r].split("=");
                n[i[0]] = decodeURIComponent(i[1]);
            }
            return n;
        }, r = function(n) {
            var r = [];
            for (var i in n) i != t && i != "" && r.push(i + "=" + encodeURIComponent(n[i]));
            e.location.hash = r.join("&");
        };
        return {
            get: function(e) {
                var t = n();
                return e ? t[e] : t;
            },
            add: function(e) {
                var t = n();
                for (var i in e) t[i] = e[i];
                r(t);
            },
            remove: function(e) {
                e = typeof e == "string" ? [ e ] : e;
                var t = n();
                for (var i = 0; i < e.length; i++) delete t[e[i]];
                r(t);
            },
            clear: function() {
                r({});
            }
        };
    }();
    e.hash = n;
})(window);