/*global define*/(function(e) {
    typeof define == "function" && define.amd ? define([ "jquery" ], e) : window.jQuery && e(window.jQuery);
})(function(e) {
    jQuery.fn.initDropdown = function(t) {
        var n = {
            wrapper: "tseDropdown",
            selected: "tseDropdown-selected",
            label: "tseDropdown-label",
            arrow: "tseDropdown-arrow",
            list: "tseDropdown-list",
            listId: "tseList",
            listItem: "tseDropdown-listItem",
            listItemSelected: "tseDropdown-listItem--selected"
        }, r = e.extend(n, t);
        this.each(function() {
            var t = e._data(this, "events"), n = e(this).drawDropdown(r);
            if (t && t.change) {
                var i = this;
                e("li", n).click(function(n) {
                    e.each(t.change, function(t, r) {
                        e(i).val(e(n.target).data("value"));
                        r.handler.call(i, n);
                    });
                });
            }
        });
        return e("." + r.wrapper + ":not(.tsInitiated)").dropdown(r);
    };
    jQuery.fn.drawDropdown = function(t) {
        var n = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList"
        }, r = e.extend(n, t);
        if (!e("html").is(".ie7", ".lt-ie7")) {
            var i = e('[data-id^="' + r.listId + '"]').length, s = function() {
                var t = "";
                e(this).attr("data-colorwheel") == "true" && (t = '<span class="tsDropdown-colour"></span><i class="tsPict-colorwheel"></i>');
                var n = e("<div />").addClass(r.wrapper).attr("data-name", e(this).attr("name") || ""), s = e("<span />").addClass(r.selected).attr("data-value", ""), o = e("<span />").addClass(r.label), u = e("<div />").addClass(r.arrow);
                s.append(o).append(u);
                var a = e("<ul />").addClass(r.list).attr("data-id", r.listId + i);
                n.append(s).append(a);
                var f = e(this).attr("data-placeholder");
                typeof f != "undefined" && o.text(f);
                e.each(e(this).data(), function(e, t) {
                    e !== "placeholder" && e !== "class" && n.attr("data-" + e, t);
                });
                e(this).before(n);
                s.attr("data-value", "");
                o.text(e(this).data("emptytext"));
                e(this).children("option").each(function() {
                    var t = e("<li />").addClass(r.listItem).text(e(this).text()).attr("data-value", e(this).val());
                    a.append(t);
                    if (e(this).is(":selected") && typeof f == "undefined") {
                        t.addClass(r.listItemSelected);
                        s.attr("data-value", e(this).val());
                        o.text(e(this).text());
                    }
                    e.each(e(this).data(), function(e, n) {
                        t.attr("data-" + e, n);
                    });
                });
                i++;
                var l = e(this).prev().get(0);
                e(this).remove();
                return l;
            };
            return e.map(this, function(e) {
                return s.call(e);
            });
        }
    };
    jQuery.fn.dropdown = function(t) {
        var n = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList",
            listItemSelected: "selected"
        }, r = e.extend(n, t), i = {
            button: null,
            list: null,
            items: null,
            selected: null,
            arrow: null,
            visible: !1
        };
        return this.each(function() {
            function o() {
                e("." + r.wrapper).removeClass("open");
                e("." + r.list).hide();
                if (n.button.parents(".tsProductAttribute").length > 0) {
                    n.button.css("position", "absolute");
                    (mediaqueriesMin("mqMedium") || e("body").hasClass("lt-ie9")) && n.button.css("right", "12px");
                }
                n.button.addClass("open");
                n.list.show();
            }
            function u() {
                n.list.hide();
                n.button.removeClass("open");
                if (n.button.parents(".tsProductAttribute").length > 0) {
                    n.button.css("position", "relative");
                    (mediaqueriesMin("mqMedium") || e("body").hasClass("lt-ie9")) && n.button.css("right", "0");
                }
            }
            e(this).data("customClasses", t);
            e(this).addClass("tsInitiated");
            var n = e.extend({}, i, n);
            e(this).data("options", n);
            n.button = e(this);
            n.list = e(this).find("." + r.list);
            n.selected = e(this).find("." + r.selected);
            n.items = e(this).find("." + r.list + " li");
            n.arrow = e(this).find("." + r.arrow);
            e(document).click(u);
            e(document).keydown(function(e) {
                e.keyCode == 27 && u();
            });
            n.selected.find(".tsDropdown-colour").hide();
            n.items.each(function() {
                if (e(this).attr("data-color") !== undefined) {
                    e(this).attr("data-color") != "wheel" ? e(this).attr("data-color") == "white" || e(this).attr("data-color") == "#ffffff" || e(this).attr("data-color") == "#fff" ? e(this).prepend('<span class="tsDropdown-colour" style="background: white; border: 1px solid #c7c2ba"></span>') : e(this).prepend('<span class="tsDropdown-colour" style="background:' + e(this).attr("data-color") + ' "></span>') : e(this).prepend('<i class="tsPict-colorwheel"></i>');
                    e(this).append('<i class="tsPict-' + e(this).attr("data-stock") + '"></i>');
                }
            });
            n.button.click(function(t) {
                if (!e(this).hasClass("tsDropdown-disabled") && typeof e(this).attr("disabled") == "undefined") {
                    n.list.is(":visible") ? u() : o();
                    t.stopPropagation();
                }
            });
            n.items.click(function() {
                s.call(this, n);
            });
            e(this).on("init-item", function(t, n) {
                e(n).click(s);
            });
            var s = function() {
                if (!e(this).hasClass("tsOverlay-opener") && e(this).attr("data-stock") != "na") {
                    n.selected.find("." + r.label).text(e(this).text());
                    e(this).siblings().removeClass(r.listItemSelected);
                    e(this).addClass(r.listItemSelected);
                    n.selected.attr("data-value", e(this).attr("data-value"));
                    n.selected.find(".tsDropdown-colour").css("background", e(this).attr("data-color"));
                    if (n.selected.find(".tsPict-colorwheel").length > 0) {
                        n.selected.find(".tsPict-colorwheel").hide();
                        n.selected.find(".tsDropdown-colour").show();
                    }
                    e(this).attr("data-color") == "white" || e(this).attr("data-color") == "#ffffff" ? n.selected.find(".tsDropdown-colour").css("border", "1px solid #c7cdba") : n.selected.find(".tsDropdown-colour").css("border", "0px");
                    e(this).parents('[data-behaviour="checkbox"]') && e(this).parents('[data-behaviour="checkbox"]').addClass("tsItem--selected");
                }
            };
        });
    };
    jQuery.fn.dropdownVal = function(t) {
        if (typeof e(this).data("customClasses") == "undefined") return;
        var n = "." + e(this).data("customClasses").selected;
        if (typeof t == "undefined") {
            var t = e(n, this).attr("data-value");
            return t;
        }
        var r = e("ul", this), i = e("[data-value='" + t + "']", r);
        if (i.length) {
            r.is(":visible") || e(this).trigger("click");
            i.trigger("click");
        }
    };
    jQuery.fn.dropdownRemove = function(t) {
        if (typeof e(this).data("customClasses") == "undefined") return;
        var n = "." + e(this).data("customClasses").selected, r = "." + e(this).data("customClasses").label, i = e("ul", this);
        e("[data-value='" + t + "']", i).remove();
        var s = e(n, this).attr("data-value");
        if (s === t) {
            var o = e(n, this);
            o.attr("data-value", "");
            e(r, o).text(e(this).data("emptytext") || "No item selected");
        }
    };
    jQuery.fn.dropdownText = function() {
        if (typeof e(this).data("customClasses") == "undefined") return;
        var t = "." + e(this).data("customClasses").selected;
        if (typeof n == "undefined") {
            var n = e(t, this).text();
            return n;
        }
    };
    jQuery.fn.dropdownAddValue = function(t, n) {
        var r = e("<li />").addClass(e(this).data("customClasses").listItem).text(n).attr("data-value", t), i = e("." + e(this).data("customClasses").list, this).append(r);
        e(this).trigger("init-item", r);
        return this;
    };
    e(".tsSelectDropdown").drawDropdown();
    e(".tsDropdown:not(.tsInitiated)").dropdown();
});