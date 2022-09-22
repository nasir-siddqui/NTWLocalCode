define(['angular', 'service/userStorageApi', 'helpers/common'], function (angular, userStorageApi, common) {
    var app = angular.module('userStorageService', []);

    app.factory('userStorageService', [
        '$q', function ($q) {

            // Generate callback that includes returned data
            function getDataCallback(deferred) {
                return {
                    callback: function (data) {
                        deferred.resolve(data);
                    },
                    errorHandler: function (errorString) {
                        deferred.reject(errorString);
                    }
                };
            }

            // Generate callback that includes returned data and caches the result
            function getCachedDataCallback(deferred, cacheObject, cacheKey) {
                return {
                    callback: function (data) {
                        cacheObject[cacheKey] = data;
                        deferred.resolve(data);
                    },
                    errorHandler: function (errorString) {
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
                    callback: function () {
                        deferred.resolve();
                    },
                    errorHandler: function (errorString) {
                        deferred.reject(errorString);
                    }
                };
            }
         
            var Service = {};

            /////////////////////////////////////
            // USER
            Service.getUserProperty = function (keyName) {
                var deferred = $q.defer();
                userStorageApi.getUserProperty(keyName, getDataCallback(deferred));
                return deferred.promise;
            };
            Service.setUserProperty = function (keyName, data) {
                var deferred = $q.defer();
                userStorageApi.setUserProperty(keyName, data, getVoidCallback(deferred));
                return deferred.promise;
            };

            /////////////////////////////////////
            // USER
            Service.getProfileProperty = function (tscid, keyName) {
                var deferred = $q.defer();
                userStorageApi.getProfileProperty(tscid, keyName, getDataCallback(deferred));
                return deferred.promise;
            };
            Service.setProfileProperty = function (tscid, keyName, data) {
                var deferred = $q.defer();
                userStorageApi.setProfileProperty(tscid, keyName, data, getVoidCallback(deferred));
                return deferred.promise;
            };

            /////////////////////////////////////
            // ORGANISATION
            Service.getOrganisationProperty = function (organizationTscid, keyName) {
                var deferred = $q.defer();
                userStorageApi.getOrganisationProperty(organizationTscid, keyName, getDataCallback(deferred));
                return deferred.promise;
            };
            Service.setOrganisationProperty = function (organizationTscid, keyName, data) {
                var deferred = $q.defer();
                userStorageApi.setOrganisationProperty(organizationTscid, keyName, data, getVoidCallback(deferred));
                return deferred.promise;
            };

            Service.getProperty = function(keyName) {
                if (common.isTeliaAdmin) {
                    return Service.getUserProperty(keyName);
                } else {
                    return Service.getProfileProperty(common.orgTscid, keyName);
                }
            };

            Service.setProperty = function(keyName, value) {
                if (common.isTeliaAdmin) {
                    return Service.setUserProperty(keyName, value);
                } else {
                    return Service.setProfileProperty(common.orgTscid, keyName, value);
                }
            };

            return Service;
        }
    ]);


    return app;
});