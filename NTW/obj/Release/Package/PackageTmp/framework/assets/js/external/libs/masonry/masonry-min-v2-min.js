/*!
 * Masonry PACKAGED v3.1.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */(function(e) {
    "use strict";
    function t(e) {
        if (e) {
            if ("string" == typeof r[e]) return e;
            e = e.charAt(0).toUpperCase() + e.slice(1);
            for (var t, s = 0, o = n.length; o > s; s++) if (t = n[s] + e, "string" == typeof r[t]) return t;
        }
    }
    var n = "Webkit Moz ms Ms O".split(" "), r = document.documentElement.style;
    "function" == typeof define && define.amd ? define(function() {
        return t;
    }) : e.getStyleProperty = t;
})(window), function(e) {
    "use strict";
    function t(e) {
        var t = parseFloat(e), n = -1 === e.indexOf("%") && !isNaN(t);
        return n && t;
    }
    function n() {
        for (var e = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, t = 0, n = o.length; n > t; t++) {
            var r = o[t];
            e[r] = 0;
        }
        return e;
    }
    function r(e) {
        function r(e) {
            if ("string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
                var r = s(e);
                if ("none" === r.display) return n();
                var f = {};
                f.width = e.offsetWidth, f.height = e.offsetHeight;
                for (var l = f.isBorderBox = !!u && !!r[u] && "border-box" === r[u], c = 0, h = o.length; h > c; c++) {
                    var p = o[c], d = r[p], v = parseFloat(d);
                    f[p] = isNaN(v) ? 0 : v;
                }
                var m = f.paddingLeft + f.paddingRight, g = f.paddingTop + f.paddingBottom, y = f.marginLeft + f.marginRight, b = f.marginTop + f.marginBottom, w = f.borderLeftWidth + f.borderRightWidth, E = f.borderTopWidth + f.borderBottomWidth, S = l && i, x = t(r.width);
                x !== !1 && (f.width = x + (S ? 0 : m + w));
                var T = t(r.height);
                return T !== !1 && (f.height = T + (S ? 0 : g + E)), f.innerWidth = f.width - (m + w), f.innerHeight = f.height - (g + E), f.outerWidth = f.width + y, f.outerHeight = f.height + b, f;
            }
        }
        var i, u = e("boxSizing");
        return function() {
            if (u) {
                var e = document.createElement("div");
                e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[u] = "border-box";
                var n = document.body || document.documentElement;
                n.appendChild(e);
                var r = s(e);
                i = 200 === t(r.width), n.removeChild(e);
            }
        }(), r;
    }
    var i = document.defaultView, s = i && i.getComputedStyle ? function(e) {
        return i.getComputedStyle(e, null);
    } : function(e) {
        return e.currentStyle;
    }, o = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth" ];
    "function" == typeof define && define.amd ? define([ "get-style-property/get-style-property" ], r) : e.getSize = r(e.getStyleProperty);
}(window), function(e) {
    "use strict";
    var t = document.documentElement, n = function() {};
    t.addEventListener ? n = function(e, t, n) {
        e.addEventListener(t, n, !1);
    } : t.attachEvent && (n = function(t, n, r) {
        t[n + r] = r.handleEvent ? function() {
            var t = e.event;
            t.target = t.target || t.srcElement, r.handleEvent.call(r, t);
        } : function() {
            var n = e.event;
            n.target = n.target || n.srcElement, r.call(t, n);
        }, t.attachEvent("on" + n, t[n + r]);
    });
    var r = function() {};
    t.removeEventListener ? r = function(e, t, n) {
        e.removeEventListener(t, n, !1);
    } : t.detachEvent && (r = function(e, t, n) {
        e.detachEvent("on" + t, e[t + n]);
        try {
            delete e[t + n];
        } catch (r) {
            e[t + n] = void 0;
        }
    });
    var i = {
        bind: n,
        unbind: r
    };
    "function" == typeof define && define.amd ? define(i) : e.eventie = i;
}(this), function(e) {
    "use strict";
    function t(e) {
        "function" == typeof e && (t.isReady ? e() : s.push(e));
    }
    function n(e) {
        var n = "readystatechange" === e.type && "complete" !== i.readyState;
        if (!t.isReady && !n) {
            t.isReady = !0;
            for (var r = 0, u = s.length; u > r; r++) {
                var a = s[r];
                a();
            }
        }
    }
    function r(r) {
        return r.bind(i, "DOMContentLoaded", n), r.bind(i, "readystatechange", n), r.bind(e, "load", n), t;
    }
    var i = e.document, s = [];
    t.isReady = !1, "function" == typeof define && define.amd ? (t.isReady = "function" == typeof requirejs, define([ "eventie/eventie" ], r)) : e.docReady = r(e.eventie);
}(this), function() {
    "use strict";
    function e() {}
    function t(e, t) {
        for (var n = e.length; n--; ) if (e[n].listener === t) return n;
        return -1;
    }
    function n(e) {
        return function() {
            return this[e].apply(this, arguments);
        };
    }
    var r = e.prototype;
    r.getListeners = function(e) {
        var t, n, r = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in r) r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n]);
        } else t = r[e] || (r[e] = []);
        return t;
    }, r.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n;
    }, r.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n;
    }, r.addListener = function(e, n) {
        var r, i = this.getListenersAsObject(e), s = "object" == typeof n;
        for (r in i) i.hasOwnProperty(r) && -1 === t(i[r], n) && i[r].push(s ? n : {
            listener: n,
            once: !1
        });
        return this;
    }, r.on = n("addListener"), r.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        });
    }, r.once = n("addOnceListener"), r.defineEvent = function(e) {
        return this.getListeners(e), this;
    }, r.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this;
    }, r.removeListener = function(e, n) {
        var r, i, s = this.getListenersAsObject(e);
        for (i in s) s.hasOwnProperty(i) && (r = t(s[i], n), -1 !== r && s[i].splice(r, 1));
        return this;
    }, r.off = n("removeListener"), r.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t);
    }, r.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t);
    }, r.manipulateListeners = function(e, t, n) {
        var r, i, s = e ? this.removeListener : this.addListener, o = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp) for (r = n.length; r--; ) s.call(this, t, n[r]); else for (r in t) t.hasOwnProperty(r) && (i = t[r]) && ("function" == typeof i ? s.call(this, r, i) : o.call(this, r, i));
        return this;
    }, r.removeEvent = function(e) {
        var t, n = typeof e, r = this._getEvents();
        if ("string" === n) delete r[e]; else if ("object" === n) for (t in r) r.hasOwnProperty(t) && e.test(t) && delete r[t]; else delete this._events;
        return this;
    }, r.emitEvent = function(e, t) {
        var n, r, i, s, o = this.getListenersAsObject(e);
        for (i in o) if (o.hasOwnProperty(i)) for (r = o[i].length; r--; ) n = o[i][r], n.once === !0 && this.removeListener(e, n.listener), s = n.listener.apply(this, t || []), s === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this;
    }, r.trigger = n("emitEvent"), r.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t);
    }, r.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this;
    }, r._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0;
    }, r._getEvents = function() {
        return this._events || (this._events = {});
    }, "function" == typeof define && define.amd ? define(function() {
        return e;
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e;
}.call(this), function(e) {
    "use strict";
    function t() {}
    function n(e) {
        function n(t) {
            t.prototype.option || (t.prototype.option = function(t) {
                e.isPlainObject(t) && (this.options = e.extend(!0, this.options, t));
            });
        }
        function i(t, n) {
            e.fn[t] = function(i) {
                if ("string" == typeof i) {
                    for (var o = r.call(arguments, 1), u = 0, a = this.length; a > u; u++) {
                        var f = this[u], l = e.data(f, t);
                        if (l) if (e.isFunction(l[i]) && "_" !== i.charAt(0)) {
                            var c = l[i].apply(l, o);
                            if (void 0 !== c) return c;
                        } else s("no such method '" + i + "' for " + t + " instance"); else s("cannot call methods on " + t + " prior to initialization; " + "attempted to call '" + i + "'");
                    }
                    return this;
                }
                return this.each(function() {
                    var r = e.data(this, t);
                    r ? (r.option(i), r._init()) : (r = new n(this, i), e.data(this, t, r));
                });
            };
        }
        if (e) {
            var s = "undefined" == typeof console ? t : function(e) {
                console.error(e);
            };
            e.bridget = function(e, t) {
                n(t), i(e, t);
            };
        }
    }
    var r = Array.prototype.slice;
    "function" == typeof define && define.amd ? define([ "jquery" ], n) : n(e.jQuery);
}(window), function(e, t) {
    "use strict";
    function n(e, t) {
        return e[u](t);
    }
    function r(e) {
        if (!e.parentNode) {
            var t = document.createDocumentFragment();
            t.appendChild(e);
        }
    }
    function i(e, t) {
        r(e);
        for (var n = e.parentNode.querySelectorAll(t), i = 0, s = n.length; s > i; i++) if (n[i] === e) return !0;
        return !1;
    }
    function s(e, t) {
        return r(e), n(e, t);
    }
    var o, u = function() {
        if (t.matchesSelector) return "matchesSelector";
        for (var e = [ "webkit", "moz", "ms", "o" ], n = 0, r = e.length; r > n; n++) {
            var i = e[n], s = i + "MatchesSelector";
            if (t[s]) return s;
        }
    }();
    if (u) {
        var a = document.createElement("div"), f = n(a, "div");
        o = f ? n : s;
    } else o = i;
    "function" == typeof define && define.amd ? define(function() {
        return o;
    }) : window.matchesSelector = o;
}(this, Element.prototype), function(e) {
    "use strict";
    function t(e, t) {
        for (var n in t) e[n] = t[n];
        return e;
    }
    function n(e) {
        for (var t in e) return !1;
        return t = null, !0;
    }
    function r(e) {
        return e.replace(/([A-Z])/g, function(e) {
            return "-" + e.toLowerCase();
        });
    }
    function i(e, i, s) {
        function u(e, t) {
            e && (this.element = e, this.layout = t, this.position = {
                x: 0,
                y: 0
            }, this._create());
        }
        var a = s("transition"), f = s("transform"), l = a && f, c = !!s("perspective"), h = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "otransitionend",
            transition: "transitionend"
        }[a], p = [ "transform", "transition", "transitionDuration", "transitionProperty" ], d = function() {
            for (var e = {}, t = 0, n = p.length; n > t; t++) {
                var r = p[t], i = s(r);
                i && i !== r && (e[r] = i);
            }
            return e;
        }();
        t(u.prototype, e.prototype), u.prototype._create = function() {
            this._transition = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            });
        }, u.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e);
        }, u.prototype.getSize = function() {
            this.size = i(this.element);
        }, u.prototype.css = function(e) {
            var t = this.element.style;
            for (var n in e) {
                var r = d[n] || n;
                t[r] = e[n];
            }
        }, u.prototype.getPosition = function() {
            var e = o(this.element), t = this.layout.options, n = t.isOriginLeft, r = t.isOriginTop, i = parseInt(e[n ? "left" : "right"], 10), s = parseInt(e[r ? "top" : "bottom"], 10);
            i = isNaN(i) ? 0 : i, s = isNaN(s) ? 0 : s;
            var u = this.layout.size;
            i -= n ? u.paddingLeft : u.paddingRight, s -= r ? u.paddingTop : u.paddingBottom, this.position.x = i, this.position.y = s;
        }, u.prototype.layoutPosition = function() {
            var e = this.layout.size, t = this.layout.options, n = {};
            t.isOriginLeft ? (n.left = this.position.x + e.paddingLeft + "px", n.right = "") : (n.right = this.position.x + e.paddingRight + "px", n.left = ""), t.isOriginTop ? (n.top = this.position.y + e.paddingTop + "px", n.bottom = "") : (n.bottom = this.position.y + e.paddingBottom + "px", n.top = ""), this.css(n), this.emitEvent("layout", [ this ]);
        };
        var v = c ? function(e, t) {
            return "translate3d(" + e + "px, " + t + "px, 0)";
        } : function(e, t) {
            return "translate(" + e + "px, " + t + "px)";
        };
        u.prototype._transitionTo = function(e, t) {
            this.getPosition();
            var n = this.position.x, r = this.position.y, i = parseInt(e, 10), s = parseInt(t, 10), o = i === this.position.x && s === this.position.y;
            if (this.setPosition(e, t), o && !this.isTransitioning) return this.layoutPosition(), void 0;
            var u = e - n, a = t - r, f = {}, l = this.layout.options;
            u = l.isOriginLeft ? u : -u, a = l.isOriginTop ? a : -a, f.transform = v(u, a), this.transition({
                to: f,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            });
        }, u.prototype.goTo = function(e, t) {
            this.setPosition(e, t), this.layoutPosition();
        }, u.prototype.moveTo = l ? u.prototype._transitionTo : u.prototype.goTo, u.prototype.setPosition = function(e, t) {
            this.position.x = parseInt(e, 10), this.position.y = parseInt(t, 10);
        }, u.prototype._nonTransition = function(e) {
            this.css(e.to), e.isCleaning && this._removeStyles(e.to);
            for (var t in e.onTransitionEnd) e.onTransitionEnd[t].call(this);
        }, u.prototype._transition = function(e) {
            if (!parseFloat(this.layout.options.transitionDuration)) return this._nonTransition(e), void 0;
            var t = this._transition;
            for (var n in e.onTransitionEnd) t.onEnd[n] = e.onTransitionEnd[n];
            for (n in e.to) t.ingProperties[n] = !0, e.isCleaning && (t.clean[n] = !0);
            if (e.from) {
                this.css(e.from);
                var r = this.element.offsetHeight;
                r = null;
            }
            this.enableTransition(e.to), this.css(e.to), this.isTransitioning = !0;
        };
        var m = f && r(f) + ",opacity";
        u.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: m,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(h, this, !1));
        }, u.prototype.transition = u.prototype[a ? "_transition" : "_nonTransition"], u.prototype.onwebkitTransitionEnd = function(e) {
            this.ontransitionend(e);
        }, u.prototype.onotransitionend = function(e) {
            this.ontransitionend(e);
        };
        var g = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        u.prototype.ontransitionend = function(e) {
            if (e.target === this.element) {
                var t = this._transition, r = g[e.propertyName] || e.propertyName;
                if (delete t.ingProperties[r], n(t.ingProperties) && this.disableTransition(), r in t.clean && (this.element.style[e.propertyName] = "", delete t.clean[r]), r in t.onEnd) {
                    var i = t.onEnd[r];
                    i.call(this), delete t.onEnd[r];
                }
                this.emitEvent("transitionEnd", [ this ]);
            }
        }, u.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(h, this, !1), this.isTransitioning = !1;
        }, u.prototype._removeStyles = function(e) {
            var t = {};
            for (var n in e) t[n] = "";
            this.css(t);
        };
        var y = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return u.prototype.removeTransitionStyles = function() {
            this.css(y);
        }, u.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [ this ]);
        }, u.prototype.remove = function() {
            if (!a || !parseFloat(this.layout.options.transitionDuration)) return this.removeElem(), void 0;
            var e = this;
            this.on("transitionEnd", function() {
                return e.removeElem(), !0;
            }), this.hide();
        }, u.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var e = this.layout.options;
            this.transition({
                from: e.hiddenStyle,
                to: e.visibleStyle,
                isCleaning: !0
            });
        }, u.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var e = this.layout.options;
            this.transition({
                from: e.visibleStyle,
                to: e.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: {
                    opacity: function() {
                        this.css({
                            display: "none"
                        });
                    }
                }
            });
        }, u.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            });
        }, u;
    }
    var s = document.defaultView, o = s && s.getComputedStyle ? function(e) {
        return s.getComputedStyle(e, null);
    } : function(e) {
        return e.currentStyle;
    };
    "function" == typeof define && define.amd ? define([ "eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property" ], i) : (e.Outlayer = {}, e.Outlayer.Item = i(e.EventEmitter, e.getSize, e.getStyleProperty));
}(window), function(e) {
    "use strict";
    function t(e, t) {
        for (var n in t) e[n] = t[n];
        return e;
    }
    function n(e) {
        return "[object Array]" === c.call(e);
    }
    function r(e) {
        var t = [];
        if (n(e)) t = e; else if (e && "number" == typeof e.length) for (var r = 0, i = e.length; i > r; r++) t.push(e[r]); else t.push(e);
        return t;
    }
    function i(e, t) {
        var n = p(t, e);
        -1 !== n && t.splice(n, 1);
    }
    function s(e) {
        return e.replace(/(.)([A-Z])/g, function(e, t, n) {
            return t + "-" + n;
        }).toLowerCase();
    }
    function o(n, o, c, p, d, v) {
        function m(e, n) {
            if ("string" == typeof e && (e = u.querySelector(e)), !e || !h(e)) return a && a.error("Bad " + this.settings.namespace + " element: " + e), void 0;
            this.element = e, this.options = t({}, this.options), this.option(n);
            var r = ++y;
            this.element.outlayerGUID = r, b[r] = this, this._create(), this.options.isInitLayout && this.layout();
        }
        function g(e, n) {
            e.prototype[n] = t({}, m.prototype[n]);
        }
        var y = 0, b = {};
        return m.prototype.settings = {
            namespace: "outlayer",
            item: v
        }, m.prototype.options = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, t(m.prototype, c.prototype), m.prototype.option = function(e) {
            t(this.options, e);
        }, m.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), t(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize();
        }, m.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children);
        }, m.prototype._itemize = function(e) {
            for (var t = this._filterFindItemElements(e), n = this.settings.item, r = [], i = 0, s = t.length; s > i; i++) {
                var o = t[i], u = new n(o, this);
                r.push(u);
            }
            return r;
        }, m.prototype._filterFindItemElements = function(e) {
            e = r(e);
            for (var t = this.options.itemSelector, n = [], i = 0, s = e.length; s > i; i++) {
                var o = e[i];
                if (h(o)) if (t) {
                    d(o, t) && n.push(o);
                    for (var u = o.querySelectorAll(t), a = 0, f = u.length; f > a; a++) n.push(u[a]);
                } else n.push(o);
            }
            return n;
        }, m.prototype.getItemElements = function() {
            for (var e = [], t = 0, n = this.items.length; n > t; t++) e.push(this.items[t].element);
            return e;
        }, m.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var e = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, e), this._isLayoutInited = !0;
        }, m.prototype._init = m.prototype.layout, m.prototype._resetLayout = function() {
            this.getSize();
        }, m.prototype.getSize = function() {
            this.size = p(this.element);
        }, m.prototype._getMeasurement = function(e, t) {
            var n, r = this.options[e];
            r ? ("string" == typeof r ? n = this.element.querySelector(r) : h(r) && (n = r), this[e] = n ? p(n)[t] : r) : this[e] = 0;
        }, m.prototype.layoutItems = function(e, t) {
            e = this._getItemsForLayout(e), this._layoutItems(e, t), this._postLayout();
        }, m.prototype._getItemsForLayout = function(e) {
            for (var t = [], n = 0, r = e.length; r > n; n++) {
                var i = e[n];
                i.isIgnored || t.push(i);
            }
            return t;
        }, m.prototype._layoutItems = function(e, t) {
            if (!e || !e.length) return this.emitEvent("layoutComplete", [ this, e ]), void 0;
            this._itemsOn(e, "layout", function() {
                this.emitEvent("layoutComplete", [ this, e ]);
            });
            for (var n = [], r = 0, i = e.length; i > r; r++) {
                var s = e[r], o = this._getItemLayoutPosition(s);
                o.item = s, o.isInstant = t, n.push(o);
            }
            this._processLayoutQueue(n);
        }, m.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            };
        }, m.prototype._processLayoutQueue = function(e) {
            for (var t = 0, n = e.length; n > t; t++) {
                var r = e[t];
                this._positionItem(r.item, r.x, r.y, r.isInstant);
            }
        }, m.prototype._positionItem = function(e, t, n, r) {
            r ? e.goTo(t, n) : e.moveTo(t, n);
        }, m.prototype._postLayout = function() {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1));
        }, m.prototype._getContainerSize = l, m.prototype._setContainerMeasure = function(e, t) {
            if (void 0 !== e) {
                var n = this.size;
                n.isBorderBox && (e += t ? n.paddingLeft + n.paddingRight + n.borderLeftWidth + n.borderRightWidth : n.paddingBottom + n.paddingTop + n.borderTopWidth + n.borderBottomWidth), e = Math.max(e, 0), this.element.style[t ? "width" : "height"] = e + "px";
            }
        }, m.prototype._itemsOn = function(e, t, n) {
            function r() {
                return i++, i === s && n.call(o), !0;
            }
            for (var i = 0, s = e.length, o = this, u = 0, a = e.length; a > u; u++) {
                var f = e[u];
                f.on(t, r);
            }
        }, m.prototype.ignore = function(e) {
            var t = this.getItem(e);
            t && (t.isIgnored = !0);
        }, m.prototype.unignore = function(e) {
            var t = this.getItem(e);
            t && delete t.isIgnored;
        }, m.prototype.stamp = function(e) {
            if (e = this._find(e)) {
                this.stamps = this.stamps.concat(e);
                for (var t = 0, n = e.length; n > t; t++) {
                    var r = e[t];
                    this.ignore(r);
                }
            }
        }, m.prototype.unstamp = function(e) {
            if (e = this._find(e)) for (var t = 0, n = e.length; n > t; t++) {
                var r = e[t];
                i(r, this.stamps), this.unignore(r);
            }
        }, m.prototype._find = function(e) {
            return e ? ("string" == typeof e && (e = this.element.querySelectorAll(e)), e = r(e)) : void 0;
        }, m.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var e = 0, t = this.stamps.length; t > e; e++) {
                    var n = this.stamps[e];
                    this._manageStamp(n);
                }
            }
        }, m.prototype._getBoundingRect = function() {
            var e = this.element.getBoundingClientRect(), t = this.size;
            this._boundingRect = {
                left: e.left + t.paddingLeft + t.borderLeftWidth,
                top: e.top + t.paddingTop + t.borderTopWidth,
                right: e.right - (t.paddingRight + t.borderRightWidth),
                bottom: e.bottom - (t.paddingBottom + t.borderBottomWidth)
            };
        }, m.prototype._manageStamp = l, m.prototype._getElementOffset = function(e) {
            var t = e.getBoundingClientRect(), n = this._boundingRect, r = p(e), i = {
                left: t.left - n.left - r.marginLeft,
                top: t.top - n.top - r.marginTop,
                right: n.right - t.right - r.marginRight,
                bottom: n.bottom - t.bottom - r.marginBottom
            };
            return i;
        }, m.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e);
        }, m.prototype.bindResize = function() {
            this.isResizeBound || (n.bind(e, "resize", this), this.isResizeBound = !0);
        }, m.prototype.unbindResize = function() {
            n.unbind(e, "resize", this), this.isResizeBound = !1;
        }, m.prototype.onresize = function() {
            function e() {
                t.resize(), delete t.resizeTimeout;
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var t = this;
            this.resizeTimeout = setTimeout(e, 100);
        }, m.prototype.resize = function() {
            var e = p(this.element), t = this.size && e;
            t && e.innerWidth === this.size.innerWidth || this.layout();
        }, m.prototype.addItems = function(e) {
            var t = this._itemize(e);
            return t.length && (this.items = this.items.concat(t)), t;
        }, m.prototype.appended = function(e) {
            var t = this.addItems(e);
            t.length && (this.layoutItems(t, !0), this.reveal(t));
        }, m.prototype.prepended = function(e) {
            var t = this._itemize(e);
            if (t.length) {
                var n = this.items.slice(0);
                this.items = t.concat(n), this._resetLayout(), this._manageStamps(), this.layoutItems(t, !0), this.reveal(t), this.layoutItems(n);
            }
        }, m.prototype.reveal = function(e) {
            if (e && e.length) for (var t = 0, n = e.length; n > t; t++) {
                var r = e[t];
                r.reveal();
            }
        }, m.prototype.hide = function(e) {
            if (e && e.length) for (var t = 0, n = e.length; n > t; t++) {
                var r = e[t];
                r.hide();
            }
        }, m.prototype.getItem = function(e) {
            for (var t = 0, n = this.items.length; n > t; t++) {
                var r = this.items[t];
                if (r.element === e) return r;
            }
        }, m.prototype.getItems = function(e) {
            if (e && e.length) {
                for (var t = [], n = 0, r = e.length; r > n; n++) {
                    var i = e[n], s = this.getItem(i);
                    s && t.push(s);
                }
                return t;
            }
        }, m.prototype.remove = function(e) {
            e = r(e);
            var t = this.getItems(e);
            if (t && t.length) {
                this._itemsOn(t, "remove", function() {
                    this.emitEvent("removeComplete", [ this, t ]);
                });
                for (var n = 0, s = t.length; s > n; n++) {
                    var o = t[n];
                    o.remove(), i(o, this.items);
                }
            }
        }, m.prototype.destroy = function() {
            var e = this.element.style;
            e.height = "", e.position = "", e.width = "";
            for (var t = 0, n = this.items.length; n > t; t++) {
                var r = this.items[t];
                r.destroy();
            }
            this.unbindResize(), delete this.element.outlayerGUID, f && f.removeData(this.element, this.settings.namespace);
        }, m.data = function(e) {
            var t = e && e.outlayerGUID;
            return t && b[t];
        }, m.create = function(e, n) {
            function r() {
                m.apply(this, arguments);
            }
            return t(r.prototype, m.prototype), g(r, "options"), g(r, "settings"), t(r.prototype.options, n), r.prototype.settings.namespace = e, r.data = m.data, r.Item = function() {
                v.apply(this, arguments);
            }, r.Item.prototype = new v, r.prototype.settings.item = r.Item, o(function() {
                for (var t = s(e), n = u.querySelectorAll(".js-" + t), i = "data-" + t + "-options", o = 0, l = n.length; l > o; o++) {
                    var c, h = n[o], p = h.getAttribute(i);
                    try {
                        c = p && JSON.parse(p);
                    } catch (d) {
                        a && a.error("Error parsing " + i + " on " + h.nodeName.toLowerCase() + (h.id ? "#" + h.id : "") + ": " + d);
                        continue;
                    }
                    var v = new r(h, c);
                    f && f.data(h, e, v);
                }
            }), f && f.bridget && f.bridget(e, r), r;
        }, m.Item = v, m;
    }
    var u = e.document, a = e.console, f = e.jQuery, l = function() {}, c = Object.prototype.toString, h = "object" == typeof HTMLElement ? function(e) {
        return e instanceof HTMLElement;
    } : function(e) {
        return e && "object" == typeof e && 1 === e.nodeType && "string" == typeof e.nodeName;
    }, p = Array.prototype.indexOf ? function(e, t) {
        return e.indexOf(t);
    } : function(e, t) {
        for (var n = 0, r = e.length; r > n; n++) if (e[n] === t) return n;
        return -1;
    };
    "function" == typeof define && define.amd ? define([ "eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item" ], o) : e.Outlayer = o(e.eventie, e.docReady, e.EventEmitter, e.getSize, e.matchesSelector, e.Outlayer.Item);
}(window), function(e) {
    "use strict";
    function t(e, t) {
        var r = e.create("masonry");
        return r.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var e = this.cols;
            for (this.colYs = []; e--; ) this.colYs.push(0);
            this.maxY = 0;
        }, r.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var e = this.items[0], n = e && e.element;
                this.columnWidth = n && t(n).outerWidth || this.containerWidth;
            }
            this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1);
        }, r.prototype.getContainerWidth = function() {
            var e = this.options.isFitWidth ? this.element.parentNode : this.element, n = t(e);
            this.containerWidth = n && n.innerWidth;
        }, r.prototype._getItemLayoutPosition = function(e) {
            e.getSize();
            var t = Math.ceil(e.size.outerWidth / this.columnWidth);
            t = Math.min(t, this.cols);
            for (var r = this._getColGroup(t), s = Math.min.apply(Math, r), o = n(r, s), u = {
                x: this.columnWidth * o,
                y: s
            }, a = s + e.size.outerHeight, f = this.cols + 1 - r.length, l = 0; f > l; l++) this.colYs[o + l] = a;
            return u;
        }, r.prototype._getColGroup = function(e) {
            if (2 > e) return this.colYs;
            for (var t = [], n = this.cols + 1 - e, r = 0; n > r; r++) {
                var i = this.colYs.slice(r, r + e);
                t[r] = Math.max.apply(Math, i);
            }
            return t;
        }, r.prototype._manageStamp = function(e) {
            var n = t(e), r = this._getElementOffset(e), i = this.options.isOriginLeft ? r.left : r.right, s = i + n.outerWidth, o = Math.floor(i / this.columnWidth);
            o = Math.max(0, o);
            var u = Math.floor(s / this.columnWidth);
            u = Math.min(this.cols - 1, u);
            for (var a = (this.options.isOriginTop ? r.top : r.bottom) + n.outerHeight, f = o; u >= f; f++) this.colYs[f] = Math.max(a, this.colYs[f]);
        }, r.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var e = {
                height: this.maxY
            };
            return this.options.isFitWidth && (e.width = this._getContainerFitWidth()), e;
        }, r.prototype._getContainerFitWidth = function() {
            for (var e = 0, t = this.cols; --t && 0 === this.colYs[t]; ) e++;
            return (this.cols - e) * this.columnWidth - this.gutter;
        }, r.prototype.resize = function() {
            var e = this.containerWidth;
            this.getContainerWidth(), e !== this.containerWidth && this.layout();
        }, r;
    }
    var n = Array.prototype.indexOf ? function(e, t) {
        return e.indexOf(t);
    } : function(e, t) {
        for (var n = 0, r = e.length; r > n; n++) {
            var i = e[n];
            if (i === t) return n;
        }
        return -1;
    };
    "function" == typeof define && define.amd ? define([ "outlayer/outlayer", "get-size/get-size" ], t) : e.Masonry = t(e.Outlayer, e.getSize);
}(window);