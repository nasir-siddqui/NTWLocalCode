jsonApp.factory("json", function(e, t) {
    var n = [];
    return {
        getJsonCached: function(r) {
            if (n.length > 0) {
                i.resolve(n);
                return i.promise;
            }
            var i = t.defer();
            e({
                method: "GET",
                url: r
            }).success(function(e) {
                var t = JSON.stringify(e);
                n = t;
                i.resolve(t);
            }).error(function(e, t) {
                console.log("Error: " + t);
            });
            return i.promise;
        },
        getJson: function(n, r, i, s) {
            var s = t.defer();
            e({
                method: "GET",
                url: n,
                params: r
            }).success(function(e) {
                e.requestId = i;
                s.resolve(JSON.stringify(e));
            }).error(function(e, t) {
                console.log("Error: " + t);
            });
            return s.promise;
        },
        getJsonTwoCalls: function(n, r, i, s) {
            return t.all([ e.get(n, {
                params: r
            }), e.get(i, {
                params: s
            }) ]).then(function(e) {
                var t = [];
                angular.forEach(e, function(e) {
                    t = t.concat(e.data);
                });
                return t;
            });
        },
        getObjects: function(e) {
            var n = t.defer(), r = window[e];
            n.resolve(r);
            return n.promise;
        }
    };
});