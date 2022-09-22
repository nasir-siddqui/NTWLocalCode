define(['jquery', 'angular', 'constants', 'helpers/common', 'helpers/serviceErrorHandling', 'local/angularApplications/commonDirectives', 'local/angularApplications/customTable', 'local/angularApplications/services/validationService', 'local/angularApplications/templates'], function ($, ng, constants, common, errorHandler) {

    var app = ng.module('manageCustomTable', ['commonDirectives', 'customTable', 'validationService', 'templates-main']);

    app.directive('tsManageCustomTable', function () {
        return {
            templateUrl: constants.manageCustomTableTemplateUrl,
            replace: 'true',
            controller: 'ManageCustomTableController'
        };
    });

    app.controller("ManageCustomTableControllerDummy", function () {});

    app.controller("ManageCustomTableController", ['$scope', '$rootScope', '$attrs', 'validationService', function ($scope, $rootScope, $attrs, validationService) {
        $scope.common = common;
        ///////////////////////////////////
        // Customization
        $scope.customization = {
            // Mapping of row detail information
            add: {
                api: null,
                enabled: false,
                fields: [],
                apiActionFnName: null,
                apiActionFnParameters: [],
                submitText: "Skicka",
                errorPrefixText: "Följande fel uppstod: "
            }
        };

        function evalAll(arr) {
            var evaledArr = $.map(arr, function (obj) {
                return $scope.$eval(obj);
            });
            return evaledArr;
        }

        function validateAll(fields){
            var valid = true;
            angular.forEach(fields, function(field, fieldIndex){
                field.validation["error"] = "";
                angular.forEach(field["validation"], function(validation, key){
                    var parameters = [];
                    if (typeof validation.additionalParameters !== "undefined"){
                        parameters = evalAll(validation.additionalParameters);
                    }
                    parameters.unshift(field.value);

                    if (!validationService[validation.method].apply(this, parameters)){
                        field.validation["error"] = validation.message;
                        valid = false;
                    }
                });
            });
            return valid;
        }

        function executeApiCall(api, funcName, args, callback) {
            var func = $scope.customization.add.api[funcName];
            var argsCopy = [].slice.call(args);
            argsCopy.push(callback);

            if (func.length !== argsCopy.length)
                throw new Error("Non-matching parameter count compared to API call.");

            var obj = func.apply(this, argsCopy); // Call the API's method with the requested parameters
        }

        $scope.add = function(element, abCallback) {
            $scope.add.status = "LOADING";
            $scope.add.error = null;

            if (!validateAll($scope.customization.add.fields)){
                $scope.add.status = "DEFAULT";
                return;
            }

            var callback = function (obj) {
                $scope.$apply(function () {
                    $scope.add.status = "DEFAULT";
                    $rootScope.$broadcast("CUSTOM_TABLE_ADD_ROW", obj, $scope.customization.targetId);
                });
            }
            var error = function (errorString) {
                $scope.$apply(function () {
                    $scope.add.status = "FAILED";
                    $scope.add.error = errorString;
                    $scope.add.failed = true;
                });
            };
            var callbackFunctions = errorHandler.serviceCallbacks(callback, error);

            executeApiCall($scope.customization.add.api, $scope.customization.add.apiActionFnName, evalAll($scope.customization.add.apiActionFnParameters), callbackFunctions);
        };

        $scope.init = function () {
            /////////////////////////////
            // PARAMETERS           
            if ($attrs.addEnabled !== undefined) $scope.customization.add.enabled = $attrs.addEnabled;
            if ($attrs.addFields !== undefined) $scope.customization.add.fields = $.parseJSON($attrs.addFields);
            if ($attrs.addSubmitText !== undefined) $scope.customization.add.submitText = $attrs.addSubmitText;
            if ($attrs.addProgressText !== undefined) $scope.customization.add.progressText = $attrs.addProgressText;
            if ($attrs.addFinishedText !== undefined) $scope.customization.add.finishedText = $attrs.addFinishedText;
            if ($attrs.addFailedText !== undefined) $scope.customization.add.failedText = $attrs.addFailedText;
            if ($attrs.targetId !== undefined) $scope.customization.targetId = $attrs.targetId;

            if ($attrs.addApiName !== undefined) {
                $scope.add.error = null;
                $scope.customization.add.apiName = $attrs.addApiName;
                $scope.customization.add.apiActionFnName = $attrs.addApiActionFnName;
                $scope.customization.add.apiActionFnParameters = $.parseJSON($attrs.addApiActionFnParameters);
                $scope.customization.add.errorPrefixText = $attrs.addErrorPrefixText;
                
                require([$attrs.addApiName], function(api) {
                    $scope.customization.add.api = api;
                });
            }
            // END PARAMETERS
            //////////////////////////////////
        };

        $scope.init();
    }]);

    var init = function (element) {
        ng.bootstrap(element, ['manageCustomTable']);
    };

    return {

        init: function (element) {
            init(element);
        }

    };
});