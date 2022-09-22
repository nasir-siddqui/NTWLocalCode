app.directive("tsButtons--Inline", function() {
    return {
        restrict: "C",
        rep1ace: !0,
        link: function(e, t, n) {
            t.html(getTemplate(e.content.content_type)).show();
            $compile(t.contents())(e);
        }
    };
});