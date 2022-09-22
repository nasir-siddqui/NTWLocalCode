/**
 * Copyright (c) Mozilla Foundation http://www.mozilla.org/
 * This code is available under the terms of the MIT License
 */function indexof(e, t) {
    var n, r, i = e, s = i.length >>> 0;
    if (s === 0) return -1;
    n = 0;
    if (arguments.length > 1) {
        n = Number(arguments[1]);
        n != n ? n = 0 : n != 0 && n != Infinity && n != -Infinity && (n = (n > 0 || -1) * Math.floor(Math.abs(n)));
    }
    if (n >= s) return -1;
    for (r = n >= 0 ? n : Math.max(s - Math.abs(n), 0); r < s; r++) if (r in i && i[r] === t) return r;
    return -1;
}

function checkBrowser() {
    return BrowserDetect.browser + "|" + BrowserDetect.version;
}

Array.prototype.map || (Array.prototype.map = function(e) {
    var t = this.length;
    if (typeof e != "function") throw new TypeError;
    var n = new Array(t), r = arguments[1];
    for (var i = 0; i < t; i++) i in this && (n[i] = e.call(r, this[i], i, this));
    return n;
});

String.prototype.replaceAll = function(e, t) {
    if (e === t) return this;
    var n = this, r = n.indexOf(e);
    while (r !== -1) {
        n = n.replace(e, t);
        r = n.indexOf(e);
    }
    return n.toString();
};

var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    },
    searchString: function(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t].string;
            this.versionSearchString = e[t].subString;
            if (n.indexOf(e[t].subString) != -1) return e[t].identity;
        }
    },
    searchVersion: function(e) {
        var t = e.indexOf(this.versionSearchString);
        if (t == -1) return;
        return parseFloat(e.substring(t + this.versionSearchString.length + 1));
    },
    dataBrowser: [ {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.userAgent,
        subString: "Safari",
        identity: "Safari"
    }, {
        string: navigator.userAgent,
        subString: "Opera",
        identity: "Opera"
    } ]
};