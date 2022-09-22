define(['angular', 'underscore'], function(ng, _) {
    
    var module = ng.module('hashService', []).config(['$anchorScrollProvider', function($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();
    }]);

    module.factory('hash', ['$location', function($location) {

        var fromHash = function() {
            var hash = $location.hash() || "";
            var ret = {};
            _.each(hash.split('&'), function(item) {
                var str = item.split('=');
                if (str[0] && str[1]) {
                    ret[str[0]] = str[1];
                }
            });
            return ret;

        };

        var toHash = function(params) {
            var str = _.reduce(_.keys(params), function(a, b) {
                return (a || "") + (a ? "&" : "") + b + "=" + params[b];
            }, null);
            $location.replace();
            $location.hash(str);
        };

        return {

            get: function(key) {
                var params = fromHash();
                return params[key] || null;
            },

            set: function(key, value) {
                var params = fromHash();
                params[key] = value;
                toHash(params);
            },

            remove: function(key) {
                var params = fromHash();
                delete params[key];
                toHash(params);
            }



        };

    }]);

});