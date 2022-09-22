define(['angular', 'local/angularApplications/services/manageInviteNgService', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/savedOrganizationsService', 'local/angularApplications/services/manageGroupNgService'], function (angular) {
    "use strict";

    var app = angular.module('serviceProvider', ['manageInviteNgService', 'corpAdministrationService', 'savedOrganizationsService', 'manageGroupNgService']);

    app.factory('serviceProvider', ['manageInviteNgService', 'corpAdministrationService', 'savedOrganizationsService', 'manageGroupNgService', function (manageInviteNgService, corpAdministrationService, savedOrganizationsService, manageGroupNgService) {

        return {
            manageInviteNgService: manageInviteNgService,
            corpAdministrationService: corpAdministrationService,
            savedOrganizationsService: savedOrganizationsService,
            manageGroupNgService: manageGroupNgService
        };
    }]);
    
});