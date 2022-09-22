typeof jQuery != "undefined" && function(e) {
    var t = {
        xdomain: "*",
        ie: navigator.userAgent.toLowerCase().indexOf("msie") > -1,
        scrollToTop: !0
    }, n = {
        init: function() {
            return this.each(function(n) {
                var i = e(this);
                window.postMessage ? window.addEventListener ? window.addEventListener("message", function(e) {
                    r.messageHandler(i, e);
                }, !1) : window.attachEvent && window.attachEvent("onmessage", function(e) {
                    r.messageHandler(i, e);
                }, i) : setInterval(function() {
                    var e = window.location.hash, n = e.match(/^#h(\d+)(s?)$/);
                    if (n) {
                        r.setHeight(i, n[1]);
                        t.scrollToTop && n[2] === "s" && scroll(0, 0);
                    }
                }, 150);
            });
        }
    }, r = {
        messageHandler: function(e, n) {
            var i, s, o, u;
            if (t.xdomain !== "*") {
                var a = new RegExp(t.xdomain + "$");
                if (n.origin == "null") throw new Error("messageHandler( elem, e): There is no origin.  You are viewing the page from your file system.  Please run through a web server.");
                if (!n.origin.match(a)) throw new Error("messageHandler( elem, e): The orgin doesn't match the responsiveiframe  xdomain.");
                o = !0;
            }
            if (t.xdomain === "*" || o) {
                u = n.data + "";
                s = u.match(/^(\d+)(s?)$/);
                if (s && s.length === 3) {
                    i = parseInt(s[1], 10);
                    if (!isNaN(i)) try {
                        r.setHeight(e, i);
                    } catch (f) {}
                    t.scrollToTop && s[2] === "s" && scroll(0, 0);
                }
            }
        },
        setHeight: function(e, t) {
            e.css("height", t + "px");
        },
        getDocHeight: function() {
            var e = document;
            return Math.min(Math.max(e.body.scrollHeight, e.documentElement.scrollHeight), Math.max(e.body.offsetHeight, e.documentElement.offsetHeight), Math.max(e.body.clientHeight, e.documentElement.clientHeight));
        }
    };
    e.fn.responsiveIframe = function(r) {
        if (n[r]) return n[r].apply(this, Array.prototype.slice.call(arguments, 1));
        if (typeof r == "object" || !r) {
            e.extend(t, arguments[0]);
            return n.init.apply(this);
        }
        e.error("Method " + r + " does not exist on jQuery.responsiveIframe");
    };
}(jQuery);

(function() {
    function r() {
        return new n;
    }
    var e, t, n = function() {
        e = this;
    };
    n.prototype.allowResponsiveEmbedding = function() {
        if (window.addEventListener) {
            window.addEventListener("click", e.messageParent, !1);
            window.addEventListener("load", e.messageParent, !1);
            window.addEventListener("resize", e.messageParent, !1);
        } else if (window.attachEvent) {
            window.attachEvent("click", e.messageParent);
            window.attachEvent("onload", e.messageParent);
            window.attachEvent("onresize", e.messageParent);
        }
    };
    n.prototype.messageParent = function(e) {
        var t = document.body.offsetHeight;
        t = e ? t + "s" : t;
        top.postMessage ? top.postMessage(t, "*") : window.location.hash = "h" + t;
    };
    "undefined" == typeof exports ? window.responsiveIframe = r : t.exports.responsiveIframe = r;
})();