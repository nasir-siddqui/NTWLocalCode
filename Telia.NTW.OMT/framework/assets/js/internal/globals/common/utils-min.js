/*global define*/(function(e) {
    typeof define == "function" && define.amd ? define([], e) : window.Utils = e();
})(function() {
    return {
        getStyleSheetsList: function(e, t, n) {
            var r = [];
            for (var i = 0; i < document.styleSheets.length; i++) {
                var s = document.styleSheets[i], o = s.rules || s.cssRules;
                for (var u = 0; u < o.length; u++) {
                    var a = null, f = o[u];
                    if (f.selectorText && (a = f.selectorText.match(e)) !== null) {
                        var l = a[1] ? a[1] : a[0], c = null;
                        if (f.cssText) {
                            a = f.cssText.match(t);
                            c = a[1] ? a[1] : a[0];
                        } else f.style && f.style[n] && (c = f.style[n]);
                        var h = !1;
                        for (var p = 0; p < r.length; p++) if (r[p].index === l) {
                            h = !0;
                            break;
                        }
                        h || r.push({
                            index: l,
                            value: c
                        });
                    }
                }
            }
            return r;
        }
    };
});