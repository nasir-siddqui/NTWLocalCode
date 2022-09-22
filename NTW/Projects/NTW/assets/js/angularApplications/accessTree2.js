define(['jquery', 'angular', 'constants', 'translationPUI', 'translationManageUser', 'local/angularApplications/commonDirectives', 'local/angularApplications/services/selectedRolesService', 'local/angularApplications/templates'],
    function($, ng, constants, translation, t2) {
        "use strict";

        var app = ng.module('accessTree', ['commonDirectives', 'selectedRolesService', 'templates-main']);

        var linkFunc = function($scope, element, $attrs, controller, selectedRolesServiceWrapper) {

            var instanceId = $scope.$eval($attrs.instance);

            var selectedRolesService = selectedRolesServiceWrapper.getInstance(instanceId);

            $scope.puiStructure = null;
            $scope.readOnly = $attrs.readOnly === "true";
            $scope.puiNames = translation;
            $scope.translation = t2;
            
            $scope.fullAccess = $scope.translation.translate($attrs.fullAccessText || "Full access");
            $scope.partialAccess = $scope.translation.translate($attrs.partialAccessText || "Partial access");
            $scope.noAccess = $scope.translation.translate($attrs.noAccessText || "No access");

            /*$scope.$watch(function() { return selectedRolesService.selectedPuiNames; }, function(newVal) {
                if ($scope.puiStructure === null) return;
                setActivePuis(newVal);
            });*/

            /*$scope.$watch(function() { return selectedRolesService.getSelectedPuiNames(); }, function() {
                console.log('hej');
            });*/

            function setActivePuis(puis) {
                var items = getAllItems();
                $.each(items, function (i, nodePui) {
                    if (isLeafNode(nodePui)) {
                        nodePui.$selected = $.grep(puis, function (pui) { return nodePui.name === pui; }).length > 0;
                        checkStatusChanged(this);
                    }
                });

                updateSelectedLeafPuis();
            }


            $scope.checkStatusChanged = function(item) {
                checkStatusChanged(item);
                updateSelectedLeafPuis();
            };

            function checkStatusChanged(item) {
                var selected = item.$selected;

                // Set all descendants to same selection status
                var descendants = getDescedantItems(item);
                $.each(descendants, function () {
                    this.$selected = selected;
                });

                // Ancestors: 
                // 1) If item unchecked, uncheck ancestors (semichecked handled separately)
                if (selected == false) {
                    $.each(getAncestorItems(item), function () { this.$selected = false; });
                }
                // 2) If item checked, select parent if all siblings are selected (recursively)
                if (selected) {
                    var current = item;
                    while (current.$parent != null) {
                        var siblings = current.$parent.items;
                        if (siblings.every(function (i) { return i.$selected; })) current.$parent.$selected = true;
                        current = current.$parent;
                    }
                }
            }

            $scope.isSemichecked = function(item) {
                if (isLeafNode(item)) return false;
                var total = item.items.length;
                var selectedCount = $.grep(item.items, function(i) { return i.$selected; }).length;
                var semiselectedCount = $.grep(item.items, function(i) { return $scope.isSemichecked(i); }).length;
                return (selectedCount > 0 && selectedCount < total) || semiselectedCount > 0;
            };

            $scope.checkStatus = function(item) {
                var status;
                if (item.$selected) {
                    status = $scope.fullAccess;
                } else if ($scope.isSemichecked(item)) {
                    status = $scope.partialAccess;
                } else {
                    status = $scope.noAccess;
                }
                return status;
            };

            function updateSelectedLeafPuis() {
                var items = $.grep(getAllItems(), function(item) { return item.$selected && isLeafNode(item); });
                var puis = $.map(items, function (item) { return item.name; });
                if (puis.length > 0) {
                    $scope.puiIsSelected = true;
                }
                else {
                    $scope.puiIsSelected = false;
                }
                selectedRolesService.setSelectedPuiNames(puis);
            }

            function getAllItems() {
                return getDescedantItems({ items: $scope.puiStructure });
            }

            function getDescedantItems(item) {

                function getDescedantItemsInt(item, addSelf) {
                    if (isLeafNode(item)) return [item];

                    var result = [];
                    $.each(item.items, function() { result = result.concat(getDescedantItemsInt(this, true)); });
                    if (addSelf) result.push(item);
                    return result;
                }

                return getDescedantItemsInt(item, false);
            }

            function getAncestorItems(item) {
                var ancestors = [];
                var current = item;

                while (current.$parent !== null) {
                    ancestors.push(current.$parent);
                    current = current.$parent;
                }

                return ancestors;
            }

            // Sets the $parent property of each item in the data, to easily allow for "get all ancestors" later
            function setItemsParent(data) {

                function setItemsParentInt(data, parent) {
                    if (!data) return;

                    $.each(data, function() {
                        this.$parent = parent;
                        if (this.items) setItemsParentInt(this.items, this);
                    });
                }

                setItemsParentInt(data, null);
            }

            function isLeafNode(node) {
                return node.items === undefined || node.items === null;
            }

            function getTranslation(name) {
                // TODO: On controller init, get the PUI translation data. In this method, return the translation for the requested PUI name (string). Return the name itself if no translation is found.
                return translation.translate(name);
                //return name; 
            }

            function setTranslations(puiStructure) {
                var allItems = getDescedantItems({ items: puiStructure });
                $.each(allItems, function() { this.displayName = getTranslation(this.name); });
            }

            function setPuiStructure(puiStructure) {
                setItemsParent(puiStructure);
                setTranslations(puiStructure);
                $scope.puiStructure = puiStructure;

                selectedRolesService.getSelectedPuiNames(function(data) {
                    setActivePuis(data);
                });
            }

            function createPuiStructure(puis) {

                function createNodePath(current, nodeNames, leaf) {
                    if (nodeNames.length === 0) {
                        current.items.push(leaf);
                        return;
                    }

                    var checkNodeName = nodeNames.shift();

                    var matchingExistingNodes = $.grep(current.items, function(node) { return node.name === checkNodeName; });
                    if (matchingExistingNodes.length === 0) {
                        var newNode = { name: checkNodeName, items: [] };
                        current.items.push(newNode);
                        createNodePath(newNode, nodeNames, leaf);
                    } else {
                        createNodePath(matchingExistingNodes[0], nodeNames, leaf);
                    }
                }

                var treeRoot = { items: [] };
                $.each(puis, function() {
                    createNodePath(treeRoot, this.type.split('/'), this);
                });

                return treeRoot.items;
            }

            function getPuiStructureData() {
                /*if (selectedRolesService.availablePuis !== null) {
                    var puiStructure = createPuiStructure(selectedRolesService.availablePuis);
                    setPuiStructure(puiStructure);
                }*/
                selectedRolesService.getAvailablePuis(function(data) {
                    var puiStructure = createPuiStructure(data);
                    setPuiStructure(puiStructure);
                });
            }

            //$scope.$watchCollection(function () { return { a: selectedRolesService.availablePuis, b: selectedRolesService.availableRoles }; }, function () { getPuiStructureData(); });
            //$scope.$watch(function () { return selectedRolesService.accessReadOnly; }, function (newVal) { $scope.readOnly = newVal; });

            function initController() {
                selectedRolesService.accessReadOnly = $scope.readOnly;
                if ($attrs.structureData !== undefined) {
                    var puiStructure = $.parseJSON($attrs.structureData);
                    setPuiStructure(puiStructure);
                } else {
                    getPuiStructureData();
                }
            }

            initController();
        };

        app.directive('tsAccessTree', ['selectedRolesService', function(selectedRolesServiceWrapper) {
            return {
                templateUrl: constants.accessTreeTemplateUrl,
                replace: 'true',
                controller: 'AccessTreeController',
                link: function(a, b, c, d) { linkFunc(a, b, c, d, selectedRolesServiceWrapper); }
            };
        }]);

        app.directive('tsAccessList', ['selectedRolesService', function(selectedRolesServiceWrapper) {
            return {
                templateUrl: constants.accessListTemplateUrl,
                replace: 'true',
                controller: 'AccessTreeController',
                link: function(a, b, c, d) { linkFunc(a, b, c, d, selectedRolesServiceWrapper); }
            };
        }]);

        app.controller('AccessTreeController', [
            '$compile', '$scope', '$q', '$attrs', 'selectedRolesService', function($compile, $scope, $q, $attrs, selectedRolesServiceWrapper) {
   
            }
        ]);
    });