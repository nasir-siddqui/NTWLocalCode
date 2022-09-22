/*! jQuery UI - v1.10.3 - 2013-12-11
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.sortable.js, jquery.ui.autocomplete.js, jquery.ui.menu.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */(function(e, t) {
    function n(t, n) {
        var i, s, o, u = t.nodeName.toLowerCase();
        return "area" === u ? (i = t.parentNode, s = i.name, t.href && s && "map" === i.nodeName.toLowerCase() ? (o = e("img[usemap=#" + s + "]")[0], !!o && r(o)) : !1) : (/input|select|textarea|button|object/.test(u) ? !t.disabled : "a" === u ? t.href || n : n) && r(t);
    }
    function r(t) {
        return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function() {
            return "hidden" === e.css(this, "visibility");
        }).length;
    }
    var i = 0, s = /^ui-id-\d+$/;
    e.ui = e.ui || {}, e.extend(e.ui, {
        version: "1.10.3",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), e.fn.extend({
        focus: function(t) {
            return function(n, r) {
                return "number" == typeof n ? this.each(function() {
                    var t = this;
                    setTimeout(function() {
                        e(t).focus(), r && r.call(t);
                    }, n);
                }) : t.apply(this, arguments);
            };
        }(e.fn.focus),
        scrollParent: function() {
            var t;
            return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
            }).eq(0) : this.parents().filter(function() {
                return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
            }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t;
        },
        zIndex: function(n) {
            if (n !== t) return this.css("zIndex", n);
            if (this.length) for (var r, i, s = e(this[0]); s.length && s[0] !== document; ) {
                if (r = s.css("position"), ("absolute" === r || "relative" === r || "fixed" === r) && (i = parseInt(s.css("zIndex"), 10), !isNaN(i) && 0 !== i)) return i;
                s = s.parent();
            }
            return 0;
        },
        uniqueId: function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++i);
            });
        },
        removeUniqueId: function() {
            return this.each(function() {
                s.test(this.id) && e(this).removeAttr("id");
            });
        }
    }), e.extend(e.expr[":"], {
        data: e.expr.createPseudo ? e.expr.createPseudo(function(t) {
            return function(n) {
                return !!e.data(n, t);
            };
        }) : function(t, n, r) {
            return !!e.data(t, r[3]);
        },
        focusable: function(t) {
            return n(t, !isNaN(e.attr(t, "tabindex")));
        },
        tabbable: function(t) {
            var r = e.attr(t, "tabindex"), i = isNaN(r);
            return (i || r >= 0) && n(t, !i);
        }
    }), e("<a>").outerWidth(1).jquery || e.each([ "Width", "Height" ], function(n, r) {
        function i(t, n, r, i) {
            return e.each(s, function() {
                n -= parseFloat(e.css(t, "padding" + this)) || 0, r && (n -= parseFloat(e.css(t, "border" + this + "Width")) || 0), i && (n -= parseFloat(e.css(t, "margin" + this)) || 0);
            }), n;
        }
        var s = "Width" === r ? [ "Left", "Right" ] : [ "Top", "Bottom" ], o = r.toLowerCase(), u = {
            innerWidth: e.fn.innerWidth,
            innerHeight: e.fn.innerHeight,
            outerWidth: e.fn.outerWidth,
            outerHeight: e.fn.outerHeight
        };
        e.fn["inner" + r] = function(n) {
            return n === t ? u["inner" + r].call(this) : this.each(function() {
                e(this).css(o, i(this, n) + "px");
            });
        }, e.fn["outer" + r] = function(t, n) {
            return "number" != typeof t ? u["outer" + r].call(this, t) : this.each(function() {
                e(this).css(o, i(this, t, !0, n) + "px");
            });
        };
    }), e.fn.addBack || (e.fn.addBack = function(e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function(t) {
        return function(n) {
            return arguments.length ? t.call(this, e.camelCase(n)) : t.call(this);
        };
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({
        disableSelection: function() {
            return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(e) {
                e.preventDefault();
            });
        },
        enableSelection: function() {
            return this.unbind(".ui-disableSelection");
        }
    }), e.extend(e.ui, {
        plugin: {
            add: function(t, n, r) {
                var i, s = e.ui[t].prototype;
                for (i in r) s.plugins[i] = s.plugins[i] || [], s.plugins[i].push([ n, r[i] ]);
            },
            call: function(e, t, n) {
                var r, i = e.plugins[t];
                if (i && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (r = 0; i.length > r; r++) e.options[i[r][0]] && i[r][1].apply(e.element, n);
            }
        },
        hasScroll: function(t, n) {
            if ("hidden" === e(t).css("overflow")) return !1;
            var r = n && "left" === n ? "scrollLeft" : "scrollTop", i = !1;
            return t[r] > 0 ? !0 : (t[r] = 1, i = t[r] > 0, t[r] = 0, i);
        }
    });
})(jQuery);

(function(e, t) {
    var n = 0, r = Array.prototype.slice, i = e.cleanData;
    e.cleanData = function(t) {
        for (var n, r = 0; null != (n = t[r]); r++) try {
            e(n).triggerHandler("remove");
        } catch (s) {}
        i(t);
    }, e.widget = function(n, r, i) {
        var s, o, u, a, f = {}, l = n.split(".")[0];
        n = n.split(".")[1], s = l + "-" + n, i || (i = r, r = e.Widget), e.expr[":"][s.toLowerCase()] = function(t) {
            return !!e.data(t, s);
        }, e[l] = e[l] || {}, o = e[l][n], u = e[l][n] = function(e, n) {
            return this._createWidget ? (arguments.length && this._createWidget(e, n), t) : new u(e, n);
        }, e.extend(u, o, {
            version: i.version,
            _proto: e.extend({}, i),
            _childConstructors: []
        }), a = new r, a.options = e.widget.extend({}, a.options), e.each(i, function(n, i) {
            return e.isFunction(i) ? (f[n] = function() {
                var e = function() {
                    return r.prototype[n].apply(this, arguments);
                }, t = function(e) {
                    return r.prototype[n].apply(this, e);
                };
                return function() {
                    var n, r = this._super, s = this._superApply;
                    return this._super = e, this._superApply = t, n = i.apply(this, arguments), this._super = r, this._superApply = s, n;
                };
            }(), t) : (f[n] = i, t);
        }), u.prototype = e.widget.extend(a, {
            widgetEventPrefix: o ? a.widgetEventPrefix : n
        }, f, {
            constructor: u,
            namespace: l,
            widgetName: n,
            widgetFullName: s
        }), o ? (e.each(o._childConstructors, function(t, n) {
            var r = n.prototype;
            e.widget(r.namespace + "." + r.widgetName, u, n._proto);
        }), delete o._childConstructors) : r._childConstructors.push(u), e.widget.bridge(n, u);
    }, e.widget.extend = function(n) {
        for (var i, o, u = r.call(arguments, 1), a = 0, f = u.length; f > a; a++) for (i in u[a]) o = u[a][i], u[a].hasOwnProperty(i) && o !== t && (n[i] = e.isPlainObject(o) ? e.isPlainObject(n[i]) ? e.widget.extend({}, n[i], o) : e.widget.extend({}, o) : o);
        return n;
    }, e.widget.bridge = function(n, i) {
        var o = i.prototype.widgetFullName || n;
        e.fn[n] = function(u) {
            var f = "string" == typeof u, l = r.call(arguments, 1), c = this;
            return u = !f && l.length ? e.widget.extend.apply(null, [ u ].concat(l)) : u, f ? this.each(function() {
                var r, i = e.data(this, o);
                return i ? e.isFunction(i[u]) && "_" !== u.charAt(0) ? (r = i[u].apply(i, l), r !== i && r !== t ? (c = r && r.jquery ? c.pushStack(r.get()) : r, !1) : t) : e.error("no such method '" + u + "' for " + n + " widget instance") : e.error("cannot call methods on " + n + " prior to initialization; " + "attempted to call method '" + u + "'");
            }) : this.each(function() {
                var t = e.data(this, o);
                t ? t.option(u || {})._init() : e.data(this, o, new i(u, this));
            }), c;
        };
    }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(t, r) {
            r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), r !== this && (e.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(e) {
                    e.target === r && this.destroy();
                }
            }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
        },
        _destroy: e.noop,
        widget: function() {
            return this.element;
        },
        option: function(n, r) {
            var i, s, o, u = n;
            if (0 === arguments.length) return e.widget.extend({}, this.options);
            if ("string" == typeof n) if (u = {}, i = n.split("."), n = i.shift(), i.length) {
                for (s = u[n] = e.widget.extend({}, this.options[n]), o = 0; i.length - 1 > o; o++) s[i[o]] = s[i[o]] || {}, s = s[i[o]];
                if (n = i.pop(), r === t) return s[n] === t ? null : s[n];
                s[n] = r;
            } else {
                if (r === t) return this.options[n] === t ? null : this.options[n];
                u[n] = r;
            }
            return this._setOptions(u), this;
        },
        _setOptions: function(e) {
            var t;
            for (t in e) this._setOption(t, e[t]);
            return this;
        },
        _setOption: function(e, t) {
            return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
        },
        enable: function() {
            return this._setOption("disabled", !1);
        },
        disable: function() {
            return this._setOption("disabled", !0);
        },
        _on: function(n, r, i) {
            var s, o = this;
            "boolean" != typeof n && (i = r, r = n, n = !1), i ? (r = s = e(r), this.bindings = this.bindings.add(r)) : (i = r, r = this.element, s = this.widget()), e.each(i, function(i, u) {
                function a() {
                    return n || o.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof u ? o[u] : u).apply(o, arguments) : t;
                }
                "string" != typeof u && (a.guid = u.guid = u.guid || a.guid || e.guid++);
                var f = i.match(/^(\w+)\s*(.*)$/), l = f[1] + o.eventNamespace, c = f[2];
                c ? s.delegate(c, l, a) : r.bind(l, a);
            });
        },
        _off: function(e, t) {
            t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t);
        },
        _delay: function(e, t) {
            function n() {
                return ("string" == typeof e ? r[e] : e).apply(r, arguments);
            }
            var r = this;
            return setTimeout(n, t || 0);
        },
        _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function(t) {
                    e(t.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function(t) {
                    e(t.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function(t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function(t) {
                    e(t.currentTarget).addClass("ui-state-focus");
                },
                focusout: function(t) {
                    e(t.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function(t, n, r) {
            var i, s, o = this.options[t];
            if (r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent) for (i in s) i in n || (n[i] = s[i]);
            return this.element.trigger(n, r), !(e.isFunction(o) && o.apply(this.element[0], [ n ].concat(r)) === !1 || n.isDefaultPrevented());
        }
    }, e.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(t, n) {
        e.Widget.prototype["_" + t] = function(r, i, s) {
            "string" == typeof i && (i = {
                effect: i
            });
            var o, u = i ? i === !0 || "number" == typeof i ? n : i.effect || n : t;
            i = i || {}, "number" == typeof i && (i = {
                duration: i
            }), o = !e.isEmptyObject(i), i.complete = s, i.delay && r.delay(i.delay), o && e.effects && e.effects.effect[u] ? r[t](i) : u !== t && r[u] ? r[u](i.duration, i.easing, s) : r.queue(function(n) {
                e(this)[t](), s && s.call(r[0]), n();
            });
        };
    });
})(jQuery);

(function(e) {
    var t = !1;
    e(document).mouseup(function() {
        t = !1;
    }), e.widget("ui.mouse", {
        version: "1.10.3",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var t = this;
            this.element.bind("mousedown." + this.widgetName, function(e) {
                return t._mouseDown(e);
            }).bind("click." + this.widgetName, function(n) {
                return !0 === e.data(n.target, t.widgetName + ".preventClickEvent") ? (e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1) : undefined;
            }), this.started = !1;
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        },
        _mouseDown: function(n) {
            if (!t) {
                this._mouseStarted && this._mouseUp(n), this._mouseDownEvent = n;
                var r = this, i = 1 === n.which, s = "string" == typeof this.options.cancel && n.target.nodeName ? e(n.target).closest(this.options.cancel).length : !1;
                return i && !s && this._mouseCapture(n) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    r.mouseDelayMet = !0;
                }, this.options.delay)), this._mouseDistanceMet(n) && this._mouseDelayMet(n) && (this._mouseStarted = this._mouseStart(n) !== !1, !this._mouseStarted) ? (n.preventDefault(), !0) : (!0 === e.data(n.target, this.widgetName + ".preventClickEvent") && e.removeData(n.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
                    return r._mouseMove(e);
                }, this._mouseUpDelegate = function(e) {
                    return r._mouseUp(e);
                }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), n.preventDefault(), t = !0, !0)) : !0;
            }
        },
        _mouseMove: function(t) {
            return e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted);
        },
        _mouseUp: function(t) {
            return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1;
        },
        _mouseDistanceMet: function(e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance;
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet;
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0;
        }
    });
})(jQuery);

