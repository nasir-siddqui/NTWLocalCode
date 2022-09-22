/*global define*/
/*jshint unused: false*/

define(['jquery', 'underscore', 'helpers/common'], function($, _, common) {
    "use strict";

    var delay = function(func, delay) {
        setTimeout(function() {
                func();
            },
            delay || 100
        );
    };

    var systemRoles = [
        { "id": 1, "roleName": "Super user", "description": "Super duper user!", "systemRole": true },
        { "id": 2, "roleName": "Portal admin", "description": "Ze portal admin.", "systemRole": true }
    ];

    var organizationRoles = [
        { "id": 3, "organizationTscid": "11111", "roleName": "Local mobile admin", "description": "Organization mobile operator.", "systemRole": false },
        { "id": 4, "organizationTscid": "22222", "roleName": "Happy org", "description": "Organization happy user.", "systemRole": false }
    ];

    var rolePuis = [
        { roleId: 1, puis: [{ name: "ma" }, { name: "sdw" }, { name: "m_subscription" }, { name: "m_phones" }, { name: "f_subscription" }, { name: "f_phones" }] },
        { roleId: 2, puis: [{ name: "sdw" }, { name: "1_aktuellt"} ] },
        { roleId: 3, puis: [{ name: "ma" }] },
        { roleId: 4, puis: [{ name: "1_outage" }, { name: "2_outage" }] }
    ];

    var userRoles = [
        { tcwssUserId: 1, roleIds: [1] },
        { tcwssUserId: 2, roleIds: [2,3] },
        { tcwssUserId: 4, roleIds: [1,4] }
    ];

    var puiOnProfile = [
        { tcwssId: 1, puis: [ { pui: { name: 'ma' }, attributes: [ { id: 1, displayName: 'Username', name: 'username', value: 'lzh182' } ] } ] }
    ];

    var invites = [
        {   inviteId: 1,
            inviteRoles: [
                { orgId: "11111", roleId: 1 },
                { orgId: "11111", roleId: 2 },
                { orgId: "22222", roleId: 2 },
                { orgId: "22222", roleId: 4 }
            ],
            firstName: "Christian",
            lastName: "Nagorka",
            mobileNumber: "0708471451",
            email: "christian@teliasonera.com",
            invitedBy: 3,
            acceptedBy: null,
            createDate: new Date(2014,5,30),
            status: "Accepted",
            acceptedDate: null,
            nonce: "12345",
            securePin: null,
            inviteText: "Här får du en inbjudan enl. överenskommelse"
        },
        {   inviteId: 2,
            inviteRoles: [
                { orgId: "11111", roleId: 1 },
                { orgId: "11111", roleId: 2 },
                { orgId: "22222", roleId: 2 },
                { orgId: "22222", roleId: 4 }
            ],
            firstName: "Christian",
            lastName: "Nagorka",
            mobileNumber: "0708471451",
            email: "christian@teliasonera.com",
            invitedBy: 2,
            acceptedBy: null,
            createDate: new Date(2014,6,1),
            status: "Pending",
            acceptedDate: null,
            nonce: "12345",
            securePin: null,
            inviteText: "Här får du en inbjudan enl. överenskommelse"
        },
        {   inviteId: 3,
            inviteRoles: [
                { orgId: "11111", roleId: 1 },
                { orgId: "11111", roleId: 2 },
                { orgId: "22222", roleId: 2 },
                { orgId: "22222", roleId: 4 }
            ],
            firstName: "Christian",
            lastName: "Nagorka",
            mobileNumber: "0708471451",
            email: "christian@teliasonera.com",
            invitedBy: 6,
            acceptedBy: null,
            createDate: new Date(2014,6,3),
            status: "Pending",
            acceptedDate: null,
            nonce: "12345",
            securePin: null,
            inviteText: "Här får du en inbjudan enl. överenskommelse"
        },
        {   inviteId: 4,
            inviteRoles: [
                { orgId: "11111", roleId: 1 },
                { orgId: "11111", roleId: 2 },
                { orgId: "22222", roleId: 2 },
                { orgId: "33333", roleId: 4 }
            ],
            firstName: "Christian",
            lastName: "Nagorka",
            mobileNumber: "0708471451",
            email: "christian@teliasonera.com",
            invitedBy: 2,
            acceptedBy: null,
            createDate: new Date(2014,6,2),
            status: "Pending",
            acceptedDate: null,
            nonce: "12345",
            securePin: null,
            inviteText: "Här får du en inbjudan enl. överenskommelse"
        }
    ];

    var users = [
        { tcwssUserId: 1, organizationTscid: "11111", userName: "kla", firstName: "Kalle", lastName: "Larsson", mobileNumber: "0700-198425", emailAddress: "kalle.larsson@teliasonera.com" },
        { tcwssUserId: 2, organizationTscid: "11111", userName: "lka", firstName: "Lasse", lastName: "Karlsson", mobileNumber: "0700-184575", emailAddress: "lasse.karlsson@teliasonera.com" },
        { tcwssUserId: 3, organizationTscid: "22222", userName: "kan", firstName: "Kalle", lastName: "Anka", mobileNumber: "0700-196577", emailAddress: "kalle.anka@regeringskansliet.se" },
        { tcwssUserId: 4, organizationTscid: "22222", userName: "ala", firstName: "Anka", lastName: "Larsson", mobileNumber: "0700-298544", emailAddress: "anka.larsson@regeringskansliet.se" },
        { tcwssUserId: 5, organizationTscid: "22222", userName: "kka", firstName: "Kalle", lastName: "Karlsson", mobileNumber: "0700-938656", emailAddress: "kalle.karlsson@regeringskansliet.se" },
        { tcwssUserId: 7, organizationTscid: "33333", userName: "kka", firstName: "Arne", lastName: "Bengtsson", mobileNumber: "0700-938656", emailAddress: "kalle.karlsson@regeringskansliet.se" }
    ];

    var puis = [
        { name: "sdw", displayName: "Service Desk Web", type: "sso", common: false, attributes: [ { displayName: 'Username', name: 'username', id: 1 }, { id: 2, displayName: 'Agreement', name: 'agreement' } ] },
        { name: "ma", displayName: "Mobil administration", type: "sso", common: false },
        { name: "1_aktuellt", displayName: "Aktuellt f?r dig", type: "site_module/B2B_main", common: true, attributes: [ { id: 1, displayName: 'Username', name: 'username' }, { id: 2, displayName: 'Aggrement', name: 'agreement' } ] },
        { name: "1_outage", displayName: "Outage info", type: "site_module/B2B_main", common: true },
        { name: "2_circle", displayName: "Circle of Life", type: "site_module/B2B_second", common: true },
        { name: "2_aktuellt", displayName: "Aktuellt f?r dig", type: "site_module/B2B_second", common: true },
        { name: "2_outage", displayName: "Outage info", type: "site_module/B2B_second", common: true },
        { name: "m_subscription", displayName: "Abonnemang", type: "orderflow/mobile", common: true, attributes: [ { id: 3, displayName: 'Test', name: 'test' } ] },
        { name: "m_phones", displayName: "Telefoner", type: "orderflow/mobile", common: true },
        { name: "f_subscription", displayName: "Abonnemang", type: "orderflow/fixed", common: true },
        { name: "f_phones", displayName: "Telefoner", type: "orderflow/fixed", common: true }
    ];

    var requests = [
        { id: 6, tcwssUserId: 6, organizationTscid: "11111", userName: "bcl", firstName: "Classe", lastName: "Basse", mobilenumber: "0701-123456", email: "basse@application.se", accessRequestType: "?", organizationNumber: "5566369707" }
    ];

    var organizations = [
        {
            organizationNumber: "1111111111",
            organizationTscid: "11111",
            name: "TeliaSonera",
            containsInMasterGroup: false
        },
        {
            organizationNumber: "2222222222",
            organizationTscid: "22222",
            name: "Regeringskansliet",
            containsInMasterGroup: false
        },
        {
            organizationNumber: "2222222223",
            organizationTscid: "22223",
            name: "RegeringskanslietA",
            containsInMasterGroup: true
        },
        {
            organizationNumber: "2222222224",
            organizationTscid: "22224",
            name: "RegeringskanslietB",
            containsInMasterGroup: false
        },
        {
            organizationNumber: "2222222225",
            organizationTscid: "22225",
            name: "RegeringskanslietC",
            containsInMasterGroup: false
        },
        {
            organizationNumber: "3333333333",
            organizationTscid: "33333",
            name: "Svenska kyrkan",
            containsInMasterGroup: false
        }
    ];

    var groupInformation = [
        { 
            name: "IKEA",
            phone: "0701234567",
            website: "",
            cost: 1,
            afNumber: "111",
            contactPerson: "Erik",
            profitabilitySegment: "Retail"
        },
        {  
            name: "Regeringen",
            phone: "0707654321",
            website: "",
            cost: 2,
            afNumber: "222",
            contactPerson: "Johan",
            profitabilitySegment: "Retail"
        }
    ];

    var inviteInfo = [
        {
            inviteId: 1,
            inviteToken: "12345",
            info: {
                roles: {
                    "1": _.extend({}, _.find(systemRoles, function(x) { return x.id === 1; }), { puis: _.map(_.find(rolePuis, function(y) { return y.roleId === 1; }).puis, function(y) { return _.find(puis, function(z) { return z.name === y.name; }); }) }),
                    "2": _.extend({}, _.find(systemRoles, function(x) { return x.id === 2; }), { puis: _.map(_.find(rolePuis, function(y) { return y.roleId === 2; }).puis, function(y) { return _.find(puis, function(z) { return z.name === y.name; }); }) }),
                    "3": _.extend({}, _.find(organizationRoles, function(x) { return x.id === 3; }), { puis: _.map(_.find(rolePuis, function(y) { return y.roleId === 3; }).puis, function(y) { return _.find(puis, function(z) { return z.name === y.name; }); }) }),
                    "4": _.extend({}, _.find(organizationRoles, function(x) { return x.id === 4; }), { puis: _.map(_.find(rolePuis, function(y) { return y.roleId === 4; }).puis, function(y) { return _.find(puis, function(z) { return z.name === y.name; }); }) })
                },
                commonPuis: _.where(puis, { common: true }),
                organisations: {
                    "11111": _.find(organizations, function(x) { return x.organizationTscid === "11111"; }),
                    "22222": _.find(organizations, function(x) { return x.organizationTscid === "22222"; })
                },
                orgPuis: {
                    "11111": _.where(puis, { common: false }),
                    "22222": _.where(puis, { common: false })
                }
            }
        }
    ];

    return {
        accepteInvite: function(id, nounce, tcwssId, cb) {

        },
        createMasterGroup: function(organisationNumbers, name, phone, website, cost, afNumber, contactPerson, profitabilitySegment, selectedPUIs, cb) {
            console.log("MOCK: createMasterGroup", organisationNumbers, name, phone, website, cost, afNumber, contactPerson, profitabilitySegment, selectedPUIs);
            delay(function() {
                var item = _.find(groupInformation, function(item) {
                    return item.afNumber === afNumber;
                });
                if (item) {
                    cb.callback(item);
                } else {
                    cb.errorHandler("ERROR_CANNOT_CREATE_MAIN_GROUP");
                }
            }, 1000);
        },
        getInvitesOnOrganisation: function(organizationTscid, status, cb) {
            console.log("MOCK: getInvitesOnOrganization", organizationTscid, status);
            delay(function() {
                var list = _.filter(invites, function(item) { return item.status === status && _.find(item.inviteRoles, function(x) { return x.orgId === organizationTscid; }); });
                list = _.map(list, function(item) { return _.clone(item); });
                cb.callback(list);
            }, 1000);
        },
        getInvite: function(id, cb) {
            console.log("MOCK: getInvite", id);
            delay(function() {
                var item = _.find(invites, function(item) { return item.inviteId === id; });
                if (item) {
                    cb.callback(item);
                } else {
                    cb.errorHandler("INVITE_DOES_NO_EXIST");
                }
            }, 1000);
        },
        getInvite2: function(id, token, cb) {
            console.log("MOCK: getInvite2", id, token);
            delay(function() {
                var item = _.find(invites, function(item) { return item.inviteId === id && item.nonce === token; });
                cb.callback(item);
            }, 1000);
        },
        getInviteInfo: function(id, token, cb) {
            console.log("MOCK: getInviteInfo", id, token);
            delay(function() {
                var info = _.find(inviteInfo, function(x) { return x.inviteId === id; });
                cb.callback(info.info);
            }, 1000);
        },
        sendSmsCode: function(text, inviteId, cb) {
            console.log("MOCK: sendSmsCode", text, inviteId);
            cb.callback(true);
        },
        validateSmsCode: function(inviteId, smsToken, cb) {
                console.log("MOCK: validateSmsCode", inviteId, smsToken);
                cb.callback(true);
        },

        acceptInvite: function(inviteId, nonce, smsToken, userId, cb) {
                console.log("MOCK: acceptInvite", inviteId, nonce, smsToken, userId);
                cb.callback();
            },

        getPuisOnProfile: function (tcwssId, organizationTscid, cb) {
            console.log("MOCK: getPuisOnProfile", tcwssId, organizationTscid);
            delay(function() {
                var match = $.grep(puiOnProfile, function(item) { return item.tcwssId === tcwssId; });
                if (match.length) {
                    cb.callback(match[0].puis);
                } else {
                    cb.callback([]);
                }
            }, 1000);
        },
        getAttributesOnPUI: function (name, cb) {
            console.log("MOCK: getAttributesOnPUI", name);
            delay(function() {
                var match = $.grep(puis, function(item) { return item.name === name && item.attributes && item.attributes.length; });
                if (match.length) {
                    cb.callback(match[0].attributes);
                } else {
                    cb.callback([]);
                }
            }, 1000);
        },
        setPUIAttributeOnProfile: function(id, userId, orgId, value, cb) {
            console.log("MOCK: setPUIAttributeOnProfile", id, userId, orgId, value);
            delay(function() {
                cb.callback();
            }, 1000);
        },
        deletePUIAttributeOnProfile: function(id, userId, orgId, cb) {
            console.log("MOCK: deletePUIAttributeOnProfile", id, userId, orgId);
            delay(function() {
                cb.callback();
            }, 1000);
        },
        createOrganizationRole: function (organizationTscid, displayName, description, puis, cb) {
            console.log("MOCK: createOrganizationRole", displayName, description, puis);
            delay(function () {
                if (_.find(organizationRoles, function(item) { return item.roleName === displayName; })) {
                    cb.errorHandler("DUPLICATE");
                } else {
                    cb.callback();
                }
            }, 1000);
        },
        updateOrganizationRole: function (organizationTscid, roleId, displayName, description, puis, cb) {
            console.log("MOCK: updateOrganizationRole", organizationTscid, roleId, displayName, description, puis);
            delay(function () {
                var match = $.grep(organizationRoles, function (role) { return role.organizationTscid === organizationTscid && role.id === roleId; });
                if (match.length > 0) {
                    cb.callback();
                }
                else {
                    cb.callback(null);
                }
            }, 1000);

        },
        deleteOrganizationRole: function (organizationTscid, roleId, cb) {
            console.log("MOCK: deleteOrganizationRole", organizationTscid, roleId);
            delay(function () {
                var match = $.grep(organizationRoles, function (role) { return role.organizationTscid === organizationTscid && role.id === roleId; });
                if (match.length > 0) {
                    cb.callback();
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        getOrganizationRole: function (organizationTscid, roleId, cb) {
            console.log("MOCK: getOrganizationRole", organizationTscid, roleId);
            delay(function () {
                var match = $.grep(organizationRoles, function (role) { return role.organizationTscid === organizationTscid && role.id === roleId; });
                $.each(match, function () {
                    var that = this;
                    this.puis = $.grep(rolePuis, function (role) { return role.roleId === that.id; })[0].puis;
                });
                if (match.length > 0) {
                    cb.callback(match[0]);
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        getSystemRole: function (roleId, cb) {
            console.log("MOCK: getSystemRole", roleId);
            delay(function () {
                var match = $.grep(systemRoles, function (role) { return role.id === roleId; });
                $.each(match, function() {
                    var that = this;
                    this.puis = $.grep(rolePuis, function (role) { return role.roleId === that.id; })[0].puis;
                });
                if (match.length > 0) {
                    cb.callback(match[0]);
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        createSystemRole: function (displayName, description, puiNames, cb) {
            console.log("MOCK: createSystemRole", displayName, description, puiNames);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        updateSystemRole: function (roleId, displayName, description, puiNames, cb) {
            console.log("MOCK: updateSystemRole", roleId, displayName, description, puiNames);
            delay(function () {
                var match = $.grep(systemRoles, function (role) { return role.id === roleId; });
                if (match.length > 0) {
                    cb.callback();
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        deleteSystemRole: function (roleId, cb) {
            console.log("MOCK: deleteSystemRole", roleId);
            delay(function () {
                var match = $.grep(systemRoles, function(role) { return role.id === roleId; });
                if (match.length > 0) {
                    cb.callback();
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        getAllRoles: function (organizationTscid, cb) {
            console.log("MOCK: getAllRoles", organizationTscid);
            delay(function () {
                cb.callback(systemRoles.concat($.grep(organizationRoles, function(role) { return role.organizationTscid === organizationTscid; })));
            }, 2000);
        },
        getAllOrganizationRoles: function (organizationTscid, cb) {
            console.log("MOCK: getAllOrganizationRole", organizationTscid);
            delay(function () {
                cb.callback(organizationRoles);
            }, 2000);
        },
        getAllSystemRoles: function (cb) {
            console.log("MOCK: getAllSystemRoles");
            delay(function () {
                // clone the entire array
                cb.callback($.extend(true, [], systemRoles));
            }, 1000);
        },
        getRolesOnUser: function (organizationTscid, tcwssUserId, cb) {
            console.log("MOCK: getRolesOnUser", organizationTscid, tcwssUserId);
            delay(function () {
                var roleIds = $.map($.grep(userRoles, function (userRole) { return userRole.tcwssUserId === tcwssUserId; }), function (ur) { return ur.roleIds; });
                if (roleIds.length === 0) {
                    cb.callback([]);
                }
                else {
                    cb.callback($.grep(systemRoles.concat(organizationRoles), function (role) { return $.inArray(role.id, roleIds) >= 0; }));
                }
            }, 1000);
        },
        getRolesOnProfile: function (organizationTscid, cb) {
            console.log("MOCK: getRolesOnProfile", organizationTscid);
            delay(function () {
                var roleIds = $.map($.grep(userRoles, function (userRole) { return userRole.tcwssUserId === common.userId; }), function (ur) { return ur.roleIds; });
                if (roleIds.length === 0) {
                    cb.callback([]);
                }
                else {
                    cb.callback($.grep(systemRoles.concat(organizationRoles), function (role) { return $.inArray(role.id, roleIds) >= 0; }));
                }
            }, 1000);
        },
        getUsersOnOrganization: function (organizationTscid, cb) {
            console.log("MOCK: getUsersOnOrganization", organizationTscid);
            delay(function () {
                var list = $.grep(users, function (user) { return user.organizationTscid === organizationTscid; });
                console.log('getUsersOnOrganization', organizationTscid, list);
                cb.callback(list);
            }, 1000);
        },
        getUser: function (organizationTscid, tcwssUserId, cb) {
            console.log("MOCK: getUser", organizationTscid, tcwssUserId);
            delay(function () {
                if (!_.find(organizations, function(x) { return x.organizationTscid === organizationTscid; })) {
                    cb.errorHandler("ACCESS_DENIED");
                    return;
                }
                var match = $.grep(users, function (user) { return user.tcwssUserId === tcwssUserId && user.organizationTscid === organizationTscid; });
                if (match.length > 0) {
                    cb.callback(match[0]);
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        setRolesOnUser: function (organizationTscid, tcwssUserId, roleIds, cb) {
            console.log("MOCK: setRolesOnUser", organizationTscid, tcwssUserId, roleIds);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        deleteProfile: function (tcwssUserId, organizationTscid, cb) {
            console.log("MOCK: deleteProfile", tcwssUserId, organizationTscid);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        cancelInvite: function (id, cb) {
            console.log("MOCK: cancelInvite", id);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        getPendingRequests: function (cb) {
            console.log("MOCK: getPendingRequests");
            delay(function () {
                cb.callback(requests);
            }, 1000);
        },
        getPendingRequestsOrganization: function (organizationTscid, cb) {
            console.log("MOCK: getPendingRequestsOrganization", organizationTscid);
            delay(function () {
                cb.callback($.grep(requests, function (request) { return request.organizationTscid === organizationTscid; }));
            }, 1000);
        },
        acceptRequest: function (organizationTscid, tcwssUserId, cb) {
            console.log("MOCK: acceptRequest", organizationTscid, tcwssUserId);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        rejectRequest: function (organizationTscid, tcwssUserId, cb) {
            console.log("MOCK: rejectRequest", organizationTscid, tcwssUserId);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        createAccessRequest: function(tcwssUserId, userName, firstName, lastName, mobilenumber, email, accessRequestType, orgNr, cb) {
            console.log("MOCK: createAccessRequest", tcwssUserId, userName, firstName, lastName, mobilenumber, email, accessRequestType, orgNr);
            delay(function() {
                cb.callback();
            }, 1000);
        },
        getAllPuis: function (cb) {
            console.log("MOCK: getAllPuis");
            delay(function () {
                cb.callback(puis);
            }, 1000);
        },
        getCommonPuis: function (cb) {
            console.log("MOCK: getCommonPuis");
            delay(function () {
                cb.callback($.grep(puis, function(pui) {
                    return pui.common;
                }));
            }, 1000);
        },
        getAllPuiOnOrganization: function (organizationTscid, cb) {
            console.log("MOCK: getAllPuiOnOrganization", organizationTscid);
            delay(function () {
                cb.callback($.grep(puis, function (pui) {
                    return !pui.common;
                }));
            }, 1000);
        },
        getOrganization: function (organizationTscid, cb) {
            console.log("MOCK: getOrganization", organizationTscid);
            delay(function () {
                var match = $.grep(organizations, function (organization) { return organization.organizationTscid === organizationTscid; });
                if (match.length > 0) {
                    cb.callback(match[0]);
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        deleteOrganization: function (organizationTscid, cb) {
            console.log("MOCK: deleteOrganization", organizationTscid);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        setPuisOnOrganization: function (organizationTscid, puiNames, cb) {
            console.log("MOCK: setPuisOnOrganization", organizationTscid, puiNames);
            delay(function () {
                cb.callback();
            }, 1000);
        },
        getOrganizationByOrgNr: function (organizationNumber, cb) {
            console.log("MOCK: getOrganizationByOrgNr", organizationNumber);
            delay(function () {
                var match = $.grep(organizations, function (organization) { return organization.organizationNumber === organizationNumber; });
                if (match.length > 0) {
                    cb.callback(match[0]);
                }
                else {
                    cb.callback(null);
                }
            }, 1000);
        },
        createOrganizationIfNotExists: function (organizationNumber, cb) {
            console.log("MOCK: createOrganizationIfNotExists", organizationNumber);
            delay(function () {
                if (organizationNumber === "3333333333") {
                    cb.callback("33333");
                } else {
                    cb.errorHandler("AGORA_ERROR_ORGANISATION_DOES_NOT_EXIST_IN_ALPHA");
                }
            }, 1000);
        },

        createInvite: function(email, mobile, firstName, lastName, inviteText, roles, cb) {
            console.log("MOCK: createInvite", email, mobile, firstName, lastName, inviteText, roles);
            delay(function() {
                cb.callback(1);
            }, 1000);
        },

        updateInvite: function(id, email, mobile, firstName, lastName, inviteText, roles, cb) {
            console.log("MOCK: updateInvite", id, email, mobile, firstName, lastName, inviteText, roles);
            delay(function() {
                //cb.errorHandler("AGORA_ERROR_UNABLE_TO_UPDATE_INVITE");
                cb.callback(true);
            }, 1000);
        },

        isInviteNonceValid: function(id, nonce, cb) {
            console.log("MOCK: isInviteNonceValid", id, nonce);
            delay(function() {
                console.log(nonce === "12345");
                cb.callback(nonce === "12345");
            }, 1000);
        },

        getOrganizations: function(orgs, cb) {
            delay(function() {
                var list = _.filter(organizations, function(org) {
                    return _.find(orgs, function(x) { return x === org.organizationNumber; });
                });
                var errors = _.difference(orgs, _.pluck(list, 'organizationNumber'));
                cb.callback({
                    organisations: list,
                    errors: errors
                });
            }, 1000);
        },

        organizationSearch: function(text, cb) {
            delay(function() {
                var re = new RegExp("^" + text, "i");
                console.log(re);
                var list = _.filter(organizations, function(org) {
                    return re.test(org.name) || text.replace("-", "") === org.organizationNumber;
                });
                cb.callback(list);
            }, 400);
        },

        getOrganizationsInGroup: function(cb) {
            delay(function() {
                cb.callback(organizations);
            }, 1000);
        }

    };

});
