define(['jquery', 'angular', 'service/DCFServiceApi', 'dwr/engine', 'helpers/serviceErrorHandling', 'modules/jquery.validation', 'helpers/common', 'underscore', 'constants', 'angular-route', 'angular-resource', 'local/angularApplications/commonDirectives'], function($, ng, api, engine, errorHandler, Validator, common, _, constants) {

    var resource;
    var template;
    var instance;
    var formname;

    var rootElement;

    var app = ng.module('dcf', ['ngRoute', 'ngResource', 'commonDirectives']);

    var addGuiMeta = function(scope) {
        // TODO: add meta data group to the form
        var data = $.extend(true, {}, scope.form);
        var meta = {
            groupId: "META_GUI",
            groupName: "",
            attributes: [
                {
                    attributeId: "page",
                    attributeName: "",
                    attributeValue: scope.meta.page
                }
            ]
        };

        var found = false;
        $.each(data.groups, function(i, g) {
            if (g.groupId === "META_GUI") {
                data.groups[i] = meta;
                found = true;
            }
        });
        if (!found) {
            data.groups.push(meta);
        }
        return data;
    };

    var getDirective = function(isHide) {

      return ['$animator', function($animator) {
        //linker function
        return function(scope, element, attr) {

          var animate, last;
          animate = $animator(scope, attr);
          last = null;

          return scope.$watch(attr.oaShow, function(value) {
            var action;
            if (isHide)
              value = !value;

            action = value ? "show" : "hide";

            if (action !== last) {
              scope.$emit('elementVisibility', {
                element: element,
                action: action
              });
              animate[action](element);
            }

            return last == action;
          });
        };
      }];
    };

    app.directive('tsShow', ['$timeout', function($timeout) {
        return function(scope, element, attrs) {
            scope.$watch(attrs.tsShow, function ngShowWatchAction(value){
                //console.log(value);
                //$animate[value ? 'removeClass' : 'addClass'](element, 'ng-hide');
                element.toggleClass('ng-hide', !value);
                scope.$emit('elementVisibility', {
                    element: element,
                    attrs: attrs,
                    action: value
                });
            });
        };
    }]);

    //app.directive('tsHide', getDirective(true));

    app.config(["$routeProvider", function($routeProvider) {
        if (constants.dcfUrlRegexp.test(window.location.href)) {
            $routeProvider
                .when('/', { template: 'Loading...', controller: 'ViewController' })
                .when('/:page', { templateUrl: function(data) {
                    console.log(template, data.page, formname);
                    return template.replace("{0}", data.page).replace("{1}", formname);
                }, controller: 'ViewController' })
                .otherwise({ redirectTo: '/' });
        }
    }]);

    app.run(['$rootScope', '$location', function($rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if ($rootScope.isSummary) {
                $location.path('/' + $rootScope.summaryPage);
            }
            /*if (validate && $rootScope.validator && !$rootScope.validator.isFormValid()) {
                // the form is not valid, redirect to the current one
                validate = false;
                $location.path('/' + current.params.page);
            }*/
        });
    }]);

    app.factory('FormService', ['$resource', function($resource) {
        return {
            definition: function(resource) {
                return $resource(resource,
                    {},
                    {
                        get: { method: 'GET' }
                    }
                );
            }
        };
    }]);

    app.filter('breakFilter', function () {
        return function (text) {
            if (text !== undefined) return text.replace(/\n/g, '<br />');
        };
    });

    app.directive('tsUploadFile', function() {
        return {
            link: function(scope, element, attrs) {
                // Since dwr replaces the input type file element we need to do
                // a css select query to get the instance of the new one. The on
                // change even however will still be triggered.
                var parent = $(element).parent();

                $(window).on('change', element, function(e) {
                    element = $("[ts-upload-file]", parent);
                    if (e.target !== element.get(0)){
                        return;
                    }
                    
                    var fileId = attrs.tsUploadFile || ("file" + (scope.files ? scope.files.length + 1 : 1));

                    if (element.val()) {
                        // there is a file

                        var reload = false;
                        // check the instance
                        if (!scope.form.instanceId) {
                            // do a reload after save
                            reload = true;
                        }

                        var status = $("<span />").text('Uploading...');
                        $(attrs.status).append(status);

                        var upload = function() {
                            api.saveFile(common.orgnr, scope.form.instanceId, fileId, element.get(0), errorHandler.serviceCallbacks(function() {
                                // success
                                
                                if (reload) {

                                    scope.updateChangeAndSave(false, true);

                                    scope.gotoInstance(scope.form.instanceId);
                                } else {

                                    // reload the files
                                    api.getFilesOnInstance(common.orgnr, scope.form.instanceId, errorHandler.serviceCallbacks(function(list) {

                                        scope.updateFiles(list);
                                        status.remove();

                                    }, function(message) {
                                        alert('Error in get files: ' + message);
                                    }));

                                }

                            }, function(message) {
                                // error
                                status.remove();
                                alert('Error in save file: ' + message);
                            }));
                        };

                        if (scope.form.instanceId) {
                            upload();
                        } else {
                            // save the form
                            api.saveForm(common.orgnr, addGuiMeta(scope), errorHandler.serviceCallbacks(function(data) {
                                scope.updateForm(data);
                                upload();
                            }, function(message) {
                                status.remove();
                                alert('Error in save form: ' + message);
                            }));
                        }

                    }
                });
            }
        };
    });

    app.directive('tsDownloadFile', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    api.getFile(common.orgnr, scope.form.instanceId, attrs.tsDownloadFile, {
                        async: false,
                        callback: function(url) {
                            engine.openInDownload(url);
                        }
                    });
                });
            }
        };
    });

    app.directive('tsDeleteFile', function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    api.deleteFile(common.orgnr, scope.form.instanceId, attrs.tsDeleteFile, {
                        callback: function() {
                            api.getFilesOnInstance(common.orgnr, scope.form.instanceId, errorHandler.serviceCallbacks(function(list) {
                                scope.confirmRemoveAttachment[attrs.index] = false;
                                scope.updateFiles(list);
                            }, function() {
                                // error
                            }));
                        }
                    });
                });
            }
        };
    });

    app.directive('tsPage', ['$location', function($location) {
        return {
            link: function(scope, element, attrs) {
                
                var handler = function(e) {
                    e.preventDefault();
                    scope.$apply(function() {
                        $location.path('/' + attrs.tsPage);
                    });
                };

                if (element.is('[type=submit]')) {
                    element.closest('form').submit(handler);
                } else {
                    element.click(handler);
                }
            }
        };
    }]);

    app.directive("tsSendorder", ['$location', '$routeParams', function($location, $routeParams) {
        return {
            link: function(scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    
                    var success = function(data) {

                        scope.updateChangeAndSave(false, true);
                        scope.updateForm(data);

                        scope.$apply(function() {
                            $location.path('/' + (parseInt($routeParams.page, 10) + 1));
                        });

                    };

                    var error = function(data) {

                    };

                    var url = "http://www.telia.se/view-form?id={0}";

                    if (scope.formdef.recipient.type && scope.formdef.recipient.type === 'email') {
                        api.emailOrder(common.orgnr, scope.form, "no-reply@telia.se", scope.formdef.recipient.value, "New order", url, errorHandler.serviceCallbacks(success, error));
                    } else if (scope.formdef.recipient.type && scope.formdef.recipient.type === 'alpha') {
                        api.registerOrder(common.orgnr, scope.form, scope.formdef.recipient.value, url, errorHandler.serviceCallbacks(success, error));
                    } else {
                        throw new Error("No recipient!");
                    }


                });


            }
        };
    }]);

    app.directive("tsSaveForm", ['$location', '$routeParams', function($location, $routeParams) {
        return {
            link: function(scope, element, attrs) {

                element.click(function(e) {
                    e.preventDefault();
                    element.trigger('animate');
                    var reload = false;
                    // check the instance
                    if (!scope.form.instanceId) {
                        // do a reload after save
                        reload = true;
                    }

                    api.saveForm(common.orgnr, addGuiMeta(scope), errorHandler.serviceCallbacks(function(data) {
                        // success

                        element.trigger('finish');
                        scope.updateChangeAndSave(false, true);

                        if (reload) {
                            scope.gotoInstance(data.instanceId);
                        }

                        scope.updateForm(data);

                    }, function(message) {
                        // error
                        element.trigger('fail');

                        scope.addError(message);

                    }));

                });


            }
        };
    }]);

    app.directive("tsSaveTemplate", [function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    element.trigger('animate');
                    // make a deep copy of the form groups array
                    // and leave the groups we don't want
                    var groups = {
                        Group: $.map($.grep(scope.form.groups, function(group, index) {
                            // only include the groups that should be saved
                            // don't include meta groups
                            return !/^META/.test(group.groupId) && scope.template.Group[index].save;
                        }), function(group) {
                            return {
                                id: group.groupId,
                                name: group.groupName,
                                Attribute: $.map(group.attributes, function(attr) {
                                    return {
                                        id: attr.attributeId,
                                        name: attr.attributeName,
                                        value: attr.attributeValue
                                    };
                                })
                            };
                        })
                    };
                    
                    var param = JSON.stringify(groups);

                    api.saveUserLevelGroupTemplate(common.orgnr, param, errorHandler.serviceCallbacks(function(data) {
                        // success
                        element.trigger('finish');

                    }, function(message) {
                        // error
                        element.trigger('fail');
                    }));
                    

                });
            }
        };
    }]);

    app.directive("tsShareForm", ['$location', '$routeParams', '$compile', function($location, $routeParams, $compile) {
        return {
            link: function(scope, element, attrs) {

                scope.assign = {
                    user: null,
                    message: ''
                };

                var sent = false;

                var html = $("<div />", { "class": "tscButtonDropdown-containerWrapper", "ts-validator": "", "data-default-message": false, "data-clear-form-on-re-init": true }).append(
                    $("<div />", { "class": "tscButtonDropdown-container tsClear" }).append(
                        $("<div />", { "class": "tseTextField--Small" }).append(
                            $("<input />", { name: 'user', type: "text", placeholder: attrs.userPlaceholder, disabled: true, 'data-rules': 'required', 'data-value': '' })
                        ),
                        $("<div />", { "class": "tseTextArea--Small tsMarginTop--halfGutter" }).append(
                            $("<textarea />", { name: "message", placeholder: attrs.messagePlaceholder, rows: 5, "ng-model": "assign.message" })
                        ),
                        $("<button />", { type: 'submit', "class": "tsBtn--Small--Regular tsPullRight tsMarginTop--halfGutter" }).text(attrs.buttonText).click(function(e) {
                            e.preventDefault();

                            sent = true;
                            var reload = false;
                            // check the instance
                            if (!scope.form.instanceId) {
                                // do a reload after save
                                reload = true;
                            }

                            // add the url to the message
                            var url = "https://www.telia.se/foretag/mybusiness/" + common.orgnr + "/bestall/bestallning/" + scope.form.formName + "/{0}";
                            var message = scope.assign.message + "\n\n" + url;
                            api.assignForm(common.orgnr, addGuiMeta(scope), scope.assign.user.tcwssId, "no-reply@telia.se", scope.assign.user.email, "You have a form", message, errorHandler.serviceCallbacks(function(data) {
                                // success
                                
                                scope.updateChangeAndSave(false, true);

                                if (reload) {
                                    scope.gotoInstance(data.instanceId);
                                }

                                scope.updateForm(data);
                                
                                element.removeClass('open');
                                showHideDropdown(function(show) {
                                    /*if (!show) {
                                        element.addClass('tsHidden').attr('disabled', true).siblings('[ts-unshare-form]').removeClass('tsHidden').attr('disabled', false);
                                        element.siblings('[ts-save-form]').attr('disabled', true);
                                    }*/
                                });

                            }, function(message) {
                                // error
                                alert('Something went wrong: ' + message);
                            }));

                        })
                    )
                );

                api.getUsersList(common.orgnr, errorHandler.serviceCallbacks(function(data) {
                    // success
                    $("input[name=user]", html).attr('disabled', false).autocomplete({
                        source: function(req, res) {
                            var r = new RegExp(".*" + req.term + ".*", "i");
                            var d = $.map($.grep(data, function(user) {
                                return common.userId !== user.tcwssId.toString() && ((user.email !== null && user.email.match(r)) || (user.firstname !== null && user.firstname.match(r)) || (user.surname !== null && user.surname.match(r)));
                            }), function(user) {
                                var name = ((user.firstname || '') + ' ' + (user.surname || '')).replace(/^\s/, '').replace(/\s$/, '');
                                var email = user.email || '';
                                return {
                                    name: name,
                                    email: email,
                                    label: name || email,
                                    user: user
                                };
                            });
                            res(d);
                        },
                        select: function(event, ui) {
                            scope.assign.user = ui.item ? ui.item.user : null;
                            $("input[name=user]", html).data('value', ui.item ? ui.item.user.tcwssId : '').trigger('change');
                        },
                        change: function(event, ui) {
                            scope.assign.user = ui.item ? ui.item.user : null;
                            $("input[name=user]", html).data('value', ui.item ? ui.item.user.tcwssId : '').trigger('change');
                        }
                    }).each(function() {
                        $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                            return $("<li>").data("item.autocomplete", item)
                                .append($("<a>").append(
                                    item.name,
                                    $("<span>", { "class": "email" }).text(item.email)
                                ))
                                .appendTo(ul);
                        };
                        $(this).autocomplete("widget").addClass("user-email-menu");
                    });
                }, function(message) {
                    // error
                }));

                if (attrs.position && attrs.position === 'above') {
                    html.css('bottom', element.outerHeight());
                }

                var w = element.outerWidth(true);

                var showHideDropdown = function(callback) {
                    sent = false;
                    if (element.hasClass('open')) {
                        scope.assign = {
                            user: null,
                            message: ''
                        };
                        if (element.parent('.tscButtonDropdown').length === 0) {
                            element.wrap('<div class="tscButtonDropdown"></div>');
                            element.after(html);
                            $compile(html)(scope);
                        }
                        element.parent().css('margin-right', element.css('margin-right')).stop().animate({ width: attrs.width }, { duration: 200, complete: function() {
                            element.next().stop().slideDown(200, function() {
                                $("input[name=user]", html).focus();
                                if (typeof callback === "function") {
                                    callback(true);
                                }
                            });
                        }});
                    } else if (element.parent('.tscButtonDropdown').length > 0) {
                        element.next('.tscButtonDropdown-containerWrapper').stop().slideUp(200, function() {
                            var e = $(this);
                            element.parent().stop().animate({ width: w }, { duration: 200, complete: function() {
                                e.detach();
                                element.unwrap();
                                if (typeof callback === "function") {
                                    callback(false);
                                }
                            }});
                        });
                    }
                };

                showHideDropdown();
                element.click(function(e) {

                    e.preventDefault();
                    element.toggleClass('open');

                    showHideDropdown();

                });

                // need to watch since we must be able to hacdle closing of the popup if the share is done from another button
                scope.$watch(function() { return scope.displayUnshare(); }, function(hide) {
                    if (hide && !sent && element.hasClass('open')) {
                        // we are in the share form that has not been sent and it is open, remove container and wrapper
                        element.next('.tscButtonDropdown-containerWrapper').hide().detach();
                        element.unwrap();
                        element.removeClass('open');
                    }
                });

            }
        };
    }]);

    app.directive('tsUnshareForm', [function() {
        return {
            link: function(scope, element) {
                element.click(function(e) {
                    e.preventDefault();
                    api.unassignForm(common.orgnr, scope.form, errorHandler.serviceCallbacks(function(data) {
                        // success
                        scope.updateForm(data);

                        /*
                        
                        element.addClass('tsHidden').attr('disabled', true).siblings('[ts-share-form]').removeClass('tsHidden').attr('disabled', false);
                        element.siblings('[ts-save-form]').attr('disabled', false);
                        
                        */
                       
                    }, function(message) {
                        // error
                    }));
                });
            }
        };
    }]);

    app.directive('tsSaveAsPdf', [function() {
        return {
            link: function(scope, element, attrs) {
                element.click(function(e) {
                    
                    e.preventDefault();
                    var doc = new jsPDF('portrait', 'cm', 'a4');

                    var margin = 2;
                    var width = 21 - 2 * margin;
                    var height = 29.7 - 2 * margin;
                    var iconsize = 3;

                    doc.setFont('Helvetica Neue', '');
                    doc.setFontSize(14);
                    doc.setLineWidth(1/72);

                    doc.setFillColor(200,200,200);
                    doc.circle(margin + iconsize/2, margin + iconsize/2, iconsize/2, 'F');

                    var lines = doc.splitTextToSize('Hej, detta är ett test för att kolla ifall det blir radbrytning vid långa texter, vilket det inte verkar bli', width);

                    doc.text(margin, margin, 'Hej');
                    doc.save('order.pdf');
                });
            }
        };
    }]);

    // app.directive('tsValidator', ['$timeout', function($timeout) {
    //     return {
    //         link: function(scope, element, attrs) {
    //             $timeout(function() {
    //                 if (!element.data('validator')) {
    //                     var v = new Validator(element.get(0), { disableSubmitButton: attrs.disableSubmitButton === "false" ? false : true, validateHidden: attrs.validateHidden !== "false", defaultMessage: attrs.defaultMessage ? (attrs.defaultMessage !== "false") : true });
    //                     v.init();
    //                     scope.setValidator(v);
    //                 } else {
    //                     element.data('validator').clearForm();
    //                 }
    //             });
    //         }
    //     };
    // }]);

    app.controller('MainController', ['$timeout', '$rootScope', '$scope', '$location', "$sce", 'FormService', '$attrs', function($timeout, $rootScope, $scope, $location, $sce, FormService, $attrs) {

        resource = $attrs.resource;
        instance = $attrs.instance;
        template = $attrs.template;

        $location.path('/');
        $scope.common = common;
        $rootScope.validator = null;

        $scope.confirmRemoveAttachment = [];

        $(window).on('beforeunload', function() {
            if ($scope.isChanged) {
                return "The form is not saved. Are you sure you want to leave the page?";
            }
        });

        $scope.getHtml = function(html) {
            return typeof html !== "undefined" && html !== null ? $sce.trustAsHtml(html.replace(/\n/g, '<br />')) : "";
        };

        $scope.errors = [];

        $scope.addError = function(error) {
            $scope.$apply(function() {
                $scope.errors.push(error);
            });
        };

        // get the form definition from magnolia
        $scope.form = FormService.definition(resource).get();
        $scope.form.$promise.then(function(data) {
            
            formname = data.name;

            // the save status object
            $scope.template = {
                Group: [ { save: false } ]
            };

            // create the form object to be sent to the service
            var form = {
                Form: {
                    id: data.id,
                    name: data.name,
                    Group: $.map($.grep(data.params.values, function(item) {
                        return item.type === 'group';
                    }), function(group) {
                        // set the default save status to true
                        $scope.template.Group.push({ save: group.group.saveAsTemplate });

                        return {
                            id: data.category + "_" + group.group.id,
                            name: group.group.name,
                            Attribute: $.map($.grep(group.group.attributes.values, function(item) {
                                return item.type === 'attribute' && item.atype !== 'link';
                            }), function(attr) {
                                var v = attr.value;
                                // see if ther is a value for the attribute in the form definition
                                if (attr.allowValueChange && group.values[attr.id] !== '') {
                                    v = group.values[attr.id];
                                }
                                return {
                                    id: attr.id,
                                    name: attr.name,
                                    value: v
                                };
                            })
                        };
                    })
                }
            };

            form.Form.Group.splice(0, 0, { id: "META_PRODUCT", name: "Product Information", Attribute: [ { id: "variant", name: "Variant", value: "" } ] });

            // set the form defintion as property formdef on the scope
            // this scope is inherited down to the view controller
            // used to draw the different form elements with its options
            $scope.formdef = data;

            // a method to be able to update the form from a child scope
            $scope.updateForm = function(form) {
                $scope.$apply(function() {
                    $scope.form = form;
                    console.log(form);
                });
            };

            $scope.gotoInstance = function(id) {
                var url = window.location.pathname.replace(/\/$/, "") + '/' + id;
                window.location.href = url; 
            };

            $scope.fixSelectValue = function(group, attr) {
                if ($scope.form.groups[group].attributes[attr].attributeValue === null) {
                    $scope.ignoreChange = true;
                    $scope.form.groups[group].attributes[attr].attributeValue = "";
                }
            };

            $scope.setValidator = function(v) {
                $rootScope.validator = v;
            };

            $scope.getValidator = function() {
                return $rootScope.validator;
            };

            var resetObject = {};

            $scope.setResetValues = function(values, group, attr, reset, validate) {
                // the values array is fields that when changed should reset the field specified by the group and attr params
                for (var i = 0; i < values.length; i++) {
                    var v = values[i];
                    if (!resetObject[v.group]) {
                        resetObject[v.group] = {};
                    }
                    if (!resetObject[v.group][v.attr]) {
                        resetObject[v.group][v.attr] = [];
                    }
                    resetObject[v.group][v.attr].push({ group: group, attr: attr, reset: reset, validate: validate });
                }
            };

            $scope.$on("elementVisibility", function(e, obj) {
                if (obj.attrs.validate && $scope.getValidator()) {
                    $scope.getValidator().validateField(obj.attrs.validate);
                    $scope.getValidator().toggleSubmitButton();
                }
            });

            $scope.resetValues = function(group, attr) {

                // reset the fields connected to the field specified by the group and attr params
                if (resetObject[group] && resetObject[group][attr]) {
                    for (var i = 0; i < resetObject[group][attr].length; i++) {
                        var f = resetObject[group][attr][i];
                        if (f.reset) {
                            $scope.form.groups[f.group].attributes[f.attr].attributeValue = "";
                        }
                        /*if (f.validate) {
                            // revalidate the field
                            var e = $("form [name='" + f.validate + "']", rootElement);
                            if (e.length) {
                                $timeout(function() {
                                    $scope.validator.validateField(e.get(0));
                                    $scope.validator.toggleSubmitButton();
                                }, 100);
                            }
                        }*/
                    }
                }
            };

            /*$scope.setDisplay = function(expression, validate) {
                if (validate) {
                    // revalidate the field
                    var e = $("form [name='" + validate + "']", rootElement);
                    if (e.length) {
                        $timeout(function() {
                            $scope.validator.validateField(e.get(0));
                            $scope.validator.toggleSubmitButton();
                        }, 100);
                    }
                }
                return expression;
            };*/

            $scope.updateChangeAndSave = function(change, save) {
                $scope.$apply(function() {
                    $scope.isChanged = change;
                    $scope.isSaved = save;
                });
            };

            $scope.updateFiles = function(list) {
                $scope.$apply(function() {
                    $scope.files = list;
                });
            };

            $scope.setIgnoreChange = function(ignore) {
                $scope.ignoreChange = ignore;
            };

            $scope.hasSavePermission = function(){
                var currentUserAssigned = common.userId === $scope.form.assignee;
                var isOwner = $scope.form.ownedBy === null || $scope.form.owner;
                var noneAssigned = $scope.form.assignee === null;
                return $scope.errors.length === 0 && (currentUserAssigned || (isOwner && noneAssigned));
            };

            $scope.displayUnshare = function(){
                var currentUserAssigned = common.userId === $scope.form.assignee;
                var isOwner = $scope.form.ownedBy === null || $scope.form.owner;
                var noneAssigned = $scope.form.assignee === null;
                return isOwner && !noneAssigned && !currentUserAssigned;
            };

            $scope.isSummary = function() {
                return $scope.form.status && $scope.form.status === "REGISTERED";
            };

            var success = function(data) {

                $scope.form = data;
                console.log(data);

                $scope.isChanged = false;
                $scope.isSaved = false;
                $scope.ignoreChange = false;

                // check if the form is loaded from the database
                if (data.instanceId) {
                    // match the form object to the definition
                    
                    // check that it is the correct form
                    if ($scope.formdef.id !== data.formId) {
                        alert('The form is invalid');
                        return;
                    }

                    // create a new form object
                    var d = {
                        assignee: data.assignee,
                        formId: data.formId,
                        formName: form.Form.name,
                        groups: [],
                        hasWriteAccess: data.hasWriteAccess,
                        instanceId: data.instanceId,
                        ownedBy: data.ownedBy,
                        owner: data.owner,
                        status: data.status
                    };

                    // loop through the form definition groups
                    for (var i = 0; i < form.Form.Group.length; i++) {
                        
                        d.groups.push({
                            groupId: form.Form.Group[i].id,
                            groupName: form.Form.Group[i].name,
                            attributes: []
                        });

                        // check if we can find this group in the loaded form
                        var group = -1;
                        for (var _i = 0; _i < data.groups.length; _i++) {
                            if (form.Form.Group[i].id === data.groups[_i].groupId) {
                                group = _i;
                                break;
                            }
                        }

                        // transfer the attributes
                        for (var j = 0; j < form.Form.Group[i].Attribute.length; j++) {
                            
                            var a = {
                                attributeId: form.Form.Group[i].Attribute[j].id,
                                attributeName: form.Form.Group[i].Attribute[j].name,
                                attributeValue: ""
                            };

                            if (group !== -1) {
                                var attribute = -1;
                                for (var _j = 0; _j < data.groups[group].attributes.length; _j++) {
                                    if (data.groups[group].attributes[_j].attributeId === a.attributeId) {
                                        attribute = _j;
                                        break;
                                    }
                                }
                                if (attribute !== -1) {
                                    // the attribute is found in the saved form
                                    a.attributeInstanceId = data.groups[group].attributes[attribute].attributeInstanceId;
                                    a.attributeValue = data.groups[group].attributes[attribute].attributeValue;

                                    // remove the attribute so we don't have to loop it again
                                    data.groups[group].attributes.splice(attribute, 1);
                                }

                            }

                            d.groups[i].attributes.push(a);
                        }

                        if (group !== -1) {
                            // remove the group so we don't have to loop it again
                            data.groups.splice(group, 1);
                        }
                    }

                    // add the remaining groups to the end
                    // only accept META and META_GUI
                    $.each(data.groups, function(index, item) {
                        if (item.groupId === "META" || item.groupId === "META_GUI") {
                            d.groups.push(item);
                        }
                    });

                    $scope.form = d;

                }
               
                // add hte GUI metadata object
                $scope.meta = {
                    comments: [],
                    page: "1"
                };

                // check for meta object in the for object
                $.each(data.groups, function(a, b) {
                    if (b.groupId === "META_GUI") {
                        $.each(b.attributes, function(c, d) {
                            if (d.attributeId === "page") {
                                $scope.meta.page = d.attributeValue;
                            }
                        });
                    }
                });

                if ($scope.form.instanceId && $scope.form.instanceId !== "") {
                    api.getFilesOnInstance(common.orgnr, $scope.form.instanceId, errorHandler.serviceCallbacks(function(data) {
                        $scope.$apply(function() {
                            $scope.files = data;
                        });
                    }, function(message) {

                    }));
                }

                $scope.formfiles = $scope.formdef.file !== null ? [$scope.formdef.file] : [];

                // watch the form object for changes
                $scope.$watch('form.groups', function(oldValue, newValue) {
                    // form is changed;
                    if (!$scope.ignoreChange && !$scope.isSaved && !_.isEqual(oldValue, newValue)) {
                        $scope.isChanged = true;
                    }
                    $scope.isSaved = false;
                    $scope.ignoreChange = false;

                }, true);

                // set this to a real value
                $rootScope.isSummary = $scope.form.status && $scope.form.status === "REGISTERED";
                $rootScope.summaryPage = $scope.formdef.pages;

                $scope.$apply(function() {
                    var page = $scope.meta.page;
                    if ($scope.isSummary()) {
                        page = $scope.formdef.pages;
                    }
                    $location.path('/' + page);
                });

            };

            var error = function(message) {
                alert('Error in view/populate form: ' + message);
            };

            // check if we should load the form
            if (instance) {

                // load the form from the instance
                api.viewForm(common.orgnr, instance, { callback:success, errorHandler:error });


            } else {

                // populate a new form
                api.populateForm(common.orgnr, JSON.stringify(form), errorHandler.serviceCallbacks(success, error));

            }


        });
        
    }]);

    app.controller('ViewController', ['$scope', '$location', '$http', '$route', '$routeParams','$rootScope', 'FormService', '$timeout', function($scope, $location, $http, $route, $routeParams, $rootScope, FormService, $timeout) {

        // check that the form definition is set
        if ($scope.formdef && $routeParams.page !== "") {
            
            // include the template from magnolia
            $timeout(function() {
                $scope.include = template.replace('{0}', $routeParams.page).replace('{1}', $scope.formdef.name);
                console.log($scope.include);
                // set the current page
                // this value is used in the meta group for the form when it is saved
                $scope.meta.page = $routeParams.page;

            });

        }
    
    }]);



    var init = function(element) {

        //template = '/foretag/mybusiness/ajax/dcf?page={0}';
        //resource = '/foretag/mybusiness/ajax/dcf';
        //template = 'data/form-prolane-{0}.html';
        //resource = 'data/form-prolane.json';
        //instance = "1";

        resource = $(element).data('resource');
        instance = $(element).data('instance');
        template = $(element).data('template');
        rootElement = element;

        ng.bootstrap(element, ['dcf']);

    };


    return {

        init: function(element) {
            init(element);
        }
    
    };

});