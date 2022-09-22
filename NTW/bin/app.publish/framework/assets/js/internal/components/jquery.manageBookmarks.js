/*global define */
/*jshint unused: false*/

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'service/userStorageApi', 'helpers/serviceErrorHandling', 'helpers/common', 'libs/jquery/jquery-ui-1.10.3.mybusiness.min', 'modules/jquery.toggleManage', 'modules/jquery.checkBookmarks'], factory);
    } else if (window.jQuery && window.BookmarksApi) {
        factory(window.jQuery, window.BookmarksApi);
    }

})(function($, bookmarksApi, errorHandler, common) {

    
    $.fn.bookmarks = function(options) {

        var thisBookmark = this;

        var userId = {
            userId: common.userId,
            orgId: common.orgnr
        };

        var defaults = {
            customForm: '.tsShortCuts-add-url',
            customAddButton: '#add_bookmark',
            customAddUrl: '#shortcuts_url',
            customAddName: '#shortcuts_url_name',
            list: '.tsShortCuts-links'
        };

        var o = $.extend({}, defaults, options);

        function displayError(msg) {
            // Fix this when you know what the right way of using errors are
            var errorMsg = $('<p class="bookmarkErrorMessage error">' + msg + '</p></div>');
            var container = $('.tsShortCuts-add-url');
            $('p.bookmarkErrorMessage').remove();
            container.prepend(errorMsg);
        }

        var getData = function(remove, name, url, uuid) {
            var data = $.grep($.map($(o.list + " li:not([id])", this), function(item) {
                var ret = { u: $("a i", item).data('url'), n: $("a i", item).data('name'), uuid: $("a i", item).data('uuid') };
                return ret;
            }), function(item, index) {
                return remove === null || remove !== index;
            });
            if (name && url && uuid) {
                data.push({ u: url, n: name, uuid: uuid });
            }
            var json = JSON.stringify(data);
            console.log(json, json.length);
            return json;
        };

        function checkBookmarks() {
            $(thisBookmark).checkBookmarks();
        }

        var addBookmark = function(name, url, uuid) {

            var _this = this;

            var d = getData.call(this, null, name, url, uuid);

            function appendBookmark() {
                var data = JSON.parse(d);
                $('p.bookmarkErrorMessage').remove();
                var id = data[data.length - 1].stBookmarkId;
                var li = $("<li></li>");
                var aIcon = $("<i class='tsIcon-Next tsLinkIcon'></i>");
                var a = $("<a href='" + url + "' title='" + name + "'></a>").text(name);
                var i = $("<i style='display: inline;' class='tsIcon-Minus tsShortCuts-deleteBookmark tsToggle-container tsShortCuts-hide tsShortCuts-deleteBookmark' data-name='" + name + "' data-url='" + url + "' data-uuid='" + uuid + "'></i>");
                a.append(i);
                li.append(aIcon).append(a);
                $("#toggle-add", _this).before(li);

                // Hightlight
                li.addClass('hightlight');
                setTimeout(function() {
                    li.removeClass('hightlight');
                }, 50);


                // Run the script again so it's possible to delete the newly added bookmark
                update.call(_this);
            }
            var callbackFunctions = errorHandler.serviceCallbacks(appendBookmark, displayError);
            bookmarksApi.setProfileProperty(common.orgTscid, "bookmarks", d, callbackFunctions);

        };

        var deleteBookmark = function(parentListItem) {
            
            var id = parentListItem.index();
            console.log('delete', id);

            var d = getData.call(this, id);

            function _deleteBookmark() {
                parentListItem.remove();
            }

            //bookmarksApi.deleteCorpBookMark(userId.orgId, name, url, id, {callback:_deleteBookmark, errorHandler:displayError});
            bookmarksApi.setProfileProperty(common.orgTscid, "bookmarks", d, {callback:_deleteBookmark, errorHandler:displayError});
        };

        var update = function() {

            var _this = this;
            $(".tsShortCuts-deleteBookmark", this).each(function() {

                var events = $._data(this, "events");

                if (typeof events === "undefined" || !events.click) {
                    $(this).on( "click", function(e) {
                        e.preventDefault();
                        var parentListItem = $(this).parent().parent();
                        deleteBookmark.call(_this, parentListItem);
                        console.log($(this).data("uuid"));
                        $(thisBookmark).checkBookmarks($(this).data("uuid"));
                    });
                }

            });

        };

        var init = function() {

            var $this = $(this);
            var _this = this;
            
            $(o.customAddButton, this).click(function(e) {
                if ($(o.customForm).valid()) {
                    e.preventDefault();
                    var name = $(o.customAddName, $this).val();
                    var url = $(o.customAddUrl, $this).val();
                    url = url.match(/^http(?:s)?\:\/\//) ? url : "http://" + url;
                    addBookmark.call(_this, name, url, 1);
                }

            });

            $('.tsShortCuts-manage', this).tsToggle({ target: '.tsToggle-container', onToggle: function(b) {
                $(o.list).sortable(b ? 'enable' : 'disable');
            } });

            $('.tsShortCuts-manage', this).click(function() {
                $('.tsToggle-manage', this).toggleClass('tsShortCuts-hide');
            });

            $('.tsShortCuts-add-link', this).tsToggle({ target: '.tsExpand-container' });

            $('.tsShortCuts-add-btn', this).on("click", function(e) {
                e.stopImmediatePropagation();

                // Toggle between add and remove bookmark
                if ($(this).hasClass('tsIcon-Add')) {
                    addBookmark.call(_this, $(this).attr('data-name'), $(this).attr('data-url'), $(this).attr('data-uuid'));
                    var closestLi = $(this).closest('li');

                    // Hightlight
                    closestLi.addClass('highlight addedBookmark');
                    setTimeout(function() {
                        closestLi.removeClass('highlight');
                    }, 700);

                    $(this).removeClass('tsIcon-Add').addClass('tsIcon-Minus');
                }
                else {
                    $('.tsShortCuts-links', _this).find("[data-uuid='" + $(this).attr('data-uuid') + "']").trigger('click');
                    $(this).removeClass('tsIcon-Minus').addClass('tsIcon-Add');
                    $(this).closest('li').removeClass('addedBookmark');
                }

            });



            $(o.list, this).sortable({
                items: '> li:not(.pin)',
                stop: function(event, ui) {
                    var param = $.map($(".tsShortCuts-links li a i", $this), function(item) { return $(item).data("id"); }).join(",");
                    var d = getData.call(_this);
                    bookmarksApi.setProfileProperty(common.orgTscid, "bookmarks", d, { callback:function() {}, errorHandler: displayError });
                }
            }).disableSelection();

            $(o.list).sortable('disable');

            checkBookmarks();

        };

        return this.each(function() {
        
            if (!this.Bookmarks) {

                this.Bookmarks = {};

                init.call(this);
                update.call(this);

            }

        });
    };

    $("[data-widget*=shortcuts]").bookmarks();

});