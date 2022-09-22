alert("smart!");

(function(e, t) {
    var n = function(e, t, n) {
        var r;
        return function() {
            function u() {
                n || e.apply(s, o);
                r = null;
            }
            var s = this, o = arguments;
            r ? clearTimeout(r) : n && e.apply(s, o);
            r = setTimeout(u, t || 250);
        };
    };
    jQuery.fn[t] = function(e) {
        return e ? this.bind("resize", n(e)) : this.trigger(t);
    };
})(jQuery, "smartresize");