
define(['jquery', 'angular', 'underscore', 'helpers/common', 'modules/jquery.accordionList', 'modules/jquery.validation', 'constants', 'translationCommon', 'modules/jquery.showMore', 'modules/jquery.animateButton', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/services/userStorageService', 'local/angularApplications/templates'], function($, angular, _, common, initAccordion, Validator, constants, translation) {


    /*
     * This component uses the ngTable directive, see the following pages for more information:
     * https://github.com/esvit/ng-table
     * http://bazalt-cms.com/ng-table/example/1
     */

    var app = angular.module('commonDirectives', ["templates-main"]);

    // "{1} {2}".format("A", "B") --> "A B"
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
    }

    app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

        $scope.username = "frgu02";
        $scope.password = "pwd123";

        $scope.login = function() {
            console.log('login');

            

        };

    }]);


    app.factory('validatorService', function() {
        return {
            validator: null,
            translation: null,
            validators: {}
        };
    });

    app.directive('tsValidator', ['$timeout', 'validatorService', function($timeout, service) {
        return {
            scope: {
                validate: '='
            },
            link: function(scope, element, attrs, ctrl) {
                if (scope.validate !== false) {
                    $timeout(function() {
                        if (!element.data('validator')) {
                            var v = new Validator(element.get(0), { 
                                errorElementClass: attrs.errorElementClass || null,
                                container: attrs.container || null,
                                translation: service.translation,
                                disableSubmitButton: attrs.disableSubmitButton === "false" ? false : true,
                                validateHidden: attrs.validateHidden !== "false",
                                defaultMessage: attrs.defaultMessage ? (attrs.defaultMessage !== "false") : true,
                                preventSubmit: attrs.preventSubmit === "true",
                                addHasErrorOnWrapper: attrs.addHasErrorOnWrapper || null,
                                defaultMessageIncludeName: !attrs.defaultMessageIncludeName || attrs.defaultMessageIncludeName !== "false",
                                submitSelector: attrs.submitSelector || "[type-submit]"
                            });
                            v.init();
                            ctrl.validator = v;
                            service.validator = v;
                            if (attrs.tsValidator) {
                                var extend = {};
                                extend[attrs.tsValidator] = v;
                                service.validators = _.extend({}, service.validators, extend);
                            }
                        } else if (attrs.clearFromOnReInit === "true") {
                            element.data('validator').clearForm();
                        }
                    });
                }
            },
            controller: ['$scope', function($scope) {
                
                this.validator = null;

            }]
        };
    }]);

    app.directive("tsValidatorError", ['$timeout', function($timeout) {
        return {
            scope: {
                tsValidatorError: '='
            },
            require: "^tsValidator",
            link: function(scope, element, attrs, ctrl) {
                var v = null;
                scope.$watch(function() { return ctrl.validator; }, function(validator) {
                    if (validator && !v) {
                        v = validator;
                        var field = v.getFieldObject(element.get(0));
                        field.supressError = true;
                        field.onerror = function(error) {
                            scope.tsValidatorError = error;
                        };
                    }
                });
            }
        };
    }]);

    app.controller("OrganizationSearchController", ["$scope", "corpAdministrationService", "$window", "$timeout", "$http", function($scope, corpAdministrationService, $window, $timeout, $http) {
        
        $scope.orgIdRegex = /^(\d{6})(\-)?(\d{4})$/;

        $scope.searchPlaceholder = translation.translate('SEARCH_MENU_PLACEHOLDER');

        $scope.$watch("organizationId", function (organizationId) {


            if (organizationId === undefined || organizationId === '') {
                return;
            }

            $scope.searchResult = true;
            $scope.getOrganization(organizationId);

        });

        $scope.texts = {
            noResult: "Inga träffar"
        };

        $scope.getOrganization = function (organizationNumber) {
            $scope.isSearching = true;
            $scope.newOrganization = null;
            $scope.notFound = false;

            /*corpAdministrationService.getOrganizationByOrgNr(organizationNumber.replace("-", "")).then(function (organization) {
                // don't know why, but sometimes the scope isn't updated.
                //$timeout(function() {
                    if (organization === null) {
                        $scope.notFound = true;
                    } else {
                        $scope.newOrganization = organization;
                    }
                    $scope.isSearching = false;
                //});
            }, function () {
                $scope.isSearching = false;
                $scope.notFound = true;
            });*/

            var data = $.param({
                orgnr: organizationNumber
            });

            var handleError = function() {
                $scope.isSearching = false;
                $scope.notFound = true;
            };

            $http({
                url: '/foretag/mybusiness/ajax/readCompanyName',
                data: data,
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                if (data.error) {
                    handleError();
                } else {
                    $scope.isSearching = false;
                    $scope.newOrganization = {
                        organizationNumber: organizationNumber,
                        name: data.result
                    };
                }
            }).error(handleError);
            

        };

        $scope.changeUrl = function(org) {
            $window.location.href = constants.baseUrl.replace("{0}", org.organizationNumber);
        };

    }]);

    app.directive("tsOrganizationSearch", [function() {
        return {
            templateUrl: constants.organizationSearchTemplateUrl,
            link: function(scope, element) {

            },
            scope: {},
            controller: "OrganizationSearchController"
        };
    }]);

    app.directive("tsCompanyContacts", ['userStorageService', function(userStorageService) {
        return {
            templateUrl: constants.companyContactsTemplateUrl,
            link: function(scope) {
                scope.headline = translation.translate("ORGANISATION_COMPANY_HEADER");
                scope.loading = true;
                scope.visible = true;
                userStorageService.getOrganisationProperty(common.orgTscid, 'contacts').then(function(data) {
                    scope.contacts = angular.fromJson(data || '[]');
                    scope.visible = scope.contacts.length > 0;
                    scope.loading = false;
                });
            }
        };
    }]);

    app.directive("tsRedirect", ['$timeout', '$interval', '$window', function($timeout, $interval, $window) {
        return {
            link: function(scope, element, attrs) {

                var time = parseInt(attrs.timeout || "10", 10);
                var url = "";
                if (attrs.url) { url = attrs.url; }
                if (attrs.urlExpr) { url = scope.$eval(attrs.urlExpr); }

                scope.seconds = time;
                scope.link = url;

                $interval(function() {
                    scope.seconds--;
                }, 1000, time);

                $timeout(function() {
                    $window.location.href = url;
                }, time * 1000);

            }
        };
    }]);

    app.directive('tsColumnList', [function() {
        return {
            link: function(scope, element, attrs) {
                var items = element.children();
                var columns = Math.max(1, parseInt(attrs.tsColumnList || "2", 10));
                element.css('position', 'relative');
                var h = 0;
                _.each(_.range(columns), function(c) {
                    var index = Math.ceil(items.length/columns * c);
                    var item = items.filter(':eq(' + index + ')');
                    var top = item.position().top;
                    h = Math.max(h, top);
                    item.css({ 'margin-top': -top });
                    var left = items.filter(':gt(' + index + ')').add(item);
                    left.css('margin-left', (100 / columns * c) + '%').attr('data-column', c + 1).each(function(index) {
                        $(this).attr('data-row', index + 1);
                    });
                });
                element.css('height', h);
                //element.attr('ts-position-list', 'row')
            }
        };
    }]);



    /*
        EXAMPLE 1: Pure JavaScript/jquery
        <script type="text/javascript">
            function deleteRole(element, callback) {
            var roleid = button.attr("data-roleid");
            console.log("Deleting role " + roleid);
            setTimeout(function () {
                // Simulate a callback after 1 second.
                button.trigger("finish");
            },1000);
        }
        </script>
        <button type="button" class="tsBtn--Internal--Medium--Animated"
            data-roleid="4"
            ts-loading-button
            x-progress-text="Deleting"
            x-finish-text="Email deleted"
            x-failure-text="Oops,try again!">Confirm removal</button>

        EXAMPLE 2: Angular
        In the controller: $scope.status = "DEFAULT", "LOADING", "FINISHED" or "FAILED"
        <button type="button" class="tsBtn--Internal--Medium--Animated"
            ts-loading-button
            x-status="status"
            x-progress-text="Deleting"
            x-click-enabled="false"
            x-finish-text="Role deleted"
            x-failure-text="Oops,try again!"
            ng-click="doRowAction(p, common.orgnr, p.roleId)">Confirm removal</button>
        
     */
    app.directive('tsLoadingButton', ["$timeout",
        function($timeout) {
            return {
                scope: {
                    status: '='
                },
                link: function(scope, element, attrs) {

                    var setDisabled = function(value) {
                        if (!attrs.ngDisabled) {
                            element.attr('disabled', value);
                        }
                    };

                    scope.$watch('$disabled', setDisabled);

                    var label = element;
                    if (element.children('span').length) {
                        label = element.children('span');
                    }

                    // add support for file button
                    // if the value isn't changed trigger the change anyway
                    var file = element.children('input[type=file]');

                    var attachFileEvents = function(fileElement) {
                        if (fileElement.length) {
                            var status = 0;
                            var value = null;
                            fileElement.on('focus', function(e) {
                                if (status === 1 && $(this).val() === value) {
                                    $(this).trigger('change', e);
                                }
                            }).on('click', function(e) {
                                if (element.is(':disabled')) {
                                    e.preventDefault();
                                    return;
                                }
                                status = 1;
                                value = $(this).val();
                            }).on('change', function(e) {
                                scope.$emit("filechange", fileElement);
                            });
                        }
                    };

                    attachFileEvents(file);

                    scope.setToDisabled = typeof attrs.setToDisabled === "undefined" || attrs.setToDisabled === "true";
                    scope.clickEnabled = typeof attrs.clickEnabled === "undefined" || attrs.clickEnabled === "true";
                    scope.resetAfterComplete = typeof attrs.resetAfterComplete !== "undefined" && attrs.resetAfterComplete === "true";
                    scope.resetAfterCompleteTimeout = parseInt(attrs.resetAfterCompleteTimeout || "2000", 10);
                    scope.setFinishClass = typeof attrs.setFinishClass === "undefined" || attrs.setFinishClass === "true";

                    var defaultText = null;
                    var progressText = attrs.progressText || '';
                    var finishText = attrs.finishText || '';
                    var failureText = attrs.failureText || '';

                    $timeout(function() {
                        defaultText = label.html();
                        progressText = progressText || defaultText;
                        finishText = finishText || defaultText;
                        failureText = failureText || defaultText;
                    });

                    scope.$watch("status", function(newVal, oldVal) {
                        if (newVal === oldVal) {
                            return;
                        }
                        if (newVal === "LOADING") {
                            startProgress();
                        } else if (newVal === "FINISHED") {
                            finish();
                        } else if (newVal === "FAILED") {
                            fail();
                        } else {
                            reset();
                        }
                    });

                    var timeout = function() {
                        if (scope.resetAfterComplete) {
                            if (scope.resetAfterCompleteTimeout > 0 && scope.setFinishClass) {
                                $timeout(function() {
                                    reset();
                                }, scope.resetAfterCompleteTimeout);
                            } else {
                                console.log(reset);
                                reset();
                            }
                        }
                    };

                    var setToActive = function(e) {
                        element.addClass("active");
                        if (scope.setToDisabled !== false){
                            //element.attr("disabled", "disabled");
                            setDisabled(true);
                        }
                        if (typeof e !== "undefined"){
                            e.stopPropagation();
                        }
                    };

                    var setToInactive = function(e, forceDisabled) {
                        // removed this, active class is removed in the reset instead //nagorka
                        element.removeClass("active");
                        if (forceDisabled && scope.setToDisabled !== false){
                            //element.attr("disabled", "disabled");
                            setDisabled(true);
                        } else if (scope.setToDisabled !== false){
                            //element.removeAttr("disabled");
                            setDisabled(false);
                        }
                        if (typeof e !== "undefined"){
                            e.stopPropagation();
                        }
                    };


                    var startProgress = function(e) {
                        setToActive(e);
                        label.html(progressText);
                    };

                    var finish = function(e) {
                        setToInactive(e, true);
                        if (scope.setFinishClass) {
                            element.addClass("finished");
                        }
                        label.html(finishText);
                        timeout();
                    };

                    var reset = function(e) {
                        setToInactive(e);
                        element.removeClass("finished").removeClass('active');
                        if (defaultText !== null) {
                            label.html(defaultText);
                        }
                        if (attrs.tsLoadingButton) {
                            scope.$emit("loadingButtonReset", attrs.tsLoadingButton);
                        }
                        var _file = element.children("input[type=file]");
                        if (file.length && _file.length && file.get(0) !== _file.get(0)) {
                            file = _file;
                            attachFileEvents(file);
                        }
                    };

                    var fail = function(e) {
                        setToInactive(e, true);
                        label.html(failureText);
                        timeout();
                    };

                    if (scope.clickEnabled){
                        element.on('click', startProgress);
                    }
                    element.on('start', startProgress);
                    element.on('finish', finish);
                    element.on('reset', reset);
                    element.on('fail', fail);
                }
            };
        }
    ]);

    /*
        EXAMPLE 1: Pure JavaScript
        <script type="text/javascript">
            function deleteRole(element, callback) {
            // Element contains the a/input field that ts-animate-button is applied to.
            // Callback is callback functions for controlling the animatebutton.
            var roleid = element.attr("data-roleid");
            console.log("Deleting role " + roleid);
            setTimeout(function () {
                callback.finish();
                callback.disable();
            },1000);
        }
        </script>
        <a class="tsBtn--Internal--Medium" ts-animate-button data-roleid="4"
            x-progress-text="Deleting role..." x-finish-text="Role deleted" x-failure-text="Failed!"
            x-max-time="2000" x-on-click="deleteRole">Confirm removal</a>

        EXAMPLE 2: Angular
        In the controller: $scope.sayHello = function(obj, abCallback) { .... }
        <a class="tsBtn--Internal--Medium" ts-animate-button
            x-progress-text="Deleting role..." x-finish-text="Role deleted" x-failure-text="Failed!"
            x-max-time="2000" x-on-click-ng="sayHello(p, abCallback)">Confirm removal</a>
        
     */
    app.directive('tsAnimateButton', [
        function() {
            var instanceCount = 1;
            return {
                scope: {
                    onClickNg: '&'
                },
                link: function(scope, element, attrs) {
                    var html = '<span class="tsAnimateButton-wrapper" data-content="{0}" data-progress="{1}" data-finish="{2}" data-fail="{3}" data-max-time="{4}" id="{5}" data-no-finish="true" data-reset="false" ng-transclude></span>';
                    var content = (element.is('a') ? element.html() : element.attr('value'));
                    var progressText = attrs.progressText || '';
                    var finishText = attrs.finishText || '';
                    var failureText = attrs.failureText || '';

                    var maxTime = attrs.maxTime || "5000";
                    var id = "animateButton" + instanceCount++;
                    html = html.format(content, progressText, finishText, failureText, maxTime, id);

                    element.addClass('tsAnimateButton');
                    element.wrap(html);

                    var wrapperElement = element.parent();
                    $(wrapperElement).animateButton();

                    scope.onClick = attrs.onClick;

                    wrapperElement.bind('click', function() {
                        var callback = {
                            finish: function() { wrapperElement.trigger("finish"); },
                            reset: function() { wrapperElement.trigger("reset"); },
                            fail: function() { wrapperElement.trigger("fail"); },
                            disable: function() { element.attr("disabled", "disabled"); }
                        };

                        if (window[scope.onClick]) {
                            window[scope.onClick](element, callback);
                        }

                        if (scope.onClickNg) {
                            scope.onClickNg({
                                element: element,
                                abCallback: callback
                            });
                        }
                    });
                }
            };
        }
    ]);

    app.directive('tsSelect', ['$timeout', function($timeout) {
            return {
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    if (ngModel) {
                        scope.$watch(function () {
                            if (ngModel.$modelValue === null || ngModel.$modelValue === "") {
                                element.next('.select-placeholder').text("Inget valt"); 
                            }
                            return ngModel.$modelValue;
                        }, function(newValue) {
                            if (newValue) {
                                change();
                            }
                        });
                    }
                    var change = function() {
                        element.next('.select-placeholder').text($('option:selected', element).text());
                    };
                    if (element.parent().attr("class") === undefined || element.parent().attr("class").indexOf("tseSelect") < 0) {
                        var divclass = attrs.tsSelect || "tseSelect--Normal--Narrow";
                        element.wrap("<div class='" + divclass + "'></div>");
                    }
                    $timeout(function() {
                        element.after(
                            $("<div />", { "class": "select-placeholder" }).text($('option:selected', element).text())
                        ).addClass('hidden').change(change);
                    });
                }
            };
        }
    ]);

    app.directive('tsAccordion', ['$timeout', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                // HACK: Post-link action?
                $timeout(function() {
                    initAccordion($(element));
                });
            }
        };
    }]);

    app.directive('tsShowmore', ['$timeout', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element.showMore({ height: parseInt(attrs.height, 10), target: $(attrs.target, element), showMore: attrs.showmore, showLess: attrs.showLess});
                });
            }
        };
    }]);

    app.directive('tsAnimate', function() {
        return {
            scope: {
                tsAnimate: '='
            },
            link: function(scope, element, attrs) {
                var animateType = attrs.animateType || 'slide';
                var duration = parseInt(attrs.animateDuration, 10) || 200;

                var done = function() {
                    scope.$emit("animationDone");
                };

                scope.$watch('tsAnimate', function(show) {
                    // We don't want an initial slide or fade
                    if (!scope.initialized){
                        scope.initialized = true;
                        element.toggle(show === true); // Make sure that the var is passed as boolean to prevent animation
                        return;
                    }
                    if (show === true) {
                        if (animateType === "slide") {
                            element.slideDown(duration, done);
                        } else if (animateType === "fade") {
                            element.fadeIn(duration, done);
                        }
                    } else {
                        if (animateType === "slide") {
                            element.slideUp(duration, done);
                        } else if (animateType === "fade") {
                            element.fadeOut(duration, done);
                        }
                    }
                });
            }
        };
    });

    app.directive('tsAnimateToggle', function() {
        return {
            scope: {
                tsAnimateToggle: '='
            },
            link: function(scope, element, attrs) {
                scope.tsAnimateToggle = false;
                element.on('click', function(e) {
                    var tag = e.target.tagName.toLowerCase();
                    if (tag !== "input" && tag !== "label") {
                        scope.$apply(function() {
                            scope.tsAnimateToggle = !scope.tsAnimateToggle;
                        });
                    }

                });
            }
        };
    });

    app.directive('tsFullContainer', function() {
        return {
            link: function(scope, element) {
                var resize = function() {
                    var elementToCalcFrom = element.closest('table').size() ? element.closest('table') : element.parent();
                    var w = ($(window).width() - elementToCalcFrom.width()) / 2;
                    element.css({ marginLeft: -w, marginRight: -w });
                };
                resize();
                $(window).resize(resize);
            }
        };
    });

    app.directive('tsTriggeredInput', [
        function() {
            return {
                replace: true,
                template: '<span><span ng-show="!triggerEdit">{{modelBinding}}</span><input type="{{inputType}}" class="{{inputClass}}" ng-model="modelBinding" ng-show="triggerEdit"/></span>',
                scope: {
                    triggerEdit: '=triggerEdit',
                    triggerCancel: '=triggerCancel',
                    triggerSave: '=triggerSave',
                    modelBinding: '=ngModel'
                },
                link: function(scope, element, attrs) {
                    scope.inputType = attrs.type;
                    scope.inputClass = attrs["class"];
                    scope.originalValue = scope.modelBinding;

                    scope.$watch('triggerEdit', function (newVal) {
                        if (newVal) {
                            scope.originalValue = scope.modelBinding;
                        }
                    });
                    scope.$watch('triggerCancel', function (newVal) {
                        if (newVal) {
                            scope.modelBinding = scope.originalValue;
                        }
                    });
                }
            };
        }
    ]);

    app.directive('tsTriggeredInputTrigger', ['$rootScope',
        function($rootScope) {
            return {
                replace: true,
                template: '<span class="tscEdit">' +
                    '<a class="tsBtn--Internal--Normal--Regular" ng-disabled="$root.tsTriggeredInputTriggered" ng-click="edit()" ng-show="!triggerEdit">{{editText}}</a>' +
                    '<a class="tsSecondaryLink" ng-click="cancel()" ng-show="triggerEdit">{{cancelText}}</a>' +
                    '<span><a class="tsBtn--Internal--Normal--Regular" ng-click="save()" ng-show="triggerEdit">{{saveText}}</a></span>' +
                    '</span>',
                scope: {
                    triggerEdit: '=triggerEdit',
                    triggerCancel: '=triggerCancel',
                    saveFunction: '&save',
                },
                link: function (scope, element, attrs) {
                    if ($rootScope.tsTriggeredInputTriggered === undefined) $rootScope.tsTriggeredInputTriggered = false;
                    scope.editText = attrs.editText;
                    scope.saveText = attrs.saveText;
                    scope.cancelText = attrs.cancelText;

                    function editMode(val) {
                        scope.triggerEdit = val;
                        $rootScope.tsTriggeredInputTriggered = val;
                        if (val) {
                            scope.triggerCancel = false;
                            scope.triggerSave = false;
                        }
                    }

                    scope.edit = function () {
                        editMode(true);
                    };
                    scope.cancel = function () {
                        scope.triggerCancel = true;
                        editMode(false);
                    };
                    scope.save = function () {
                        scope.triggerSave = true;
                        if (scope.saveFunction) {
                            var retval = scope.saveFunction();
                            if (retval === undefined) retval = true;
                            editMode(!retval);
                        } else {
                            editMode(false);
                        }
                    };
                }
            };
        }
    ]);

    app.directive('tsTriggerFocus', ['$timeout', '$parse', function($timeout, $parse) {
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.tsTriggerFocus);
                scope.$watch(model, function(value) {
                    if(value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }]);


    var init = function (element) {
        angular.bootstrap(element, ['commonDirectives']);
    };


    return {
        init: function (element) {
            init(element);
        }
    };
});