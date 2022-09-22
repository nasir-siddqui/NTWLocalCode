define(['jquery', 'angular', 'underscore', 'constants', 'helpers/common', 'translationPUI', 'local/angularApplications/services/corpAdministrationService'], function($, ng, _, constants, common, translationPUI) {
    "use strict";

    var app = ng.module('selectedRolesService', ['corpAdministrationService']);

    app.factory('selectedRolesService', ['$q', 'corpAdministrationService', '$rootScope', function($q, corpAdministrationService, $rootScope) {
        

        // the available instances
        var Instance = function(id) {

            this.id = id;

            this.availableRoles = $q.defer();
            this.selectedRoleIds = $q.defer();
            this.availablePuis = $q.defer();
            this.selectedPuiNames = $q.defer();
            this.profilePuis = $q.defer();

            this.accessReadOnly = false;
            this.combineRolesEnabled = true;
            this.organizationAdminMode = false;
            this.managePuiAttributes = false;
            this.commonPuis = null;
            this.puisOnOrganisation = null;

            this.rolesHasPuis = false;

            this.tscId = null;

            this._selectedPuiNames = [];
            this._selectedRoleIds = [];

            this.selectedRoleIds.resolve(this._selectedRoleIds);
            this.selectedPuiNames.resolve(this._selectedPuiNames);


            var _this = this;

            
            // get the puis for all available roles
            this.availableRoles.promise.then(function(data) {
                
                corpAdministrationService.fillPuisOnRoles(data).then(function(data) {
                    
                    var puiOnRoles = _.uniq(
                        _.flatten(
                            _.map(data, function(item) {
                                return _.map(item.puis, function(x) {
                                    return x.name;
                                });
                            })
                        )
                    );

                    var promises = [];

                    if (_this.organizationAdminMode) {
                        promises = [corpAdministrationService.getUncommonPuis()];
                    } else if (_this.tscId) {
                        // get the available puis for this organisation
                        promises = [_this.getCommonPuis(), _this.getAllPuiOnOrganization(_this.tscId)];
                    } else if (common.isTeliaAdmin) {
                        promises = [corpAdministrationService.getAllPuis()];
                    } else {
                        promises = [corpAdministrationService.getCommonPuis()];
                    }

                    $q.all(promises).then(function(data) {
                        var puis = _.flatten(data);
                    
                        // filter this list 
                        /*puis = _.filter(puis, function(item) {
                            return _.find(puiOnRoles, function(x) {
                                return x === item.name;
                            });
                        });*/

                        _this.availablePuis.resolve(puis);
                        
                        if (_this.managePuiAttributes) {
                            return corpAdministrationService.getPuisOnProfile(_this.tcwssId, _this.tscId);
                        }
                    
                    }).then(function(data) {
                        if (data) {
                            var puis = $.map(data, function(item) { return { name: item.pui.name, attributes: item.attributes }; });
                            _this.profilePuis.resolve(puis);
                        }
                    });

                });
            
            });
        };

        Instance.prototype.getId = function() {
            return this.id;
        };

        // this loads the data for the instance
        Instance.prototype.loadData = function() {
            
            if (!this.loading) {

                this.loading = true;
 
                var tscId = this.tscId;
                var _this = this;

                var complete = function(data) {
                    if (_this.tscId !== tscId) {
                        return;
                    }

                    _this.availableRoles.resolve(data);

                };
                
                // check if this is for an organisation
                if (this.tscId) {
                    corpAdministrationService.getAllRoles(this.tscId).then(complete);
                } else {
                    corpAdministrationService.getAllSystemRoles().then(complete);
                }

            }
        };

        Instance.prototype.setAvailableRoles = function(roles, puis) {
            this.loading = false;
            this.availableRoles.resolve(roles);
            if (puis) {
                this.rolesHasPuis = true;
            }
        };

        Instance.prototype.getCommonPuis = function() {
            if (this.commonPuis) {
                var deferred = $q.defer();
                deferred.resolve(this.commonPuis);
                return deferred.promise;
            }
            return corpAdministrationService.getCommonPuis();
        };

        Instance.prototype.getAllPuiOnOrganization = function(tscId) {
            if (this.puisOnOrganisation) {
                var deferred = $q.defer();
                deferred.resolve(this.puisOnOrganisation);
                return deferred.promise;
            }
            return corpAdministrationService.getAllPuiOnOrganization(tscId);
        };

        Instance.prototype.setCommonPuis = function(puis) {
            this.commonPuis = puis;
        };

        Instance.prototype.setPuisOnOrganisation = function(puis) {
            this.puisOnOrganisation = puis;
        };

        Instance.prototype.loadPuiAttributes = function() {

            var _this = this;
 
            var _puiPromise = $q.defer();
            _this.getSelectedPuiNames(function(data) {
                _puiPromise.resolve(data);
            });

            $q.all([_this.profilePuis.promise, _puiPromise.promise, _this.availablePuis.promise]).then(function(data) {
                // profile puis is loaded
                // loop through them and load attributes for the rest
                // filter out the puis not in the availablepuis list
                
                var profilePuis = data[0];
                var selectedPuiNames = data[1];
                var availablePuis = data[2];

                var promises = [];
                var names = [];
                var puis = $.grep(selectedPuiNames, function(item) {
                    return $.grep(availablePuis, function(x) {
                        return x.name === item;
                    }).length > 0;
                });

                $.each(puis , function(index, item) {
                    var found = $.grep(profilePuis, function(x) { return x.name === item; });
                    if (!found.length) {
                        names.push(item);
                        promises.push(corpAdministrationService.getAttributesOnPui(item));
                    }
                });

                $q.all(promises).then(function(data) {

                    $.each(data, function(index, item) {
                        profilePuis.push({ name: names[index], attributes: $.map(item, function(x) { return $.extend({ value: null }, x); }) });
                    });

                    _this.attributePuis = $.map($.grep(profilePuis, function(item) { return item.attributes && item.attributes.length; }), function(item) {
                        return $.extend(item, { displayName: translationPUI.translate(item.name) });
                    });

                });
            });

        };

        Instance.prototype.setSelectedRoleIds = function(ids, force) {

            var _this = this;
            
            // ignore if there is no change
            if (_.isEqual(ids, _this._selectedRoleIds) && !force) {
                return;
            }

            _this._selectedRoleIds = ids;
            _this.selectedRoleIds = $q.defer();
            _this.selectedRoleIds.resolve(ids);
            

            $q.all([_this.availableRoles.promise, _this.availablePuis.promise]).then(function(data) {

                var names = _.uniq(_.pluck(_.flatten(_.pluck(_.filter(data[0], function(item) {
                        return _.contains(ids, item.id);
                    }), 'puis')), 'name'));
                
                _this.setSelectedPuiNames(names);

            });

        };

        Instance.prototype.updateSelectedRoleIds = function() {
            this.setSelectedRoleIds(this._selectedRoleIds, true);
        };

        Instance.prototype.addSelectedRoleIds = function(ids) {
            this.setSelectedRoleIds(_.union(this._selectedRoleIds, ids));
        };

        Instance.prototype.removeSelectedRoleIds = function(ids) {
            this.setSelectedRoleIds(_.without.apply(null, [this._selectedRoleIds].concat(ids)));
        };

        Instance.prototype.setRoleIdsEnabled = function(roleIds, enabled) {
            this.availableRoles.promise.then(function(data) {
                _.each(data, function(item) {
                    if (_.contains(roleIds, item.id)) {
                        item.$disabled = !enabled;
                    }
                });
            });
        };

        Instance.prototype.setSelectedPuiNames = function(names) {

            var sorted = _.sortBy(names);

            if (_.isEqual(sorted, this._selectedPuiNames)) {
                return;
            }

            this._selectedPuiNames = sorted;
            this.selectedPuiNames = $q.defer();
            this.selectedPuiNames.resolve(sorted);

        };

        Instance.prototype.setTscId = function(id) {
            this.tscId = id;
        };

        Instance.prototype.setTcwssId = function(id) {
            this.tcwssId = id;
        };
        
        // listener for available roles. will trigger callback each time the roles are updated
        Instance.prototype.getAvailableRoles = function(callback) {
            var _this = this;
            $rootScope.$watch(function() { return _this.availableRoles.promise; }, function(a, b) {
                _this.availableRoles.promise.then(function(data) { callback(data, _this.id); });
            });
        };
        
        // listener for selected roles. will trigger callback each time the roles are updated
        Instance.prototype.getSelectedRoleIds = function(callback) {
            var _this = this;
            if (callback) {
                $rootScope.$watch(function() { return _this.selectedRoleIds.promise; }, function(a, b) {
                    _this.selectedRoleIds.promise.then(function(data) { callback(data, _this.id); });
                });
            } else {
                return _this.selectedRoleIds.promise;
            }
        };

        Instance.prototype.getSelectedRoles = function(callback) {
            var _this = this;
            console.log('SERVICE: getSelectedRoles');
            $rootScope.$watch(function() { return _this.selectedRoleIds.promise; }, function(a, b) {
                _this.selectedRoleIds.promise.then(function(data) {
                    _this.availableRoles.promise.then(function(roles) {
                        callback(_.filter(roles, function(role) {
                            return _.contains(data, role.id);
                        }), _this.id);
                    });
                });
            });
        };

        // listener for available puis. will trigger callback each time the puis are updated
        Instance.prototype.getAvailablePuis = function(callback) {
            var _this = this;
            console.log("SERVICE: getAvailablePuis");
            $rootScope.$watch(function() { return _this.availablePuis.promise; }, function(a, b) {
                _this.availablePuis.promise.then(function(data) { callback(data, _this.id); });
            });
        };

        // listener for selected puis. will trigger callback each time the puis are updated
        Instance.prototype.getSelectedPuiNames = function(callback) {
            var _this = this;
            $rootScope.$watch(function() { return _this.selectedPuiNames.promise; }, function(a, b) {
                _this.selectedPuiNames.promise.then(function(data) { callback(data, _this.id); });
            });
        };

        var rolesService = {};

        rolesService.accessReadOnly = false;
        rolesService.combineRolesEnabled = true;
        rolesService.organizationTscid = null;
        rolesService.tcwssUserId = null;
        rolesService.organizationAdminMode = false;

        rolesService.availableRoles = null;
        rolesService.availablePuis = null;

        rolesService.selectedRoles = [];
        rolesService.selectedRoleIds = [];
        rolesService.selectedPuiNames = [];

        rolesService.profilePuis = null;
        rolesService.attributePuis = null;

        rolesService.profilePuisPromise = $q.defer();
        rolesService.selectedPuiNamesPromise = $q.defer();

        rolesService.managePuiAttributes = false;

        var removeDuplicates = function(items) {
            var uniqueItems = [];
            $.each(items, function(i, el){
                if($.inArray(el, uniqueItems) === -1) {
                    uniqueItems.push(el);
                }
            });
            return uniqueItems;
        };

        rolesService.selectRoles = function (roles) {
            var newRoleIds = $.map(roles, function (role) { return role.id; });
            // Identical elements, return to avoid watch loops
            if (compareArrays(newRoleIds, rolesService.selectedRoleIds)) {
                return;
            }

            var selectedPuiNames = rolesService.selectedPuiNames.slice(0);
            var oldRolePuis = $.map(rolesService.selectedRoles, function (role) { return role.puis; });
            var newRolePuis = removeDuplicates($.map(roles, function (role) { return role.puis; }));

            var oldRolePuiNames = $.map(oldRolePuis, function(pui) { return pui.name; });
            var newRolePuiNames = $.map(newRolePuis, function(pui) { return pui.name; });

            /* We don't want this select and deselect to affect PUIs that are selected manually */
            var deselectPuis = [];
            $.each(oldRolePuiNames, function(i, el) {
                if ($.inArray(el, newRolePuiNames) === -1) {
                    deselectPuis.push(el);
                }
            });

            var selectPuis = [];
            $.each(newRolePuiNames, function(i, el) {
                if ($.inArray(el, oldRolePuiNames) === -1) {
                    selectPuis.push(el);
                }
            });


            rolesService.selectedRoles = roles;
            rolesService.selectedRoleIds = newRoleIds;

            $.each(deselectPuis, function(i, el) {
                if ($.inArray(el, selectedPuiNames) !== -1) {
                    selectedPuiNames.splice(selectedPuiNames.indexOf(el), 1);
                }
            });

            $.each(selectPuis, function(i, el) {
                if ($.inArray(el, selectedPuiNames) === -1) {
                    selectedPuiNames.push(el);
                }
            });

            rolesService.selectPuiNames(selectedPuiNames);
            rolesService.selectedPuiNamesPromise.resolve();
        };

        rolesService.selectPuiNames = function (puis) {
            if (puis.length > 0 && puis[0].name !== undefined) {
                throw new Error("selectPuiNames expects array of strings (pui names), but got array of Pui objects.");
            }
            // Identical elements, return to avoid watch loops
            if (compareArrays(puis, rolesService.selectedPuiNames)) {
                return;
            }
            rolesService.selectedPuiNames = puis;
        };

        var dataOrganizationTscid = null;
        var dataOrganizationMode = null;

        function loadRoleData() {
            var organizationTscid = rolesService.organizationTscid;
            var rolesPromise;
            if (organizationTscid > 0) {
                rolesPromise = corpAdministrationService.getAllRoles(organizationTscid);
            } else {
                // No organization selected = only have access to system roles
                rolesPromise = corpAdministrationService.getAllSystemRoles();
            }

            rolesPromise.then(function (allRoles) {
                // Later call has been done, discard results
                if (organizationTscid !== dataOrganizationTscid) {
                    return;
                }
                corpAdministrationService.fillPuisOnRoles(allRoles).then(function () {
                    rolesService.availableRoles = allRoles;
                });
            });
        }

        function loadPuiData() {
            var organizationTscid = rolesService.organizationTscid;
            var userId = rolesService.tcwssUserId;
            var organizationAdminMode = rolesService.organizationAdminMode;

            var promises = [];
            if (organizationAdminMode) {
                promises = [corpAdministrationService.getUncommonPuis()];
            } else {
                if (organizationTscid > 0) {
                    promises = [corpAdministrationService.getCommonPuis(), corpAdministrationService.getAllPuiOnOrganization(organizationTscid)];
                } else {
                    if (common.isTeliaAdmin) {
                        promises = [corpAdministrationService.getAllPuis()];
                    } else {
                        promises = [corpAdministrationService.getCommonPuis()];
                    }
                }
            }
            var merged = [];
            $q.all(promises).then(function (data) {
                // Old request, discard response
                if (organizationTscid !== dataOrganizationTscid || organizationAdminMode !== dataOrganizationMode) {
                    return;
                }
                $.each(merged.concat.apply(merged, data), function (i, el) {
                    // Avoid duplicates
                    if ($.grep(merged, function (pui) { return pui.name === el.name; }).length === 0) {
                        merged.push(el);
                    }
                });
                rolesService.availablePuis = merged;
                if (rolesService.managePuiAttributes) {
                    return corpAdministrationService.getPuisOnProfile(userId, organizationTscid);
                }
            }).then(function(data) {
                if (data) {
                    var puis = $.map(data, function(item) {
                        return { name: item.pui.name, attributes: item.attributes };
                    });
                    rolesService.profilePuis = puis;
                    rolesService.profilePuisPromise.resolve();
                }
            });
        }


        rolesService.loadData = function (init) {
            var organizationTscid = rolesService.organizationTscid;
            var organizationAdminMode = rolesService.organizationAdminMode;

            // Already requested this data, do not request again
            if (organizationTscid === dataOrganizationTscid && organizationAdminMode === dataOrganizationMode && !init) {
                return;
            }
            dataOrganizationTscid = organizationTscid;
            dataOrganizationMode = organizationAdminMode;

            loadRoleData();
            loadPuiData();
        };

        rolesService.loadPuiAttributes = function() {

            $q.all([rolesService.profilePuisPromise.promise, rolesService.selectedPuiNamesPromise.promise]).then(function() {
                // profile puis is loaded
                // loop through them and load attributes for the rest
                // filter out the puis not in the availablepuis list
                
                var promises = [];
                var names = [];
                var puis = $.grep(rolesService.selectedPuiNames, function(item) {
                    return $.grep(rolesService.availablePuis, function(x) {
                        return x.name === item;
                    }).length > 0;
                });

                $.each(puis , function(index, item) {
                    var found = $.grep(rolesService.profilePuis, function(x) {
                        return x.name === item;
                    });
                    if (!found.length) {
                        names.push(item);
                        promises.push(corpAdministrationService.getAttributesOnPui(item));
                    }
                });

                $q.all(promises).then(function(data) {

                    $.each(data, function(index, item) {
                        rolesService.profilePuis.push({ name: names[index], attributes: $.map(item, function(x) {
                                return $.extend({ value: null }, x);
                            })
                        });
                    });

                    rolesService.attributePuis = $.map($.grep(rolesService.profilePuis, function(item) { return item.attributes && item.attributes.length; }), function(item) {
                        return $.extend(item, { displayName: translationPUI.translate(item.name) });
                    });

                });
            });

        };

        var instances = [];

        return {

            getInstance: function(key) {
                key = key || "_default";
                var obj = _.find(instances, function(item) { return item.key === key; });
                if (!obj) {
                    obj = { key: key, value: new Instance(key) };
                    instances.push(obj);
                }

                return obj.value;
            },

        };

    }]);
});
