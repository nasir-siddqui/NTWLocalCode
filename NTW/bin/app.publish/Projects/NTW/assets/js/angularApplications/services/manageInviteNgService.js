define(['angular', 'underscore', 'translationInvite', 'local/angularApplications/services/corpAdministrationService', 'constants', 'helpers/serviceErrorHandling', 'helpers/common', 'local/angularApplications/services/savedOrganizationsService'], function (angular, _, translation, corpAdministrationService, constants, errorHandler, common) {
    "use strict";

    var app = angular.module('manageInviteNgService', ['corpAdministrationService', 'savedOrganizationsService']);

    app.factory('manageInviteNgService', ['$q', '$rootScope', '$timeout', 'corpAdministrationService', 'savedOrganizationsService', function ($q, $rootScope, $timeout, corpAdministrationService, savedOrganizationsService) {

        var organisations = [];

        var inviteOrganisationDeferred = $q.defer();

        var service = {

            updateInviteOrganisation: function(org) {
                console.log("SERVICE: updateInviteOrganisation", org);
                if (org.$selected) {
                    service.addInviteOrganisation(org);
                } else {
                    service.removeInviteOrganisation(org.id);
                }
            },

            addInviteOrganisation: function(org) {
                service.setInviteOrganisations(organisations.concat([org]));
            },

            removeInviteOrganisation: function(id) {
                var deferred = $q.defer();
                deferred.resolve();
                var orgs = _.filter(organisations, function(item) { return item.id !== id; });
                service.setInviteOrganisations(orgs);
                return deferred.promise;
            },

            getInviteOrganisations: function(callback) {
                console.log("SERVICE: getInviteOrganisations");
                inviteOrganisationDeferred.promise.then(callback.callback, callback.errorHandler);
                var ref = inviteOrganisationDeferred.promise;
                // didn't use old value here since the promise migth change between the call to
                // getInviteOrganisations and the first time the watch is triggered
                // In that case we should register the callback
                $rootScope.$watch(function() { return inviteOrganisationDeferred.promise; }, function(a) {
                    if (a === ref) {
                        return;
                    }
                    ref = inviteOrganisationDeferred.promise;
                    inviteOrganisationDeferred.promise.then(callback.callback, callback.errorHandler);
                });
            },

            setInviteOrganisations: function(_organisations) {
                console.log("SERVICE: setInviteOrganisations", _organisations);
                organisations = _organisations;
                inviteOrganisationDeferred = $q.defer();
                inviteOrganisationDeferred.resolve(_organisations);
            },

            loadUserInfo: function(user) {
                console.log("SERVICE: getUserInfo", user);

                var count = 0;

                var complete = function(organisations) {
                    if (user.invitedBy === 0) {
                        user.userInfoLoading = false;
                        user.invitedByName = translation.translate("SENT_BY_TELIA_ADMIN");
                        return;
                    }
                    _.each(organisations, function(x) {
                        corpAdministrationService.getUser(x.id, user.invitedBy, true).then(function(data) {
                            count++;
                            if (data && user.userInfoLoading) {
                                user.userInfoLoading = false;
                                user.invitedByName = data.firstName + " " + data.lastName;
                            }
                            if (count === organisations.length) {
                                user.userInfoLoading = false;
                                if (!user.invitedByName) {
                                    user.invitedByName = translation.translate("SENT_BY_UNKNOWN");
                                }
                            }
                                
                        });
                    });
                };

                if (common.isTeliaAdmin) {
                    savedOrganizationsService.getSavedOrganizations().then(function(data) {
                        complete(_.map(data, function(x) { return { id: x.organizationTscid }; }));
                    });
                } else {
                    complete(common.organisations);
                }

            }

        };

        return service;

    }]);

});