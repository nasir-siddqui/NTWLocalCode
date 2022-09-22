/*global define*/(function(e) {
    typeof define == "function" && define.amd ? define([ "jquery" ], e) : window.jQuery && e(window.jQuery);
})(function(e) {
    e.fn.loadVideo = function() {
        return this.each(function() {
            var t = this, n = e("[data-widget*=loadVideo]");
            e.each(e(n, t), function() {
                var t = e(this), n = e(this).attr("data-youtubeid"), r = e("<iframe src='//www.youtube.com/embed/" + n + "?rel=0' frameborder='0' allowfullscreen></iframe>");
                setTimeout(function() {
                    t.append(r);
                }, 600);
            });
        });
    };
});