/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2012, Licensed GPL & MIT
 *
*//*Attention: This is changed from original script, added event for pause on mouseover. */window.Swipe = function(e, t) {
    var n = this;
    if (!e) return;
    this.container = e;
    this.element = this.container.children[0];
    this.browser = {
        touch: function() {
            return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
        }(),
        transitions: function() {
            var e = document.createElement("swipe"), t = [ "perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective" ];
            for (var n in t) if (e.style[t[n]] !== undefined) return !0;
            return !1;
        }()
    };
    t = t || {};
    this.index = t.startSlide || 0;
    this.speed = t.speed || 300;
    this.callback = t.callback || function() {};
    this.transitionEnd = t.transitionEnd || function() {};
    this.delay = t.auto || 0;
    this.cont = t.continuous != undefined ? !!t.continuous : !0;
    this.disableScroll = !!t.disableScroll;
    this.index = parseInt(this.index, 10);
    this.setup();
    this.begin();
    if (this.element.addEventListener) {
        if (!this.browser.touch) {
            this.element.addEventListener("mouseover", this, !1);
            this.element.addEventListener("mouseleave", this, !1);
        } else {
            this.element.addEventListener("touchstart", this, !1);
            this.element.addEventListener("touchmove", this, !1);
            this.element.addEventListener("touchend", this, !1);
        }
        if (!!this.browser.transitions) {
            this.element.addEventListener("webkitTransitionEnd", this, !1);
            this.element.addEventListener("msTransitionEnd", this, !1);
            this.element.addEventListener("oTransitionEnd", this, !1);
            this.element.addEventListener("transitionend", this, !1);
        }
        window.addEventListener("resize", this, !1);
    } else window.onresize = function() {
        n.setup();
    };
};

