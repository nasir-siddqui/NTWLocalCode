/*global require*/

require.config({
    baseUrl: "/framework/assets/js/internal",
    urlArgs: "v=" + (new Date()).getTime(),
    waitSeconds: 60,
    paths: {
        "jquery" : "../external/libs/jquery/jquery-1.10.2.min",
        "angular-services": "angular/tse-services",
        "local": "../../../../projects/NTW/assets/js",
        "eventie": "../external/bower_components/eventie",
        "doc-ready": "../external/bower_components/doc-ready",
        "eventEmitter": "../external/bower_components/eventEmitter",
        "get-style-property": "../external/bower_components/get-style-property",
        "get-size": "../external/bower_components/get-size",
        "matches-selector": "../external/bower_components/matches-selector",
        "outlayer": "../external/bower_components/outlayer",
        "masonry": "../external/bower_components/masonry",
        "imagesloaded": "../external/bower_components/imagesloaded",
        "errorKeyTranslation": "pagespecific/errorKeyTranslation.js?lang=" + document.documentElement.getAttribute('lang'),
        "angular": "../external/bower_components/angular/angular.min",
        "angular-sanitize": "../external/bower_components/angular-sanitize/angular-sanitize.min",
        "angular-route": "../external/angular/libs/angular-route.min",
        "angular-resource": "../external/angular/libs/angular-resource.min",
        "angular-table": "../../../../projects/NTW/assets/js/external/ng-table",
        "jsPDF": "../external/libs/misc/jspdf.min",
        "placeholders": "../external/libs/misc/placeholders.min",
        "underscore": "../external/bower_components/underscore/underscore",
        "translationStart": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/start/summary/summary",
        "translationPUI": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/manage/roles_user/pui",
        "translationManageUser": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/manage/roles_user/user",
        "translationInvite": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/manage/roles_user/invite",
        "translationCommon": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=common/common",
        "translationSavedOrganizations": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/admin/savedOrganizations",
        "translationDCF": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/order/dcf",
        "translationGroup": "pagespecific/translation.js?lang=" + document.documentElement.getAttribute('lang') + "&data=mybusiness/manage/group",
        "libs/jquery/jquery.backgroundSize": "../external/libs/jquery/jquery.backgroundSize",
        "libs/jquery/jquery.csv-0.71.min": "../external/libs/jquery/jquery.csv-0.71.min",
        "libs/jquery/jquery-ui-1.10.3.mybusiness.min": "../external/libs/jquery/jquery-ui-1.10.3.mybusiness.min",
        "libs/jquery/jquery.validate.min": "../external/libs/jquery/jquery.validate.min",
        "libs/jquery/jquery.dataTables": "../external/libs/jquery/jquery.dataTables",
        "libs/jquery/jquery.jsviews": "../external/libs/jquery/jquery.jsviews",
        "libs/hash/hash": "../external/libs/hash/hash",
        "libs/misc/raphael-min": "../external/libs/misc/raphael-min",
        "poly-checked": "../external/libs/jquery/poly-checked.min",
        "jquery-ui": "../external/libs/jquery/jquery-ui-mybusiness",
        
        // added for new js structure in git
        "helpers": "./pagespecific",
        "modules": "./components",
        "common/utils": "./globals/common/utils",
        "common/extensions": "./globals/common/extensions",
        "elements": "./components",
        "local/queryStringHelper": "../../../../projects/NTW/assets/js/internal/queryStringHelper",

		//"jquery.validation": "components/jquery.validation",
        "jquery.validate.unobtrusive": "../../../../Scripts/jquery.validate.unobtrusive.min",
        "jquery.validate.unobstrusive.advanced": "../../../../Scripts/advancedModelValidation"
    },
    shim: {
        "libs/jquery/jquery.backgroundSize" : ["jquery"],
        "libs/jquery/jquery.csv-0.71.min" : ["jquery"],
        "libs/jquery/jquery-ui-1.10.3.mybusiness.min" : ["jquery"],
        "libs/jquery/jquery.validate.min" : ["jquery"],
        "angular" : {
            deps: ["jquery"],
            exports: "angular"
        },
        "angular-route": [ "angular" ],
        "angular-resource": ["angular"],
        "angular-sanitize": ["angular"],
        "modules/rating": ["../external/libs/misc/chart.min"],
        "../external/libs/hash/hash": {
            exports: "hash"
        },
        "poly-checked": ["jquery"],
        "jquier-ui": ["jquery"],
    },
    map: {
        '*': {
            'local/angularApplications/services/selectedRolesService': 'local/angularApplications/services/selectedRolesService2',
            'local/angularApplications/manageUser': 'local/angularApplications/manageUser2',
            'local/angularApplications/manageroles': 'local/angularApplications/manageroles2',
            'local/angularApplications/manageProfile': 'local/angularApplications/manageProfile2',
            'local/angularApplications/manageOrganization': 'local/angularApplications/manageOrganization2',
            'local/angularApplications/accessTree': 'local/angularApplications/accessTree2',
            'local/angularApplications/combineRoles': 'local/angularApplications/combineRoles2'
        }
    },
    packages: [
        { name: "dwr", location: "../../../../projects/NTW/assets/js/mock" },
        { name: "service", location: "../../../../projects/NTW/assets/js/mock" }
    ],
    deps: ["local/init-require"]
});

