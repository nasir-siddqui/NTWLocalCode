/*global define*/
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        window.BookmarksApi = factory(window.jQuery);
    }

})(function($) {

    if (Modernizr.localstorage) {

        if (!localStorage.getItem("bookmarks")) {

            localStorage.setItem("bookmarks", JSON.stringify([
                { id: 1, url: "http://www.telia.se", name: "Telia.se" },
                { id: 2, url: "http://www.google.se", name: "Google" },
                { id: 3, url: "http://www.telia.se/skapafelanmalan", name: "Skapa ny felanmälan" }
            ]));
        }

        var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

        $(function() {
            $(".tsShortCuts-links").prepend(
                $.map(bookmarks, function(item, index) {
                    return $("<li />").append(
                        $("<a />", { "href": item.url }).append(
                            item.name,
                            $("<i />", { "class": "tsIcon-Delete tsShortCuts-deleteBookmark tsToggle-container tsShortCuts-hide", "data-id": item.id, "data-name": item.name, "data-url": item.url })
                        )
                    );
                })
            );
        });

        var get = function() {
            return JSON.parse(localStorage.getItem("bookmarks"));
        };

        var save = function(bookmarks) {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        };

    }

    return {

        addCorpBookMark: function(orgId, name, url, cb) {

            var bookmarks = get();

            var id = Math.max.apply(null, $.map(bookmarks, function(item) { return item.id + 1; }).concat(1));

            bookmarks.push({ id: id, name: name, url: url });
            save(bookmarks);

            cb.callback([ { stBookmarkId: id } ]);
        },
        deleteCorpBookMark: function(orgId, name, url, id, cb) {

            var bookmarks = get();

            var _index = -1;
            $.each(bookmarks, function(index, item) { if (item.id === parseInt(id, 10)) { _index = index;} });

            if (_index >= 0) {
                bookmarks.splice(_index, 1);
                save(bookmarks);
                cb.callback();
            } else {
                // handle error
                cb.erroHandler();
            }

        },
        updateCorpBookMark: function (orgId, param) {
            
            var data = $.map(param.split(","), function(item) { return parseInt(item, 10); });
            
            var bookmarks = get();

            bookmarks.sort(function(a, b) {
                return $.inArray(a.id, data) - $.inArray(b.id, data);
            });

            save(bookmarks);

            cb.callback();

        }

    };

});
