app.directive("tsSelectListTrigger", function(e) {
    return {
        restrict: "C",
        link: function(t, n, r, i) {
            n.bind("click", function(e) {
                e.stopPropagation();
            });
            e.bind("click", function() {
                angular.forEach(t.selectlists, function(e, n) {
                    t.selectlists[n] = !1;
                });
                t.$apply();
            });
        }
    };
});

app.directive("tsSelectList", function() {
    return {
        restrict: "C",
        link: function(e, t, n) {
            var r = 300;
            n.ngModel != undefined && e.$watch(n.ngModel, function(e, n, i) {
                e !== n && setTimeout(function() {
                    var e = getOffset(t[0]).left, n = t[0].offsetWidth / 2;
                    t.css("margin-left", -n + "px");
                    e < n / 2 && (n = n - 10 + e);
                    t.css("margin-left", -n + "px");
                }, r);
            }, !1);
        }
    };
});