define(['jquery', 'angular', 'underscore', 'constants', 'helpers/common', 'translationPUI', 'local/angularApplications/services/corpAdministrationService'], function($, ng, _, constants, common, translationPUI) {
    "use strict";

    var app = ng.module('selectedRolesService', ['corpAdministrationService']);

    function compareArrays(arr1, arr2) {
        return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
    }

    app.factory('selectedRolesService', ['$q', 'corpAdministrationService', function($q, corpAdministrationService) {
        var rolesService = {};

        rolesService.accessReadOnly = false;
        rolesService.combineRolesEnabled = true;
        rolesService.organizationTscid = common.orgTscid;
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
                if($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
            });
            return uniqueItems;
        };

        rolesService.selectRoles = function (roles) {
            var newRoleIds = $.map(roles, function (role) { return role.id; });
            if (compareArrays(newRoleIds, rolesService.selectedRoleIds)) return; // Identical elements, return to avoid watch loops

            var selectedPuiNames = rolesService.selectedPuiNames.slice(0);
            var oldRolePuis = $.map(rolesService.selectedRoles, function (role) { return role.puis; });
            var newRolePuis = removeDuplicates($.map(roles, function (role) { return role.puis; }));

            var oldRolePuiNames = $.map(oldRolePuis, function(pui) { return pui.name; });
            var newRolePuiNames = $.map(newRolePuis, function(pui) { return pui.name; });

            /* We don't want this select and deselect to affect PUIs that are selected manually */
            var deselectPuis = [];
            $.each(oldRolePuiNames, function(i, el) {
                if ($.inArray(el, newRolePuiNames) === -1) deselectPuis.push(el);
            });

            var selectPuis = [];
            $.each(newRolePuiNames, function(i, el) {
                if ($.inArray(el, oldRolePuiNames) === -1) selectPuis.push(el);
            });


            rolesService.selectedRoles = roles;
            rolesService.selectedRoleIds = newRoleIds;

            $.each(deselectPuis, function(i, el) {
                if ($.inArray(el, selectedPuiNames) !== -1) selectedPuiNames.splice(selectedPuiNames.indexOf(el), 1);
            });

            $.each(selectPuis, function(i, el) {
                if ($.inArray(el, selectedPuiNames) === -1) selectedPuiNames.push(el);
            });

            rolesService.selectPuiNames(selectedPuiNames);
            rolesService.selectedPuiNamesPromise.resolve();
        };

        rolesService.selectPuiNames = function (puis) {
            if (puis.length > 0 && puis[0].name !== undefined) {
                throw new Error("selectPuiNames expects array of strings (pui names), but got array of Pui objects.");
            }
            if (compareArrays(puis, rolesService.selectedPuiNames)) return; // Identical elements, return to avoid watch loops
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
                if (organizationTscid !== dataOrganizationTscid) return; // Later call has been done, discard results
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
            if (organizationAdminMode === true) {
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
                if (organizationTscid !== dataOrganizationTscid || organizationAdminMode !== dataOrganizationMode) return; // Old request, discard response
                $.each(merged.concat.apply(merged, data), function (i, el) {
                    if ($.grep(merged, function (pui) { return pui.name === el.name; }).length === 0) merged.push(el); // Avoid duplicates
                });
                rolesService.availablePuis = merged;
                if (rolesService.managePuiAttributes) {
                    return corpAdministrationService.getPuisOnProfile(userId, organizationTscid);
                }
            }).then(function(data) {
                if (data) {
                    var puis = $.map(data, function(item) { return { name: item.pui.name, attributes: item.attributes }; });
                    rolesService.profilePuis = puis;
                    rolesService.profilePuisPromise.resolve();
                }
            });
        }


        rolesService.loadData = function (init) {
            var organizationTscid = rolesService.organizationTscid;
            var organizationAdminMode = rolesService.organizationAdminMode;

            if (organizationTscid === dataOrganizationTscid && organizationAdminMode === dataOrganizationMode && !init) return; // Already requested this data, do not request again
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
                    var found = $.grep(rolesService.profilePuis, function(x) { return x.name === item; });
                    if (!found.length) {
                        names.push(item);
                        promises.push(corpAdministrationService.getAttributesOnPui(item));
                    }
                });

                $q.all(promises).then(function(data) {

                    $.each(data, function(index, item) {
                        rolesService.profilePuis.push({ name: names[index], attributes: $.map(item, function(x) { return $.extend({ value: null }, x); }) });
                    });

                    rolesService.attributePuis = $.map($.grep(rolesService.profilePuis, function(item) { return item.attributes && item.attributes.length; }), function(item) {
                        return $.extend(item, { displayName: translationPUI.translate(item.name) });
                    });

                });
            });

        };

        return rolesService;
    }]);
});
