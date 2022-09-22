define(['underscore', 'angular', 'helpers/serviceErrorHandling'], function (_, angular, errorHandler) {
    //"use strict";

    var app = angular.module('cacheService', []);

    app.factory('cacheService', ['$q', function ($q) {

        var instances = [];

        var hash = function() {
            if (arguments.length === 0) return "singleton";
            return [].join.call(arguments, '_');
        };

        var createCallback = function(deferred, obj, key, options) {
            obj[key + "_promise"] = deferred;
            return {
                callback: function(data) {
                    if (typeof data === "undefined") {
                        deferred.resolve();
                    } else {
                        // store the data
                        //var _data = _.clone(data);
                        obj[key + "_data"] = data;
                        deferred.resolve(data);
                    }
                },
                errorHandler: function(error) {
                    if (options && options.ignoreError) {
                        deferred.resolve(null);
                    } else {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, error);
                    }
                }
            };
        };

        var Instance = function(api) {
            this.cache = {};
            this.api = api;
        };

        /**
         * This method returns the chached data or promise for the passed arguments
         * @param  {object} options   Optional. Pass an object here that will be passed to the callback method
         * @param  {string} method    The method name for the api
         * @param  {vars}   arguments An array of arguments to the call
         * @return {promise}          The method returns a resolved promise, cached promise or new promise if the cached data data is not there
         */
        Instance.prototype.get = function() {
            if (!this.api) {
                return;
            }

            var options = null;
            // get the arguments
            var args = [].slice.call(arguments);
            // the first one is the method or options
            var method = args.shift();
            if (typeof first === "object") {
                options = method;
                // then the second one is the method
                method = args.shift();
            }
            // the key
            var key = hash.apply(null, args);
            var deferred = $q.defer();
            // see if we can resolve the data
            if (this.cache && this.cache[method] && this.cache[method][key + "_data"]) {
                deferred.resolve(this.cache[method][key + "_data"]);
            }
            // see if the call has already been made and the promise exists
            else if (this.cache && this.cache[method] && this.cache[method][key + "_promise"]) {
                deferred = this.cache[method][key + "_promise"];
            }
            // make the call
            else {
                if (!this.cache) {
                    this.cache = {};
                }
                if (!this.cache[method]) {
                    this.cache[method] = {};
                }
                args.push(createCallback(deferred, this.cache[method], key, options));
                this.api[method].apply(this.api, args);
            }
            return deferred.promise;
        };

        service = {
            init: function(obj) {
                var instance = _.find(instances, function(item) { return item.api === obj; });
                if (!instance) {
                    instance = new Instance(obj);
                    instances.push(instance);
                    console.log("CACHESERVICE: Create new instance");
                } else {
                    console.log("CACHESERVICE: Found existing instance");
                }
                return instance;
            }
        };

        return service;

    }]);

});
