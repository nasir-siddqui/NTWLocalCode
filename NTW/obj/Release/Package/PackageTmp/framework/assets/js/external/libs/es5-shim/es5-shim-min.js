// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab
// Module systems magic dance
(function(e) {
    typeof define == "function" ? define(e) : typeof YUI == "function" ? YUI.add("es5", e) : e();
})(function() {
    function e() {}
    function A(e) {
        e = +e;
        e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e)));
        return e;
    }
    function O(e) {
        var t = typeof e;
        return e === null || t === "undefined" || t === "boolean" || t === "number" || t === "string";
    }
    function M(e) {
        var t, n, r;
        if (O(e)) return e;
        n = e.valueOf;
        if (typeof n == "function") {
            t = n.call(e);
            if (O(t)) return t;
        }
        r = e.toString;
        if (typeof r == "function") {
            t = r.call(e);
            if (O(t)) return t;
        }
        throw new TypeError;
    }
    Function.prototype.bind || (Function.prototype.bind = function(n) {
        var r = this;
        if (typeof r != "function") throw new TypeError("Function.prototype.bind called on incompatible " + r);
        var s = i.call(arguments, 1), o = function() {
            if (this instanceof o) {
                var e = r.apply(this, s.concat(i.call(arguments)));
                return Object(e) === e ? e : this;
            }
            return r.apply(n, s.concat(i.call(arguments)));
        };
        if (r.prototype) {
            e.prototype = r.prototype;
            o.prototype = new e;
            e.prototype = null;
        }
        return o;
    });
    var t = Function.prototype.call, n = Array.prototype, r = Object.prototype, i = n.slice, s = t.bind(r.toString), o = t.bind(r.hasOwnProperty), u, a, f, l, c;
    if (c = o(r, "__defineGetter__")) {
        u = t.bind(r.__defineGetter__);
        a = t.bind(r.__defineSetter__);
        f = t.bind(r.__lookupGetter__);
        l = t.bind(r.__lookupSetter__);
    }
    if ([ 1, 2 ].splice(0).length != 2) {
        var h = Array.prototype.splice;
        !function() {
            function e(e) {
                var t = [];
                while (e--) t.unshift(e);
                return t;
            }
            var t = [], n;
            t.splice.bind(t, 0, 0).apply(null, e(20));
            t.splice.bind(t, 0, 0).apply(null, e(26));
            n = t.length;
            t.splice(5, 0, "XXX");
            if (n + 1 == t.length) return !0;
        }() ? Array.prototype.splice = function(e, t) {
            var n, r = i.call(arguments, 2), s = r.length;
            if (!arguments.length) return [];
            e === void 0 && (e = 0);
            t === void 0 && (t = this.length - e);
            if (s > 0) {
                if (t <= 0) {
                    if (e == this.length) {
                        this.push.apply(this, r);
                        return [];
                    }
                    if (e == 0) {
                        this.unshift.apply(this, r);
                        return [];
                    }
                }
                n = i.call(this, e, e + t);
                r.push.apply(r, i.call(this, e + t, this.length));
                r.unshift.apply(r, i.call(this, 0, e));
                r.unshift(0, this.length);
                h.apply(this, r);
                return n;
            }
            return h.call(this, e, t);
        } : Array.prototype.splice = function(e, t) {
            return arguments.length ? h.apply(this, [ e === void 0 ? 0 : e, t === void 0 ? this.length - e : t ].concat(i.call(arguments, 2))) : [];
        };
    }
    if ([].unshift(0) != 1) {
        var p = Array.prototype.unshift;
        Array.prototype.unshift = function() {
            p.apply(this, arguments);
            return this.length;
        };
    }
    Array.isArray || (Array.isArray = function(t) {
        return s(t) == "[object Array]";
    });
    var d = Object("a"), v = d[0] != "a" || !(0 in d);
    Array.prototype.forEach || (Array.prototype.forEach = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = arguments[1], o = -1, u = r.length >>> 0;
        if (s(t) != "[object Function]") throw new TypeError;
        while (++o < u) o in r && t.call(i, r[o], o, n);
    });
    Array.prototype.map || (Array.prototype.map = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, o = Array(i), u = arguments[1];
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        for (var a = 0; a < i; a++) a in r && (o[a] = t.call(u, r[a], a, n));
        return o;
    });
    Array.prototype.filter || (Array.prototype.filter = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, o = [], u, a = arguments[1];
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        for (var f = 0; f < i; f++) if (f in r) {
            u = r[f];
            t.call(a, u, f, n) && o.push(u);
        }
        return o;
    });
    Array.prototype.every || (Array.prototype.every = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, o = arguments[1];
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        for (var u = 0; u < i; u++) if (u in r && !t.call(o, r[u], u, n)) return !1;
        return !0;
    });
    Array.prototype.some || (Array.prototype.some = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, o = arguments[1];
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        for (var u = 0; u < i; u++) if (u in r && t.call(o, r[u], u, n)) return !0;
        return !1;
    });
    Array.prototype.reduce || (Array.prototype.reduce = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1) throw new TypeError("reduce of empty array with no initial value");
        var o = 0, u;
        if (arguments.length >= 2) u = arguments[1]; else do {
            if (o in r) {
                u = r[o++];
                break;
            }
            if (++o >= i) throw new TypeError("reduce of empty array with no initial value");
        } while (!0);
        for (; o < i; o++) o in r && (u = t.call(void 0, u, r[o], o, n));
        return u;
    });
    Array.prototype.reduceRight || (Array.prototype.reduceRight = function(t) {
        var n = _(this), r = v && s(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (s(t) != "[object Function]") throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1) throw new TypeError("reduceRight of empty array with no initial value");
        var o, u = i - 1;
        if (arguments.length >= 2) o = arguments[1]; else do {
            if (u in r) {
                o = r[u--];
                break;
            }
            if (--u < 0) throw new TypeError("reduceRight of empty array with no initial value");
        } while (!0);
        if (u < 0) return o;
        do u in this && (o = t.call(void 0, o, r[u], u, n)); while (u--);
        return o;
    });
    if (!Array.prototype.indexOf || [ 0, 1 ].indexOf(1, 2) != -1) Array.prototype.indexOf = function(t) {
        var n = v && s(this) == "[object String]" ? this.split("") : _(this), r = n.length >>> 0;
        if (!r) return -1;
        var i = 0;
        arguments.length > 1 && (i = A(arguments[1]));
        i = i >= 0 ? i : Math.max(0, r + i);
        for (; i < r; i++) if (i in n && n[i] === t) return i;
        return -1;
    };
    if (!Array.prototype.lastIndexOf || [ 0, 1 ].lastIndexOf(0, -3) != -1) Array.prototype.lastIndexOf = function(t) {
        var n = v && s(this) == "[object String]" ? this.split("") : _(this), r = n.length >>> 0;
        if (!r) return -1;
        var i = r - 1;
        arguments.length > 1 && (i = Math.min(i, A(arguments[1])));
        i = i >= 0 ? i : r - Math.abs(i);
        for (; i >= 0; i--) if (i in n && t === n[i]) return i;
        return -1;
    };
    if (!Object.keys) {
        var m = !0, g = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], y = g.length;
        for (var b in {
            toString: null
        }) m = !1;
        Object.keys = function D(e) {
            if (typeof e != "object" && typeof e != "function" || e === null) throw new TypeError("Object.keys called on a non-object");
            var D = [];
            for (var t in e) o(e, t) && D.push(t);
            if (m) for (var n = 0, r = y; n < r; n++) {
                var i = g[n];
                o(e, i) && D.push(i);
            }
            return D;
        };
    }
    var w = -621987552e5, E = "-000001";
    if (!Date.prototype.toISOString || (new Date(w)).toISOString().indexOf(E) === -1) Date.prototype.toISOString = function() {
        var t, n, r, i, s;
        if (!isFinite(this)) throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        i = this.getUTCFullYear();
        s = this.getUTCMonth();
        i += Math.floor(s / 12);
        s = (s % 12 + 12) % 12;
        t = [ s + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds() ];
        i = (i < 0 ? "-" : i > 9999 ? "+" : "") + ("00000" + Math.abs(i)).slice(0 <= i && i <= 9999 ? -4 : -6);
        n = t.length;
        while (n--) {
            r = t[n];
            r < 10 && (t[n] = "0" + r);
        }
        return i + "-" + t.slice(0, 2).join("-") + "T" + t.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    };
    var S = !1;
    try {
        S = Date.prototype.toJSON && (new Date(NaN)).toJSON() === null && (new Date(w)).toJSON().indexOf(E) !== -1 && Date.prototype.toJSON.call({
            toISOString: function() {
                return !0;
            }
        });
    } catch (x) {}
    S || (Date.prototype.toJSON = function(t) {
        var n = Object(this), r = M(n), i;
        if (typeof r == "number" && !isFinite(r)) return null;
        i = n.toISOString;
        if (typeof i != "function") throw new TypeError("toISOString property is not callable");
        return i.call(n);
    });
    if (!Date.parse || "Date.parse is buggy") Date = function(e) {
        function t(n, r, i, s, o, u, a) {
            var f = arguments.length;
            if (this instanceof e) {
                var l = f == 1 && String(n) === n ? new e(t.parse(n)) : f >= 7 ? new e(n, r, i, s, o, u, a) : f >= 6 ? new e(n, r, i, s, o, u) : f >= 5 ? new e(n, r, i, s, o) : f >= 4 ? new e(n, r, i, s) : f >= 3 ? new e(n, r, i) : f >= 2 ? new e(n, r) : f >= 1 ? new e(n) : new e;
                l.constructor = t;
                return l;
            }
            return e.apply(this, arguments);
        }
        function i(e, t) {
            var n = t > 1 ? 1 : 0;
            return r[t] + Math.floor((e - 1969 + n) / 4) - Math.floor((e - 1901 + n) / 100) + Math.floor((e - 1601 + n) / 400) + 365 * (e - 1970);
        }
        function s(t) {
            return Number(new e(1970, 0, 1, 0, 0, 0, t));
        }
        var n = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"), r = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 ];
        for (var o in e) t[o] = e[o];
        t.now = e.now;
        t.UTC = e.UTC;
        t.prototype = e.prototype;
        t.prototype.constructor = t;
        t.parse = function(r) {
            var o = n.exec(r);
            if (o) {
                var u = Number(o[1]), a = Number(o[2] || 1) - 1, f = Number(o[3] || 1) - 1, l = Number(o[4] || 0), c = Number(o[5] || 0), h = Number(o[6] || 0), p = Math.floor(Number(o[7] || 0) * 1e3), d = Boolean(o[4] && !o[8]), v = o[9] === "-" ? 1 : -1, m = Number(o[10] || 0), g = Number(o[11] || 0), y;
                if (l < (c > 0 || h > 0 || p > 0 ? 24 : 25) && c < 60 && h < 60 && p < 1e3 && a > -1 && a < 12 && m < 24 && g < 60 && f > -1 && f < i(u, a + 1) - i(u, a)) {
                    y = ((i(u, a) + f) * 24 + l + m * v) * 60;
                    y = ((y + c + g * v) * 60 + h) * 1e3 + p;
                    d && (y = s(y));
                    if (-864e13 <= y && y <= 864e13) return y;
                }
                return NaN;
            }
            return e.parse.apply(this, arguments);
        };
        return t;
    }(Date);
    Date.now || (Date.now = function() {
        return (new Date).getTime();
    });
    (!Number.prototype.toFixed || 8e-5.toFixed(3) !== "0.000" || .9.toFixed(0) === "0" || 1.255.toFixed(2) !== "1.25" || 0xde0b6b3a7640080.toFixed(0) !== "1000000000000000128") && function() {
        function i(r, i) {
            var s = -1;
            while (++s < t) {
                i += r * n[s];
                n[s] = i % e;
                i = Math.floor(i / e);
            }
        }
        function s(r) {
            var i = t, s = 0;
            while (--i >= 0) {
                s += n[i];
                n[i] = Math.floor(s / r);
                s = s % r * e;
            }
        }
        function o() {
            var e = t, r = "";
            while (--e >= 0) if (r !== "" || e === 0 || n[e] !== 0) {
                var i = String(n[e]);
                r === "" ? r = i : r += "0000000".slice(0, 7 - i.length) + i;
            }
            return r;
        }
        function u(e, t, n) {
            return t === 0 ? n : t % 2 === 1 ? u(e, t - 1, n * e) : u(e * e, t / 2, n);
        }
        function a(e) {
            var t = 0;
            while (e >= 4096) {
                t += 12;
                e /= 4096;
            }
            while (e >= 2) {
                t += 1;
                e /= 2;
            }
            return t;
        }
        var e, t, n, r;
        e = 1e7;
        t = 6;
        n = [ 0, 0, 0, 0, 0, 0 ];
        Number.prototype.toFixed = function(e) {
            var t, n, r, f, l, c, h, p;
            t = Number(e);
            t = t !== t ? 0 : Math.floor(t);
            if (t < 0 || t > 20) throw new RangeError("Number.toFixed called with invalid number of decimals");
            n = Number(this);
            if (n !== n) return "NaN";
            if (n <= -1e21 || n >= 1e21) return String(n);
            r = "";
            if (n < 0) {
                r = "-";
                n = -n;
            }
            f = "0";
            if (n > 1e-21) {
                l = a(n * u(2, 69, 1)) - 69;
                c = l < 0 ? n * u(2, -l, 1) : n / u(2, l, 1);
                c *= 4503599627370496;
                l = 52 - l;
                if (l > 0) {
                    i(0, c);
                    h = t;
                    while (h >= 7) {
                        i(1e7, 0);
                        h -= 7;
                    }
                    i(u(10, h, 1), 0);
                    h = l - 1;
                    while (h >= 23) {
                        s(1 << 23);
                        h -= 23;
                    }
                    s(1 << h);
                    i(1, 1);
                    s(2);
                    f = o();
                } else {
                    i(0, c);
                    i(1 << -l, 0);
                    f = o() + "0.00000000000000000000".slice(2, 2 + t);
                }
            }
            if (t > 0) {
                p = f.length;
                p <= t ? f = r + "0.0000000000000000000".slice(0, t - p + 2) + f : f = r + f.slice(0, p - t) + "." + f.slice(p - t);
            } else f = r + f;
            return f;
        };
    }();
    var T = String.prototype.split;
    "ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || "tesst".split(/(s)*/)[1] === "t" || "".split(/.?/).length === 0 || ".".split(/()()/).length > 1 ? function() {
        var e = /()??/.exec("")[1] === void 0;
        String.prototype.split = function(t, n) {
            var r = this;
            if (t === void 0 && n === 0) return [];
            if (Object.prototype.toString.call(t) !== "[object RegExp]") return T.apply(this, arguments);
            var i = [], s = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.extended ? "x" : "") + (t.sticky ? "y" : ""), o = 0, t = new RegExp(t.source, s + "g"), u, a, f, l;
            r += "";
            e || (u = new RegExp("^" + t.source + "$(?!\\s)", s));
            n = n === void 0 ? -1 >>> 0 : n >>> 0;
            while (a = t.exec(r)) {
                f = a.index + a[0].length;
                if (f > o) {
                    i.push(r.slice(o, a.index));
                    !e && a.length > 1 && a[0].replace(u, function() {
                        for (var e = 1; e < arguments.length - 2; e++) arguments[e] === void 0 && (a[e] = void 0);
                    });
                    a.length > 1 && a.index < r.length && Array.prototype.push.apply(i, a.slice(1));
                    l = a[0].length;
                    o = f;
                    if (i.length >= n) break;
                }
                t.lastIndex === a.index && t.lastIndex++;
            }
            o === r.length ? (l || !t.test("")) && i.push("") : i.push(r.slice(o));
            return i.length > n ? i.slice(0, n) : i;
        };
    }() : "0".split(void 0, 0).length && (String.prototype.split = function(e, t) {
        return e === void 0 && t === 0 ? [] : T.apply(this, arguments);
    });
    if ("".substr && "0b".substr(-1) !== "b") {
        var N = String.prototype.substr;
        String.prototype.substr = function(e, t) {
            return N.call(this, e < 0 ? (e = this.length + e) < 0 ? 0 : e : e, t);
        };
    }
    var C = "	\n\f\r   ᠎             　\u2028\u2029﻿";
    if (!String.prototype.trim || C.trim()) {
        C = "[" + C + "]";
        var k = new RegExp("^" + C + C + "*"), L = new RegExp(C + C + "*$");
        String.prototype.trim = function() {
            if (this === void 0 || this === null) throw new TypeError("can't convert " + this + " to object");
            return String(this).replace(k, "").replace(L, "");
        };
    }
    var _ = function(e) {
        if (e == null) throw new TypeError("can't convert " + e + " to object");
        return Object(e);
    };
});