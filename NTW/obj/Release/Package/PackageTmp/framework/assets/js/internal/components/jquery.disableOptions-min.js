/*global define*/(function(e) {
    typeof define == "function" && define.amd ? define([ "jquery" ], e) : window.jQuery && e(window.jQuery);
})(function(e) {
    e.fn.disableOptions = function(t) {
        var n = {
            list1: ".tsShortCuts-links",
            attr1: "href",
            list2: ".tsAccordion-list",
            attr2: "data-url",
            icon: "tsIcon-Add"
        };
        t = e.extend({}, n, t);
        return this.each(function() {
            var n = this;
            e.each(e(t.list2 + " i." + t.icon, n), function() {
                var r = !1, i = this;
                e(n).data("compare-names") === !0 ? e.each(e(t.list1 + " li span.tsBookmark-item i", n), function() {
                    var t = this;
                    e(i).data("name") === e(t).data("name") && (r = !0);
                }) : e.each(e(t.list1 + " li a", n), function() {
                    var t = this;
                    e(i).data("url") === e(t).attr("href") && (r = !0);
                });
                r === !0 ? e(i).css("display", "none") : e(i).css("display", "block");
            });
        });
    };
});