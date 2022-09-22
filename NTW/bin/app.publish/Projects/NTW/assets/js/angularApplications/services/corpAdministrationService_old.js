define(['jquery', 'angular', 'underscore', 'service/corpAdministrationServiceApi', 'constants', 'helpers/serviceErrorHandling', 'helpers/common', 'local/angularApplications/services/savedOrganizationsService', 'local/angularApplications/services/cacheService'], function ($, angular, _, serviceApi, constants, errorHandler, common) {
    //"use strict";

    var app = angular.module('corpAdministrationService', ['savedOrganizationsService', 'cacheService']);

    app.factory('corpAdministrationService', [
        '$q', 'savedOrganizationsService', 'cacheService', function ($q, savedOrganizationsService, cacheService) {

            var api = cacheService.init(serviceApi);

            // Generate callback that includes returned data
            function getDataCallback(deferred) {
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
            }

            // Generate callback that includes returned data and caches the result
            function getCachedDataCallback(deferred, cacheObject, cacheKey) {
                return {
                    callback: function(data) {
                        cacheObject[cacheKey] = data;
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            }

            // Generate callback that includes returned data and caches the deferred object
            function getCachedPromiseCallback(deferred, cacheObject, cacheKey, ignoreError) {
                cacheObject[cacheKey] = deferred;
                return {
                    callback: function(data) {
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        if (ignoreError) {
                            deferred.resolve(null);
                        } else {
                            errorHandler.translateToMessage(function(message) {
                                deferred.reject(message);
                            }, errorString);
                        }
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
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            }

            var getCache = function(deferred, obj, key) {
                // check if data is already there. This might be unnecessary
                if (obj[key + "_data"]) {
                    deferred.resolve(obj[key]);
                    return deferred.promise;
                }
                // else check if the call already has been made
                else if (obj[key + "_promise"]) {
                    return obj[key + "_promise"].promise;
                }
                return false;
            };

            var cache = {};

            var organizationRolesCache = {};
            var systemRolesCache = {};
            var organizationPuiCache = {};
            var puisOnProfileCache = {};
            var puiAttributesCache = {};
            var usersPromiseCache = {};
            var userListCache = {};
            var inviteListCache = {};
            var requestListCache = {};
            var organizationsCache = {};


            function hash() {
                if (arguments.length === 0) return "singleton";
                return [].join.call(arguments, '_');
            }

            var service = {};

            /////////////////////////////////////
            // ORGANISATION
            service.getOrganization = function(organizationTscid) {
                console.log("SERVICE: getOrganization", organizationTscid);
                return api.get("getOrganization", organizationTscid);
            };
            service.getOrganizationByOrgNr = function(organizationId) {
                console.log("SERVICE: getOrganizationByOrgNr", organizationId);
                return api.get("getOrganizationByOrgNr", organizationId);
            };
            service.setPuisOnOrganization = function(organizationTscid, puiNames) {
                var deferred = $q.defer();
                serviceApi.setPuisOnOrganization(organizationTscid, puiNames, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deleteOrganization = function (organizationTscid) {
                var deferred = $q.defer();
                serviceApi.deleteOrganization(organizationTscid, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.getMySavedOrganizations = function() {
                var deferred = $q.defer();

                savedOrganizationsService.getSavedOrganizations()
                    .then(function(data) {
                            if (!data) {
                                deferred.resolve([]);
                            } else {
                                var promises = $.map(data, function(org) { return service.getOrganization(org.organizationTscid); });

                                $q.all(promises).then(function (organizations) {
                                    organizations = $.grep(organizations, function(organization) { return organization !== null; }); // Remove non-existing organizations
                                    $.each(organizations, function() {
                                        var formattedOrganizationNumber = String(this.organizationNumber).replace("-", "");
                                        this.organizationNumberFormatted = formattedOrganizationNumber.substr(0, 6) + "-" + formattedOrganizationNumber.substr(6);
                                    });
                                    deferred.resolve(organizations);
                                });
                            }
                        },
                        function(message) { deferred.reject(message); });

                return deferred.promise;
            };
            service.createOrganizationIfNotExists = function (organizationNumber) {
                var deferred = $q.defer();
                serviceApi.createOrganizationIfNotExists(organizationNumber, getDataCallback(deferred));
                return deferred.promise;
            };

            /////////////////////////////////////
            // ROLES
            service.getAllSystemRoles = function() {
                console.log('SERVICE: getAllSystemRoles');
                var deferred = $q.defer();
                var cacheKey = hash();
                if (getCachedData(systemRolesCache, cacheKey) !== undefined) {
                    deferred.resolve(getCachedData(systemRolesCache, cacheKey));
                } else
                    serviceApi.getAllSystemRoles(getCachedDataCallback(deferred, systemRolesCache, cacheKey));
                return deferred.promise;
            };
            service.getAllRoles = function(organizationTscid) {
                console.log('SERVICE: getAllRoles', organizationTscid);
                var deferred = $q.defer();
                serviceApi.getAllRoles(organizationTscid, getDataCallback(deferred));
                return deferred.promise;
            };
            service.getAllOrganizationRoles = function(organizationTscid) {
                console.log('SERVICE: getAllOrganizationRoles', organizationTscid);
                var deferred = $q.defer();
                var cacheKey = hash(organizationTscid);
                if (getCachedData(organizationRolesCache, cacheKey) !== undefined)
                    deferred.resolve(getCachedData(organizationRolesCache, cacheKey));
                else
                    serviceApi.getAllOrganizationRoles(organizationTscid, getCachedDataCallback(deferred, organizationRolesCache, cacheKey));
                return deferred.promise;
            };
            service.getOrganizationRole = function(organizationTscid, roleId) {
                console.log('SERVICE: getOrganizationRole', organizationTscid, roleId);
                var deferred = $q.defer();
                var cacheKey = hash(organizationTscid, roleId);
                if (getCachedData(organizationRolesCache, cacheKey) !== undefined)
                    deferred.resolve(getCachedData(organizationRolesCache, cacheKey));
                else
                    serviceApi.getOrganizationRole(organizationTscid, roleId, getCachedDataCallback(deferred, organizationRolesCache, cacheKey));
                return deferred.promise;
            };
            service.getSystemRole = function(roleId) {
                console.log('SERVICE: getSystemRole', roleId);
                var deferred = $q.defer();
                var cacheKey = hash(roleId);
                if (getCachedData(systemRolesCache, cacheKey) !== undefined) {
                    deferred.resolve(getCachedData(systemRolesCache, cacheKey));
                } else
                    serviceApi.getSystemRole(roleId, getCachedDataCallback(deferred, systemRolesCache, cacheKey));
                return deferred.promise;
            };
            service.createSystemRole = function(displayName, description, puis) {
                var deferred = $q.defer();
                serviceApi.createSystemRole(displayName, description, puis, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.updateSystemRole = function(roleId, displayName, description, puis) {
                var deferred = $q.defer();
                serviceApi.updateSystemRole(roleId, displayName, description, puis, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deleteSystemRole = function(roleId) {
                var deferred = $q.defer();
                serviceApi.deleteSystemRole(roleId, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.createOrganizationRole = function(organizationTscid, displayName, description, puis) {
                var deferred = $q.defer();
                serviceApi.createOrganizationRole(organizationTscid, displayName, description, puis, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.updateOrganizationRole = function(organizationTscid, roleId, displayName, description, puis) {
                console.log('SERVICE: updateOrganizationRole', organizationTscid, roleId, displayName, description, puis);
                var deferred = $q.defer();
                serviceApi.updateOrganizationRole(organizationTscid, roleId, displayName, description, puis, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deleteOrganizationRole = function(organizationTscid, roleId) {
                var deferred = $q.defer();
                serviceApi.deleteOrganizationRole(organizationTscid, roleId, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deleteRole = function(organizationTscid, roleId) {
                if (organizationTscid !== null && organizationTscid > 0) {
                    return service.deleteOrganizationRole(organizationTscid, roleId);
                } else {
                    return service.deleteSystemRole(roleId);
                }
            };
            service.getPuisOnProfile = function(userId, organizationTscid) {
                console.log('SERVICE: getPuisOnProfile', userId, organizationTscid);
                var deferred = $q.defer();
                var key = hash(organizationTscid, userId);
                if (getCachedData(puisOnProfileCache, key)) {
                    deferred.resolve(getCachedData(puisOnProfileCache, key));
                } else {
                    serviceApi.getPuisOnProfile(userId, organizationTscid, getCachedDataCallback(deferred, puisOnProfileCache, key));
                }
                return deferred.promise;
            };
            service.getAttributesOnPui = function(name) {
                console.log('SERVICE: getAttributesOnPui', name);
                var deferred = $q.defer();
                var key = hash(name);
                if (getCachedData(puiAttributesCache, key)) {
                    deferred.resolve(getCachedData(puiAttributesCache, key));
                } else {
                    serviceApi.getAttributesOnPUI(name, getCachedDataCallback(deferred, puiAttributesCache, key));
                }
                return deferred.promise;
            };
            service.setPUIAttributeOnProfile = function(id, userId, orgId, value) {
                console.log('SERVICE: setPUIAttributeOnProfile', id, userId, orgId, value);
                var deferred = $q.defer();
                serviceApi.setPUIAttributeOnProfile(id, userId, orgId, value, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deletePUIAttributeOnProfile = function(id, userId, orgId) {
                console.log('SERVICE: deletePUIAttributeOnProfile', id, userId, orgId);
                var deferred = $q.defer();
                serviceApi.deletePUIAttributeOnProfile(id, userId, orgId, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.getMyManagedRoles = function() {
                if (common.isTeliaAdmin) {
                    return service.getMySavedOrganizations()
                        .then(function (savedOrganizations) { // Add more organization information, i.e. name
                            return $q.all($.map(savedOrganizations, function(savedOrganization) { return service.getOrganization(savedOrganization.organizationTscid); }));
                        })
                        .then(function(organizations) {
                            if (organizations.length > 0) {
                                var promises = $.map(organizations, function (organization) { return service.getAllRoles(organization.organizationTscid); });
                                return $q.all(promises).then(function (roles) {
                                    var merged = [];
                                    for (var i = 0; i < organizations.length; i++) {
                                        $.each(roles[i], function () {
                                            var role = this;
                                            // Add organization information to organization roles and add to merged array
                                            if (!role.systemRole) {
                                                role.organizationName = organizations[i].name;
                                                merged.push(role);
                                            } else {
                                                role.organizationName = "";
                                                // Do not add duplicate system roles
                                                if ($.grep(merged, function (existingRole) { return role.id === existingRole.id; }).length === 0) {
                                                    merged.push(role);
                                                }
                                            }
                                        });
                                    }
                                    return merged;
                                });
                            } else {
                                return service.getAllSystemRoles().then(function(roles) {
                                    $.each(roles, function () { this.organizationName = ""; });
                                    return roles;
                                });
                            }
                            
                        });
                } else {
                    return service.getAllRoles(common.orgTscid);
                }
            };

            /////////////////////////////////////
            // PUIS
            service.getCommonPuis = function() {
                console.log('SERVICE: getCommonPuis');
                var deferred = $q.defer();
                serviceApi.getCommonPuis(getDataCallback(deferred));
                return deferred.promise;
            };
            service.getUncommonPuis = function() {
                console.log('SERVICE: getUncommonPuis');
                return service.getAllPuis().then(function(allPuis) {
                    return $.grep(allPuis, function(pui) { return pui.common == false; });
                });
            };
            service.getAllPuiOnOrganization = function(organizationTscid) {
                console.log('SERVICE: getAllPuiOnOrganization', organizationTscid);
                var deferred = $q.defer();
                var cacheKey = hash(organizationTscid);
                if (getCachedData(organizationPuiCache, cacheKey) !== undefined) {
                    deferred.resolve(getCachedData(organizationPuiCache, cacheKey));
                } else {
                    serviceApi.getAllPuiOnOrganization(organizationTscid, getDataCallback(deferred, organizationPuiCache, cacheKey));
                }
                return deferred.promise;
            };
            service.fillPuisOnRoles = function(roles) {
                var promises = [];
                $.each(roles, function() {
                    var role = this;
                    if (role.puis === undefined || role.puis.length === 0) {
                        var promise = role.systemRole ?
                            service.getSystemRole(role.id) :
                            service.getOrganizationRole(role.organizationTscid, role.id);
                        promise.then(function(data) { role.puis = data.puis; });
                        promises.push(promise);
                    }
                });

                return $q.all(promises);
            };
            service.getAllPuis = function() {
                console.log('SERVICE: getAllPuis');
                var deferred = $q.defer();
                serviceApi.getAllPuis(getDataCallback(deferred));
                return deferred.promise;
            };

            /////////////////////////////////////
            // REQUESTS
            service.getPendingRequests = function() {
                console.log('SERVICE: getPendingRequest');
                var deferred = $q.defer();
                serviceApi.getPendingRequests(getDataCallback(deferred));
                return deferred.promise.then(function(users) { return transformUsers(users, true); });
            };
            service.getPendingRequestsOrganization = function(organizationTscid) {
                console.log('SERVICE: getPendingRequest', organizationTscid);
                var deferred = $q.defer();
                serviceApi.getPendingRequestsOrganization(organizationTscid, getDataCallback(deferred));
                return deferred.promise.then(function(users) { return transformUsers(users, true); });
            };
            service.acceptRequest = function(organizationTscid, tcwssUserId) {
                var deferred = $q.defer();
                serviceApi.acceptRequest(organizationTscid, tcwssUserId, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.createAccessRequest = function(tcwssUserId, userName, firstName, lastName, mobilenumber, email, accessRequestType, orgNr) {
                var deferred = $q.defer();
                serviceApi.createAccessRequest(tcwssUserId, userName, firstName, lastName, mobilenumber, email, accessRequestType, orgNr, getVoidCallback(deferred));
                return deferred.promise;
            };

            /////////////////////////////////////
            // USERS
            service.getUser = function(organizationTscid, tcwssUserId, ignoreError) {
                console.log("SERVICE: getUser", organizationTscid, tcwssUserId);
                return api.get("getUser", organizationTscid, tcwssUserId);
            };

            service.getRolesOnUser = function(organizationTscid, tcwssUserId) {
                console.log("SERVICE: getRolesOnUser", organizationTscid, tcwssUserId);
                var deferred = $q.defer();
                serviceApi.getRolesOnUser(organizationTscid, tcwssUserId, getDataCallback(deferred));
                return deferred.promise;
            };

            service.getRolesOnProfile = function(organizationTscid) {
                console.log("SERVICE: getRolesOnProfile", organizationTscid);
                var deferred = $q.defer();
                serviceApi.getRolesOnProfile(organizationTscid, getDataCallback(deferred));
                return deferred.promise;
            };

            service.setRolesOnUser = function(organizationTscid, tcwssUserId, roleIds) {
                console.log("SERVICE: setRolesOnUser", organizationTscid, tcwssUserId, roleIds);
                var deferred = $q.defer();
                serviceApi.setRolesOnUser(organizationTscid, tcwssUserId, roleIds, getVoidCallback(deferred));
                return deferred.promise;
            };
            service.deleteProfile = function(status) {
                var deferred = $q.defer();
                var args = [].slice.call(arguments);
                args.splice(0, 1);
                args.push(getVoidCallback(deferred));
                console.log("SERVICE: deleteProfile", status, args);
                if (status === "ACTIVE") {
                    serviceApi.deleteProfile.apply(null, args);
                } else if (status === "INVITE") {
                    // send email first
                    
                    // the invite object is the second argument 
                    var invite = args.splice(1, 1)[0];
                    var _url = constants.sendInviteDeleteEmailUrl;
                    var _data = {
                        mailAddress: invite.email,
                        mailFullName: invite.firstName + " " + invite.lastName,
                    };
                                        
                    $.post(_url, _data, function(data) {
                        console.log(args);
                        serviceApi.cancelInvite.apply(null, args);
                    }, 'text');

                } else if (status === "REQUEST") {
                    serviceApi.rejectRequest.apply(null, args);
                }
                return deferred.promise;
            };
            var transformUsers = function(users, isRequest, isInvite) {
                return $.map(users, function (_user) {
                    var user = _.clone(_user);
                    user.name = user.firstName + " " + user.lastName;
                    user.isRequest = isRequest;
                    user.isInvite = isInvite || false;
                    user.link = common.isTeliaAdmin ? constants.adminManageUserUrl : constants.manageUserUrl;
                    user.userStatus = "ACTIVE";
                    if (isRequest) { // Some API property names differ for users and requests, make them the same.
                        user.userStatus = "REQUEST";
                        user.emailAddress = user.email;
                        user.mobileNumber = user.mobilenumber;
                    } else if (isInvite) {
                        user.link = common.isTeliaAdmin ? constants.adminManageInviteUrl : constants.manageInviteUrl;
                        user.userStatus = "INVITE";
                        user.emailAddress = user.email;
                        user.userInfoLoading = true;
                        user.tcwssUserId = user.inviteId + "|" + user.nonce;
                        user.inviteDate = user.createDate;

                        if (!common.isTeliaAdmin) {
                            // check if this is editable
                            var _inviteOrgs = _.uniq(_.pluck(user.inviteRoles, 'orgId'));
                            var _managableOrgs = _.pluck(_.filter(common.organisations, function(x) { return x.manageUser; }), 'id');

                            var _diff = _.difference(_inviteOrgs, _managableOrgs);

                            user.$openLinkDisabled = _diff.length > 0;
                            user.$openLinkAction = _diff.length > 0 ? "details" : "link";
                            user.$rowDetailsButtonDisabled = _diff.length > 0;
                        }

                    }
                    return user;
                });
            };
            service.getUsersOnOrganization = function(organizationTscid) {
                var deferred = $q.defer();
                serviceApi.getUsersOnOrganization(organizationTscid, getDataCallback(deferred));
                return deferred.promise.then(function(users) { return transformUsers(users, false, false); });
            };
            service.getInvitesOnOrganization = function(organizationTscid) {
                var deferred = $q.defer();
                return api.get("getInvitesOnOrganisation", organizationTscid, "Pending").then(function(users) {
                    var _users = transformUsers(users, false, true);
                    return _users;
                });
                /*
                var key = hash(organizationTscid);
                if (1 === 0 && getCachedData(inviteListCache, key)) {
                    deferred.resolve(getCachedData(inviteListCache, key));
                } else {
                    serviceApi.getInvitesOnOrganisation(organizationTscid, "Pending", getCachedDataCallback(deferred, inviteListCache, key));
                }
                return deferred.promise.then(function(users) { return transformUsers(users, false, true); });
                */
            };
            service.getUsersAndInvitesAndRequestsForOrganization = function(organizationTscid) {
                if (organizationTscid <= 0) {
                    return service.getPendingRequests()
                        .then(function(data) { return $.map(data, transformUsers(data, true, false)); });
                }

                var users = service.getUsersOnOrganization(organizationTscid);
                var requests = service.getPendingRequestsOrganization(organizationTscid);
                var invites = service.getInvitesOnOrganization(organizationTscid);

                return $q.all([users, requests, invites]).then(function(data) {
                    var totalUsers = data[0].concat(data[1].concat(data[2] || []));
                    return totalUsers;
                });
            };
            service.getMyManagedUsers = function() {
                if (common.isTeliaAdmin) {
                    return service.getMySavedOrganizations().then(function(organizations) {
                        var promises = $.map(organizations, function (organization) { return service.getUsersAndInvitesAndRequestsForOrganization(organization.organizationTscid); });
                        return $q.all(promises).then(function(users) {
                            _.each(organizations, function(org, i) {
                                $.each(users[i], function () {
                                    // Add organization information to user
                                    this.organizationName = org.name;
                                });
                            });
                            var merged = [].concat.apply([], users);
                            
                            // merge invites by concatenating orgnaization names and mark duplicates for removal
                            var invites = _.filter(merged, function(item) {
                                return item.userStatus === "INVITE";
                            });
                            _.each(invites, function(item, i) {
                                if (item.remove) {
                                    return;
                                }
                                var _same = invites.filter(function(_item) {
                                    return _item.inviteId === item.inviteId && item !== _item;
                                });
                                var name = item.organizationName;
                                _.each(_same, function(_item) {
                                    name += ", " + _item.organizationName;
                                });
                                _.each(_same, function(_item) {
                                    _item.organizationName = name;
                                    _item.remove = true;
                                });
                                item.organizationName = name;
                            });
                            // remove duplicates
                            return _.filter(merged, function(item) {
                                return !item.remove;
                            });
                        });
                    });
                } else {
                    return service.getUsersAndInvitesAndRequestsForOrganization(common.orgTscid);
                }
            };

            service.getUserOrRequest = function(organizationTscid, tcwssUserId) {
                return service.getUser(organizationTscid, tcwssUserId)
                    .then(function(user) {
                        if (user !== null) return user;
                        return service.getPendingRequestsOrganization(organizationTscid)
                            .then(function(requests) { return $.grep(requests, function(r) { return r.tcwssUserId === tcwssUserId; })[0]; });
                    });
            };

            service.getInvite = function(id) {
                console.log("SERVICE: getInvite", id);
                var deferred = $q.defer();
                serviceApi.getInvite(id, getDataCallback(deferred));
                return deferred.promise;
            };

            service.getInviteWithNonce = function(id, token) {
                console.log("SERVICE: getInviteWithNonce", id, token);
                var deferred = $q.defer();
                serviceApi.getInvite2(id, token, getDataCallback(deferred));
                return deferred.promise;
            };

            service.getInviteInfo = function(id, token) {
                console.log("SERVICE: getInviteInfo", id, token);
                var deferred = $q.defer();
                serviceApi.getInviteInfo(id, token, getDataCallback(deferred));
                return deferred.promise;
            };

            service.createInvite = function(email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles) {
                console.log("SERVICE: createInvite", email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles);
                var deferred = $q.defer();
                serviceApi.createInvite(email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles, getDataCallback(deferred));
                return deferred.promise;
            };

            service.updateInvite = function(inviteId, email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles) {
                console.log("SERVICE: updateInvite", inviteId, email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles);
                var deferred = $q.defer();
                serviceApi.updateInvite(inviteId, email, mobilePhoneNumber, firstName, lastName, personalInviteText, roles, getDataCallback(deferred));
                return deferred.promise;
            };

            service.isInviteNonceValid = function(inviteId, inviteToken) {
                console.log("SERVICE: isInviteNonceValid", inviteId, inviteToken);
                var deferred = $q.defer();
                serviceApi.isInviteNonceValid(inviteId, inviteToken, getDataCallback(deferred));
                //deferred.resolve(true);
                return deferred.promise;

            };

            service.sendInviteSmsToken = function(text, inviteId) {
                console.log("SERVICE: sendInviteSmsToken", text, inviteId);
                var deferred = $q.defer();
                //deferred.resolve(true);
                serviceApi.sendSmsCode(text, inviteId, getDataCallback(deferred));
                return deferred.promise;
            };

            service.verifyInvite = function(inviteId, nonce, smsToken) {
                console.log("SERVICE: verifyInvite", inviteId, nonce, smsToken);
                var deferred = $q.defer();
                //deferred.resolve(true);
                serviceApi.validateSmsCode(inviteId, smsToken, getDataCallback(deferred));
                return deferred.promise;
            };

            service.acceptInvite = function(inviteId, nonce, smsToken, userId) {
                console.log("SERVICE: acceptInvite", inviteId, nonce, smsToken, userId);
                var deferred = $q.defer();
                serviceApi.acceptInvite(inviteId, nonce, smsToken, userId, getVoidCallback(deferred));
                return deferred.promise;
            };

            return service;
        }
    ]);


    return app;
});