define('constants', function () {
    
    if (String.prototype.substituteUrlParameters === undefined) {
        String.prototype.substituteUrlParameters = function (obj) {
            var result = this;
            var matches = this.match(/{.+?}/g);
            if (matches === null) {
                return result;
            }

            for (var i = 0; i < matches.length; i++) {
                var match = $.trim(matches[i].substring(1, matches[i].length - 1));

                var defaultValue = null;
                var defaultValueIndex = match.indexOf("||");
                if (defaultValueIndex > 0) {
                    defaultValue = $.trim(match.substring(defaultValueIndex + 2));
                    match = $.trim(match.substring(0, defaultValueIndex));
                }

                var value = obj[match] || defaultValue;

                result = result.replace(matches[i], value);
            }
            return result;
        };
    }

    return {
        baseUrl: "page-start.php?org={0}",
        loginUrl: "page-login.php",
        registerUrl: "page-account-registration.php",
        loginUrlSMS: "page-login.php?method=sms",
        loginUrlSafeword: "page-login.php?method=safeword",
        lastAccessTimeUrl: "page-last-access-time.php",
        automaticLogoutLink: "page-login.php?automaticLogout=true",
        customTableTemplateUrl: 'assets/js/angularApplications/customTableTemplate.html',
        manageCustomTableTemplateUrl: 'assets/js/angularApplications/manageCustomTableTemplate.html',
        accessTreeTemplateUrl: 'assets/js/angularApplications/accessTreeTemplate.html',
        accessListTemplateUrl: 'assets/js/angularApplications/accessListTemplate.html',
        combineRolesTemplateUrl: 'assets/js/angularApplications/combineRolesTemplate.html',
        savedOrganizationsTemplateUrl: 'assets/js/angularApplications/savedOrganizationsTemplate.html',
        manageUserHomeTemplateUrl: 'assets/js/angularApplications/manageUserHomeTemplate.html',
        manageUserSummaryTemplateUrl: 'assets/js/angularApplications/manageUserSummaryTemplate.html',
        manageInviteTemplateUrl: 'assets/js/angularApplications/manageInviteTemplate.html',
        summaryTemplateUrl: 'assets/js/angularApplications/summaryTemplate.html',
        manageUsersTableUrl: 'page-manage-users-table.php',
        manageRolesTableUrl: 'page-manage-roles-table.php',
        manageUserUrl: 'page-manage-user-v2.php?{organizationTscid}&{tcwssUserId}',
        manageInviteUrl: 'page-manage-invite.php?{inviteId}',
        manageRoleUrl: "page-manage-roles-ng.php?{id}&{organizationTscid || 0}",
        adminManageUsersTableUrl: 'page-admin-manage-users.php',
        adminManageRolesTableUrl: 'page-admin-manage-roles.php',
        adminManageOrganizationTableUrl: 'page-admin-manage-organizations.php',
        adminManageUserUrl: 'page-manage-user-v2.php?{organizationTscid}&{tcwssUserId}',
        adminManageRoleUrl: 'page-manage-roles-ng.php?{id}&{organizationTscid || 0}',
        adminManageOrganizationUrl: "page-admin-manage-organization.php?{organizationTscid}",
        adminManageInviteUrl: 'page-manage-invite.php?{inviteId}',
        userRegistrationPostUrl: 'test/registerUserSuccess.php',
        userRegistrationSuccessUrl: 'blank.html',
        userInfo: "test/userinfo.php",
        changePassword: "test/changepassword.php",
        ordersAssignedToMeUrl: 'test/ordersAssignedToMe.html',
        savedOrderUrl: 'test/savedOrder.html',
        pendingRequestsUrl: 'test/pendingRequests.html',
        adminPendingRequestsUrl: 'test/pendingRequests.html',
        inviteSmsTokenUrl: 'test/inviteSmsToken.php',
        sendInviteEmailUrl: 'test/sendInviteEmail.php',
        sendInviteUpdateEmailUrl: 'test/sendInviteEmail.php',
        sendInviteDeleteEmailUrl: 'test/sendInviteEmail.php',
        organizationSearchTemplateUrl: 'assets/js/angularApplications/organizationSearchTemplate.html',
        companyContactsTemplateUrl: 'assets/js/angularApplications/companyContactsTemplate.html',
        dcfUrlRegexp: /page-orderflow-ng\.php/,
        manageUserUrlRegexp: /page-manage-user-v2\.php/,
        dcfTemplateUrl: 'assets/js/angularApplications/dcfTemplate.html',
        dcfFieldTemplateUrl: 'assets/js/angularApplications/dcfFieldTemplate.html',
        dcfSummaryFieldsTemplateUrl: 'assets/js/angularApplications/dcfSummaryFieldsTemplate.html',
        dcfShareDialogTemplateUrl: 'assets/js/angularApplications/dcfShareDialogTemplate.html',
        dcfInstanceUrl: "page-dcf-poc.php?dcf_instance={0}&dcf_organization={1}",
        dcfCancelUrl: "page-start.php",
        dcfDefinitionUrl : "data/form-{0}.json",
        manageGroupUrlRegexp: /page-manage-group\.php/,
        manageGroupTemplateUrl: 'assets/js/angularApplications/manageGroupTemplate.html',
        manageGroupCollectTemplateUrl: 'assets/js/angularApplications/manageGroupCollectTemplate.html',
        manageGroupMainTemplateUrl: 'assets/js/angularApplications/manageGroupMainTemplate.html',
        manageGroupOrganisationsTemplateUrl: 'assets/js/angularApplications/manageGroupOrganisationsTemplate.html',
        manageGroupBatchTemplateUrl: 'assets/js/angularApplications/manageGroupBatchTemplate.html',
        manageGroupSearchTemplateUrl: 'assets/js/angularApplications/manageGroupSearchTemplate.html',
        manageGroupCollectedOrganisationsUrl: 'data/collectedOrganisations.json'

    };
});


