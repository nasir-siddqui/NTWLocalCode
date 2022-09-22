({
    baseUrl: "../../../../framework/assets/js/internal",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "jquery" : "../external/libs/jquery/jquery-1.10.2.min",
        "angular-services": "angular/tse-services",
        "local" : "../../../../projects/b2bonline/assets/js",
        "eventie": "../external/bower_components/eventie",
        "doc-ready": "../external/bower_components/doc-ready",
        "eventEmitter": "../external/bower_components/eventEmitter",
        "get-style-property": "../external/bower_components/get-style-property",
        "get-size": "../external/bower_components/get-size",
        "matches-selector": "../external/bower_components/matches-selector",
        "outlayer": "../external/bower_components/outlayer",
        "masonry": "../external/bower_components/masonry",
        "imagesloaded": "../external/bower_components/imagesloaded",
        "errorKeyTranslation": "helpers/errorKeyTranslation.js?lang=" + "1",
        "angular": "../external/bower_components/angular/angular.min",
        "angular-sanitize": "../external/bower_components/angular-sanitize/angular-sanitize.min",
        "angular-route": "../external/angular/libs/angular-route.min",
        "angular-resource": "../external/angular/libs/angular-resource.min",
        "angular-table": "../../../../projects/b2bonline/assets/js/external/ng-table",
        "jsPDF": "../external/libs/misc/jspdf.min",
        "placeholders": "../external/libs/misc/placeholders.min",
        "underscore": "../external/bower_components/underscore/underscore",
        "translationStart": "helpers/translation.js?lang=" + "1" + "&data=mybusiness/start/summary/summary",
        "translationPUI": "helpers/translation.js?lang=" + "1" + "&data=mybusiness/manage/roles_user/pui",
        "translationManageUser": "helpers/translation.js?lang=" + "1" + "&data=mybusiness/manage/roles_user/user",
        "translationInvite": "helpers/translation.js?lang=" + "1" + "&data=mybusiness/manage/roles_user/invite",
        "translationCommon": "helpers/translation.js?lang=" + "1" + "&data=common/common",
        "translationSavedOrganizations": "helpers/translation.js?lang=" + "1" + "&data=mybusiness/admin/savedOrganizations",
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
        "constants": "empty:",
        // added for new js structure in git
        "helpers": "./pagespecific",
        "modules": "./components",
        "common/utils": "./globals/common/utils",
        "common/extensions": "./globals/common/extensions",
        "elements": "./components"
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
        "jquier-ui": ["jquery"]
    },
    packages: [
        { name: "dwr", location: "../../../../projects/b2bonline/assets/js/mock" },
        { name: "service", location: "../../../../projects/b2bonline/assets/js/mock" }
    ],
    wrapShim: true,
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
    name: 'local/init-require',
    //optimize: 'none',
    excludeShallow: [
        "libs/misc/raphael-min",
        "libs/jquery/jquery.backgroundSize",
        "errorKeyTranslation",
        "service/adamApi",
        "service/chatApi",
        "service/priceInformationApi",
        "service/searchApi",
        "service/bookmarksApi",
        "service/billedAccountsApi",
        "service/DCFServiceApi",
        "service/userStorageApi",
        "service/corpAdministrationServiceApi",
        "service/customerIdentityServiceApi",
        "service/customerInvoiceApi",
        "dwr/engine",
        "modules/jquery.chat",
        "modules/jquery.priceInformation",
        "helpers/common"
    ],
    findNestedDependencies: true,
    out: 'init-built.js',
    onBuildWrite: function(moduleName, path, contents) {
        //console.log()
        return contents.replace(/(angularApplications\/[a-zA-Z]+)2/g, "$1").replace(/(angularApplications\/services\/[a-zA-Z]+)2/g, "$1");
    }
})