(function(e, t) {
    function n(e, t, n) {
        return [ parseFloat(e[0]) * (p.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (p.test(e[1]) ? n / 100 : 1) ];
    }
    function r(t, n) {
        return parseInt(e.css(t, n), 10) || 0;
    }
    function i(t) {
        var n = t[0];
        return 9 === n.nodeType ? {
            width: t.width(),
            height: t.height(),
            offset: {
                top: 0,
                left: 0
            }
        } : e.isWindow(n) ? {
            width: t.width(),
            height: t.height(),
            offset: {
                top: t.scrollTop(),
                left: t.scrollLeft()
            }
        } : n.preventDefault ? {
            width: 0,
            height: 0,
            offset: {
                top: n.pageY,
                left: n.pageX
            }
        } : {
            width: t.outerWidth(),
            height: t.outerHeight(),
            offset: t.offset()
        };
    }
    e.ui = e.ui || {};
    var s, o = Math.max, u = Math.abs, a = Math.round, f = /left|center|right/, l = /top|center|bottom/, c = /[\+\-]\d+(\.[\d]+)?%?/, h = /^\w+/, p = /%$/, d = e.fn.position;
    e.position = {
        scrollbarWidth: function() {
            if (s !== t) return s;
            var n, r, i = e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), o = i.children()[0];
            return e("body").append(i), n = o.offsetWidth, i.css("overflow", "scroll"), r = o.offsetWidth, n === r && (r = i[0].clientWidth), i.remove(), s = n - r;
        },
        getScrollInfo: function(t) {
            var n = t.isWindow ? "" : t.element.css("overflow-x"), r = t.isWindow ? "" : t.element.css("overflow-y"), i = "scroll" === n || "auto" === n && t.width < t.element[0].scrollWidth, s = "scroll" === r || "auto" === r && t.height < t.element[0].scrollHeight;
            return {
                width: s ? e.position.scrollbarWidth() : 0,
                height: i ? e.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function(t) {
            var n = e(t || window), r = e.isWindow(n[0]);
            return {
                element: n,
                isWindow: r,
                offset: n.offset() || {
                    left: 0,
                    top: 0
                },
                scrollLeft: n.scrollLeft(),
                scrollTop: n.scrollTop(),
                width: r ? n.width() : n.outerWidth(),
                height: r ? n.height() : n.outerHeight()
            };
        }
    }, e.fn.position = function(t) {
        if (!t || !t.of) return d.apply(this, arguments);
        t = e.extend({}, t);
        var s, p, v, m, g, y, b = e(t.of), w = e.position.getWithinInfo(t.within), E = e.position.getScrollInfo(w), S = (t.collision || "flip").split(" "), x = {};
        return y = i(b), b[0].preventDefault && (t.at = "left top"), p = y.width, v = y.height, m = y.offset, g = e.extend({}, m), e.each([ "my", "at" ], function() {
            var e, n, r = (t[this] || "").split(" ");
            1 === r.length && (r = f.test(r[0]) ? r.concat([ "center" ]) : l.test(r[0]) ? [ "center" ].concat(r) : [ "center", "center" ]), r[0] = f.test(r[0]) ? r[0] : "center", r[1] = l.test(r[1]) ? r[1] : "center", e = c.exec(r[0]), n = c.exec(r[1]), x[this] = [ e ? e[0] : 0, n ? n[0] : 0 ], t[this] = [ h.exec(r[0])[0], h.exec(r[1])[0] ];
        }), 1 === S.length && (S[1] = S[0]), "right" === t.at[0] ? g.left += p : "center" === t.at[0] && (g.left += p / 2), "bottom" === t.at[1] ? g.top += v : "center" === t.at[1] && (g.top += v / 2), s = n(x.at, p, v), g.left += s[0], g.top += s[1], this.each(function() {
            var i, f, l = e(this), c = l.outerWidth(), h = l.outerHeight(), d = r(this, "marginLeft"), y = r(this, "marginTop"), T = c + d + r(this, "marginRight") + E.width, N = h + y + r(this, "marginBottom") + E.height, C = e.extend({}, g), L = n(x.my, l.outerWidth(), l.outerHeight());
            "right" === t.my[0] ? C.left -= c : "center" === t.my[0] && (C.left -= c / 2), "bottom" === t.my[1] ? C.top -= h : "center" === t.my[1] && (C.top -= h / 2), C.left += L[0], C.top += L[1], e.support.offsetFractions || (C.left = a(C.left), C.top = a(C.top)), i = {
                marginLeft: d,
                marginTop: y
            }, e.each([ "left", "top" ], function(n, r) {
                e.ui.position[S[n]] && e.ui.position[S[n]][r](C, {
                    targetWidth: p,
                    targetHeight: v,
                    elemWidth: c,
                    elemHeight: h,
                    collisionPosition: i,
                    collisionWidth: T,
                    collisionHeight: N,
                    offset: [ s[0] + L[0], s[1] + L[1] ],
                    my: t.my,
                    at: t.at,
                    within: w,
                    elem: l
                });
            }), t.using && (f = function(e) {
                var n = m.left - C.left, r = n + p - c, i = m.top - C.top, s = i + v - h, a = {
                    target: {
                        element: b,
                        left: m.left,
                        top: m.top,
                        width: p,
                        height: v
                    },
                    element: {
                        element: l,
                        left: C.left,
                        top: C.top,
                        width: c,
                        height: h
                    },
                    horizontal: 0 > r ? "left" : n > 0 ? "right" : "center",
                    vertical: 0 > s ? "top" : i > 0 ? "bottom" : "middle"
                };
                c > p && p > u(n + r) && (a.horizontal = "center"), h > v && v > u(i + s) && (a.vertical = "middle"), a.important = o(u(n), u(r)) > o(u(i), u(s)) ? "horizontal" : "vertical", t.using.call(this, e, a);
            }), l.offset(e.extend(C, {
                using: f
            }));
        });
    }, e.ui.position = {
        fit: {
            left: function(e, t) {
                var n, r = t.within, i = r.isWindow ? r.scrollLeft : r.offset.left, s = r.width, u = e.left - t.collisionPosition.marginLeft, a = i - u, f = u + t.collisionWidth - s - i;
                t.collisionWidth > s ? a > 0 && 0 >= f ? (n = e.left + a + t.collisionWidth - s - i, e.left += a - n) : e.left = f > 0 && 0 >= a ? i : a > f ? i + s - t.collisionWidth : i : a > 0 ? e.left += a : f > 0 ? e.left -= f : e.left = o(e.left - u, e.left);
            },
            top: function(e, t) {
                var n, r = t.within, i = r.isWindow ? r.scrollTop : r.offset.top, s = t.within.height, u = e.top - t.collisionPosition.marginTop, a = i - u, f = u + t.collisionHeight - s - i;
                t.collisionHeight > s ? a > 0 && 0 >= f ? (n = e.top + a + t.collisionHeight - s - i, e.top += a - n) : e.top = f > 0 && 0 >= a ? i : a > f ? i + s - t.collisionHeight : i : a > 0 ? e.top += a : f > 0 ? e.top -= f : e.top = o(e.top - u, e.top);
            }
        },
        flip: {
            left: function(e, t) {
                var n, r, i = t.within, s = i.offset.left + i.scrollLeft, o = i.width, a = i.isWindow ? i.scrollLeft : i.offset.left, f = e.left - t.collisionPosition.marginLeft, l = f - a, c = f + t.collisionWidth - o - a, h = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0, p = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0, d = -2 * t.offset[0];
                0 > l ? (n = e.left + h + p + d + t.collisionWidth - o - s, (0 > n || u(l) > n) && (e.left += h + p + d)) : c > 0 && (r = e.left - t.collisionPosition.marginLeft + h + p + d - a, (r > 0 || c > u(r)) && (e.left += h + p + d));
            },
            top: function(e, t) {
                var n, r, i = t.within, s = i.offset.top + i.scrollTop, o = i.height, a = i.isWindow ? i.scrollTop : i.offset.top, f = e.top - t.collisionPosition.marginTop, l = f - a, c = f + t.collisionHeight - o - a, h = "top" === t.my[1], p = h ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0, d = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0, v = -2 * t.offset[1];
                0 > l ? (r = e.top + p + d + v + t.collisionHeight - o - s, e.top + p + d + v > l && (0 > r || u(l) > r) && (e.top += p + d + v)) : c > 0 && (n = e.top - t.collisionPosition.marginTop + p + d + v - a, e.top + p + d + v > c && (n > 0 || c > u(n)) && (e.top += p + d + v));
            }
        },
        flipfit: {
            left: function() {
                e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments);
            },
            top: function() {
                e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments);
            }
        }
    }, function() {
        var t, n, r, i, s, o = document.getElementsByTagName("body")[0], u = document.createElement("div");
        t = document.createElement(o ? "div" : "body"), r = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        }, o && e.extend(r, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
        for (s in r) t.style[s] = r[s];
        t.appendChild(u), n = o || document.documentElement, n.insertBefore(t, n.firstChild), u.style.cssText = "position: absolute; left: 10.7432222px;", i = e(u).offset().left, e.support.offsetFractions = i > 10 && 11 > i, t.innerHTML = "", n.removeChild(t);
    }();
})(jQuery);

