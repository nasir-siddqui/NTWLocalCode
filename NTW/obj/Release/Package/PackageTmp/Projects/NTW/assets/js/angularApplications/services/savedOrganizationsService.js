define(['angular', 'helpers/common', 'underscore', 'service/userStorageApi'], function (angular, common, _, userStorageApi) {
    "use strict";

    var app = angular.module('savedOrganizationsService', []);

    app.factory('savedOrganizationsService', [
        '$q', '$rootScope', '$timeout', function ($q, $rootScope, $timeout) {
            
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
            // SAVED ORGANIZATIONS

            Service.extraOrganizations = null;
            Service.loadedOrganizations = null;
            Service.loadOrganizationsDeferred = null;
            Service.count = null;
            Service.totalOrganizationsDeferred = null;


            Service.getSavedOrganizations = function () {
                console.log("SERVICE: getSavedOrganizations");
                var self = this;
                var deferred = $q.defer();
                if (this.loadedOrganizations) {
                    deferred.resolve(JSON.stringify(this.loadedOrganizations));
                } else if (this.loadOrganizationsDeferred) {
                    deferred = this.loadOrganizationsDeferred;
                } else {
                    this.loadOrganizationsDeferred = $q.defer();
                    userStorageApi.getUserProperty("savedOrganizations", getDataCallback(this.loadOrganizationsDeferred));
                    this.loadOrganizationsDeferred.promise.then(function(data) {
                        deferred.resolve(data);
                    });
                }
                return deferred.promise.then(function (organizations) {
                    
                    var _organizations = null;
                    try {
                        _organizations = JSON.parse(organizations) || [];
                    } catch (ex) {
                        _organizations = [];
                    }
                    
                    var orgs = _.uniq(_organizations.concat(self.extraOrganizations || []), function(x) {
                        return x.organizationTscid;
                    });

                    Service.count = orgs.length;

                    return orgs;

                });
            };

            Service.updateSavedOrganizations = function (organizations, ignoreSave) {
                var data = $.map(organizations, function (org) { // Only store properties that are needed
                    return {
                        organizationTscid: org.organizationTscid
                    };
                });

                this.loadedOrganizations = data;

                this.totalOrganizationsDeferred = $q.defer();
                this.totalOrganizationsDeferred.resolve(data);

                Service.count = organizations.length;
                Service.updatedTimestamp = new Date();

                var deferred = $q.defer();
                if (!ignoreSave) {
                    userStorageApi.setUserProperty("savedOrganizations", JSON.stringify(data), getVoidCallback(deferred));
                }
                return deferred.promise;
            };

            // used to add an organisation without saving.
            Service.addOrganizationTscId = function(organizationTscid) {
                var self = this;
                var arr = organizationTscid;
                if (typeof organizationTscid === "string") {
                    arr = [organizationTscid];
                }
                arr = _.map(arr, function(x) {
                    return { organizationTscid: x };
                });
                self.extraOrganizations = _.uniq((self.extraOrganizations || []).concat(arr), function(x) { return x.organizationTscid; });
                self.totalOrganizationsDeferred = $q.defer();
                self.getSavedOrganizations().then(function(data) {
                    self.totalOrganizationsDeferred.resolve(data);
                });
            };

            // used by savedOrganizations app to be able to update the organisations
            Service.getOrganizations = function(cb) {
                var self = this;
                if (!self.totalOrganizationsDeferred) {
                    self.totalOrganizationsDeferred = $q.defer();
                    self.getSavedOrganizations().then(function(data) {
                        self.totalOrganizationsDeferred.resolve(data);
                    });
                }
                this.totalOrganizationsDeferred.promise.then(cb);
                $rootScope.$watch(function() { return self.totalOrganizationsDeferred.promise; }, function(a, b) {
                    if (a !== b) {
                        self.totalOrganizationsDeferred.promise.then(cb);
                    }
                });
            };

            Service.updatedTimestamp = new Date(); // Used for $watch target to be informed when "my organizations" has been updated
           
            return Service;
        }
    ]);


    return app;
});
