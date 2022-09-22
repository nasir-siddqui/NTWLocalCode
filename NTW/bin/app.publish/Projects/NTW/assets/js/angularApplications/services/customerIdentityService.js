define(['angular', 'helpers/common', 'service/customerIdentityServiceApi'], function(angular, common, customerIdentityServiceApi) {
    var app = angular.module('customerIdentityService', []);

    app.factory('customerIdentityService', [
        '$q', function($q) {

            // Generate callback that includes returned data
            function getDataCallback(deferred) {
                return {
                    callback: function(data) {
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        deferred.reject(errorString);
                    }
                };
            }

            // Generate callback that includes returned data and caches the result
            function getCachedDataCallback(deferred, cacheObject, cacheKey) {
                return {
                    callback: function(data) {
                        cacheObject[cacheKey] = data;
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        deferred.reject(errorString);
                    }
                };
            }

            function getCachedData(cacheObject, cacheKey) {
                return cacheObject[cacheKey];
            }

            // Generate callback that does not return any data
            function getVoidCallback(deferred) {
                return {
                    callback: function() {
                        deferred.resolve();
                    },
                    errorHandler: function(errorString) {
                        deferred.reject(errorString);
                    }
                };
            }

            function hash() {
                if (arguments.length === 0) return "singleton";
                return [].join.call(arguments, ':');
            }

            var Service = {};



            /////////////////////////////////////
            // Translate a orgnummer to tscid
            Service.lookupTscid = function (organizationsId) {
                var deferred = $q.defer();
                customerIdentityServiceApi.lookupTscid(organizationsId, getDataCallback(deferred));
                return deferred.promise;
            }
            

            return Service;
        }
    ]);


    return app;
});
