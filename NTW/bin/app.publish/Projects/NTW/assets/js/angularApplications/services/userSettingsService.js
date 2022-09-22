define(['angular', 'helpers/common', 'local/angularApplications/services/userStorageService', 'service/userStorageApi'], function(angular, common, userStorageService, userStorageApi) {
    var app = angular.module('userSettingsService', []);

    var cachedService = null;

    app.factory('userSettingsService', [
        '$q', function ($q) {
            if (cachedService) return cachedService; // Manual caching of service: For some reason the service was instansiated twice otherwise.

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
            // LANGUAGE
            Service.getLanguage = function () {
                var deferred = $q.defer();
                userStorageApi.getUserProperty("language", getDataCallback(deferred));
                return deferred.promise;
            }
            Service.setLanguage = function (data) {
                var deferred = $q.defer();
                userStorageApi.setUserProperty("language", data, getVoidCallback(deferred));
                return deferred.promise;
            }


            /////////////////////////////////////
            // DEFAULT ORGANIZATION
            Service.getDefaultOrganizationTscid = function () {
                var deferred = $q.defer();
                userStorageApi.getUserProperty("defaultOrganization", getDataCallback(deferred));
                return deferred.promise;
            }
            Service.setDefaultOrganization = function (organization) {
                var deferred = $q.defer();
                userStorageApi.setUserProperty("defaultOrganization", organization.organizationTscid, getVoidCallback(deferred));
                return deferred.promise;
            }

            return Service;

        }
    ]);


    return app;
});
