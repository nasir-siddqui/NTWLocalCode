/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        window.Utils = factory();
    }

})(function() {

    return {
    
        /**
         * Gets a list of css rules from the document based of the matching selector and the matching css
         * @param  {regexp} selectorMatch           Regexp used to match the selectorText. The match will be used as the index property in the return object.
         *                                          If groups are used in the regexp the index will be the first group
         * @param  {regexp} cssMatch                Regexp used to match the cssText. The match will be used as the value property in the return object.
         *                                          If groups are used in the regexp the value will be the first group
         * @param  {string} fallbackStyleProperty   A string representing the property of the style object. Used as fallback when the cssText property doesn't exist.
         *                                          Note that the style property cannot be a modern style such as 'fill'
         * @return {array}                          An array objects where each object has an index propery and a value property. The index property represent the selectorMatch value,
         *                                          and the value property represents the cssMatch value or the property value from the style object.
         */
        getStyleSheetsList: function(selectorMatch, cssMatch, fallbackStyleProperty) {
            var ret = [];
            for (var i = 0; i < document.styleSheets.length; i++) {
                var o = document.styleSheets[i];
                var rules = o.rules || o.cssRules;
                for (var j = 0; j < rules.length; j++) {
                    var info = null;
                    var rule = rules[j];
                    if (rule.selectorText && (info = rule.selectorText.match(selectorMatch)) !== null) {
                        var index = info[1] ? info[1] : info[0];
                        var value = null;
                        if (rule.cssText) {
                            info = rule.cssText.match(cssMatch);
                            value = info[1] ? info[1] : info[0];
                        } else if (rule.style && rule.style[fallbackStyleProperty]) {
                            value = rule.style[fallbackStyleProperty];
                        }
                        var found = false;
                        for (var k = 0; k < ret.length; k++) {
                            if (ret[k].index === index) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            ret.push({ index: index, value: value });
                        }
                    }
                }
            }
            return ret;
        },

        // format a date to return date in format YYYY-MM-DD
        formatDate: function(d) {
            var dd = d.getDate();
            if ( dd < 10 ) dd = '0' + dd;
            var mm = d.getMonth() + 1;
            if ( mm < 10 ) mm = '0' + mm;
            var yy = d.getFullYear();
            return yy + '-' + mm + '-' + dd;
        }

    };

});