Swipe.prototype = {
    setup: function() {
        this.slides = this.element.children;
        this.length = this.slides.length;
        this.cache = new Array(this.length);
        if (this.length < 1) return;
        this.width = this.container.getBoundingClientRect().width || this.container.offsetWidth;
        if (!this.width) return;
        var e = [ [], [], [] ];
        this.element.style.width = this.slides.length * this.width + "px";
        for (var t = this.length - 1; t > -1; t--) {
            var n = this.slides[t];
            n.style.width = this.width + "px";
            n.setAttribute("data-index", t);
            this.browser.transitions && (n.style.left = t * -this.width + "px");
            e[this.index > t ? 0 : this.index < t ? 2 : 1].push(t);
        }
        if (this.browser.transitions) {
            this._stack(e[0], -1);
            this._stack(e[1], 0);
            this._stack(e[2], 1);
        }
        this.container.style.visibility = "visible";
    },
    kill: function() {
        this.delay = 0;
        clearTimeout(this.interval);
        var e = [];
        for (var t = this.slides.length - 1; t >= 0; t--) {
            this.slides[t].style.width = "";
            e.push(t);
        }
        this._stack(e, 0);
        var n = this.element;
        n.className = n.className.replace("swipe-active", "");
        if (this.element.removeEventListener) {
            if (!this.browser.touch) {
                this.element.removeEventListener("mouseover", this, !1);
                this.element.removeEventListener("mouseout", this, !1);
            } else {
                this.element.removeEventListener("touchstart", this, !1);
                this.element.removeEventListener("touchmove", this, !1);
                this.element.removeEventListener("touchend", this, !1);
            }
            if (!!this.browser.transitions) {
                this.element.removeEventListener("webkitTransitionEnd", this, !1);
                this.element.removeEventListener("msTransitionEnd", this, !1);
                this.element.removeEventListener("oTransitionEnd", this, !1);
                this.element.removeEventListener("transitionend", this, !1);
            }
            window.removeEventListener("resize", this.resize, !1);
        } else window.onresize = null;
    },
    getPos: function() {
        return this.index;
    },
    prev: function(e) {
        clearTimeout(this.interval);
        this.delay = e || 0;
        this.index ? this.slide(this.index - 1, this.speed) : this.cont && this.slide(this.length - 1, this.speed);
    },
    next: function(e) {
        clearTimeout(this.interval);
        this.delay = e || 0;
        this.index < this.length - 1 ? this.slide(this.index + 1, this.speed) : this.cont && this.slide(0, this.speed);
    },
    pause: function() {
        clearTimeout(this.interval);
    },
    begin: function() {
        var e = this;
        this.interval = this.delay ? setTimeout(function() {
            e.next(e.delay);
        }, this.delay) : 0;
    },
    handleEvent: function(e) {
        switch (e.type) {
          case "mouseover":
            this.pause();
            break;
          case "mouseleave":
            this.begin();
            break;
          case "touchstart":
            this.onTouchStart(e);
            break;
          case "touchmove":
            this.onTouchMove(e);
            break;
          case "touchend":
            this.onTouchEnd(e);
            break;
          case "webkitTransitionEnd":
          case "msTransitionEnd":
          case "oTransitionEnd":
          case "transitionend":
            this.onTransitionEnd(e);
            break;
          case "resize":
            this.setup();
        }
    },
    onTouchStart: function(e) {
        var t = this;
        t.start = {
            pageX: e.touches[0].pageX,
            pageY: e.touches[0].pageY,
            time: Number(new Date)
        };
        t.isScrolling = undefined;
        t.deltaX = 0;
    },
    onTouchMove: function(e) {
        var t = this;
        if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
        t.deltaX = e.touches[0].pageX - t.start.pageX;
        typeof t.isScrolling == "undefined" && (t.isScrolling = !!(t.isScrolling || Math.abs(t.deltaX) < Math.abs(e.touches[0].pageY - t.start.pageY)));
        if (!t.isScrolling) {
            e.preventDefault();
            t.delay = 0;
            clearTimeout(t.interval);
            t.deltaX = t.deltaX / (!t.index && t.deltaX > 0 || t.index == t.length - 1 && t.deltaX < 0 ? Math.abs(t.deltaX) / t.width + 1 : 1);
            t._move([ t.index - 1, t.index, t.index + 1 ], t.deltaX);
        } else t.disableScroll && e.preventDefault();
    },
    onTouchEnd: function(e) {
        var t = this, n = Number(new Date) - t.start.time < 250 && Math.abs(t.deltaX) > 20 || Math.abs(t.deltaX) > t.width / 2, r = !t.index && t.deltaX > 0 || t.index == t.length - 1 && t.deltaX < 0, i = t.deltaX < 0;
        if (!t.isScrolling) if (n && !r) {
            if (i) {
                t._stack([ t.index - 1 ], -1);
                t._slide([ t.index, t.index + 1 ], -t.width, t.speed);
                t.index += 1;
            } else {
                t._stack([ t.index + 1 ], 1);
                t._slide([ t.index - 1, t.index ], t.width, t.speed);
                t.index += -1;
            }
            t.callback(t.index, t.slides[t.index]);
        } else t._slide([ t.index - 1, t.index, t.index + 1 ], 0, t.speed);
    },
    onTransitionEnd: function(e) {
        if (this._getElemIndex(e.target) == this.index) {
            this.delay && this.begin();
            this.transitionEnd(this.index, this.slides[this.index]);
        }
    },
    slide: function(e, t) {
        clearTimeout(this.interval);
        var n = this.index;
        if (n == e) return;
        if (this.browser.transitions) {
            var r = Math.abs(n - e) - 1, i = Math.abs(n - e) / (n - e), s = [];
            while (r--) s.push((e > n ? e : n) - r - 1);
            this._stack(s, i);
            this._slide([ n, e ], this.width * i, this.speed);
        } else this._animate(n * -this.width, e * -this.width, this.speed);
        this.index = e;
        this.callback(this.index, this.slides[this.index]);
    },
    _slide: function(e, t, n) {
        clearTimeout(this.interval);
        var r = this.slides, i = e.length;
        while (i--) {
            this._translate(r[e[i]], t + this.cache[e[i]], n ? n : 0);
            this.cache[e[i]] += t;
        }
    },
    _stack: function(e, t) {
        var n = this.slides, r = e.length, i = this.width * t;
        while (r--) {
            this._translate(n[e[r]], i, 0);
            this.cache[e[r]] = i;
        }
    },
    _move: function(e, t) {
        var n = this.slides, r = e.length;
        while (r--) this._translate(n[e[r]], t + this.cache[e[r]], 0);
    },
    _translate: function(e, t, n) {
        if (!e) return;
        var r = e.style;
        r.webkitTransitionDuration = r.MozTransitionDuration = r.msTransitionDuration = r.OTransitionDuration = r.transitionDuration = n + "ms";
        r.webkitTransform = "translate3d(" + t + "px,0,0)";
        r.msTransform = r.MozTransform = r.OTransform = "translateX(" + t + "px)";
    },
    _animate: function(e, t, n) {
        var r = this.element;
        if (!n) {
            r.style.left = t + "px";
            return;
        }
        var i = this, s = new Date, o = setInterval(function() {
            var u = new Date - s;
            if (u > n) {
                r.style.left = t + "px";
                if (i._getElemIndex(r) == i.index) {
                    i.delay && i.begin();
                    i.transitionEnd(i.index, i.slides[i.index]);
                }
                clearInterval(o);
                return;
            }
            r.style.left = (t - e) * (Math.floor(u / n * 100) / 100) + e + "px";
        }, 4);
    },
    _getElemIndex: function(e) {
        return parseInt(e.getAttribute("data-index"), 10);
    }
};

(window.jQuery || window.Zepto) && function(e) {
    e.fn.Swipe = function(t) {
        return this.each(function() {
            var n = e(this);
            n.data("Swipe", new Swipe(n[0], t));
        });
    };
}(window.jQuery || window.Zepto);