var getOffset = function(e) {
    var t = 0, n = 0;
    while (e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop)) {
        t += e.offsetLeft - e.scrollLeft;
        n += e.offsetTop - e.scrollTop;
        e = e.offsetParent;
    }
    return {
        top: n,
        left: t
    };
};

Array.prototype.equals = function(e, t) {
    if (!e) return !1;
    arguments.length == 1 && (t = !0);
    if (this.length != e.length) return !1;
    for (var n = 0; n < this.length; n++) if (this[n] instanceof Array && e[n] instanceof Array) {
        if (!this[n].equals(e[n], t)) return !1;
    } else {
        if (t && this[n] != e[n]) return !1;
        if (!t) return this.sort().equals(e.sort(), !0);
    }
    return !0;
};

var removeSpaces = function(e) {
    e = e.replace(/\s/g, "-");
    return e;
}, cleanContent = function(e) {
    if (e != null) {
        e = e.toLowerCase();
        e = e.replaceAll("å", "a");
        e = e.replaceAll("ä", "a");
        e = e.replaceAll("ö", "o");
        e = removeSpaces(e);
    }
    return e;
};

String.prototype.replaceAll = function(e, t) {
    if (e === t) return this;
    var n = this, r = n.indexOf(e);
    while (r !== -1) {
        n = n.replace(e, t);
        r = n.indexOf(e);
    }
    return n.toString();
};