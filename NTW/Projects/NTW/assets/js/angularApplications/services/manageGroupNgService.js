define(['angular', 'underscore', 'local/angularApplications/services/corpAdministrationService', 'service/corpAdministrationServiceApi', 'constants', 'helpers/serviceErrorHandling', 'helpers/common', 'local/angularApplications/services/savedOrganizationsService', 'local/angularApplications/services/cacheService'], function (angular, _, corpAdministrationService, serviceApi, constants, errorHandler, common) {
    "use strict";

    var app = angular.module('manageGroupNgService', ['corpAdministrationService', 'cacheService']);

    app.factory('manageGroupNgService', ['$q', '$rootScope', '$timeout', 'corpAdministrationService', 'cacheService', function ($q, $rootScope, $timeout, corpAdministrationService, cacheService) {

        var organisations = [];

        var api = cacheService.init(serviceApi);

        var organisationDeferred = $q.defer();

        var service = {
            // Generate callback that includes returned data
            getDataCallback: function(deferred) {
                return {
                    callback: function(data) {
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            },

            hasOrganizations: function() {
                return organisations.length > 0;
            },

            addOrganization: function(org) {
                service.setOrganizations(organisations.concat([org]));
            },

            addOrganizations: function(orgs) {
                console.log(orgs);
                service.setOrganizations(organisations.concat(orgs));
            },

            removeOrganization: function(id) {
                var deferred = $q.defer();
                deferred.resolve();
                var orgs = _.filter(organisations, function(item) { return item.organizationTscid !== id; });
                service.setOrganizations(orgs);
                return deferred.promise;
            },

            getOrganizations: function(callback) {
                console.log("SERVICE: getOrganisations");
                organisationDeferred.promise.then(callback.callback, callback.errorHandler);
                var ref = organisationDeferred.promise;
                // didn't use old value here since the promise migth change between the call to
                // getInviteOrganisations and the first time the watch is triggered
                // In that case we should register the callback
                $rootScope.$watch(function() { return organisationDeferred.promise; }, function(a) {
                    if (a === ref) {
                        return;
                    }
                    ref = organisationDeferred.promise;
                    organisationDeferred.promise.then(callback.callback, callback.errorHandler);
                });
            },

            setOrganizations: function(_organisations) {
                console.log("SERVICE: setOrganisations", _organisations);
                organisations = _organisations;
                organisationDeferred = $q.defer();
                organisationDeferred.resolve(_organisations);
            }
        };

        return service;

    }]);

});