/*!
 * jQuery.LocalScroll
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * http://flesler.blogspot.com/2007/10/jquerylocalscroll-10.html
 * @author Ariel Flesler
 * @version 1.2.9b
 */(function(e) {
    function r(t, n, r) {
        var i = n.hash.slice(1), s = document.getElementById(i) || document.getElementsByName(i)[0];
        if (!s) return;
        t && t.preventDefault();
        var o = e(r.target);
        if (r.lock && o.is(":animated") || r.onBefore && r.onBefore(t, s, o) === !1) return;
        r.stop && o._scrollable().stop(!0);
        if (r.hash) {
            var u = r.offset;
            u = u && u.top || u || 0;
            var a = s.id == i ? "id" : "name", f = e("<a> </a>").attr(a, i).css({
                position: "absolute",
                top: e(window).scrollTop() + u,
                left: e(window).scrollLeft()
            });
            s[a] = "";
            e("body").prepend(f);
            location = n.hash;
            f.remove();
            s[a] = i;
        }
        o.scrollTo(s, r).trigger("notify.serialScroll", [ s ]);
    }
    var t = location.href.replace(/#.*/, ""), n = e.localScroll = function(t) {
        e("body").localScroll(t);
    };
    n.defaults = {
        duration: 1e3,
        axis: "y",
        event: "click",
        stop: !0,
        target: window,
        reset: !0
    };
    e.fn.localScroll = function(i) {
        function s() {
            return !!this.href && !!this.hash && this.href.replace(this.hash, "") == t && (!i.filter || e(this).is(i.filter));
        }
        i = e.extend({}, n.defaults, i);
        if (i.hash && location.hash) {
            i.target && window.scrollTo(0, 0);
            r(0, location, i);
        }
        return i.lazy ? this.bind(i.event, function(t) {
            var n = e([ t.target, t.target.parentNode ]).filter(s)[0];
            n && r(t, n, i);
        }) : this.find("a,area").filter(s).bind(i.event, function(e) {
            r(e, this, i);
        }).end().end();
    };
    n.hash = function() {};
})(jQuery);