(function(e) {
    function t(e, t, n) {
        return e > t && t + n > e;
    }
    function n(e) {
        return /left|right/.test(e.css("float")) || /inline|table-cell/.test(e.css("display"));
    }
    e.widget("ui.sortable", e.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _create: function() {
            var e = this.options;
            this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? "x" === e.axis || n(this.items[0].item) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0;
        },
        _destroy: function() {
            this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy();
            for (var e = this.items.length - 1; e >= 0; e--) this.items[e].item.removeData(this.widgetName + "-item");
            return this;
        },
        _setOption: function(t, n) {
            "disabled" === t ? (this.options[t] = n, this.widget().toggleClass("ui-sortable-disabled", !!n)) : e.Widget.prototype._setOption.apply(this, arguments);
        },
        _mouseCapture: function(t, n) {
            var r = null, i = !1, s = this;
            return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(t), e(t.target).parents().each(function() {
                return e.data(this, s.widgetName + "-item") === s ? (r = e(this), !1) : undefined;
            }), e.data(t.target, s.widgetName + "-item") === s && (r = e(t.target)), r ? !this.options.handle || n || (e(this.options.handle, r).find("*").addBack().each(function() {
                this === t.target && (i = !0);
            }), i) ? (this.currentItem = r, this._removeCurrentsFromItems(), !0) : !1 : !1);
        },
        _mouseStart: function(t, n, r) {
            var i, s, o = this.options;
            if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, e.extend(this.offset, {
                click: {
                    left: t.pageX - this.offset.left,
                    top: t.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt), this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), o.containment && this._setContainment(), o.cursor && "auto" !== o.cursor && (s = this.document.find("body"), this.storedCursor = s.css("cursor"), s.css("cursor", o.cursor), this.storedStylesheet = e("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(s)), o.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", o.opacity)), o.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", o.zIndex)), this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !r) for (i = this.containers.length - 1; i >= 0; i--) this.containers[i]._trigger("activate", t, this._uiHash(this));
            return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(t), !0;
        },
        _mouseDrag: function(t) {
            var n, r, i, s, o = this.options, u = !1;
            for (this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < o.scrollSensitivity ? this.scrollParent[0].scrollTop = u = this.scrollParent[0].scrollTop + o.scrollSpeed : t.pageY - this.overflowOffset.top < o.scrollSensitivity && (this.scrollParent[0].scrollTop = u = this.scrollParent[0].scrollTop - o.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < o.scrollSensitivity ? this.scrollParent[0].scrollLeft = u = this.scrollParent[0].scrollLeft + o.scrollSpeed : t.pageX - this.overflowOffset.left < o.scrollSensitivity && (this.scrollParent[0].scrollLeft = u = this.scrollParent[0].scrollLeft - o.scrollSpeed)) : (t.pageY - e(document).scrollTop() < o.scrollSensitivity ? u = e(document).scrollTop(e(document).scrollTop() - o.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < o.scrollSensitivity && (u = e(document).scrollTop(e(document).scrollTop() + o.scrollSpeed)), t.pageX - e(document).scrollLeft() < o.scrollSensitivity ? u = e(document).scrollLeft(e(document).scrollLeft() - o.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < o.scrollSensitivity && (u = e(document).scrollLeft(e(document).scrollLeft() + o.scrollSpeed))), u !== !1 && e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), n = this.items.length - 1; n >= 0; n--) if (r = this.items[n], i = r.item[0], s = this._intersectsWithPointer(r), s && r.instance === this.currentContainer && i !== this.currentItem[0] && this.placeholder[1 === s ? "next" : "prev"]()[0] !== i && !e.contains(this.placeholder[0], i) && ("semi-dynamic" === this.options.type ? !e.contains(this.element[0], i) : !0)) {
                if (this.direction = 1 === s ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(r)) break;
                this._rearrange(t, r), this._trigger("change", t, this._uiHash());
                break;
            }
            return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1;
        },
        _mouseStop: function(t, n) {
            if (t) {
                if (e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t), this.options.revert) {
                    var r = this, i = this.placeholder.offset(), s = this.options.axis, o = {};
                    s && "x" !== s || (o.left = i.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft)), s && "y" !== s || (o.top = i.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)), this.reverting = !0, e(this.helper).animate(o, parseInt(this.options.revert, 10) || 500, function() {
                        r._clear(t);
                    });
                } else this._clear(t, n);
                return !1;
            }
        },
        cancel: function() {
            if (this.dragging) {
                this._mouseUp({
                    target: null
                }), "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var t = this.containers.length - 1; t >= 0; t--) this.containers[t]._trigger("deactivate", null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)), this.containers[t].containerCache.over = 0);
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this;
        },
        serialize: function(t) {
            var n = this._getItemsAsjQuery(t && t.connected), r = [];
            return t = t || {}, e(n).each(function() {
                var n = (e(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[\-=_](.+)/);
                n && r.push((t.key || n[1] + "[]") + "=" + (t.key && t.expression ? n[1] : n[2]));
            }), !r.length && t.key && r.push(t.key + "="), r.join("&");
        },
        toArray: function(t) {
            var n = this._getItemsAsjQuery(t && t.connected), r = [];
            return t = t || {}, n.each(function() {
                r.push(e(t.item || this).attr(t.attribute || "id") || "");
            }), r;
        },
        _intersectsWith: function(e) {
            var t = this.positionAbs.left, n = t + this.helperProportions.width, r = this.positionAbs.top, i = r + this.helperProportions.height, s = e.left, o = s + e.width, u = e.top, a = u + e.height, f = this.offset.click.top, l = this.offset.click.left, c = "x" === this.options.axis || r + f > u && a > r + f, h = "y" === this.options.axis || t + l > s && o > t + l, p = c && h;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > e[this.floating ? "width" : "height"] ? p : t + this.helperProportions.width / 2 > s && o > n - this.helperProportions.width / 2 && r + this.helperProportions.height / 2 > u && a > i - this.helperProportions.height / 2;
        },
        _intersectsWithPointer: function(e) {
            var n = "x" === this.options.axis || t(this.positionAbs.top + this.offset.click.top, e.top, e.height), r = "y" === this.options.axis || t(this.positionAbs.left + this.offset.click.left, e.left, e.width), i = n && r, s = this._getDragVerticalDirection(), o = this._getDragHorizontalDirection();
            return i ? this.floating ? o && "right" === o || "down" === s ? 2 : 1 : s && ("down" === s ? 2 : 1) : !1;
        },
        _intersectsWithSides: function(e) {
            var n = t(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height), r = t(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width), i = this._getDragVerticalDirection(), s = this._getDragHorizontalDirection();
            return this.floating && s ? "right" === s && r || "left" === s && !r : i && ("down" === i && n || "up" === i && !n);
        },
        _getDragVerticalDirection: function() {
            var e = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== e && (e > 0 ? "down" : "up");
        },
        _getDragHorizontalDirection: function() {
            var e = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== e && (e > 0 ? "right" : "left");
        },
        refresh: function(e) {
            return this._refreshItems(e), this.refreshPositions(), this;
        },
        _connectWith: function() {
            var e = this.options;
            return e.connectWith.constructor === String ? [ e.connectWith ] : e.connectWith;
        },
        _getItemsAsjQuery: function(t) {
            var n, r, i, s, o = [], u = [], a = this._connectWith();
            if (a && t) for (n = a.length - 1; n >= 0; n--) for (i = e(a[n]), r = i.length - 1; r >= 0; r--) s = e.data(i[r], this.widgetFullName), s && s !== this && !s.options.disabled && u.push([ e.isFunction(s.options.items) ? s.options.items.call(s.element) : e(s.options.items, s.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), s ]);
            for (u.push([ e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : e(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this ]), n = u.length - 1; n >= 0; n--) u[n][0].each(function() {
                o.push(this);
            });
            return e(o);
        },
        _removeCurrentsFromItems: function() {
            var t = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = e.grep(this.items, function(e) {
                for (var n = 0; t.length > n; n++) if (t[n] === e.item[0]) return !1;
                return !0;
            });
        },
        _refreshItems: function(t) {
            this.items = [], this.containers = [ this ];
            var n, r, i, s, o, u, a, f, l = this.items, c = [ [ e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {
                item: this.currentItem
            }) : e(this.options.items, this.element), this ] ], h = this._connectWith();
            if (h && this.ready) for (n = h.length - 1; n >= 0; n--) for (i = e(h[n]), r = i.length - 1; r >= 0; r--) s = e.data(i[r], this.widgetFullName), s && s !== this && !s.options.disabled && (c.push([ e.isFunction(s.options.items) ? s.options.items.call(s.element[0], t, {
                item: this.currentItem
            }) : e(s.options.items, s.element), s ]), this.containers.push(s));
            for (n = c.length - 1; n >= 0; n--) for (o = c[n][1], u = c[n][0], r = 0, f = u.length; f > r; r++) a = e(u[r]), a.data(this.widgetName + "-item", o), l.push({
                item: a,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0
            });
        },
        refreshPositions: function(t) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            var n, r, i, s;
            for (n = this.items.length - 1; n >= 0; n--) r = this.items[n], r.instance !== this.currentContainer && this.currentContainer && r.item[0] !== this.currentItem[0] || (i = this.options.toleranceElement ? e(this.options.toleranceElement, r.item) : r.item, t || (r.width = i.outerWidth(), r.height = i.outerHeight()), s = i.offset(), r.left = s.left, r.top = s.top);
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (n = this.containers.length - 1; n >= 0; n--) s = this.containers[n].element.offset(), this.containers[n].containerCache.left = s.left, this.containers[n].containerCache.top = s.top, this.containers[n].containerCache.width = this.containers[n].element.outerWidth(), this.containers[n].containerCache.height = this.containers[n].element.outerHeight();
            return this;
        },
        _createPlaceholder: function(t) {
            t = t || this;
            var n, r = t.options;
            r.placeholder && r.placeholder.constructor !== String || (n = r.placeholder, r.placeholder = {
                element: function() {
                    var r = t.currentItem[0].nodeName.toLowerCase(), s = e("<" + r + ">", t.document[0]).addClass(n || t.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                    return "tr" === r ? t.currentItem.children().each(function() {
                        e("<td>&#160;</td>", t.document[0]).attr("colspan", e(this).attr("colspan") || 1).appendTo(s);
                    }) : "img" === r && s.attr("src", t.currentItem.attr("src")), n || s.css("visibility", "hidden"), s;
                },
                update: function(e, o) {
                    (!n || r.forcePlaceholderSize) && (o.height() || o.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css("paddingTop") || 0, 10) - parseInt(t.currentItem.css("paddingBottom") || 0, 10)), o.width() || o.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css("paddingLeft") || 0, 10) - parseInt(t.currentItem.css("paddingRight") || 0, 10)));
                }
            }), t.placeholder = e(r.placeholder.element.call(t.element, t.currentItem)), t.currentItem.after(t.placeholder), r.placeholder.update(t, t.placeholder);
        },
        _contactContainers: function(r) {
            var s, o, u, a, f, l, c, h, p, d, v = null, m = null;
            for (s = this.containers.length - 1; s >= 0; s--) if (!e.contains(this.currentItem[0], this.containers[s].element[0])) if (this._intersectsWith(this.containers[s].containerCache)) {
                if (v && e.contains(this.containers[s].element[0], v.element[0])) continue;
                v = this.containers[s], m = s;
            } else this.containers[s].containerCache.over && (this.containers[s]._trigger("out", r, this._uiHash(this)), this.containers[s].containerCache.over = 0);
            if (v) if (1 === this.containers.length) this.containers[m].containerCache.over || (this.containers[m]._trigger("over", r, this._uiHash(this)), this.containers[m].containerCache.over = 1); else {
                for (u = 1e4, a = null, d = v.floating || n(this.currentItem), f = d ? "left" : "top", l = d ? "width" : "height", c = this.positionAbs[f] + this.offset.click[f], o = this.items.length - 1; o >= 0; o--) e.contains(this.containers[m].element[0], this.items[o].item[0]) && this.items[o].item[0] !== this.currentItem[0] && (!d || t(this.positionAbs.top + this.offset.click.top, this.items[o].top, this.items[o].height)) && (h = this.items[o].item.offset()[f], p = !1, Math.abs(h - c) > Math.abs(h + this.items[o][l] - c) && (p = !0, h += this.items[o][l]), u > Math.abs(h - c) && (u = Math.abs(h - c), a = this.items[o], this.direction = p ? "up" : "down"));
                if (!a && !this.options.dropOnEmpty) return;
                if (this.currentContainer === this.containers[m]) return;
                a ? this._rearrange(r, a, null, !0) : this._rearrange(r, null, this.containers[m].element, !0), this._trigger("change", r, this._uiHash()), this.containers[m]._trigger("change", r, this._uiHash(this)), this.currentContainer = this.containers[m], this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[m]._trigger("over", r, this._uiHash(this)), this.containers[m].containerCache.over = 1;
            }
        },
        _createHelper: function(t) {
            var n = this.options, r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [ t, this.currentItem ])) : "clone" === n.helper ? this.currentItem.clone() : this.currentItem;
            return r.parents("body").length || e("parent" !== n.appendTo ? n.appendTo : this.currentItem[0].parentNode)[0].appendChild(r[0]), r[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }), (!r[0].style.width || n.forceHelperSize) && r.width(this.currentItem.width()), (!r[0].style.height || n.forceHelperSize) && r.height(this.currentItem.height()), r;
        },
        _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left" in t && (this.offset.click.left = t.left + this.margins.left), "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top" in t && (this.offset.click.top = t.top + this.margins.top), "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top);
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && e.ui.ie) && (t = {
                top: 0,
                left: 0
            }), {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };
        },
        _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
                var e = this.currentItem.position();
                return {
                    top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                };
            }
            return {
                top: 0,
                left: 0
            };
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            };
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function() {
            var t, n, r, i = this.options;
            "parent" === i.containment && (i.containment = this.helper[0].parentNode), ("document" === i.containment || "window" === i.containment) && (this.containment = [ 0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, e("document" === i.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (e("document" === i.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ]), /^(document|window|parent)$/.test(i.containment) || (t = e(i.containment)[0], n = e(i.containment).offset(), r = "hidden" !== e(t).css("overflow"), this.containment = [ n.left + (parseInt(e(t).css("borderLeftWidth"), 10) || 0) + (parseInt(e(t).css("paddingLeft"), 10) || 0) - this.margins.left, n.top + (parseInt(e(t).css("borderTopWidth"), 10) || 0) + (parseInt(e(t).css("paddingTop"), 10) || 0) - this.margins.top, n.left + (r ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(e(t).css("borderLeftWidth"), 10) || 0) - (parseInt(e(t).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, n.top + (r ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(e(t).css("borderTopWidth"), 10) || 0) - (parseInt(e(t).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top ]);
        },
        _convertPositionTo: function(t, n) {
            n || (n = this.position);
            var r = "absolute" === t ? 1 : -1, i = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, s = /(html|body)/i.test(i[0].tagName);
            return {
                top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : i.scrollTop()) * r,
                left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : i.scrollLeft()) * r
            };
        },
        _generatePosition: function(t) {
            var n, r, i = this.options, s = t.pageX, o = t.pageY, u = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, a = /(html|body)/i.test(u[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (s = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (s = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top)), i.grid && (n = this.originalPageY + Math.round((o - this.originalPageY) / i.grid[1]) * i.grid[1], o = this.containment ? n - this.offset.click.top >= this.containment[1] && n - this.offset.click.top <= this.containment[3] ? n : n - this.offset.click.top >= this.containment[1] ? n - i.grid[1] : n + i.grid[1] : n, r = this.originalPageX + Math.round((s - this.originalPageX) / i.grid[0]) * i.grid[0], s = this.containment ? r - this.offset.click.left >= this.containment[0] && r - this.offset.click.left <= this.containment[2] ? r : r - this.offset.click.left >= this.containment[0] ? r - i.grid[0] : r + i.grid[0] : r)), {
                top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : a ? 0 : u.scrollTop()),
                left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : a ? 0 : u.scrollLeft())
            };
        },
        _rearrange: function(e, t, n, r) {
            n ? n[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
            var i = this.counter;
            this._delay(function() {
                i === this.counter && this.refreshPositions(!r);
            });
        },
        _clear: function(e, t) {
            this.reverting = !1;
            var n, r = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
                for (n in this._storedCSS) ("auto" === this._storedCSS[n] || "static" === this._storedCSS[n]) && (this._storedCSS[n] = "");
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
            } else this.currentItem.show();
            for (this.fromOutside && !t && r.push(function(e) {
                this._trigger("receive", e, this._uiHash(this.fromOutside));
            }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || t || r.push(function(e) {
                this._trigger("update", e, this._uiHash());
            }), this !== this.currentContainer && (t || (r.push(function(e) {
                this._trigger("remove", e, this._uiHash());
            }), r.push(function(e) {
                return function(t) {
                    e._trigger("receive", t, this._uiHash(this));
                };
            }.call(this, this.currentContainer)), r.push(function(e) {
                return function(t) {
                    e._trigger("update", t, this._uiHash(this));
                };
            }.call(this, this.currentContainer)))), n = this.containers.length - 1; n >= 0; n--) t || r.push(function(e) {
                return function(t) {
                    e._trigger("deactivate", t, this._uiHash(this));
                };
            }.call(this, this.containers[n])), this.containers[n].containerCache.over && (r.push(function(e) {
                return function(t) {
                    e._trigger("out", t, this._uiHash(this));
                };
            }.call(this, this.containers[n])), this.containers[n].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, this.cancelHelperRemoval) {
                if (!t) {
                    for (this._trigger("beforeStop", e, this._uiHash()), n = 0; r.length > n; n++) r[n].call(this, e);
                    this._trigger("stop", e, this._uiHash());
                }
                return this.fromOutside = !1, !1;
            }
            if (t || this._trigger("beforeStop", e, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null, !t) {
                for (n = 0; r.length > n; n++) r[n].call(this, e);
                this._trigger("stop", e, this._uiHash());
            }
            return this.fromOutside = !1, !0;
        },
        _trigger: function() {
            e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel();
        },
        _uiHash: function(t) {
            var n = t || this;
            return {
                helper: n.helper,
                placeholder: n.placeholder || e([]),
                position: n.position,
                originalPosition: n.originalPosition,
                offset: n.positionAbs,
                item: n.currentItem,
                sender: t ? t.element : null
            };
        }
    });
})(jQuery);

(function(e) {
    var t = 0;
    e.widget("ui.autocomplete", {
        version: "1.10.3",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function() {
            var t, n, r, i = this.element[0].nodeName.toLowerCase(), s = "textarea" === i, o = "input" === i;
            this.isMultiLine = s ? !0 : o ? !1 : this.element.prop("isContentEditable"), this.valueMethod = this.element[s || o ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                keydown: function(i) {
                    if (this.element.prop("readOnly")) return t = !0, r = !0, n = !0, undefined;
                    t = !1, r = !1, n = !1;
                    var s = e.ui.keyCode;
                    switch (i.keyCode) {
                      case s.PAGE_UP:
                        t = !0, this._move("previousPage", i);
                        break;
                      case s.PAGE_DOWN:
                        t = !0, this._move("nextPage", i);
                        break;
                      case s.UP:
                        t = !0, this._keyEvent("previous", i);
                        break;
                      case s.DOWN:
                        t = !0, this._keyEvent("next", i);
                        break;
                      case s.ENTER:
                      case s.NUMPAD_ENTER:
                        this.menu.active && (t = !0, i.preventDefault(), this.menu.select(i));
                        break;
                      case s.TAB:
                        this.menu.active && this.menu.select(i);
                        break;
                      case s.ESCAPE:
                        this.menu.element.is(":visible") && (this._value(this.term), this.close(i), i.preventDefault());
                        break;
                      default:
                        n = !0, this._searchTimeout(i);
                    }
                },
                keypress: function(r) {
                    if (t) return t = !1, (!this.isMultiLine || this.menu.element.is(":visible")) && r.preventDefault(), undefined;
                    if (!n) {
                        var i = e.ui.keyCode;
                        switch (r.keyCode) {
                          case i.PAGE_UP:
                            this._move("previousPage", r);
                            break;
                          case i.PAGE_DOWN:
                            this._move("nextPage", r);
                            break;
                          case i.UP:
                            this._keyEvent("previous", r);
                            break;
                          case i.DOWN:
                            this._keyEvent("next", r);
                        }
                    }
                },
                input: function(e) {
                    return r ? (r = !1, e.preventDefault(), undefined) : (this._searchTimeout(e), undefined);
                },
                focus: function() {
                    this.selectedItem = null, this.previous = this._value();
                },
                blur: function(e) {
                    return this.cancelBlur ? (delete this.cancelBlur, undefined) : (clearTimeout(this.searching), this.close(e), this._change(e), undefined);
                }
            }), this._initSource(), this.menu = e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
                role: null
            }).hide().data("ui-menu"), this._on(this.menu.element, {
                mousedown: function(t) {
                    t.preventDefault(), this.cancelBlur = !0, this._delay(function() {
                        delete this.cancelBlur;
                    });
                    var n = this.menu.element[0];
                    e(t.target).closest(".ui-menu-item").length || this._delay(function() {
                        var t = this;
                        this.document.one("mousedown", function(r) {
                            r.target === t.element[0] || r.target === n || e.contains(n, r.target) || t.close();
                        });
                    });
                },
                menufocus: function(t, n) {
                    if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type))) return this.menu.blur(), this.document.one("mousemove", function() {
                        e(t.target).trigger(t.originalEvent);
                    }), undefined;
                    var r = n.item.data("ui-autocomplete-item");
                    !1 !== this._trigger("focus", t, {
                        item: r
                    }) ? t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(r.value) : this.liveRegion.text(r.value);
                },
                menuselect: function(e, t) {
                    var n = t.item.data("ui-autocomplete-item"), r = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = r, this._delay(function() {
                        this.previous = r, this.selectedItem = n;
                    })), !1 !== this._trigger("select", e, {
                        item: n
                    }) && this._value(n.value), this.term = this._value(), this.close(e), this.selectedItem = n;
                }
            }), this.liveRegion = e("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertBefore(this.element), this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete");
                }
            });
        },
        _destroy: function() {
            clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove();
        },
        _setOption: function(e, t) {
            this._super(e, t), "source" === e && this._initSource(), "appendTo" === e && this.menu.element.appendTo(this._appendTo()), "disabled" === e && t && this.xhr && this.xhr.abort();
        },
        _appendTo: function() {
            var t = this.options.appendTo;
            return t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)), t || (t = this.element.closest(".ui-front")), t.length || (t = this.document[0].body), t;
        },
        _initSource: function() {
            var t, n, r = this;
            e.isArray(this.options.source) ? (t = this.options.source, this.source = function(n, r) {
                r(e.ui.autocomplete.filter(t, n.term));
            }) : "string" == typeof this.options.source ? (n = this.options.source, this.source = function(t, s) {
                r.xhr && r.xhr.abort(), r.xhr = e.ajax({
                    url: n,
                    data: t,
                    dataType: "json",
                    success: function(e) {
                        s(e);
                    },
                    error: function() {
                        s([]);
                    }
                });
            }) : this.source = this.options.source;
        },
        _searchTimeout: function(e) {
            clearTimeout(this.searching), this.searching = this._delay(function() {
                this.term !== this._value() && (this.selectedItem = null, this.search(null, e));
            }, this.options.delay);
        },
        search: function(e, t) {
            return e = null != e ? e : this._value(), this.term = this._value(), e.length < this.options.minLength ? this.close(t) : this._trigger("search", t) !== !1 ? this._search(e) : undefined;
        },
        _search: function(e) {
            this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                term: e
            }, this._response());
        },
        _response: function() {
            var e = this, n = ++t;
            return function(r) {
                n === t && e.__response(r), e.pending--, e.pending || e.element.removeClass("ui-autocomplete-loading");
            };
        },
        __response: function(e) {
            e && (e = this._normalize(e)), this._trigger("response", null, {
                content: e
            }), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close();
        },
        close: function(e) {
            this.cancelSearch = !0, this._close(e);
        },
        _close: function(e) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e));
        },
        _change: function(e) {
            this.previous !== this._value() && this._trigger("change", e, {
                item: this.selectedItem
            });
        },
        _normalize: function(t) {
            return t.length && t[0].label && t[0].value ? t : e.map(t, function(t) {
                return "string" == typeof t ? {
                    label: t,
                    value: t
                } : e.extend({
                    label: t.label || t.value,
                    value: t.value || t.label
                }, t);
            });
        },
        _suggest: function(t) {
            var n = this.menu.element.empty();
            this._renderMenu(n, t), this.isNewMenu = !0, this.menu.refresh(), n.show(), this._resizeMenu(), n.position(e.extend({
                of: this.element
            }, this.options.position)), this.options.autoFocus && this.menu.next();
        },
        _resizeMenu: function() {
            var e = this.menu.element;
            e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()));
        },
        _renderMenu: function(t, n) {
            var r = this;
            e.each(n, function(e, n) {
                r._renderItemData(t, n);
            });
        },
        _renderItemData: function(e, t) {
            return this._renderItem(e, t).data("ui-autocomplete-item", t);
        },
        _renderItem: function(t, n) {
            return e("<li>").append(e("<a>").text(n.label)).appendTo(t);
        },
        _move: function(e, t) {
            return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this._value(this.term), this.menu.blur(), undefined) : (this.menu[e](t), undefined) : (this.search(null, t), undefined);
        },
        widget: function() {
            return this.menu.element;
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments);
        },
        _keyEvent: function(e, t) {
            (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(e, t), t.preventDefault());
        }
    }), e.extend(e.ui.autocomplete, {
        escapeRegex: function(e) {
            return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        filter: function(t, n) {
            var r = RegExp(e.ui.autocomplete.escapeRegex(n), "i");
            return e.grep(t, function(e) {
                return r.test(e.label || e.value || e);
            });
        }
    }), e.widget("ui.autocomplete", e.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(e) {
                    return e + (e > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
                }
            }
        },
        __response: function(e) {
            var t;
            this._superApply(arguments), this.options.disabled || this.cancelSearch || (t = e && e.length ? this.options.messages.results(e.length) : this.options.messages.noResults, this.liveRegion.text(t));
        }
    });
})(jQuery);

