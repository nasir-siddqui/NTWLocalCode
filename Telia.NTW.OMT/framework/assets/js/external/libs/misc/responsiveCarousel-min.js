/*jslint browser: true, nomen: true, white: true *//*!
 * responsiveCarousel  v 1.7.3
 * A responsive carousel that works in desktop browsers, ipad, iphone, and even
 * most Androids.  It uses css3 animations with a jquery animation fallback for
 * greater speed.  The code was optimized to minimize page reflows to further
 * enhance the overall speed..
 *
 * This is a jQuery UI Widget
 *
 * merge with github
 *
 * New:  fixes to individual mode.  Also does fraction of time if fraction of individual is showing.
 *
 * @version 1.7.3
 * @releaseDate 6/27/2013
 * @author Matthew Toledo
 * @url https://github.com/mrbinky3000/responsive_carousel
 * @requires jQuery, jQuery UI (only the Core and Widget Factory), modernizr (only css3 transitions test, touch test optional), hammer.js
 */(function(e, t, n) {
    "use strict";
    var r = 0;
    e.widget("ri.responsiveCarousel", {
        options: {
            arrowLeft: ".arrow-left span",
            arrowRight: ".arrow-right span",
            mask: ".slider-mask",
            target: "ul",
            unitElement: "li",
            unitWidth: "inherit",
            responsiveUnitSize: null,
            onRedraw: null,
            ondragstart: null,
            ondragend: null,
            dragEvents: !1,
            easing: "linear",
            speed: 400,
            slideSpeed: 2500,
            step: -1,
            responsiveStep: null,
            onShift: null,
            cssAnimations: Modernizr.csstransitions,
            nudgeThreshold: 10,
            infinite: !1,
            delta: 1,
            dragVertical: !1,
            dragPreventDefault: !1,
            lazyload: !1
        },
        _getPrefix: function(e) {
            var t = [ "Moz", "Webkit", "Khtml", "0", "ms" ], r = n.createElement("div"), i = e.charAt(0).toUpperCase() + e.slice(1), s = "", o = t.length;
            while (o > -1) {
                r.style[t[o] + i] !== undefined && (s = t[o]);
                o -= 1;
            }
            r.style[e] ? s = e.toLowerCase() : s = "-" + s.toLowerCase() + "-";
            return s;
        },
        _round: function(e) {
            if (this.options.unitWidth === "compute" || this.options.unitWidth === "inherit" || this.options.unitWidth === "integer") e = Math.round(e / this.internal.unitWidth) * this.internal.unitWidth;
            return e;
        },
        _animate: function(n, i, s, o) {
            var u = this.options, a = this.internal, f = a.prefix + "transition", l = this._round(Math.floor(n.position().left)), c = i.left, h = l + c, p, d = function(e) {
                n.css(e);
            }, v = function() {
                var i = e('<div class="redraw-' + r + '"> </div>');
                i.appendTo(n);
                i.hide();
                i.get(0).offsetHeight;
                i.show();
                t.setTimeout(function() {
                    i.remove();
                }, 1);
            };
            n.css(f, "");
            v();
            if (u.infinite === !0 && c !== undefined) if (c < l) {
                p = a.unitWidth * (a.numUnits - a.numVisibleUnits) * -1;
                if (l === p) {
                    n.css("left", 0);
                    i.left = -a.unitWidth;
                }
            } else if (c > l && l === 0) {
                p = Math.floor(n.find(".clone:first").position().left) * -1;
                n.css("left", p);
                i.left = p + h;
            }
            t.setTimeout(function() {
                if (u.cssAnimations) {
                    n.css(f, "left " + s / 1e3 + "s " + u.easing);
                    d(i);
                    t.setTimeout(function() {
                        n.css(f, "");
                        e.isFunction(o) && o();
                    }, s);
                } else n.animate(i, s, function() {
                    e.isFunction(o) && o();
                });
            }, 1);
        },
        _requestAnimationFrameShim: function() {
            var e = 0, n = [ "ms", "moz", "webkit", "o" ], r;
            if (!t.requestAnimationFrame || !t.cancelAnimationFrame) {
                for (r = 0; r < n.length && !t.requestAnimationFrame; r += 1) {
                    t.requestAnimationFrame = t[n[r] + "RequestAnimationFrame"];
                    t.cancelAnimationFrame = t[n[r] + "CancelAnimationFrame"] || t[n[r] + "CancelRequestAnimationFrame"];
                }
                t.requestAnimationFrame || (t.requestAnimationFrame = function(n) {
                    var r = (new Date).getTime(), i = Math.max(0, 16 - (r - e)), s = t.setTimeout(function() {
                        n(r + i);
                    }, i);
                    e = r + i;
                    return s;
                });
                t.cancelAnimationFrame || (t.cancelAnimationFrame = function(e) {
                    clearTimeout(e);
                });
            }
        },
        _setTargetWidth: function() {
            function o(n) {
                var r, i = e(n);
                i.css("width", "");
                r = Math.ceil(i.width()) + 1;
                i.width(r);
                t.targetWidth = t.targetWidth + r;
                i.data("responsiveCarousel", {
                    width: r,
                    top: Math.floor(i.position().top),
                    right: Math.floor(i.position().left) + i.width(),
                    bottom: Math.floor(i.position().top) + i.height(),
                    left: Math.floor(i.position().left)
                });
            }
            var t = this.internal, n = this.options, r, i = e(n.unitElement), s;
            t.numUnits = e(n.unitElement).length;
            r = t.numUnits;
            s = r;
            if (n.unitWidth === "individual") {
                t.targetWidth = 0;
                while (s--) o(i[s]);
            } else t.targetWidth = t.numUnits * t.unitWidth;
            e(n.target).width(t.targetWidth);
            t.targetHeight = e(n.target).height();
            t.maskWidth = e(n.mask).width();
            t.maskHeight = e(n.mask).height();
        },
        _setArrowVisibility: function() {
            var t = this.options, n = this.internal, r = e(t.target), i = e(t.arrowLeft), s = e(t.arrowRight), o = 0, u, a = n.maskWidth, f = this._round(Math.floor(r.position().left)), l = n.targetWidth + f;
            if (s.length) if (t.infinite !== !0 && l <= a) {
                s.addClass("disabled");
                n.isArrowBeingClicked === !0 && this._clearInterval();
                n.arrowRightVisible = n.isArrowBeingClicked = !1;
            } else {
                s.removeClass("disabled");
                n.arrowRightVisible = !0;
            }
            if (i.length) if (t.infinite !== !0 && f >= o) {
                i.addClass("disabled");
                n.isArrowBeingClicked === !0 && this._clearInterval();
                n.arrowLeftVisible = n.isArrowBeingClicked = !1;
            } else {
                i.removeClass("disabled");
                n.arrowLeftVisible = !0;
            }
            if (t.unitWidth !== "individual") {
                n.currentSlide = e(t.unitElement).eq([ Math.abs(f / n.unitWidth) ]).data("slide");
                u = n.currentSlide;
            }
            if (e.isFunction(t.onShift)) typeof u == "number" && t.onShift(u); else if (t.onShift !== null) throw new Error("The onShift option must be a function or null if not in use.");
        },
        _clearInterval: function() {
            var e = this.internal;
            if ("number" == typeof e.timer) {
                e.isArrowBeingClicked = !1;
                t.clearInterval(e.timer);
            }
        },
        _doArrowBeingClicked: function(t) {
            var n = this, r = this.internal, i = this.options, s = e(i.target), o = Math.floor(s.position().left), u, a, f = i.speed, l, c, h, p, d = 0, v = !1, m = r.currentSlide;
            if (r.busy === !0) return;
            if (i.unitWidth === "individual") if (t === "right") if (r.lastArrowClicked === "right") {
                if (m < r.numUnits - 1) {
                    m += 1;
                    h = e(i.unitElement).eq(m).data("responsiveCarousel");
                    u = o - h.width;
                    r.currentSlide = m;
                }
            } else {
                r.lastArrowClicked = "right";
                c = -1 * o + r.maskWidth;
                p = r.numUnits;
                while (m < p) {
                    h = e(i.unitElement).eq(m).data("responsiveCarousel");
                    if (c >= h.left && c <= h.right) {
                        u = o - (h.right - c);
                        f = i.speed - i.speed * ((c - h.left) / h.width);
                        r.currentSlide = m;
                        break;
                    }
                    d += h.width;
                    m += 1;
                }
            } else {
                if (t !== "left") throw new Error("unknown direction");
                if (r.lastArrowClicked === "left") {
                    if (m > 0) {
                        m -= 1;
                        h = e(i.unitElement).eq(m).data("responsiveCarousel");
                        u = o + h.width;
                        r.currentSlide = m;
                    }
                } else {
                    r.lastArrowClicked = "left";
                    if (e(i.unitElement).eq(r.currentSlide).length) {
                        l = Math.abs(o);
                        while (m >= 0) {
                            h = e(i.unitElement).eq(m).data("responsiveCarousel");
                            if (l >= h.left && l <= h.right) {
                                u = o + h.width;
                                h.right > l && (u -= h.right + o);
                                f = i.speed * ((l - h.left) / h.width);
                                r.currentSlide = m;
                                break;
                            }
                            d += h.width;
                            m -= 1;
                        }
                    }
                }
            } else if (t === "left") u = o + r.unitWidth; else {
                if (t !== "right") throw new Error("unknown direction");
                u = o - r.unitWidth;
            }
            u = this._round(u);
            r.maskWidth < r.targetWidth ? a = r.maskWidth - r.targetWidth : a = 0;
            u > 0 && (u = 0);
            u < a && (u = a);
            f = f >= 100 ? f : 100;
            r.busy = !0;
            this._animate(s, {
                left: u
            }, f, function() {
                n._setArrowVisibility("_doArrowBeingClicked");
                r.busy = !1;
            });
        },
        _setArrowEvents: function() {
            var n = this, r = this.options, i = this.internal, s = e(r.arrowLeft), o = e(r.arrowRight), u = "", a = "";
            s.on("click" + this.instanceId, function(e) {
                e.preventDefault();
            });
            o.on("click" + this.instanceId, function(e) {
                e.preventDefault();
            });
            if (r.dragEvents === !0) {
                u = "mousedown" + this.instanceId + " touchstart" + this.instanceId + " gesturestart" + this.instanceId + " gesturechange" + this.instanceId;
                a = "mouseup" + this.instanceId + " mouseout" + this.instanceId + " mouseleave" + this.instanceId + " touchend" + this.instanceId + " touchleave" + this.instanceId + " gestureend" + this.instanceId;
            } else {
                u = "mousedown" + this.instanceId;
                a = "mouseup" + this.instanceId + " mouseout" + this.instanceId + " mouseleave" + this.instanceId;
            }
            s.on(u, function(e) {
                !0 === i.ios6Device && (i.busy = !1);
                e.preventDefault();
                e.stopPropagation();
                if (i.busy === !1 && !s.hasClass("disabled")) {
                    i.isArrowBeingClicked = i.firstMouseClick = !0;
                    i.timer = t.setInterval(function() {
                        n._doArrowBeingClicked("left");
                    }, 10);
                    if (i.slideTimer) {
                        t.clearInterval(i.slideTimer);
                        i.slideShowActive = !1;
                    }
                }
            });
            o.on(u, function(e) {
                !0 === i.ios6Device && (i.busy = !1);
                e.preventDefault();
                e.stopPropagation();
                if (i.busy === !1 && !o.hasClass("disabled")) {
                    i.isArrowBeingClicked = i.firstMouseClick = !0;
                    i.timer = t.setInterval(function() {
                        n._doArrowBeingClicked("right");
                    }, 10);
                    if (i.slideTimer) {
                        t.clearInterval(i.slideTimer);
                        i.slideShowActive = !1;
                    }
                }
            });
            e.each([ s, o ], function() {
                e(this).on(a, function() {
                    i.isArrowBeingClicked === !0 && n._clearInterval();
                });
            });
            e(t).on("scroll" + this.instanceId, function() {
                if (r.unitWidth !== "individual") {
                    t.clearTimeout(i.scrollTimer);
                    i.scrollTimer = t.setTimeout(function() {
                        n._clearInterval();
                    }, 100);
                }
            });
            e(t).on(" resize" + this.instanceId + " onorientationchange" + this.instanceId, function() {
                t.clearTimeout(i.resizeTimer);
                i.resizeTimer = t.setTimeout(function() {
                    n._setTargetWidth();
                    n._clearInterval();
                }, 100);
            });
        },
        _setUnitWidth: function() {
            var n, r, i = this, s = this.internal, o = this.options, u = e(o.target), a = e(this.element), f = e(o.unitElement + ":not(.clone)"), l = f.eq(0), c, h, p, d = function() {
                s.unitWidth = l.width();
            }, v = function() {
                s.maskWidth = e(o.mask).width();
                r = o.responsiveUnitSize(a, s, o);
                if ("number" != typeof r || r < 1) throw new Error("The responsiveUnitSize callback must return a whole number greater than 0");
                n = s.maskWidth / r;
                n = Math.floor(n);
                e(o.unitElement).css("width", n);
                if (o.infinite === !0 && r > 0 && r !== s.numVisibleUnits) {
                    s.numVisibleUnits = r;
                    u.find(".clone").remove();
                    f.slice(0, s.numVisibleUnits).clone(!0).addClass("clone").appendTo(u);
                }
                s.unitWidth = n;
                s.numVisibleUnits = r;
            }, m = function(n) {
                e(n).one("load" + i.instanceId, function() {
                    if (u.is(":hidden") === !1 || u.is(":visible") === !0) {
                        t.clearTimeout(s.imageLoadTimer);
                        s.imageLoadTimer = t.setTimeout(function() {
                            e.isFunction(o.responsiveUnitSize) && v();
                            d();
                            i._setTargetWidth();
                            i._setArrowVisibility();
                            e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                        }, 400);
                    }
                });
            };
            if (o.unitWidth === "inherit") {
                d();
                u.find("img").one("load" + i.instanceId, function() {
                    d();
                    i._setTargetWidth();
                    i._setArrowVisibility();
                    e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                });
            } else if (o.unitWidth === "individual") {
                if (u.is(":hidden") === !1 || u.is(":visible") === !0) {
                    i._setTargetWidth();
                    i._setArrowVisibility();
                }
                e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                u.find("img").one("load" + i.instanceId, function() {
                    if (u.is(":hidden") === !1 || u.is(":visible") === !0) {
                        t.clearTimeout(s.imageLoadTimer);
                        s.imageLoadTimer = t.setTimeout(function() {
                            i._setTargetWidth();
                            i._setArrowVisibility();
                            e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                        });
                    }
                });
                e(t).on("resize" + i.instanceId, function() {
                    var n = s.currentSlide;
                    clearTimeout(s.setWidthTimer);
                    s.setWidthTimer = setTimeout(function() {
                        var r, f, l, c;
                        if (u.is(":hidden") === !1 || u.is(":visible") === !0) {
                            i._setTargetWidth();
                            f = e(o.unitElement).eq(n).data("responsiveCarousel");
                            if (s.lastArrowClicked === "right") r = s.maskWidth - f.right; else if (s.lastArrowClicked === "left" && n > 0) r = -1 * e(o.unitElement).eq(n - 1).data("responsiveCarousel").right; else {
                                r = 0;
                                s.currentSlide = 0;
                            }
                            c = s.left + r;
                            l = s.maskWidth - s.targetWidth;
                            if (c < l) {
                                r = l;
                                s.currentSlide = s.numUnits - 1;
                            }
                            if (c > 0) {
                                r = 0;
                                s.currentSlide = 0;
                            }
                            u.css({
                                left: r
                            });
                            t.requestAnimationFrame(function() {
                                i._setArrowVisibility("_setUnitWidth individual resize");
                                e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                            });
                        }
                    }, 400);
                });
            } else if (o.unitWidth === "compute") {
                d();
                if (e.isFunction(o.responsiveUnitSize)) {
                    v();
                    d();
                }
                e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                h = u.find("img");
                p = h.length;
                for (c = 0; c < p; ++c) m(h[c]);
                e(t).on("resize" + i.instanceId, function() {
                    if (!e("body").hasClass("lt-ie9")) {
                        var n = s.currentSlide;
                        t.clearTimeout(s.setWidthTimer);
                        if (u.is(":hidden") === !1 || u.is(":visible") === !0) s.setWidthTimer = setTimeout(function() {
                            var t, r = -1 * s.numUnits * s.unitWidth + s.maskWidth;
                            if (e.isFunction(o.responsiveUnitSize)) {
                                v();
                                d();
                            }
                            d();
                            i._setTargetWidth();
                            t = n * -1 * s.unitWidth;
                            t < r && (t = s.maskWidth - s.targetWidth);
                            u.css({
                                left: t
                            });
                            i._setArrowVisibility();
                            e.isFunction(o.onRedraw) && o.onRedraw(a, s, o);
                        }, 500);
                    }
                });
            } else s.unitWidth = o.unitWidth;
        },
        _dragEvents: function() {
            var n = this, r = this.options, i = this.internal, s = e(r.target), o = e(r.mask), u = s, a, f = new Hammer(o.get(0), {
                prevent_default: r.dragPreventDefault,
                css_hacks: !0,
                drag: !0,
                drag_vertical: r.dragVertical,
                drag_horizontal: !0,
                drag_min_distance: 0,
                swipe: !1,
                transform: !1,
                tap: !1,
                tap_double: !1,
                hold: !1
            }), l = {}, c = function() {
                var e = {
                    top: parseInt(u.css("top"), 10),
                    left: parseInt(u.css("left"), 10)
                };
                return e;
            }, h = function(e) {
                var t = r.delta, n = e.direction, s, o;
                if (!0 === i.isArrowBeingClicked) return;
                if (n === "up" || n === "left") e.distance = e.distance * -1;
                s = l.left + e.distance * t;
                o = Math.abs(i.scrollStart.left - s);
                r.unitWidth === "individual" ? o > r.nudgeThreshold && (e.direction === "up" || e.direction === "left" ? i.nudgeDirection = "left" : i.nudgeDirection = "right") : o > r.nudgeThreshold && o < i.unitWidth / 2 ? n === "up" || n === "left" ? i.nudgeDirection = "left" : i.nudgeDirection = "right" : o <= r.nudgeThreshold ? i.nudgeDirection = "abort" : i.nudgeDirection = null;
                if (r.infinite === !0) {
                    if (s <= a) {
                        s = e.distance * t;
                        i.scrollStart.left = 0;
                    }
                    if (s >= 0) {
                        s = a + e.distance * t;
                        i.scrollStart.left = a;
                    }
                }
                i.left = s;
                u.css("left", s);
            };
            i.touchObject = f;
            f.ondragstart = function() {
                n.stopSlideShow();
                t.cancelAnimationFrame(i.dragTimer);
                r.unitWidth !== "individual" && (a = i.unitWidth * (i.numUnits - i.numVisibleUnits) * -1);
                if (!0 === i.isArrowBeingClicked || !0 === i.busy) return {};
                !0 === i.ios6Device ? i.busy = !1 : i.busy = !0;
                l = c();
                l.time = (new Date).getTime();
                i.scrollStart = l;
                e.isFunction(r.ondragstart) && r.ondragstart(r, i);
            };
            f.ondrag = function(e) {
                i.dragTimer = t.requestAnimationFrame(function() {
                    h(e);
                });
            };
            f.ondragend = function() {
                t.cancelAnimationFrame(i.dragTimer);
                s.stop(!0, !1);
                t.requestAnimationFrame(function() {
                    n._animate(s, {
                        left: n.computeAdjust(s)
                    }, r.speed, function() {
                        n._setArrowVisibility();
                        i.busy = !1;
                        e.isFunction(r.ondragend) && r.ondragend(r, i);
                    });
                });
            };
        },
        _create: function() {
            r += 1;
            var t = this.options, n = e(this.element), i = e(t.target);
            this.instanceId = ".carousel_" + r.toString(10);
            this.internal = {
                busy: !1,
                currentSlide: 0,
                left: 0,
                targetWidth: 0,
                targetHeight: 0,
                maskWidth: 0,
                maskHeight: 0,
                unitWidth: 0,
                targetBackupCopy: null,
                isArrowBeingClicked: !1,
                lastArrowClicked: null,
                arrowLeftVisible: !0,
                arrowRightVisible: !0,
                targetLeft: 0,
                timer: null,
                dragTimer: null,
                dragEndTimer: null,
                scrollTimer: null,
                resizeTimer: null,
                firstMouseClick: !1,
                prefix: null,
                slideShowActive: !1,
                slideTimer: null,
                slideBumped: !1,
                nudgeDirection: null,
                infinite: !1,
                numUnits: null,
                numVisibleUnits: null,
                scrollStart: 0,
                touchObject: null,
                setWidthTimer: null,
                lazyloaded: !1,
                ios6Device: !1
            };
            this.internal.backup = i.clone(!0, !0);
            this.options.cssAnimations && (this.internal.prefix = this._getPrefix("transition"));
            /(iPhone|iPod|iPad)/i.test(navigator.userAgent) && /OS 6_/i.test(navigator.userAgent) && (this.internal.ios6Device = !0);
            this._requestAnimationFrameShim();
            i.css({
                position: "relative",
                left: 0
            });
            i.addClass("instance-" + r);
            e(t.unitElement).each(function(t) {
                e(this).attr({
                    "data-slide": t
                });
            });
            t.dragEvents === !0 && this._dragEvents();
            this._setArrowEvents();
            t.lazyload === !0 && e(t.target).find("img.lazy-slider").lazyload({
                effect: "fadeIn",
                skip_invisible: !1
            });
            if (i.is(":visible") === !0 || i.is(":hidden") === !1) {
                this._setUnitWidth();
                this._setTargetWidth();
                this._setArrowVisibility();
                t.lazyload === !0 && this._lazyLoad();
            }
            e.isFunction(t.onRedraw) && t.onRedraw(n, this.internal, t);
        },
        _lazyLoad: function() {
            function u(t) {
                e(t).trigger("appear");
            }
            function a() {
                var t, r = e(i.unitElement);
                for (s = n.currentSlide; s < o; s += 1) {
                    t = r.eq(s);
                    t.length && t.find('img.lazy-slider:not([loaded="true"])').each(function() {
                        u(this);
                    });
                }
            }
            function f() {
                var t = 0;
                e(i.target).find('img.lazy-slider:not([loaded="true"])').each(function() {
                    e(this).trigger("appear");
                    t += 1;
                });
            }
            function l() {
                var n = e(i.target).offset().top, r = e(t).scrollTop() + e(t).height() + 600, s = !1;
                if (n < r) {
                    f();
                    s = !0;
                }
                return s;
            }
            var n = this.internal, r = this.instanceId, i = this.options, s, o = n.currentSlide + n.numVisibleUnits * 2;
            if (!0 === e.browser.msie && e.browser.version.substring(0, 2) === "8.") f(); else if (!1 === n.lazyloaded) {
                a();
                e(t).on("load", function() {
                    a();
                });
                i.dragEvents === !0 ? !1 === l() && e(t).on("scroll.tempevent" + r, function() {
                    !0 === l() && e(t).unbind("scroll.tempevent" + r);
                }) : e.each([ e(i.target), e(i.arrowLeft), e(i.arrowRight) ], function() {
                    var e = this;
                    e.on("mouseover.tempevent", function() {
                        f();
                        e.unbind(".tempevent");
                    });
                });
                n.lazyloaded = !0;
            }
        },
        redraw: function() {
            var t = this, n = this.internal, r = this.options, i = e(this.element);
            if (e(r.target).is(":visible") || e(r.target).not(":hidden")) {
                this.unitWidth === undefined && this._setUnitWidth();
                this._setTargetWidth();
                this._setArrowVisibility();
                e.isFunction(this.options.onRedraw) && t.options.onRedraw(i, n, r);
                r.lazyload === !0 && t._lazyLoad();
            }
        },
        getCurrentSlide: function() {
            return this.internal.currentSlide;
        },
        goToSlide: function(t, n) {
            var r = this, i = this.internal, s = this.options, o = e(s.target), u;
            n = n !== undefined ? n : !0;
            if (o.not(":hidden")) {
                this.unitWidth === undefined && this._setUnitWidth();
                s.unitWidth === "individual" ? u = e(s.unitElement).eq(t).data("responsiveCarousel").left : u = t * i.unitWidth * -1;
                i.busy = !0;
                n === !0 ? this._animate(o, {
                    left: u
                }, s.speed, function() {
                    i.busy = !1;
                    r._setArrowVisibility("goto slide");
                }) : o.css("left", u);
            }
        },
        toggleSlideShow: function() {
            var e = this.internal;
            !1 === e.slideShowActive ? this.startSlideShow() : this.stopSlideShow();
        },
        _step: function(t) {
            var n = this, r = this.internal, i = this.options, s = e(i.target), o = r.maskWidth, u = this._round(Math.floor(s.position().left)), a = u + t * r.unitWidth, f = u + r.targetWidth, l = f + t * r.unitWidth, c = a;
            if (r.slideBumped === !1) {
                if (i.infinite === !1) {
                    if (l <= o) {
                        c = a + o - l;
                        r.slideBumped = "left";
                    }
                    if (a >= 0) {
                        r.slideBumped = "right";
                        c = 0;
                    }
                }
            } else {
                "left" === r.slideBumped && (c = 0);
                "right" === r.slideBumped && (c = u + o - f);
                r.slideBumped = !1;
            }
            r.busy = !0;
            this._animate(s, {
                left: c
            }, i.speed, function() {
                r.busy = !1;
                n._setArrowVisibility("_step");
            });
        },
        startSlideShow: function() {
            var e = this, n = this.internal, r = this.options;
            if (!1 === n.slideShowActive) {
                n.slideShowActive = !0;
                n.slideTimer = t.setInterval(function() {
                    e._step(r.step);
                }, r.slideSpeed);
            }
        },
        stopSlideShow: function() {
            var e = this.internal;
            if (!0 === e.slideShowActive) {
                e.slideShowActive = !1;
                t.clearInterval(e.slideTimer);
            }
        },
        _destroy: function() {
            var i = e(this.options.target), s = e(this.options.mask);
            t.clearTimeout(this.internal.setWidthTimer);
            t.clearInterval(this.internal.slideTimer);
            t.clearTimeout(this.internal.scrollTimer);
            t.clearTimeout(this.internal.resizeTimer);
            t.cancelAnimationFrame(this.internal.dragTimer);
            e(t).unbind(this.instanceId);
            e(n).unbind(this.instanceId);
            e(this.options.arrowLeft).unbind(this.instanceId);
            e(this.options.arrowRight).unbind(this.instanceId);
            i.removeClass("instance-" + r);
            i.find("img").unbind(this.instanceId);
            this.internal.touchObject !== null && this.internal.touchObject.destroy();
            s.css({
                "-webkit-user-select": "",
                "-webkit-user-drag": "",
                "-webkit-tap-highlight-color": ""
            });
            i.replaceWith(this.internal.backup);
        },
        computeAdjust: function(t) {
            function d() {
                var t, i, o, u = 0, f = n.currentSlide, l = e(r.unitElement);
                t = -1 * s + n.maskWidth;
                i = n.numUnits;
                while (f < i) {
                    o = l.eq(f).data("responsiveCarousel");
                    if (t >= o.left && t <= o.right) {
                        a = s - (o.right - t);
                        n.currentSlide = f;
                        return;
                    }
                    u += o.width;
                    f += 1;
                }
                a = s;
            }
            function v() {
                var t, i, o = 0, u = n.currentSlide, f = e(r.unitElement);
                t = Math.abs(s);
                while (u >= 0) {
                    i = f.eq(u).data("responsiveCarousel");
                    if (t >= i.left && t <= i.right) {
                        a = s + i.width;
                        i.right > t && (a -= i.right + s);
                        n.currentSlide = u;
                        return;
                    }
                    o += i.width;
                    u -= 1;
                }
                a = s;
            }
            var n = this.internal, r = this.options, i = n.scrollStart.left, s = t.position().left, o, u = n.maskWidth, a = 0, f = n.nudgeDirection, l = n.unitWidth, c, h, p = !1;
            if (r.unitWidth === "individual") {
                if (f !== null) {
                    f === "left" && d();
                    f === "right" && v();
                    f === "abort" && (a = s);
                    s = a;
                    n.nudgeDirection = null;
                }
            } else if (f !== null) {
                f === "left" && (a = i - l);
                f === "right" && (a = i + l);
                f === "abort" && (a = s);
                s = a;
                n.nudgeDirection = null;
            }
            o = s + n.targetWidth;
            if (o < u) {
                a = s + u - o;
                s = a;
            }
            s > 0 && (s = a = 0);
            r.unitWidth !== "individual" && (a = this._round(s));
            isNaN(a) === !0 && (a = 0);
            return a;
        },
        getNumVisibleUnits: function() {
            return this.internal.numVisibleUnits;
        }
    });
})(jQuery, window, document);