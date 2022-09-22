define(['angular',
        'local/angularApplications/savedOrganizations',
        'local/angularApplications/accessTree',
        'local/angularApplications/combineRoles',
        'local/angularApplications/customTable',
        'local/angularApplications/manageCustomTable',
        'local/angularApplications/manageInvite',
        'local/angularApplications/manageOrganization',
        'local/angularApplications/manageProfile',
        'local/angularApplications/manageroles',
        'local/angularApplications/manageUser',
        'local/angularApplications/dcf',
        'local/angularApplications/dcf2',
        'local/angularApplications/summary',
        'local/angularApplications/registerUser',
        'local/angularApplications/manageGroup'
    ], function(ng) {

    var module = ng.module('modules', ['savedOrganizations', 'accessTree', 'combineRoles', 'customTable', 'manageCustomTable', 'manageInvite', 'manageOrganization', 'manageProfile', 'manageroles', 'manageUser', 'dcf', 'DCF2', 'summary', 'registerUser', 'manageGroup']);

    return;

});