(function(e) {
    e.widget("ui.menu", {
        version: "1.10.3",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function() {
            this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, e.proxy(function(e) {
                this.options.disabled && e.preventDefault();
            }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                "mousedown .ui-menu-item > a": function(e) {
                    e.preventDefault();
                },
                "click .ui-state-disabled > a": function(e) {
                    e.preventDefault();
                },
                "click .ui-menu-item:has(a)": function(t) {
                    var n = e(t.target).closest(".ui-menu-item");
                    !this.mouseHandled && n.not(".ui-state-disabled").length && (this.mouseHandled = !0, this.select(t), n.has(".ui-menu").length ? this.expand(t) : this.element.is(":focus") || (this.element.trigger("focus", [ !0 ]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)));
                },
                "mouseenter .ui-menu-item": function(t) {
                    var n = e(t.currentTarget);
                    n.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(t, n);
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function(e, t) {
                    var n = this.active || this.element.children(".ui-menu-item").eq(0);
                    t || this.focus(e, n);
                },
                blur: function(t) {
                    this._delay(function() {
                        e.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(t);
                    });
                },
                keydown: "_keydown"
            }), this.refresh(), this._on(this.document, {
                click: function(t) {
                    e(t.target).closest(".ui-menu").length || this.collapseAll(t), this.mouseHandled = !1;
                }
            });
        },
        _destroy: function() {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
                var t = e(this);
                t.data("ui-menu-submenu-carat") && t.remove();
            }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
        },
        _keydown: function(t) {
            function n(e) {
                return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            }
            var r, i, s, o, u, a = !0;
            switch (t.keyCode) {
              case e.ui.keyCode.PAGE_UP:
                this.previousPage(t);
                break;
              case e.ui.keyCode.PAGE_DOWN:
                this.nextPage(t);
                break;
              case e.ui.keyCode.HOME:
                this._move("first", "first", t);
                break;
              case e.ui.keyCode.END:
                this._move("last", "last", t);
                break;
              case e.ui.keyCode.UP:
                this.previous(t);
                break;
              case e.ui.keyCode.DOWN:
                this.next(t);
                break;
              case e.ui.keyCode.LEFT:
                this.collapse(t);
                break;
              case e.ui.keyCode.RIGHT:
                this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                break;
              case e.ui.keyCode.ENTER:
              case e.ui.keyCode.SPACE:
                this._activate(t);
                break;
              case e.ui.keyCode.ESCAPE:
                this.collapse(t);
                break;
              default:
                a = !1, i = this.previousFilter || "", s = String.fromCharCode(t.keyCode), o = !1, clearTimeout(this.filterTimer), s === i ? o = !0 : s = i + s, u = RegExp("^" + n(s), "i"), r = this.activeMenu.children(".ui-menu-item").filter(function() {
                    return u.test(e(this).children("a").text());
                }), r = o && -1 !== r.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : r, r.length || (s = String.fromCharCode(t.keyCode), u = RegExp("^" + n(s), "i"), r = this.activeMenu.children(".ui-menu-item").filter(function() {
                    return u.test(e(this).children("a").text());
                })), r.length ? (this.focus(t, r), r.length > 1 ? (this.previousFilter = s, this.filterTimer = this._delay(function() {
                    delete this.previousFilter;
                }, 1e3)) : delete this.previousFilter) : delete this.previousFilter;
            }
            a && t.preventDefault();
        },
        _activate: function(e) {
            this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(e) : this.select(e));
        },
        refresh: function() {
            var t, n = this.options.icons.submenu, r = this.element.find(this.options.menus);
            r.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function() {
                var t = e(this), r = t.prev("a"), s = e("<span>").addClass("ui-menu-icon ui-icon " + n).data("ui-menu-submenu-carat", !0);
                r.attr("aria-haspopup", "true").prepend(s), t.attr("aria-labelledby", r.attr("id"));
            }), t = r.add(this.element), t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            }), t.children(":not(.ui-menu-item)").each(function() {
                var t = e(this);
                /[^\-\u2014\u2013\s]/.test(t.text()) || t.addClass("ui-widget-content ui-menu-divider");
            }), t.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !e.contains(this.element[0], this.active[0]) && this.blur();
        },
        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            }[this.options.role];
        },
        _setOption: function(e, t) {
            "icons" === e && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu), this._super(e, t);
        },
        focus: function(e, t) {
            var n, r;
            this.blur(e, e && "focus" === e.type), this._scrollIntoView(t), this.active = t.first(), r = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", r.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), e && "keydown" === e.type ? this._close() : this.timer = this._delay(function() {
                this._close();
            }, this.delay), n = t.children(".ui-menu"), n.length && /^mouse/.test(e.type) && this._startOpening(n), this.activeMenu = t.parent(), this._trigger("focus", e, {
                item: t
            });
        },
        _scrollIntoView: function(t) {
            var n, r, i, s, o, u;
            this._hasScroll() && (n = parseFloat(e.css(this.activeMenu[0], "borderTopWidth")) || 0, r = parseFloat(e.css(this.activeMenu[0], "paddingTop")) || 0, i = t.offset().top - this.activeMenu.offset().top - n - r, s = this.activeMenu.scrollTop(), o = this.activeMenu.height(), u = t.height(), 0 > i ? this.activeMenu.scrollTop(s + i) : i + u > o && this.activeMenu.scrollTop(s + i - o + u));
        },
        blur: function(e, t) {
            t || clearTimeout(this.timer), this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", e, {
                item: this.active
            }));
        },
        _startOpening: function(e) {
            clearTimeout(this.timer), "true" === e.attr("aria-hidden") && (this.timer = this._delay(function() {
                this._close(), this._open(e);
            }, this.delay));
        },
        _open: function(t) {
            var n = e.extend({
                of: this.active
            }, this.options.position);
            clearTimeout(this.timer), this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"), t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(n);
        },
        collapseAll: function(t, n) {
            clearTimeout(this.timer), this.timer = this._delay(function() {
                var r = n ? this.element : e(t && t.target).closest(this.element.find(".ui-menu"));
                r.length || (r = this.element), this._close(r), this.blur(t), this.activeMenu = r;
            }, this.delay);
        },
        _close: function(e) {
            e || (e = this.active ? this.active.parent() : this.element), e.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active");
        },
        collapse: function(e) {
            var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            t && t.length && (this._close(), this.focus(e, t));
        },
        expand: function(e) {
            var t = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            t && t.length && (this._open(t.parent()), this._delay(function() {
                this.focus(e, t);
            }));
        },
        next: function(e) {
            this._move("next", "first", e);
        },
        previous: function(e) {
            this._move("prev", "last", e);
        },
        isFirstItem: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length;
        },
        isLastItem: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length;
        },
        _move: function(e, t, n) {
            var r;
            this.active && (r = "first" === e || "last" === e ? this.active["first" === e ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[e + "All"](".ui-menu-item").eq(0)), r && r.length && this.active || (r = this.activeMenu.children(".ui-menu-item")[t]()), this.focus(n, r);
        },
        nextPage: function(t) {
            var n, r, i;
            return this.active ? (this.isLastItem() || (this._hasScroll() ? (r = this.active.offset().top, i = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() {
                return n = e(this), 0 > n.offset().top - r - i;
            }), this.focus(t, n)) : this.focus(t, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), undefined) : (this.next(t), undefined);
        },
        previousPage: function(t) {
            var n, r, i;
            return this.active ? (this.isFirstItem() || (this._hasScroll() ? (r = this.active.offset().top, i = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
                return n = e(this), n.offset().top - r + i > 0;
            }), this.focus(t, n)) : this.focus(t, this.activeMenu.children(".ui-menu-item").first())), undefined) : (this.next(t), undefined);
        },
        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop("scrollHeight");
        },
        select: function(t) {
            this.active = this.active || e(t.target).closest(".ui-menu-item");
            var n = {
                item: this.active
            };
            this.active.has(".ui-menu").length || this.collapseAll(t, !0), this._trigger("select", t, n);
        }
    });
})(jQuery);