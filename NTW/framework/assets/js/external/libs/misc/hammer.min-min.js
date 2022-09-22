/*
 * Hammer.JS
 * version 0.6.1
 * author: Eight Media
 * https://github.com/EightMedia/hammer.js
 */function Hammer(e, t, n) {
    function x(e) {
        return e.touches ? e.touches.length : 1;
    }
    function T(e) {
        e = e || window.event;
        if (!S) {
            var t = document, n = t.body;
            return [ {
                x: e.pageX || e.clientX + (t && t.scrollLeft || n && n.scrollLeft || 0) - (t && t.clientLeft || n && t.clientLeft || 0),
                y: e.pageY || e.clientY + (t && t.scrollTop || n && n.scrollTop || 0) - (t && t.clientTop || n && t.clientTop || 0)
            } ];
        }
        var r = [], i, s = e.touches.length > 0 ? e.touches : e.changedTouches;
        for (var o = 0, u = s.length; o < u; o++) {
            i = s[o];
            r.push({
                x: i.pageX,
                y: i.pageY
            });
        }
        return r;
    }
    function N(e, t) {
        return Math.atan2(t.y - e.y, t.x - e.x) * 180 / Math.PI;
    }
    function C(e, t) {
        if (e.length == 2 && t.length == 2) {
            var n, r;
            n = e[0].x - e[1].x;
            r = e[0].y - e[1].y;
            var i = Math.sqrt(n * n + r * r);
            n = t[0].x - t[1].x;
            r = t[0].y - t[1].y;
            var s = Math.sqrt(n * n + r * r);
            return s / i;
        }
        return 0;
    }
    function k(e, t) {
        if (e.length == 2 && t.length == 2) {
            var n, r;
            n = e[0].x - e[1].x;
            r = e[0].y - e[1].y;
            var i = Math.atan2(r, n) * 180 / Math.PI;
            n = t[0].x - t[1].x;
            r = t[0].y - t[1].y;
            var s = Math.atan2(r, n) * 180 / Math.PI;
            return s - i;
        }
        return 0;
    }
    function L(e, t) {
        t.touches = T(t.originalEvent);
        t.type = e;
        H(r["on" + e]) && r["on" + e].call(r, t);
    }
    function A(e) {
        if (!t.cancel_event) return;
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.returnValue = !1;
            e.cancelBubble = !0;
        }
    }
    function O() {
        a = {};
        l = !1;
        f = 0;
        s = 0;
        o = 0;
        c = null;
    }
    function _(n) {
        switch (n.type) {
          case "mousedown":
          case "touchstart":
            a.start = T(n);
            p = (new Date).getTime();
            f = x(n);
            l = !0;
            b = n;
            var r = e.getBoundingClientRect(), i = e.clientTop || document.body.clientTop || 0, d = e.clientLeft || document.body.clientLeft || 0, v = window.pageYOffset || e.scrollTop || document.body.scrollTop, m = window.pageXOffset || e.scrollLeft || document.body.scrollLeft;
            g = {
                top: r.top + v - i,
                left: r.left + m - d
            };
            y = !0;
            M.hold(n);
            t.prevent_default && A(n);
            break;
          case "mousemove":
          case "touchmove":
            if (!y) return !1;
            w = n;
            a.move = T(n);
            M.transform(n) || M.drag(n);
            break;
          case "mouseup":
          case "mouseout":
          case "touchcancel":
          case "touchend":
            if (!y || c != "transform" && n.touches && n.touches.length > 0) return !1;
            y = !1;
            E = n;
            var S = c == "drag";
            M.swipe(n);
            S ? L("dragend", {
                originalEvent: n,
                direction: u,
                distance: s,
                angle: o
            }) : c == "transform" ? L("transformend", {
                originalEvent: n,
                position: a.center,
                scale: C(a.start, a.move),
                rotation: k(a.start, a.move)
            }) : M.tap(b);
            h = c;
            L("release", {
                originalEvent: n,
                gesture: c
            });
            O();
        }
    }
    function D(e, t) {
        !t && window.event && window.event.toElement && (t = window.event.toElement);
        if (e === t) return !0;
        if (t) {
            var n = t.parentNode;
            while (n !== null) {
                if (n === e) return !0;
                n = n.parentNode;
            }
        }
        return !1;
    }
    function P(e, t) {
        var n = {};
        if (!t) return e;
        for (var r in e) r in t ? n[r] = t[r] : n[r] = e[r];
        return n;
    }
    function H(e) {
        return Object.prototype.toString.call(e) == "[object Function]";
    }
    function B(e, t, n) {
        t = t.split(" ");
        for (var r = 0, i = t.length; r < i; r++) e.addEventListener ? e.addEventListener(t[r], n, !1) : document.attachEvent && e.attachEvent("on" + t[r], n);
    }
    var r = this, i = {
        prevent_default: !1,
        css_hacks: !0,
        cancel_event: !0,
        swipe: !0,
        swipe_time: 200,
        swipe_min_distance: 20,
        drag: !0,
        drag_vertical: !0,
        drag_horizontal: !0,
        drag_min_distance: 20,
        transform: !0,
        scale_treshold: .1,
        rotation_treshold: 15,
        tap: !0,
        tap_double: !0,
        tap_max_interval: 300,
        tap_max_distance: 10,
        tap_double_distance: 20,
        hold: !0,
        hold_timeout: 500
    };
    t = P(i, t);
    (function() {
        if (!t.css_hacks) return !1;
        var n = [ "webkit", "moz", "ms", "o", "" ], r = {
            userSelect: "none",
            touchCallout: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }, i = "";
        for (var s = 0; s < n.length; s++) for (var o in r) {
            i = o;
            n[s] && (i = n[s] + i.substring(0, 1).toUpperCase() + i.substring(1));
            e.style[i] = r[o];
        }
    })();
    var s = 0, o = 0, u = 0, a = {}, f = 0, l = !1, c = null, h = null, p = null, d = {
        x: 0,
        y: 0
    }, v = null, m = null, g = {}, y = !1, b, w, E, S = "ontouchstart" in window;
    this.option = function(e, r) {
        r != n && (t[e] = r);
        return t[e];
    };
    this.getDirectionFromAngle = function(e) {
        var t = {
            down: e >= 45 && e < 135,
            left: e >= 135 || e <= -135,
            up: e < -45 && e > -135,
            right: e >= -45 && e <= 45
        }, n, r;
        for (r in t) if (t[r]) {
            n = r;
            break;
        }
        return n;
    };
    var M = {
        hold: function(e) {
            if (t.hold) {
                c = "hold";
                clearTimeout(m);
                m = setTimeout(function() {
                    c == "hold" && L("hold", {
                        originalEvent: e,
                        position: a.start
                    });
                }, t.hold_timeout);
            }
        },
        swipe: function(e) {
            if (!a.move) return;
            var n = a.move[0].x - a.start[0].x, i = a.move[0].y - a.start[0].y;
            s = Math.sqrt(n * n + i * i);
            var f = (new Date).getTime(), l = f - p;
            if (t.swipe && t.swipe_time > l && s > t.swipe_min_distance) {
                o = N(a.start[0], a.move[0]);
                u = r.getDirectionFromAngle(o);
                c = "swipe";
                var h = {
                    x: a.move[0].x - g.left,
                    y: a.move[0].y - g.top
                }, d = {
                    originalEvent: e,
                    position: h,
                    direction: u,
                    distance: s,
                    distanceX: n,
                    distanceY: i,
                    angle: o
                };
                L("swipe", d);
            }
        },
        drag: function(e) {
            var n = a.move[0].x - a.start[0].x, i = a.move[0].y - a.start[0].y;
            s = Math.sqrt(n * n + i * i);
            if (t.drag && s > t.drag_min_distance || c == "drag") {
                o = N(a.start[0], a.move[0]);
                u = r.getDirectionFromAngle(o);
                var f = u == "up" || u == "down";
                if ((f && !t.drag_vertical || !f && !t.drag_horizontal) && s > t.drag_min_distance) return;
                var h = N(a.interim || a.start[0], a.move[0]), p = r.getDirectionFromAngle(h);
                a.interim = a.move[0];
                c = "drag";
                var d = {
                    x: a.move[0].x - g.left,
                    y: a.move[0].y - g.top
                }, v = {
                    originalEvent: e,
                    position: d,
                    direction: u,
                    distance: s,
                    distanceX: n,
                    distanceY: i,
                    angle: o,
                    interim_angle: h,
                    interim_direction: p
                };
                if (l) {
                    L("dragstart", v);
                    l = !1;
                }
                L("drag", v);
                A(e);
            }
        },
        transform: function(e) {
            if (t.transform) {
                if (x(e) != 2) return !1;
                var n = k(a.start, a.move), r = C(a.start, a.move);
                if (c != "drag" && (c == "transform" || Math.abs(1 - r) > t.scale_treshold || Math.abs(n) > t.rotation_treshold)) {
                    c = "transform";
                    a.center = {
                        x: (a.move[0].x + a.move[1].x) / 2 - g.left,
                        y: (a.move[0].y + a.move[1].y) / 2 - g.top
                    };
                    var i = {
                        originalEvent: e,
                        position: a.center,
                        scale: r,
                        rotation: n
                    };
                    if (l) {
                        L("transformstart", i);
                        l = !1;
                    }
                    L("transform", i);
                    A(e);
                    return !0;
                }
            }
            return !1;
        },
        tap: function(e) {
            var n = (new Date).getTime(), r = n - p;
            if (t.hold && !(t.hold && t.hold_timeout > r)) return;
            var i = function() {
                if (d && t.tap_double && h == "tap" && p - v < t.tap_max_interval) {
                    var e = Math.abs(d[0].x - a.start[0].x), n = Math.abs(d[0].y - a.start[0].y);
                    return d && a.start && Math.max(e, n) < t.tap_double_distance;
                }
                return !1;
            }();
            if (i) {
                c = "double_tap";
                v = null;
                L("doubletap", {
                    originalEvent: e,
                    position: a.start
                });
                A(e);
            } else {
                var o = a.move ? Math.abs(a.move[0].x - a.start[0].x) : 0, u = a.move ? Math.abs(a.move[0].y - a.start[0].y) : 0;
                s = Math.max(o, u);
                if (s < t.tap_max_distance) {
                    c = "tap";
                    v = n;
                    d = a.start;
                    if (t.tap) {
                        L("tap", {
                            originalEvent: e,
                            position: a.start
                        });
                        A(e);
                    }
                }
            }
        }
    };
    if (S) B(e, "touchstart touchmove touchend touchcancel", _); else {
        B(e, "mouseup mousedown mousemove", _);
        B(e, "mouseout", function(t) {
            D(e, t.relatedTarget) || _(t);
        });
    }
};