/*global define */
define(['jquery', 'angular', 'angular-resource'],
    function ($, ng, constants) {
        "use strict";

        var app = ng.module('styrningsalternativApp', ['ngResource']);

        app.controller('styrningsalternativCtrl', [
            '$scope', '$timeout', 'Styrningsalternativ', 'StyrningsalternativConfirm',
            function ($scope, $timeout, Styrningsalternativ, StyrningsalternativConfirm) {
                $scope.init = function (abonnemang, serviceId, connectLinkId, namn, lopnummer, alternativnummer, index, status) {
                    $scope.loadTree(abonnemang, serviceId, connectLinkId, connectLinkId, namn, lopnummer, alternativnummer, index, status);
                }

                $scope.loadTree = function (abonnemang, serviceId, treeConnectLinkId, alternativConnectLinkId, namn, lopnummer, alternativnummer, index, status) {
                	// This is only used in edit mode, so you normally want to load the working copy of the tree.
					// But! When copying a tree you want to load the original.
	                var original = (treeConnectLinkId != alternativConnectLinkId);
	                $scope.styrningsalternativ = Styrningsalternativ.get({ connectLinkId: treeConnectLinkId, original: original }, function () {
                        /* Set properties from ViewModel */
                        $scope.styrningsalternativ.abonnemang = abonnemang;
                        $scope.styrningsalternativ.serviceId = serviceId;
                        $scope.styrningsalternativ.connectLinkId = alternativConnectLinkId;
                        $scope.styrningsalternativ.namn = namn;
                        $scope.styrningsalternativ.lopnummer = parseInt(lopnummer);
                        $scope.styrningsalternativ.alternativnummer = alternativnummer;
                        $scope.styrningsalternativ.index = index;
                        $scope.styrningsalternativ.status = status;
                    });
                }

                /* Geo service */
                $scope.geoService = function () {
                    var geoService = {};

                    geoService.edit = function(geoDistribution) {
                        $scope.geoDistributionEdit.omrade = geoDistribution.omrade;
                        geoDistribution.editing = true;
                        $scope.editing = true;
                    }

                    geoService.save = function(geoDistribution) {
                        geoDistribution.omrade = $scope.geoDistributionEdit.omrade;
                        geoDistribution.editing = false;
                        $scope.editing = false;
                    }

                    geoService.cancel = function (geoDistribution) {
                        geoDistribution.editing = false;
                        $scope.editing = false;
                    }

                    geoService.addBaseToEmptyTree = function() {
                        var newGeo = getNewGeo();
                        newGeo.omrade = "(Område)";
                        $scope.styrningsalternativ.tree.push(newGeo);
                    }

                    var getNewGeo = function() {
                        return new function () {
                            this.tidDistributions = [];
                        }
                    }

                    geoService.add = function(geoIndex) {
                        var newGeo = getNewGeo();
                        
                        $scope.styrningsalternativ.tree.splice((geoIndex + 1), 0, newGeo);
                        
                        $timeout(function() {
                            geoService.edit(newGeo);
                        });

                    }

                    geoService.delete = function(geoIndex) {
                        $scope.styrningsalternativ.tree.splice((geoIndex), 1);
                        $scope.editing = false;

                        // In order to be able to edit the tree, it can never be totally empty.
//                        if ($scope.styrningsalternativ.tree.length == 0) {
//                            $scope.styrningsalternativ.tree.push(geoService.getOnlyGeo());
//                        }
                    }

                    return geoService;
                }();
                /* Geo service end */

                /* Tid service */
                $scope.tidService = function() {
                    var tidService = {};

                    var START_OF_DAY = new Date('0001-01-01T00:00:00.0000000');
                    var END_OF_DAY = new Date('0001-01-01T23:59:59.9999999');

                    tidService.getShortDay = function(index) {
                        switch (index) {
                        case 0:
                            return "Mån";
                        case 1:
                            return "Tis";
                        case 2:
                            return "Ons";
                        case 3:
                            return "Tors";
                        case 4:
                            return "Fre";
                        case 5:
                            return "Lör";
                        case 6:
                            return "Sön";
                        case 7:
                            return "Helgdag";
                        default:
                            return "";
                        }
                    };

                    tidService.getEditDays = function(tidDistributionEdit) {
                        return $.map(tidDistributionEdit.days, function(el) { return el; });
                    };

                    var append = function(result, dayGroupString) {
                        if (result.length > 0) {
                            result += ", ";
                        }

                        result += dayGroupString;

                        return result;
                    };

                    var getDayString = function(tidDistribution) {
                        var days = $.map(tidDistribution.days, function(el) { return el; });
                        var alldays = true;
                        for (var i = 0; i < days.length; i++) {
                            if (!days[i]) {
                                alldays = false;
                                break;
                            }
                        }

                        if (alldays) {
                            return "Alla dagar";
                        }

                        var result = "";
                        var startDay;
                        var daysLength = days.length - 1;
                        for (i = 0; i < daysLength; i++) {
                            if (days[i]) {
                                startDay = tidService.getShortDay(i);
                                i++;
                                if (i < daysLength) {
                                    for (var j = 0;; i++, j++) {
                                        if (i == daysLength || !days[i]) {
                                            if (j == 0) {
                                                result = append(result, startDay);
                                            } else {
                                                result = append(result, startDay + "-" + tidService.getShortDay(i - 1));
                                            }
                                            break;
                                        }
                                    }
                                } else {
                                    result = append(result, startDay);
                                }
                            }
                        }

                        if (tidDistribution.days.holyday) {
                            result = append(result, tidService.getShortDay(7));
                        }

                        return result;
                    }

                    var getSingleTimeString = function(hours, minutes) {
                        return twoDigits(hours) + ":" + twoDigits(minutes);
                    }

                    var twoDigits = function(value) {
                        if (value < 10)
                            return "0" + value;
                        else
                            return value;
                    }

                    var getTimeString = function(tidDistribution) {
                        if (tidDistribution.otherHours) {
                            return "Övrig tid";
                        } else if (tidDistribution.startTimeHours == null
                            || tidDistribution.startTimeMinutes == null
                            || tidDistribution.endTimeHours == null
                            || tidDistribution.endTimeMinutes == null) {
                            return "";
                        }

                        return getSingleTimeString(tidDistribution.startTimeHours, tidDistribution.startTimeMinutes) + "-" + getSingleTimeString(tidDistribution.endTimeHours, tidDistribution.endTimeMinutes);
                    }

                    tidService.toString = function (tidDistribution) {
                        if (tidDistribution === undefined || tidDistribution == null || tidDistribution.days === undefined) {
                            return "";
                        }

                        return getDayString(tidDistribution) + " " + getTimeString(tidDistribution);
                    }

                    tidService.edit = function (tidDistribution) {
                        $scope.editing = true;
                        tidDistribution.editing = true;

                        $scope.tidDistributionEdit.monday = tidDistribution.days.monday;
                        $scope.tidDistributionEdit.tuesday = tidDistribution.days.tuesday;
                        $scope.tidDistributionEdit.wednesday = tidDistribution.days.wednesday;
                        $scope.tidDistributionEdit.thursday = tidDistribution.days.thursday;
                        $scope.tidDistributionEdit.friday = tidDistribution.days.friday;
                        $scope.tidDistributionEdit.saturday = tidDistribution.days.saturday;
                        $scope.tidDistributionEdit.sunday = tidDistribution.days.sunday;
                        $scope.tidDistributionEdit.holyday = tidDistribution.days.holyday;

//                        $scope.tidDistributionEdit.startTime = getSingleTimeString(tidDistribution.startTime);
//                        $scope.tidDistributionEdit.endTime = getSingleTimeString(tidDistribution.endTime);

                        if (tidDistribution.startTimeHours == null) {
                            $scope.tidDistributionEdit.startTimeHours = "";
                        } else {
                            $scope.tidDistributionEdit.startTimeHours = twoDigits(tidDistribution.startTimeHours);
                        }

                        if (tidDistribution.startTimeMinutes == null) {
                            $scope.tidDistributionEdit.startTimeMinutes = "";
                        } else {
                            $scope.tidDistributionEdit.startTimeMinutes = twoDigits(tidDistribution.startTimeMinutes);
                        }

                        if (tidDistribution.endTimeHours == null) {
                            $scope.tidDistributionEdit.endTimeHours = "";
                        } else {
                            $scope.tidDistributionEdit.endTimeHours = twoDigits(tidDistribution.endTimeHours);
                        }

                        if (tidDistribution.endTimeMinutes == null) {
                            $scope.tidDistributionEdit.endTimeMinutes = "";
                        } else {
                            $scope.tidDistributionEdit.endTimeMinutes = twoDigits(tidDistribution.endTimeMinutes);
                        }

                        $scope.tidDistributionEdit.otherHours = tidDistribution.otherHours;
                    }

                    tidService.save = function (tidDistribution) {
                        $scope.editing = false;
                        tidDistribution.editing = false;

                        // Om ingen dag är ikryssad ska det tolkas som att fördelningen ska gälla alla dagar
                        if (!$scope.tidDistributionEdit.monday
                            && !$scope.tidDistributionEdit.tuesday
                            && !$scope.tidDistributionEdit.wednesday
                            && !$scope.tidDistributionEdit.thursday
                            && !$scope.tidDistributionEdit.friday
                            && !$scope.tidDistributionEdit.saturday
                            && !$scope.tidDistributionEdit.sunday
                            && !$scope.tidDistributionEdit.holyday) {
                            tidDistribution.days.monday = true;
                            tidDistribution.days.tuesday = true;
                            tidDistribution.days.wednesday = true;
                            tidDistribution.days.thursday = true;
                            tidDistribution.days.friday = true;
                            tidDistribution.days.saturday = true;
                            tidDistribution.days.sunday = true;
                            tidDistribution.days.holyday = true;
                        } else {
                            tidDistribution.days.monday = $scope.tidDistributionEdit.monday;
                            tidDistribution.days.tuesday = $scope.tidDistributionEdit.tuesday;
                            tidDistribution.days.wednesday = $scope.tidDistributionEdit.wednesday;
                            tidDistribution.days.thursday = $scope.tidDistributionEdit.thursday;
                            tidDistribution.days.friday = $scope.tidDistributionEdit.friday;
                            tidDistribution.days.saturday = $scope.tidDistributionEdit.saturday;
                            tidDistribution.days.sunday = $scope.tidDistributionEdit.sunday;
                            tidDistribution.days.holyday = $scope.tidDistributionEdit.holyday;
                        }

                        tidDistribution.otherHours = $scope.tidDistributionEdit.otherHours;
                        if (!$scope.tidDistributionEdit.otherHours) {
                            if ($scope.tidDistributionEdit.startTimeHours == "") {
                                tidDistribution.startTimeHours = 0;
                                tidDistribution.startTimeMinutes = 0;
                            } else {
                                tidDistribution.startTimeHours = parseInt($scope.tidDistributionEdit.startTimeHours, 10);
                                tidDistribution.startTimeMinutes = parseInt($scope.tidDistributionEdit.startTimeMinutes, 10);
                            }

                            if ($scope.tidDistributionEdit.endTimeHours == "") {
                                tidDistribution.endTimeHours = 24;
                                tidDistribution.endTimeMinutes = 0;
                            } else {
                                tidDistribution.endTimeHours = parseInt($scope.tidDistributionEdit.endTimeHours, 10);
                                tidDistribution.endTimeMinutes = parseInt($scope.tidDistributionEdit.endTimeMinutes, 10);
                            }
                        } else {
                            tidDistribution.startTimeHours = undefined;
                            tidDistribution.startTimeMinutes = undefined;
                            tidDistribution.endTimeHours = undefined;
                            tidDistribution.endTimeMinutes = undefined;
                        }

                        tidDistribution.editing = false;
                    }

                    tidService.cancel = function (tidDistribution) {
                        $scope.editing = false;
                        tidDistribution.editing = false;
                    }

                    tidService.add = function (geoIndex, tidIndex) {
                        var newTid = new function() {
//                            this.startTime = new Date(START_OF_DAY);
//                            this.endTime = new Date(END_OF_DAY);
                            this.days = {
                                monday: true,
                                tuesday: true,
                                wednesday: true,
                                thursday: true,
                                friday: true,
                                saturday: true,
                                sunday: true,
                                holyday: true
                            }

                            this.anropDistributions = [];
                        }

                        $scope.styrningsalternativ.tree[geoIndex].tidDistributions.splice((tidIndex + 1), 0, newTid);

                        $timeout(function () {
                            tidService.edit(newTid);
                        });

                    }

                    tidService.getFull = function() {
                        return  new function () {
                            this.startTime = new Date(START_OF_DAY);
                            this.endTime = new Date(END_OF_DAY);
                            this.days = {
                                monday: true,
                                tuesday: true,
                                wednesday: true,
                                thursday: true,
                                friday: true,
                                saturday: true,
                                sunday: true,
                                holyday: true
                            }
                            this.anropDistributions = [];
                        }
                    }

                    tidService.getNode = function(geoIndex, tidIndex){
                        var geo = $scope.styrningsalternativ.tree[geoIndex];
                        if (tidIndex == -1) {
                            if (!geo.tidDistributions || geo.tidDistributions.length == 0) {
                                geo.tidDistributions = [];
                                var newFullTid = tidService.getFull();
                                geo.tidDistributions.push(newFullTid);
                                return newFullTid;
                            }

                            tidIndex++;
                        }

                        return geo.tidDistributions[tidIndex];
                    }

                    tidService.delete = function(geoDistribution, tidIndex) {
                        geoDistribution.tidDistributions.splice(tidIndex, 1);
                        $scope.editing = false;
                    }

                    return tidService;
                }();
                /* Tid service end */

                /* Anrop service */
                $scope.anropService = function() {
                    var anropService = {}

                    anropService.edit = function (anropDistribution) {
                        $scope.editing = true;
                        anropDistribution.editing = true;

                        $scope.anropDistributionEdit.distribution = anropDistribution.distribution;
                    }

                    anropService.save = function (anropDistribution) {
                        $scope.editing = false;
                        anropDistribution.editing = false;

                        anropDistribution.distribution = $scope.anropDistributionEdit.distribution;
                    }

                    anropService.cancel = function (anropDistribution) {
                        $scope.editing = false;
                        anropDistribution.editing = false;
                    }

                    anropService.add = function (geoIndex, tidIndex, anropIndex) {
                        var newAnrop = new function () {}

                        var tidNode = $scope.tidService.getNode(geoIndex, tidIndex);

                        tidNode.anropDistributions.splice((anropIndex + 1), 0, newAnrop);

                        $timeout(function () {
                            anropService.edit(newAnrop);
                        });
                    }

                    anropService.getFull = function() {
                        return new function() {
                            this.distribution = 100;
                        }
                    }

                    anropService.getNode = function(geoIndex, tidIndex, anropIndex) {
                        var tidNode = $scope.tidService.getNode(geoIndex, tidIndex);

                        if (anropIndex == -1) {
                            if (!tidNode.anropDistributions || tidNode.anropDistributions.length == 0) {
                                tidNode.anropDistributions = [];
                                var newFullAnrop = anropService.getFull();
                                tidNode.anropDistributions.push(newFullAnrop);
                                return newFullAnrop;
                            }

                            anropIndex++;
                        }

                        return tidNode.anropDistributions[anropIndex];
                    }

                    anropService.delete = function (tidDistribution, anropIndex) {
                        tidDistribution.anropDistributions.splice(anropIndex, 1);
                        $scope.editing = false;
                    }

                    return anropService;
                }();
                /* Anrop service end */

                /* Svarsställe service */
                $scope.svarsstalleService = function () {
                    var svarsstalleService = {}

                    svarsstalleService.edit = function (svarsstalle) {
                        $scope.editing = true;
                        svarsstalle.editing = true;

                        $scope.svarsstalleEdit.svarsstalle = svarsstalle.svarsstalle;
                    }

                    svarsstalleService.save = function (svarsstalle) {
                        $scope.editing = false;
                        svarsstalle.editing = false;

                        svarsstalle.svarsstalle = $scope.svarsstalleEdit.svarsstalle;
                    }

                    svarsstalleService.cancel = function (svarsstalle) {
                        $scope.editing = false;
                        svarsstalle.editing = false;
                    }

                    svarsstalleService.add = function (geoIndex, tidIndex, anropIndex) {
                        var newSvarsstalle = new function () { }

                        var anropNode = $scope.anropService.getNode(geoIndex, tidIndex, anropIndex);

                        anropNode.svarsstalle = newSvarsstalle;

                        $timeout(function () {
                            svarsstalleService.edit(newSvarsstalle);
                        });
                    }

                    svarsstalleService.shouldShowAdd = function (geoIndex, tidIndex) {
                        var tidDistributions = $scope.styrningsalternativ.tree[geoIndex].tidDistributions;

                        if (!tidDistributions || tidDistributions.length == 0)
                            return true;
                        else if (tidIndex == -1) {
                            return false;
                        }

                        var anropDistributions = tidDistributions[tidIndex].anropDistributions;

                        if (!anropDistributions || anropDistributions.length == 0)
                            return true;
                        else {
                            return false;
                        }
                    }

                    svarsstalleService.delete = function(anropDistribution) {
                        anropDistribution.svarsstalle = undefined;
                        $scope.editing = false;
                    }

                    return svarsstalleService;
                }();
                /* Svarsställe service end */

                /* Delete confirm */
                $scope.deleteConfirm = function() {
                    return {
                        show: function(node) {
                            node.showDeleteConfirm = true;
                            /* This is so that the node will be selected before other selects are ignored */
                            $timeout(function() {
                                $scope.editing = true;
                            });
                        },
                        hide: function(node) {
                            $scope.editing = false;
                            node.showDeleteConfirm = false;
                        }
                    }
                }();
                /* Delete confirm end*/

                /* Editing variables */
                $scope.geoDistributionEdit = {};
                $scope.tidDistributionEdit = {};
                $scope.anropDistributionEdit = {};
                $scope.svarsstalleEdit = {};

                $scope.editing = false;
                $scope.selected = {
                    element : null,
                    model : null
                }
                $scope.hovered = {
                    element : null,
                    model : null
                }
                /* Editing variables end*/

                /* Save etc */
                $scope.save = function() {
                    $scope.styrningsalternativ.$save(function (response) {
                        window.location.href = angular.fromJson(response).path;
                    });
                }

                $scope.confirm = function () {
                    $scope.styrningsalternativ.$save(function (responseJson) {
                        var response = angular.fromJson(responseJson);
                        StyrningsalternativConfirm.save({ connectLinkId: response.connectLinkId }, function () {
                            window.location.href = response.path;
                        });
                    });
                }

                $scope.cancel = function() {
                    console.log("Avbryt!");
                }

                $scope.copyAlternative = function () {
                    if ($scope.styrningsalternativForCopy != null) {
                        $scope.showCopyAlternativ = false;
                        var styrningsalternativ = $scope.styrningsalternativ;
                        $scope.loadTree(styrningsalternativ.abonnemang, styrningsalternativ.serviceId, $scope.styrningsalternativForCopy, styrningsalternativ.connectLinkId, styrningsalternativ.namn, styrningsalternativ.lopnummer, styrningsalternativ.alternativnummer, styrningsalternativ.index, styrningsalternativ.status);
                        $scope.styrningsalternativForCopy = null; // Does not seem to work, but is not so important.
                    }
                }
                /* Save etc end*/

                $scope.$watch('styrningsalternativ.tree.length', function () {
                    if ($scope.styrningsalternativ != null && $scope.styrningsalternativ.tree != null && $scope.styrningsalternativ.tree.length == 0) {
                        $scope.geoService.addBaseToEmptyTree();
                    }
                });

	            $scope.treeValid = true;
                $scope.$watch('styrningsalternativ.tree', function() {
                    var geoDistributions = $scope.styrningsalternativ.tree;

                    if (geoDistributions == null || geoDistributions.length == 0) {
                        $scope.treeValid = false;
                        return;
                    }

                    for (var i = 0; i < geoDistributions.length; i++) {
                        var tidDistributions = geoDistributions[i].tidDistributions;

                        if (tidDistributions == null || tidDistributions.length == 0) {
                            $scope.treeValid = false;
                            return;
                        }

                        for (var j = 0; j < tidDistributions.length; j++) {
                            var anropDistributions = tidDistributions[j].anropDistributions;

                            if (anropDistributions == null || anropDistributions.length == 0) {
                                $scope.treeValid = false;
                                return;
                            }

                            for (var k = 0; k < anropDistributions.length; k++) {
                                var anropDistribution = anropDistributions[k];

                                if (anropDistribution.svarsstalle == null || anropDistribution.svarsstalle.length == 0) {
                                    $scope.treeValid = false;
                                    return;
                                }
                            }
                        }
                    }

                    $scope.treeValid = true;
                }, true);
            }
        ]);

        //        Default actions:
        //        { 'get':    {method:'GET'},
        //          'save':   {method:'POST'},
        //          'query':  {method:'GET', isArray:true},
        //          'remove': {method:'DELETE'},
        //          'delete': {method:'DELETE'} };
        app.factory('Styrningsalternativ', ['$resource',
          function ($resource) {
              return $resource('Alternativ_Data');
          }]);

        app.factory('StyrningsalternativConfirm', ['$resource',
          function ($resource) {
              return $resource('Alternativ_Confirm');
          }]);

        /* ntw-selectable="model" Manages select and hover for the nodes */
        app.directive('ntwSelectable', function() {
            return {
                restrict: 'A',
                scope: {
                    model: "=ntwSelectable"
                },
                link: function($scope, element, attrs) {
                    var clickingCallback = function() {
                        if ($scope.$parent.editing) {
                            return;
                        }

                        $scope.$apply(function () {
                            if ($scope.$parent.selected.model != null) {
                                if ($scope.$parent.selected.model == $scope.model) {
                                    return;
                                } else {
                                    $scope.$parent.selected.model.selected = false;
                                    $scope.$parent.selected.element.removeClass('selected');
                                }
                            }

                            $scope.$parent.selected.element = element;
                            $scope.$parent.selected.model = $scope.model;

                            element.addClass('selected');
                            $scope.model.selected = true;
                        });
                    };
                    element.bind('click', clickingCallback);

                    var mouseEnterCallback = function () {
                        if ($scope.$parent.editing) {
                            return;
                        }

                        $scope.$parent.hovered.model = $scope.model;
                        $scope.$parent.hovered.element = element;

                        $scope.$apply(function() {
                            $scope.model.hovered = true;
                        });
                        element.addClass('selected');
                    }

                    var mouseExitCallback = function () {
                        if ($scope.$parent.editing) {
                            return;
                        }

                        $scope.$parent.hovered.model = null;
                        $scope.$parent.hovered.element = null;

                        $scope.$apply(function () {
                            $scope.model.hovered = false;
                        });

                        if ($scope.$parent.selected.model != $scope.model) {
                            element.removeClass('selected');
                        }
                    }

                    element.hover(mouseEnterCallback, mouseExitCallback);

                    $scope.$watch("model.editing", function (currentValue, previousValue) {
                        if (currentValue === true && !previousValue) {
                            if ($scope.$parent.selected.model != $scope.model) {
                                if ($scope.$parent.selected.model != null) {
                                    $scope.$parent.selected.element.removeClass('selected');
                                    $scope.$parent.selected.model.selected = false;
                                }

                                $scope.$parent.selected.element = element;
                                $scope.$parent.selected.model = $scope.model;
                                $scope.model.selected = true;
                                element.addClass('selected');
                            }

                            if (($scope.$parent.hovered.model != null) && ($scope.$parent.hovered.model != $scope.model)) {
                                $scope.$parent.hovered.element.removeClass('selected');
                                $scope.$parent.hovered.model.hovered = false;
                                $scope.$parent.hovered.element = null;
                                $scope.$parent.hovered.model = null;
                            }

                            element.find("input").first().focus();
                        }
                    });
                }
            }
        });

//        var blurFocusDirective = function () {
//        	return {
//        		restrict: 'E',
//        		require: '?ngModel',
//        		link: function (scope, elm, attr, ctrl) {
//        			if (!ctrl) {
//        				return;
//        			}
//
//        			elm.on('focus', function () {
//        				elm.addClass('has-focus');
//
//        				scope.$apply(function () {
//        					ctrl.hasFocus = true;
//        				});
//        			});
//
//        			elm.on('blur', function () {
//        				elm.removeClass('has-focus');
//        				elm.addClass('has-visited');
//
//        				scope.$apply(function () {
//        					ctrl.hasFocus = false;
//        					ctrl.hasVisited = true;
//        				});
//        			});
//
//        			elm.closest('form').on('submit', function () {
//        				elm.addClass('has-visited');
//
//        				scope.$apply(function () {
//        					ctrl.hasFocus = false;
//        					ctrl.hasVisited = true;
//        				});
//        			});
//
//        		}
//        	};
//        };
//
//        app.directive('input', blurFocusDirective);
//        app.directive('select', blurFocusDirective);

        var init = function (element) {
            ng.bootstrap(element, ['styrningsalternativApp']);
        };

        return {
            init: function (element) {
                init(element);
            }

        };
    }
);