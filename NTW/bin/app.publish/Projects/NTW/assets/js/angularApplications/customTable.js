var customTableFilteredData = {};

define(['jquery', 'require', 'angular', 'constants', 'helpers/common', 'local/queryStringHelper', 'underscore', 'common/utils', 'local/angularApplications/services/userStorageService', 'angular-table', 'local/angularApplications/commonDirectives', 'local/angularApplications/services/serviceProvider', 'local/angularApplications/templates', 'local/angularApplications/services/hashService'], function ($, require, angular, constants, common, queryStringHelper, _, utils) {
    "use strict";

    /*
     * This component uses the ngTable directive, see the following pages for more information:
     * https://github.com/esvit/ng-table
     * http://bazalt-cms.com/ng-table/example/1
     */

    var app = angular.module('customTable', ['ngTable', 'commonDirectives', 'serviceProvider', 'templates-main', 'hashService', 'userStorageService']);


    app.directive('tsDynamicCustomTable', ['$templateCache', function($templateCache) {
        return {
            template: "<div ng-include=\"template\"></div>",
            link: function(scope, element, attrs) {
                var alist = element.get(0).attributes;
                var html = "";
                _.each(alist, function(a) {
                    if (/^x\-/.test(a.name)) {
                        html += " " + a.name + "='" + a.value.replace(/'/g, "&#39;") + "'";
                    }
                });
                $templateCache.put('dynamicCustomTable.html', "<div ts-custom-table" + html + "></div>");
                scope.template = "dynamicCustomTable.html";
            }
        };
    }]);

    app.directive('tsCustomTable', function() {
        return {
            templateUrl: constants.customTableTemplateUrl,
            replace: 'true',
            controller: 'TableCtrl',
            scope: {
                dataRefreshTrigger: '='
            }
        };
    });

    app.directive('tsCustomTableInner', ['$timeout', '$window', function($timeout, $window) {
        return {
            link: function(scope, element) {
                if (!scope.customization.carousel.enabled) {
                    return;
                }
                scope.carousel.table = element;
                $(window).resize(function() {
                    scope.$emit('getData');
                });
                scope.$on('getData', function() {

                    var tw = element.width();
                    var ww = element.closest('.tsTable-inner').width();

                    scope.carousel.active = tw > ww;

                    if (scope.carousel.active) {

                        scope.carousel.data = [];

                        var offset = 0;
                        var columnSelector = "thead th";
                        element.css('margin-left', '');

                        if (scope.customization.multipleSelection.enabled) {

                            element.find('tr td:first-child, tr th:first-child').each(function() {
                                var h = $(this).next('td, th').outerHeight();
                                $(this).css({
                                    'height': h + 1,
                                    'padding-top': parseInt(h/2, 10) - 5
                                });
                            });

                            offset = 39;
                            columnSelector = 'thead th:gt(0)';
                        }

                        // calculate the positions of each column
                        var p = _.map(element.find(columnSelector), function(item) {
                            var l = $(item).position().left;
                            var w = $(item).outerWidth();
                            return {
                                left: l,
                                right: l + w
                            };
                        });

                        var bw = 60;
                        var _offset = offset;
                        var loop = 0;

                        while (p.length) {

                            var prev = loop ? 1 : 0;

                            //  CALCULATE THE OFFSET, SHOULD BE INDENTED ON OTHER THAN FIRST PAGE
                            _offset = - _.first(p).left + offset + bw * prev;

                            var index = 0;
                            for (var i = 0; i < p.length; i++) {
                                var c = p[i];
                                if (c.right + _offset < ww - bw) {
                                    index = i;
                                } else {
                                    break;
                                }
                            }
                            var columns = p.slice(0, index + 1);

                            // CHECK IF THE LAST COLUMN IS UNDER THE NEXT BUTTON
                            if (_.last(columns).right + _offset > ww - bw) {
                                columns.pop();
                            }

                            // CHECK IF THERE IS NO COLUMNS
                            if (_.isEmpty(columns)) {
                                columns.push(_.first(p));
                            }

                            // REMOVE THE COLUMNS FOR THE TOTAL LIST
                            p.splice(0, columns.length);

                            // SET THE PAGE DATA
                            var _p = {
                                items: columns.length,
                                position: _offset
                            };
                            scope.carousel.data.push(_p);

                            loop++;
                        }
                        scope.carousel.total = scope.carousel.data.length;
                        scope.setPage(scope.carousel.page);

                    }
                });
            }
        };
    }]);

    app.controller('TableCtrl', ['$scope', '$rootScope', '$filter', '$http', '$sce', 'ngTableParams', '$attrs', '$templateCache', '$timeout', '$q', 'serviceProvider', 'hash', '$location', '$window', 'userStorageService',
        function ($scope, $rootScope, $filter, $http, $sce, ngTableParams, $attrs, $templateCache, $timeout, $q, serviceProvider, hash, $location, $window, userStorageService) {

        $scope.utils = utils;
        $scope.common = common;
        
        $scope.data = [];
        $scope.filter = {};
        $scope.$watch("filter.$", function() {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        });
        $scope.tableParams = null;

        $scope.carousel = {
            active: false,
            data: [],
            page: 0,
            total: 0,
            table: null
        };

        $scope.setPage = function(p) {
            $scope.carousel.table.css('margin-left', $scope.carousel.data[p].position);
            $scope.carousel.page = p;
        };

        $scope.common = common;
        $scope.constants = constants;
        $scope.organizationNumber = common.orgnr;
        $scope.queryStringHelper = queryStringHelper;

        $scope.showMenu = false;
        $scope.isLoading = true;
        $scope.initialInformationSeen = false;

        $scope.service = serviceProvider;

        var dataPromise = $q.defer();
        var translationPromise = $q.defer();

        $scope.$watch(function() {
            return dataPromise.promise;
        }, function() {
            $q.all([dataPromise.promise, translationPromise.promise]).then(function(data) {
                $scope.isLoading = false;
                $scope.data = data[0];
                $scope.tableParams.reload();
                $scope.translation = data[1] || { translate: function(key) {
                        return key;
                    }
                };
            });
        });

        if ($attrs.translation) {
            require([$attrs.translation], function(translation) {
                translationPromise.resolve(translation);
            });
        } else {
            translationPromise.resolve();
        }

        $scope.expandedRowId = null;
        $scope.expandedRowDeleteId = null;

        $scope.displayRowDetails = function(obj) {
            if ($scope.expandedRowId === null || $scope.expandedRowId !== getIdentity(obj)) {
                getRowDetails(obj);
                $scope.expandedRowId = getIdentity(obj);
                $scope.closeRowDelete();
            } else {
                $scope.closeRowDetails();
            }
        };

        $scope.closeRowDetails = function() {
            $scope.expandedRowId = null;
        };

        $scope.displayRowDelete = function(obj) {
            if (!$scope.customization.rowDelete.displayTemplate) {
                $scope.doRowAction(obj, obj[$scope.customization.rowDelete.deleteIdProperty]);
                return;
            }
            if ($scope.expandedRowDeleteId === null || $scope.expandedRowDeleteId !== getIdentity(obj)) {
                obj.$deleteData = "Loaded";
                $scope.expandedRowDeleteId = getIdentity(obj);
                $scope.closeRowDetails();
            } else {
                $scope.closeRowDelete();
            }
        };

        $scope.closeRowDelete = function() {
            $scope.expandedRowDeleteId = null;
        };

        $scope.getDetailsButtonText = function (obj) {
            if (!$scope.customization.rowDetails.buttonTextExpanded || $scope.expandedRowId !== getIdentity(obj)) {
                return $scope.customization.rowDetails.buttonText;
            }

            return $scope.customization.rowDetails.buttonTextExpanded;
        };

        function getRowDetails(obj) {
            if ($scope.customization.rowDetails.getProperty) {
                obj.$details = obj[$scope.customization.rowDetails.getProperty];
            }
            else if ($scope.customization.rowDetails.getUrl) {
                var url = parseUrlTemplate($scope.customization.rowDetails.getUrl, obj);
                $http({ method: 'GET', url: url }).
                    success(function(detailData, status, headers, config) {
                        obj.$details = detailData;
                    }).
                    error(function(detailData, status, headers, config) {
                        //console.log("Failed to get row details", status);
                    });
            }
            else {
                obj.$details = "Loaded";
                //throw new Error("Missing row details information.", $scope.customization.rowDetails);
            }
        }

        function getIdentity(obj) {
            if (obj) {
                return obj[$scope.customization.dataDefinitions.identityFieldName];
            }
            return null;
        }

        $scope.isBoolean = function (obj, fieldName) {
            return typeof obj[fieldName] === "boolean";
        };
        $scope.getIdentity = function(obj) {
            return getIdentity(obj);
        };

        $scope.isSortedOn = function(obj) {
            var ret = $scope.tableParams.isSortBy(obj.fieldName, 'asc') || $scope.tableParams.isSortBy(obj.fieldName, 'desc');
            return ret;
        };

        $scope.getSortClass = function(obj) {
            var params = $scope.tableParams;
            if (params.isSortBy(obj.fieldName, 'asc')) {
                return "tsIcon-ArrowUp";
            }
            if (params.isSortBy(obj.fieldName, 'desc')) {
                return "tsIcon-ArrowDown";
            }
            return "";
        };

        $scope.setSortColumn = function(obj) {
            sortBy(obj.fieldName);
        };

        $scope.onCheckedEvent = function() {
            $scope.multipleSelection.active = false;
            if (!$scope.customization.multipleSelection.enabled) {
                return;
            }
            var existNotSelected = false;
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].$selected) {
                    $scope.multipleSelection.active = true;
                }
                else {
                    existNotSelected = true;
                }

                if ($scope.multipleSelection.active && existNotSelected){
                    break;
                }
            }
            $scope.multipleSelection.isSemiChecked = $scope.multipleSelection.active && existNotSelected;
        };

        $scope.setAllCheckboxes = function() {
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.data[i].$selected = $scope.multipleSelection.active;
            }
            $scope.onCheckedEvent();
        };

        function saveColumnFilteringToDb() {
            $scope.columnFilter.status = "LOADING";
            var callback = {
                callback: function (data) {
                    $scope.$apply(function () {
                        $scope.columnFilter.status = "FINISHED";
                        $timeout(function() {
                            $scope.columnFilter.active = false;
                            $scope.columnFilter.informationText = undefined;
                            $scope.initialInformationSeen = true;
                        }, 2000);
                    });
                },
                errorHandler: function(errorString) {
                    $scope.$apply(function () {
                        $scope.columnFilter.status = "FAILED";
                    });
                    throw new Error(errorString);
                }
            };
            var args = evalAll($scope.customization.columnFilter.api.saveFnParameters);
            args.push(angular.toJson($scope.customization.dataDefinitions.columns));
            executeApiCall($scope.customization.columnFilter.api.saveFnName, args, callback, false, $scope.customization.columnFilter.api);
        }

        $scope.toggleColumnFiltering = function() {
            if (!$scope.columnFilter.active) {
                $scope.columnFilter.status = "";
                // Extends performs deep copy (we want a copy of the objects as well)
                $scope.savedColumnConfiguration = $.extend(true, [], $scope.customization.dataDefinitions.columns);
                $scope.columnFilter.active = true;
            }
        };

        $scope.cancelColumnFiltering = function() {
            $scope.customization.dataDefinitions.columns = $scope.savedColumnConfiguration;
            $scope.columnFilter.active = false;
            $scope.columnFilter.informationText = undefined;
        };

        $scope.saveColumnFiltering = function() {
            // To display the changes and progress that is beeing made when called from other than the save button
            $scope.columnFilter.active = true;

            if ($scope.customization.columnFilter.api.api !== null && $scope.customization.columnFilter.api.saveFnName !== null){
                saveColumnFilteringToDb();
            }
            else {
                $scope.columnFilter.active = false;
                $scope.columnFilter.informationText = undefined;
                $scope.initialInformationSeen = true;
            }
        };

        $scope.toggleColumn = function(column) {
            var nrOfDisplayedColumns = $filter('filter')($scope.customization.dataDefinitions.columns, {displayed: true}).length;
            if (column.displayed && nrOfDisplayedColumns <= $scope.customization.columnFilter.minColumns) {
                $scope.columnFilter.informationText = $scope.customization.columnFilter.minColumnsWarning;
            }
            else if (!column.displayed && nrOfDisplayedColumns >= $scope.customization.columnFilter.maxColumns) {
                $scope.columnFilter.informationText = $scope.customization.columnFilter.maxColumnsWarning;
            }
            else {
                $scope.columnFilter.informationText = undefined;
                column.displayed = !column.displayed;
            }
        };

        function sortBy(fieldName, order) {
            if (fieldName === null) {
                return;
            }
            var params = $scope.tableParams;
            var sort = {};
            
            var column = _.find($scope.customization.dataDefinitions.columns, function(x) {
                return x.fieldName === fieldName;
            });
            if (column && column.presort) {
                sort = column.presort;
            }

            if (typeof order !== "undefined") {
                sort[fieldName] = (order === "desc") ? 'desc' : 'asc';
            } else {
                sort[fieldName] = params.isSortBy(fieldName, 'asc') ? 'desc' : 'asc';
            }
            params.sorting(sort);
        }

        $scope.openLink = function(obj) {
            if ($scope.customization.openLink.enabled === false) {
                return false;
            }

            if (obj.$openLinkAction && obj.$openLinkAction === "details") {
                $scope.displayRowDetails(obj);
                return;
            }

            // Get requested submit data from selected row
            var url = parseUrlTemplate($scope.customization.openLink.url, obj);

            window.location.href = url;
        };

        $scope.openBatchPostData = "";
        $scope.openBatch = function() {
            if ($scope.customization.multipleSelection.enabled === false) {
                return;
            }

            // Get requested submit data from selected row
            var propName = $scope.customization.dataDefinitions.identityFieldName;
            var selectedIds = $.grep($scope.data, function(element) {
                return element.$selected === true; }).map(function(element) {
                    return encodeURIComponent(element[propName]);
                });

            $scope.openBatchPostData = selectedIds;
        };

        function parseUrlTemplate(urlTemplate, obj) {
            var result = urlTemplate;
            var matches = urlTemplate.match(/{.+?}/g);
            while (matches !== null) {
                for (var i = 0; i < matches.length; i++) {
                    var match = $.trim(matches[i].substring(1, matches[i].length - 1));

                    var defaultValue = null;
                    var defaultValueIndex = match.indexOf("||");
                    if (defaultValueIndex > 0) {
                        defaultValue = $.trim(match.substring(defaultValueIndex + 2));
                        match = $.trim(match.substring(0, defaultValueIndex));
                    }

                    var value = obj[match] || $scope.constants[match] || $scope.common[match] || defaultValue;

                    result = result.replace(matches[i], value);
                }
                matches = result.match(/{.+?}/g);
            }
            return result;
        }

        $scope.doRowAction = function (rowObj) {
            if ($.inArray(rowObj, $scope.data) < 0) {
                throw new Error("First parameter must be the row object.");
            }

            rowObj.$status = "LOADING";

            var argumentsCopy = [].slice.call(arguments);
            // Remove row object from arguments
            argumentsCopy.splice(0, 1);

            var callback = {
                callback: function () {
                    if ($scope.customization.api.deleteRowAfterAction) {
                        removeRow(rowObj);
                    }
                    console.log('hej');
                    //$scope.$apply(function () {
                        rowObj.$status = "FINISHED";
                        rowObj.$rowActionCalled = true;
                    //});
                },
                errorHandler: function (errorString) {
                    //$scope.$apply(function () {
                        rowObj.$status = "FAILED";
                        rowObj.$rowActionCalled = false;
                    //});
                }
            };

            executeApiCall($scope.customization.api.actionFnName, argumentsCopy, callback, true);
        };

        function executeApiCall(funcName, args, callback, isRow, apiObject) {
            var api = $scope.customization.api;
            if (typeof apiObject === "object") {
                api = apiObject;
            }
            var func = api.api[funcName];
            if (!api.isAngularService || (!isRow && api.allowDataUpdate)) {
                args.push(callback);
            }

            //if (func.length !== args.length)
                //throw new Error("Non-matching parameter count compared to API call (expected " + func.length + ", got " + args.length + ").");

            // Call the API's method with the requested parameters
            var obj = func.apply(api.api, args);
            if (api.isAngularService && !api.allowDataUpdate) {
                obj.then(callback.callback, callback.errorHandler);
            }
        }

        $scope.dropdownChange = function() {
            window.location = parseUrlTemplate($scope.customization.dropdown.urlTemplate, { "0": $scope.customization.dropdown.value });
        };

        function addRow(obj, id) {
            if (typeof id !== "undefined" && id !== $scope.customization.id) {
                return;
            }
            $scope.data.unshift(obj);
            $scope.tableParams.reload();
        }

        function removeRow(obj) {
            $timeout(function() {
                $scope.data.splice($.inArray(obj, $scope.data), 1);
                $scope.tableParams.reload();
            }, $scope.customization.rowDelete.enabled && !$scope.customization.rowDelete.displayTemplate ? 0 : 2000);
        }

        ///////////////////////////////////
        // Customization

        $scope.customization = {
            // Table id
            id: null,

            // Page size
            pageSize: 5,

            // form class
            formClass: "tscForm",

            // Data headers and mappings
            dataDefinitions: {
                columns: [],
                identityFieldName: null
            },

            // Initial sort
            initialSort: {
                // Null if no initial sort
                fieldName: null,
                order: null
            },

            // Search/filter box
            search: {
                enabled: true,
                placeholderText: "Find"
            },

            // Hard filters (the radio buttons above the table that filters the data)
            hardFilter: {
                enabled: false,
                values: [],
                field: "",
                save: true
            },

            // Dropdown
            dropdown: {
                enabled: false,
                name: "Company",
                urlTemplate: "Hej{0}",
                value: 1,
                options: [{ label: "Company 1", value: 1 }, { label: "Company 2", value: 2 }, { label: "Company 3", value: 3 }]
            },

            // Multiple selection of data rows
            multipleSelection: {
                enabled: false
            },

            // Mapping of row detail information
            // getPropery: Name of property on data object that contains the details data. Set either this or getUrl.
            // getUrl: Url to get the row details from. Can be templated, like "test.php/{accountNumber}"
            rowDetails: {
                enabled: true,
                headerText: "",
                buttonText: "View",
                buttonTextExpanded: null,
                buttonDisabledText: "View",
                buttonDisabledExpression: "false",
                template: '',
                getProperty: null,
                getUrl: null
            },

            // row delete information
            rowDelete: {
                enabled: false,
                buttonDisabledExpression: "false",
                buttonDisabledText: "",
                template: '<div class="tsAttention--Panic">' +
                    '<div class="tsAttention-Message tsWrapInner">' +
                        '<p class="tscInline--Middle">' +
                            '<i class="tsIcon-Information tscInline-Element"></i>' +
                            '<span ng-hide="p.$rowActionCalled" class="tscInline-Element">{{ customization.rowDelete.deleteText }}</span>' +
                            '<span ng-show="p.$rowActionCalled" class="tscInline-Element">{{ customization.rowDelete.confirmText }}</span>' +
                            '<a ng-hide="p.$rowActionCalled" class="tsBtn--Normal--Regular--Internal--Animated tscInline-Element" ts-loading-button="" x-progress-text="{{ customization.rowDelete.deletingText }}" x-finish-text="{{ customization.rowDelete.deletedText }}" x-failure-text="{{ customization.rowDelete.deleteFailedText }}" x-max-time="2000" x-status="p.$status" ng-click="doRowAction(p, p[customization.rowDelete.deleteIdProperty])">{{ customization.rowDelete.deleteButtonText }}</a>' +
                            '<a ng-hide="p.$rowActionCalled" class="tsBtn--Normal--Internal--Regular" ng-click="closeRowDelete()">{{ customization.rowDelete.cancelDeleteButtonText }}</a>' +
                            '<a ng-show="p.$rowActionCalled" class="tsBtn--Delete tsMarginLeft" ng-click="closeRowDelete()"></a>' +
                        '</p>' +
                    '</div>' +
                '</div>',
                deleteText: "Are you sure?",
                confirmText: "Organisation is removed",
                deleteButtonText: "Confirm",
                deletingText: "Deleting",
                deletedText: "Deleted",
                deleteFailedText: "Failed",
                cancelDeleteButtonText: "No",
                breakFree: true,
                deleteIdProperty: "id",
                displayTemplate: true
            },

            // Mapping for "open on other page"
            // url: Can be templated, like "test.php/{accountNumber}"
            openLink: {
                enabled: true,
                url: "#",
                batchUrl: "#",
                batchText: "Open selected",
                batchInfoText: "Use checkboxes to select multiple items. Then press change button for settings."
            },

            api: {
                isAngularService: false,
                name: null,
                api: null,
                actionFnName: null,
                deleteRowAfterAction: false,
                dataFnName: null,
                dataFnParameters: [],
                deleteFnActionName: null,
                allowDataUpdate: false
            },

            dataSharing: {
                enabled: false
            },

            columnFilter: {
                enabled: false,
                minColumns: 1,
                maxColumns: 10,
                minColumnsWarning: "Minst en kolumn måste vara vald.",
                maxColumnsWarning: "Max antal kolumner är nått. Testa att avmarkera en annan kolumn.",
                editColumnsText : "Redigera kolumner",
                cancelText: "Avbryt",
                saveText: "Spara",
                saveProgressText: "Sparar",
                saveFinishedText: "Sparat",
                saveFailedText: "Oops, försök igen",
                api: {
                    api: null,
                    name: null,
                    saveFnName: null,
                    saveFnParameters: []
                }
            },

            initialInformationTemplate: '',

            carousel: {
                enabled: false,
                active: false,
                page: 0,
                total: 0
            }
        };

        // Replace { and } with {{ and }}, to allow passing angular expressions in inline attributes. Also removes multiple spaces to reduce output size.
        function anglify(expression) {
            return expression.replace(/{/g, '{{').replace(/}/g, '}}').replace(/ +/g, " ");
        }

        function evalAll(arr) {
            var evaledArr = $.map(arr, function (obj) { return $scope.$eval(obj); });
            return evaledArr;
        }

        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] === variable){
                    console.log("getQueryvariable", variable, pair[1]);
                    return pair[1];}
            }
            return(false);
        }

        function initTable() {
            $scope.tableParams = new ngTableParams({
                count: $scope.customization.pageSize,
            }, {
                total: $scope.data.length,
                getData: function ($defer, params) {
                    var filteredData = $filter('filter')($scope.data, $scope.filter);
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        filteredData;
                    if ($scope.customization.dataSharing.enabled) {
                        customTableFilteredData[$scope.customization.dataDefinitions.identityFieldName] = orderedData;
                    }
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    $scope.pages = params.generatePagesArray(params.page(), orderedData.length, params.count());
                    if ($scope.customization.carousel) {
                        $timeout(function() {
                            $scope.$broadcast('getData');
                        });
                    }
                },
                $scope: $scope
            });
            sortBy($scope.customization.initialSort.fieldName, $scope.customization.initialSort.order);
        }

        function setStandardValueIfUndefined(array, property, standardValue){
            angular.forEach(array, function(value, key){
                if (value[property] in window){
                    value[property] = standardValue;
                }
            });
            return array;
        }

        var latestLoadTimestamp = 0;
        function loadData(force) {
            if ($scope.customization.api.dataFnName) {
                if (!$scope.customization.api.api) {
                    return;
                }

                // Got data api, get data from server
                $scope.isLoading = true;

                var requestTimestamp = new Date().getTime();
                latestLoadTimestamp = requestTimestamp;

                var callback = {
                    callback: function (data) {

                        if (requestTimestamp < latestLoadTimestamp) {
                            // More recent request has been done, dcard this result
                            return;
                        }

                        // use timeout here to safely update the data and make sure it is run inside a scope apply 
                        $timeout(function() {
                            if ($scope.customization.api.allowDataUpdate || force) {
                                dataPromise = $q.defer();
                            }
                            dataPromise.resolve(data);
                        });
                    },
                    errorHandler: function(errorString) {
                        throw new Error(errorString);
                    }
                };
                executeApiCall($scope.customization.api.dataFnName, evalAll($scope.customization.api.dataFnParameters), callback);
            } else {
                // Got data from attributes, reload page
                window.location.reload(true);
            }
        }

        $scope.init = function () {
            if ($attrs.apiDataFnName !== undefined) {
                $scope.isLoading = true;
            }

            /////////////////////////////
            // PARAMETERS

            // Required parameters
            var json;
            if ($attrs.dataDefinitionColumns) {
                json = $.parseJSON($attrs.dataDefinitionColumns);
            } else if ($attrs.dataDefinitionColumnsExpr) {
                json = $scope.$eval($attrs.dataDefinitionColumnsExpr);
            }

            $scope.customization.dataDefinitions.columns = setStandardValueIfUndefined(json, "displayed", true);
            $scope.customization.dataDefinitions.identityFieldName = $attrs.dataDefinitionIdentity;
            
            // Optional parameters
            if ($attrs.data !== undefined && $attrs.apiDataFnName === undefined) {
                dataPromise.resolve($.parseJSON($attrs.data));
            }
            if ($attrs.dataExpr !== undefined && $attrs.apiDataFnName === undefined) {
                dataPromise.resolve($scope.$eval($attrs.dataExpr));
            }
            if ($attrs.id !== undefined) {
                $scope.customization.id = $attrs.id;
            }
            if ($attrs.dropdownEnabled !== undefined) {
                $scope.customization.dropdown.enabled = $attrs.dropdownEnabled;
            }
            if ($attrs.searchEnabled !== undefined) {
                $scope.customization.search.enabled = $attrs.searchEnabled === "true";
            }
            if ($attrs.searchText !== undefined) {
                $scope.customization.search.placeholderText = $attrs.searchText;
            }
            if ($attrs.searchTextExpr !== undefined) {
                $scope.customization.search.placeholderText = $scope.$eval($attrs.searchTextExpr);
            }
            if ($attrs.pageSize !== undefined) {
                $scope.customization.pageSize = $attrs.pageSize;
            }
            if ($attrs.initialSortField !== undefined) {
                $scope.customization.initialSort.fieldName = $attrs.initialSortField;
            }
            if ($attrs.initialSortOrder !== undefined) {
                $scope.customization.initialSort.order = $attrs.initialSortOrder;
            }
            if ($attrs.openLinkEnabled !== undefined) {
                $scope.customization.openLink.enabled = $attrs.openLinkEnabled === "true";
            }
            if ($attrs.openLinkBatchText !== undefined) {
                $scope.customization.openLink.batchText = $attrs.openLinkBatchText;
            }
            if ($attrs.openLinkUrl !== undefined) {
                $scope.customization.openLink.url = $attrs.openLinkUrl;
            }
            if ($attrs.openLinkBatchUrl !== undefined) {
                $scope.customization.openLink.batchUrl = $attrs.openLinkBatchUrl;
            }
            if ($attrs.openLinkBatchInfoText !== undefined) {
                $scope.customization.openLink.batchInfoText = $attrs.openLinkBatchInfoText;
            }
            if ($attrs.rowDetailsEnabled !== undefined) {
                $scope.customization.rowDetails.enabled = $attrs.rowDetailsEnabled;
            }
            if ($attrs.rowDetailsButtonDisabledExpression !== undefined) {
                $scope.customization.rowDetails.buttonDisabledExpression = $attrs.rowDetailsButtonDisabledExpression;
            }
            if ($attrs.rowDetailsButtonDisabledText !== undefined) {
                $scope.customization.rowDetails.buttonDisabledText = $attrs.rowDetailsButtonDisabledText;
            }
            if ($attrs.rowDetailsTemplate !== undefined) {
                $scope.customization.rowDetails.template = anglify($attrs.rowDetailsTemplate);
            }
            if ($attrs.rowDetailsHeader !== undefined) {
                $scope.customization.rowDetails.headerText = $attrs.rowDetailsHeader;
            }
            if ($attrs.rowDetailsUrl !== undefined) {
                $scope.customization.rowDetails.getUrl = $attrs.rowDetailsUrl;
            }
            if ($attrs.rowDetailsButtonText !== undefined) {
                $scope.customization.rowDetails.buttonText = $attrs.rowDetailsButtonText;
            }
            if ($attrs.rowDetailsButtonTextExpr !== undefined) {
                $scope.customization.rowDetails.buttonText = $scope.$eval($attrs.rowDetailsButtonTextExpr);
            }
            if ($attrs.rowDetailsButtonTextExpanded !== undefined) {
                $scope.customization.rowDetails.buttonTextExpanded = $attrs.rowDetailsButtonTextExpanded;
            }
            if ($attrs.rowDetailsBreakFree !== undefined) {
                $scope.customization.rowDetails.breakFree = $attrs.rowDetailsBreakFree === "true";
            }
            if ($attrs.hardFilterEnabled !== undefined) {
                $scope.customization.hardFilter.enabled = $attrs.hardFilterEnabled === "true";
            }
            if ($attrs.hardFilterField !== undefined) {
                $scope.customization.hardFilter.field = $attrs.hardFilterField;
            }
            if ($attrs.hardFilterValues !== undefined) {
                $scope.customization.hardFilter.values = $.parseJSON($attrs.hardFilterValues);
            }
            if ($attrs.hardFilterSave) {
                $scope.customization.hardFilter.save = $attrs.hardFilterSave === "true";
            }
            if ($attrs.dataSharingEnabled) {
                $scope.customization.dataSharing.enabled = $attrs.dataSharingEnabled === "true";
            }
            if ($attrs.columnFilterEnabled) {
                $scope.customization.columnFilter.enabled = $attrs.columnFilterEnabled === "true";
            }
            if ($attrs.columnFilterMinColumns) {
                $scope.customization.columnFilter.minColumns = $attrs.columnFilterMinColumns;
            }
            if ($attrs.columnFilterMaxColumns) {
                $scope.customization.columnFilter.maxColumns = $attrs.columnFilterMaxColumns;
            }
            if ($attrs.columnFilterMinColumnsWarning) {
                $scope.customization.columnFilter.minColumnsWarning = $attrs.columnFilterMinColumnsWarning;
            }
            if ($attrs.columnFilterMaxColumnsWarning) {
                $scope.customization.columnFilter.maxColumnsWarning = $attrs.columnFilterMaxColumnsWarning;
            }
            if ($attrs.columnFilterCancelText) {
                $scope.customization.columnFilter.cancelText = $attrs.columnFilterCancelText;
            }
            if ($attrs.columnFilterSaveText) {
                $scope.customization.columnFilter.saveText = $attrs.columnFilterSaveText;
            }
            if ($attrs.columnFilterSaveProgressText) {
                $scope.customization.columnFilter.saveProgressText = $attrs.columnFilterSaveProgressText;
            }
            if ($attrs.columnFilterSaveFinishedText) {
                $scope.customization.columnFilter.saveFinishedText = $attrs.columnFilterSaveFinishedText;
            }
            if ($attrs.columnFilterSaveFailedText) {
                $scope.customization.columnFilter.saveFailedText = $attrs.columnFilterSaveFailedText;
            }
            if ($attrs.columnFilterEditColumnsText) {
                $scope.customization.columnFilter.editColumnsText = $attrs.columnFilterEditColumnsText;
            }
            if ($attrs.initialInformationTemplate) {
                $scope.customization.initialInformationTemplate = anglify($attrs.initialInformationTemplate);
            }

            $scope.customization.carousel.enabled = $attrs.carousel === "true";

            if ($attrs.columnFilterEnabled) {
                $scope.columnFilter = {
                    active : false,
                    status : null
                };
            }

            if ($attrs.columnFilterApi) {
                $scope.customization.columnFilter.api.name = $attrs.columnFilterApi;
                $scope.customization.columnFilter.api.saveFnName = $attrs.columnFilterSaveFnName;
                if ($attrs.columnFilterSaveFnParameters !== undefined) {
                    $scope.customization.columnFilter.api.saveFnParameters = $.parseJSON($attrs.columnFilterSaveFnParameters);
                }
                require([$attrs.columnFilterApi], function(api) {
                    $scope.customization.columnFilter.api.api = api;
                });
            }

            if ($attrs.rowDeleteEnabled !== undefined) {
                $scope.customization.rowDelete.enabled = $attrs.rowDeleteEnabled === "true";
            }
            if ($attrs.rowDeleteIdProperty !== undefined) {
                $scope.customization.rowDelete.deleteIdProperty = $attrs.rowDeleteIdProperty;
            }
            if ($attrs.rowDeleteDisplayTemplate !== undefined) {
                $scope.customization.rowDelete.displayTemplate = $attrs.rowDeleteDisplayTemplate === "true";
            }
            $scope.customization.rowDelete.buttonDisabledExpression = $attrs.rowDeleteButtonDisabledExpression || "false";

            if ($attrs.multipleSelectionEnabled) {
                $scope.customization.multipleSelection.enabled = $attrs.multipleSelectionEnabled;
                $scope.multipleSelection = {
                    active : false
                };
            }
            if ($attrs.apiName !== undefined) {
                $scope.customization.api.name = $attrs.apiName;
                $scope.customization.api.isAngularService = $attrs.apiIsAngularService === "true";
                $scope.customization.api.actionFnName = $attrs.apiActionFnName;
                if ($attrs.apiAllowDataUpdate !== undefined) {
                    $scope.customization.api.allowDataUpdate = $attrs.apiAllowDataUpdate === "true";
                }
                if ($attrs.apiDeleteRowAfterAction !== undefined) {
                    $scope.customization.api.deleteRowAfterAction = $attrs.apiDeleteRowAfterAction === "true";
                }
                if ($attrs.apiDataFnName !== undefined) {
                    $scope.customization.api.dataFnName = $attrs.apiDataFnName;
                }
                if ($attrs.apiDataFnParameters !== undefined) {
                    $scope.customization.api.dataFnParameters = $.parseJSON($attrs.apiDataFnParameters);
                }

                require([$attrs.apiName], function(api) {
                    if ($scope.customization.api.isAngularService) {
                        var serviceName = $attrs.apiName.substring($attrs.apiName.lastIndexOf('/') + 1);
                        if (serviceProvider[serviceName]) {
                            $scope.customization.api.api = serviceProvider[serviceName];
                        } else {
                            var injector = angular.injector(['ng', serviceName]);
                            $scope.customization.api.api = injector.get(serviceName);
                        }
                    } else {
                        $scope.customization.api.api = api;
                    }

                    if ($scope.customization.api.dataFnName) {
                        loadData();
                    }
                });
            }

            if ($scope.dataRefreshTrigger !== undefined && $scope.dataRefreshTrigger !== null) {
                $scope.$watch(function() {
                    return $scope.dataRefreshTrigger;
                }, function() {
                    loadData(true);
                });
            }


            // END PARAMETERS
            //////////////////////////////////


            //////////////////////////////////
            // ROW AND COLUMN TEMPLATES
            $templateCache.put('templates/rowDetails.html', $scope.customization.rowDetails.template);
            $templateCache.put('templates/rowDelete.html', $scope.customization.rowDelete.template);
            $templateCache.put('templates/initialInformation.html', $scope.customization.initialInformationTemplate);

            for (var colIndex = 0; colIndex < $scope.customization.dataDefinitions.columns.length; colIndex++) {
                var colTemplate = $attrs["columnTemplate" + colIndex];
                if (colTemplate) {
                    $templateCache.put('templates/columnDetails' + colIndex + '.html', anglify(colTemplate));
                } else {
                    $templateCache.put('templates/columnDetails' + colIndex + '.html', "{{p[c.fieldName]}}");
                }
            }
            //////////////////////////////////

            initTable();

            if ($attrs.data !== undefined) {
                $scope.isLoading = false;
            }
        };

        $scope.tableParent = $scope.$parent;
        $scope.init();

        if ($scope.customization.hardFilter.enabled){
            //var filterVariable = getQueryVariable("filter") || $location.path().replace(new RegExp("/\/filter" + ($scope.customization.id ? "-" + $scope.customization.id : "") + "=/"), "");

            // the filter key is 'table-filter' by default
            // if the table has an id, the filter key is 'table-filter-{id}'
            var filterkey = ("table-filter-" + ($scope.customization.id || "")).replace(/-$/, "");
            var filterVariable = hash.get(filterkey);

            // the key in th uxdb
            var uxdbKey = "table-filter|" + $window.location.pathname + ("|" + ($scope.customization.id || "")).replace(/\|$/, "");

            if (filterVariable) {
                $scope.selectedHardFilter = filterVariable;
            }
            else {
                if ($scope.customization.hardFilter.save) {
                    userStorageService.getProperty(uxdbKey).then(function(value) {
                        $scope.selectedHardFilter = value || "";
                    });
                }
                else {
                    $scope.selectedHardFilter = "";
                }
            }

            $scope.$watch('selectedHardFilter', function(newval, oldval) {
                if (newval) {
                    hash.set(filterkey, newval);
                }
                else {
                    hash.remove(filterkey);
                }
                if ($scope.customization.hardFilter.save && newval !== oldval) {
                    userStorageService.setProperty(uxdbKey, newval || "");
                }
                $scope.filter[$scope.customization.hardFilter.field] = newval;
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
            });




        }

        /*if ($scope.customization.multipleSelection.enabled){
            $scope.multipleSelection.active = false;
            $scope.$watch('multipleSelectionActive', function(newval) {
                console.log($scope);
                //if (newval === false)
                    //clearMultipleSelectionCheckboxes();
            });
        }*/

        $scope.$on("CUSTOM_TABLE_ADD_ROW", function(event, obj){
            addRow(obj);
        });

    }]);

    var init = function(element) {
        angular.bootstrap(element, ['customTable']);
    };


    return {
        init: function(element) {
            init(element);
        },
    };
});
