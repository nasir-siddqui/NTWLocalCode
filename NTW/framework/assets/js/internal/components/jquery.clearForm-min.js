/*global define*/(function(e) {
    typeof define == "function" && define.amd ? define([ "jquery" ], e) : window.jQuery && e(window.jQuery);
})(function(e) {
    e.fn.clearForm = function() {
        return this.each(function() {
            var t = this, n = e("[data-options*=clearFormButton]", t), r = e(".tseInput", t);
            console.log(n);
            e(n).click(function() {
                e.each(r, function() {
                    e(this).val("");
                    console.log("clear");
                });
            });
        });
    };
});