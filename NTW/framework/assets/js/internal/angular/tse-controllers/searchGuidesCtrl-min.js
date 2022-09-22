"use strict";

app.controller("searchGuidesCtrl", [ "$scope", "$http", "$routeParams", "$location", "$window", "$q", "$element", "$timeout", "json", function(e, t, n, r, i, s, o, u, a) {
    var f = "search", l = "page", c = "cat", h = "tags", p = "sort", d = "Sortera", v = "Top 20 mest besökta guiderna", m = "Resultat för #search# #categories# #tags#", g = "", y, b = 500, w = 0, E = !0, S = "http://mgnl-author.www.telia.se/telia-se/privat/support/guideSearchJson.html", x = "/projects/support/json/tags.json", T = "/projects/support/json/categories.json", N = "/projects/support/json/sort.json";
    e.$watch("[currentPage, sortingname, categories, tTags]", function(t, n) {
        if (t != n) {
            e.oldGuides = e.guides;
            e.guides = null;
            e.$$phase || e.$apply();
            D();
        }
    }, function() {}, !0);
    e.searchChange = function() {
        clearTimeout(y);
        y = setTimeout(function() {
            e.oldGuides = e.guides;
            e.$$phase || e.$apply();
            D();
        }, b);
    };
    e.update = function(t) {
        t.header ? t.checked = !1 : e.currentPage = 1;
    };
    e.lastSelectElement = function(e) {
        if (e != undefined) {
            var t = 0;
            angular.forEach(e, function(e, n) {
                (e.checked || e.header) && t++;
            });
            return t != e.length;
        }
        return !1;
    };
    e.init = function() {
        e.sortingname = d;
        e.sorting = r.search()[p] != undefined ? r.search()[p] : "";
        e.search = r.search()[f] != undefined ? r.search()[f] : "";
        e.currentPage = r.search()[l] != undefined ? parseInt(r.search()[l]) : 1;
        C();
    };
    var C = function() {
        var t = r.search()[h] != undefined && r.search()[h] != "" ? r.search()[h].split("+") : [], n = r.search()[c] != undefined && r.search()[c] != "" ? r.search()[c].split("+") : [];
        a.getJson(T).then(function(t) {
            e.categories = JSON.parse(t);
            angular.forEach(e.categories, function(t, r) {
                n.indexOf(t.name) != -1 && (e.categories[r].checked = !0);
            });
        });
        a.getJson(x).then(function(n) {
            e.tTags = JSON.parse(n);
            angular.forEach(e.tTags, function(n, r) {
                t.indexOf(n.name) != -1 && (e.tTags[r].checked = !0);
            });
        });
        a.getJson(N).then(function(t) {
            e.sortingValues = JSON.parse(t);
            e.sorting != undefined && e.sorting != "" && angular.forEach(e.sortingValues, function(t, n) {
                t.value == e.sorting && (e.sortingname = t.name);
            });
        });
    }, k = function(e) {
        r.search(e);
    }, L = function(e) {
        for (var t in e) (e[t] == "" || e[t] == null || e[t] == undefined) && delete e[t];
        return e;
    }, A = function(t) {
        var n = [], r = 0, i = 10, s = Math.ceil(t.nrOfPages / i), o = e.currentPage, u = o;
        e.shownext = o != 1;
        e.showprev = parseInt(o) < parseInt(t.nrOfPages);
        s > 1 ? r = t.nrOfPages - i > 0 ? i : t.nrOfPages - i : r = parseInt(t.nrOfPages) + 1;
        if (o <= Math.floor(i / 2)) u = 1; else if (o >= t.nrOfPages - Math.ceil(i / 2)) {
            u = t.nrOfPages - i + 1;
            u > i && (u = i);
            r += u;
        } else {
            u = o - Math.floor(i / 2);
            r += u;
        }
        for (var a = u; a < r; a++) n.push({
            page: a,
            current: a == o
        });
        if (s > 1 && o < t.nrOfPages - Math.floor(i / 2)) {
            n.push({
                page: "...",
                current: !1
            });
            n.push({
                page: t.nrOfPages,
                current: !1
            });
        }
        if (s > 1 && o > Math.ceil(i / 2) + 2) {
            n.unshift({
                page: "...",
                current: !1
            });
            n.unshift({
                page: 1,
                current: !1
            });
        }
        e.pages = n;
    }, O = function(e) {
        return e.checked;
    }, M = function() {
        var t = "", n = "", r = "", i = "";
        if (e.categories != undefined) {
            var s = e.categories.filter(O);
            for (var o = 0; o < s.length; o++) {
                t += s[o].value;
                n += s[o].name;
                if (o != s.length - 1) {
                    t += "+";
                    n += "+";
                }
            }
        }
        if (e.tTags != undefined) {
            var u = e.tTags.filter(O);
            for (var o = 0; o < u.length; o++) {
                r += u[o].value;
                i += u[o].name;
                if (o != u.length - 1) {
                    r += "+";
                    i += "+";
                }
            }
        }
        var a = L({
            searchQuery: e.search,
            page: e.currentPage,
            category: t,
            tag: r,
            searchSort: e.sorting
        }), d = {};
        d[f] = e.search;
        d[l] = e.currentPage;
        d[c] = n;
        d[h] = i;
        d[p] = e.sorting;
        d = L(d);
        k(d);
        E = _(a, n, i);
        return E ? a : [];
    }, _ = function(t, n, r) {
        var i = !1;
        g = m;
        if (t["searchQuery"] != undefined) {
            g = g.replace("#search#", '"' + e.search + '" ');
            i = !0;
        }
        if (t["category"] != undefined) {
            var s = i ? "&" : "";
            g = g.replace("#categories#", s + ' "' + n.replace("+", " & ") + '"');
            i = !0;
        }
        if (t["tag"] != undefined) {
            var s = i ? "&" : "";
            g = g.replace("#tags#", s + ' "' + r.replace("+", "eller") + '"');
            i = !0;
        }
        g = g.replace("#tags#", "").replace("#categories#", "").replace("#search#", "");
        return i;
    }, D = function() {
        var t = M();
        if (Object.keys(t).length > 0) {
            e.listHeading = g;
            r.path("/");
            w++;
            a.getJson(S, t, w).then(function(t) {
                var n = JSON.parse(t);
                if (w == n.requestId) {
                    if (e.oldGuides == undefined || !e.oldGuides.equals(n)) {
                        e.guides = n.guide;
                        e.oldGuides = null;
                        e.$$phase || e.$apply();
                        A(n);
                    } else {
                        e.guides = e.oldGuides;
                        e.oldGuides = null;
                    }
                    e.loading = !1;
                }
            });
        } else {
            r.path("topplista");
            e.$$phase || e.$apply();
        }
    };
} ]);