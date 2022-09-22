define(['angular', 'constants', 'underscore', 'helpers/common', 'translationDCF', 'local/angularApplications/services/DCFService', 'local/angularApplications/services/corpAdministrationService', 'local/angularApplications/commonDirectives'], function(ng, constants, _, common, translation) {
   
    var app = ng.module('DCF2', ['ngRoute', 'DCFService', 'commonDirectives', 'corpAdministrationService']);

    app.factory('RecursionHelper', ['$compile', function($compile){
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function(element, link){
                // Normalize the link parameter
                if(angular.isFunction(link)){
                    link = { post: link };
                }

                // Break the recursion loop by removing the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: (link && link.pre) ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function(scope, element){
                        // Compile the contents
                        if(!compiledContents){
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function(clone){
                            element.after(clone).remove();
                            //element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if(link && link.post){
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }]);

    /*app.config(["$routeProvider", function($routeProvider) {
        if (constants.dc2fUrlRegexp.test(window.location.href)) {
            $routeProvider
                .when('/', {})
                .when('/:page', {})
                .otherwise({ redirectTo: '/' });
        }
    }]);*/

    app.directive('tsDcf', [function() {
        return {
            controller: 'DCFController',
            templateUrl: constants.dcfTemplateUrl
        };
    }]);

    app.directive("tsDcfField", ['$timeout', function($timeout) {
        return {
            templateUrl: constants.dcfFieldTemplateUrl,
            scope: {
                field: '=',
                model: '=',
                group: '=',
                show: '&'
            },
            link: function(scope, element, attrs) {
                scope.section = attrs.section === "true";

                scope.showField = function(group, field) {
                    console.log('directive show', group, field);
                    return scope.show({ group: group, field: field });
                };

                scope.getHtml = function(text) {
                    return text.replace(/__(.*?)__/g, "<strong>$1</strong>");
                };

            }
        };
    }]);

    /*
    app.directive('tsDcfSummaryFields', [function() {
        return {
            templateUrl: constants.dcfSummaryFieldsTemplateUrl,
            scope: {
                fields: '=',
                model: '=',
                group: "=",
                init: '&'
            },
            link: function(scope, element, attrs) {

                scope.initField = function(group, field) {
                    console.log(group.title, field.title);
                    return scope.init({ group: group, fields: field });
                };
            }
        };
    }]);

    */

    /*
    app.directive("tsDcfFieldsWrapper", ['$timeout', function($timeout) {
        return {
            link: function(scope, element) {
                $timeout(function() {
                    element.after(element.children()).remove();
                });
            }
        };
    }]);
    */
   
    app.directive("tsDcfShareDialog", ['$timeout', function($timeout) {
        return {
            templateUrl: constants.dcfShareDialogTemplateUrl,
            link: function(scope, element, attrs) {

                scope.name = attrs.tsDcfShareDialog;

                scope.assign = {
                    user: null,
                    message: null
                };

                scope.item = null;
                scope.open = false;
                var submitted = false;

                var w;
                $timeout(function() {
                    w = element.width();
                    element.css('width', w);
                });

                scope.$watch('share', function(value) {
                    if (!value.status && scope.open) {
                        scope.toggle();
                    }
                }, true);

                scope.$on("animationDone", function() {
                    if (!scope.open) {
                        element.css('width', w);
                        $timeout(function() {
                            if (!scope.open) {
                                scope.$emit('shareClosed');
                            }
                        }, 300);
                    }
                });

                scope.toggle = function() {
                    scope.open = !scope.open;
                    if (scope.open) {
                        submitted = false;
                        element.css('width', 300);
                        $timeout(function() {
                            scope.opened = scope.open;
                        }, 300);
                    } else {
                        scope.opened = false;
                    }
                };

                scope.submit = function() {
                    scope.shareForm({ assign: scope.assign });
                };

            },
            scope: {
                shareForm: "&",
                share: "=",
                texts: "=",
                disabled: "="
            }
        };
    }]);

    app.directive('tsDcfUsers', [function() {
        return {
            link: function(scope, element) {
                element.autocomplete({
                    source: function(req, res) {
                        var r = new RegExp(".*" + req.term + ".*", "i");
                        var d = $.map($.grep(scope.share.users, function(user) {
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
                        scope.item = ui.item;
                        element.data('value', ui.item ? ui.item.user.tcwssId : '').trigger('change');
                    },
                    change: function(event, ui) {
                        scope.assign.user = ui.item ? ui.item.user : null;
                        scope.item = ui.item;
                        element.data('value', ui.item ? ui.item.user.tcwssId : '').trigger('change');
                    }
                }).each(function(i) {
                    $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                        return $("<li>").toggleClass('focus', true).append(
                                item.name,
                                $("<span>", { "class": "email" }).text(item.email)
                            )
                            .appendTo(ul);
                    };
                    $(this).autocomplete("widget").addClass("user-email-menu");
                }).on('blur', function(e) {
                    if (scope.item) {
                        $(this).val(scope.item.value);
                    }
                });
            }
        };
    }]);

    /*app.directive("tsDcfUpload", [function() {
        return {
            scope: {
                file: '='
            },
            link: function(scope, element) {

                element.on('change', function(e) {
                    console.log('file change', $(this).val());
                });

            }
        };
    }]);*/

    app.controller('DCFController', ['$scope', '$attrs', '$location', 'DCFService', '$timeout', '$window', 'validatorService', 'corpAdministrationService', function($scope, $attrs, $location, DCFService, $timeout, $window, validatorService, corpAdministrationService) {

        var validator = null;

        validatorService.translation = translation;

        var validationCallback = function(valid) {
            $scope.$apply(function() {
                $scope.validationError = !valid;
            });
        };

        var errorHandler = function(message) {
            $scope.errorMessage = message;
        };

        /*var controlError = 0;
        $scope.$watch("controlError", function(value, old) {
            var error = ++controlError;
            if (value) {
                $timeout(function() {
                    if (error === controlError) {
                        $scope.controlError = null;
                    }
                }, 3000);
            }
        });
        */
       
        $scope.$watch(function() { return validatorService.validators; }, function(value) {
            if (!validator && value.main) {
                validator = value.main;
                validator.setCallback(validationCallback);
            }
        });

        var isShared = false;

        $scope.share = {
            users: null,
            shareError: null,
            status: ""
        };

        $scope.saveStatus = "";
        $scope.unshareStatus = "";
        $scope.isLoading = true;
        $scope.page = null;
        $scope.title = null;
        $scope.sendStatus = "";
        $scope.templateStatus = "";
        $scope.errorMessage = null;
        $scope.newFile = {};
        $scope.orgnr = "";

        var definitionUrl = constants.dcfDefinitionUrl.replace("{0}", $attrs.tsDcf);
        var instance = $attrs.instance || "";
        var orgnr = $attrs.orgnr || "";

        DCFService.getUsersList().then(function(data) {
            $scope.share.users = data;
        });

        $scope.chooseOrg = {
            orgs: [],
            loading: true,
            org: orgnr,
            disabled: !!orgnr
        };

        corpAdministrationService.getOrganizationsInGroup().then(function(data) {
            $scope.chooseOrg.orgs = data;
            $scope.chooseOrg.loading = false;
        });

        $scope.$watch("chooseOrg.org", function(v) {
            orgnr = v;
        });

        var definition = null;
        var model = {};
        var groups = [];
        var formObject = null;
        
        // TODO: set the real translations here 
        $scope.texts = {
            defaultPageTitle: "Beställning",
            productHeading: "Produkt",
            saveAndSendButtonLabel: "Spara & skicka order",
            saveAndSendDescription: "Important! You must click on the button to save the order",
            summaryTitle: "Färdigställ och skicka beställningen",
            doneTitle: "Beställningen klar",
            saveButton: "Spara",
            shareDialogButton: "Dela",
            shareButton: "Dela",
            unshareButton: "Upphäv delning",
            prevStep: "Tillbaka till:",
            nextStep: "Nästa steg:",
            cancel: "Avbryt köp",
            saveTemplateHeading: "OBS:",
            saveTemplateText: "Spara de markerade grupperna som mall",
            saveTemplateButton: "Spara",
            validationError: "Du har fel i formuläret. Åtgärda och försök igen",
            attentionClose: "Stäng",
            chooseOrgLabel: "Välj organisation",
            chooseOrgOption: "Välj organisation",
            chooseOrgWarning: "Du har inte valt någon organisation. För att göra en beställning måste du välja på vilket organisationsnummer beställningen ska göras"
        };

        var helpers = {
            page: function(page) {
                var p = null;
                if (model) {
                    p = _.find(_.find(model.groups, function(x) { return x.groupId === "META_GUI"; }).attributes, function(y) { return y.attributeId === "page"; });
                }
                if (!p) {
                    return;
                }
                if (page) {
                    p.attributeValue = String(page);
                    return;
                } else {
                    return p.attributeValue;
                }
            }
        };

        $scope.displayUnshare = function() {
            return model && model.owner && model.assignee !== null && model.assignee !== String(common.userId) && isShared;
        };

        $scope.isReadOnly = function() {
            return !model || (!model.hasWriteAccess && model.ownedBy);
        };

        $scope.getDataModel = function(group, field) {
            // perhaps this is a perfromance issue
            if (field) {
                return model.groups[group.index].attributes[field.index];
            }
            return model.groups[group.index];
        };

        $scope.getTitle = function(page) {
            
            var _getTitle = function() {
                if ($scope.isSummary) {
                    return $scope.texts.summaryTitle;
                }
                if ($scope.isDone) {
                    return $scope.texts.doneTitle;
                }
                return $scope.pages[page - 1].title;
            };

            return _getTitle() + (model && model.instanceId ? ": " + model.instanceId : "");
        };

        var getPage = function() {
            var p = parseInt($location.path().replace('/', ''), 10);
            if (isNaN(p)) {
                return -1;
            }
            return p;
        };

        $scope.$watch('model', function(val, old) {
            model = val;
            console.log('model', model);
            if (old && !old.instanceId && val && val.instanceId) {
                $window.location.href = constants.dcfInstanceUrl.replace("{orgnr}", common.orgnr).replace("{category}", (definition.data.info || {}).category || "").replace("{subcategory}", (definition.data.info || {}).subcategory || "").replace("{form}", definition.data.name).replace("{0}", model.instanceId).replace("{1}", orgnr);
            }

            if (model && old) {
                _.each(model.groups, function(group) {
                    var oldgroup = _.find(old.groups, function(x) { return x.groupId === group.groupId; });
                    if (oldgroup) {
                        _.each(group.attributes, function(attribute) {
                            var oldattribute = _.find(oldgroup.attributes, function(x) { return x.attributeId === attribute.attributeId; });
                            if (oldattribute.attributeValue !== attribute.attributeValue) {
                                // this value is changed
                                var definitionGroup = _.find(groups, function(x) { return x.id === group.groupId; });
                                if (definitionGroup) {
                                    var definitionField = _.find(definitionGroup.$allFields, function(x) { return x.id === attribute.attributeId; });
                                    var e = definitionGroup.internalId + "|" + definitionField.id;
                                    $scope.$emit(e);
                                }
                            }
                        });
                    }
                });
            }

        }, true);

        DCFService.getDefinition(definitionUrl, instance, orgnr).then(function(data) {
            
            definition = data.definition;
            groups = data.allGroups;
            formObject = data.formObject;

            $scope.pages = data.pages;
            $scope.templateGroups = data.templateGroups;
            $scope.nonTemplateGroups = data.nonTemplateGroups;
            $scope.allGroups = groups;
            $scope.title = data.title;
            $scope.files = data.files;
            
            $scope.model = model = data.model;
            var _isShared = false;

            isShared = model && model.owner && model.assignee !== null && model.assignee !== String(common.userId);

            var page = helpers.page() || 1;

            // override to last page for registered ordes. This should only be necessary for old orders that don't have the META_GUI group
            if (data.model && data.model.status === "REGISTERED") {
                page = definition.pages;
            }

            var current = getPage();
            if (isPageValid(current)) {
                $scope.$emit("$locationChangeStart");
            } else {
                $location.path('/' + page);
            }

        }, errorHandler, function(message) {
            $scope.loadingStatus = message;
        });

        var getDependencies = function(group, field) {

            var getGroupAndField = function(name) {
                
                var _group = group;
                var fieldId = name;
                if (name.indexOf('.') !== -1) {
                    var d = name.split('.');
                    if (d.length === 2) {
                        fieldId = d[1];
                        _group = _.find(groups, function(g) {
                            return g.internalId === d[0];
                        });
                    }
                }
                if (!_group) {
                    console.log("DCF DEPENDS: cannot find group with id: " + _group.internalId);
                    return null;
                }
                var ref = _.find(_group.$allFields, function(f) {
                    return f.id === fieldId;
                });
                if (!ref) {
                    console.log("DCF DEPENDS: cannot find field with id: " + fieldId + " in group with id: " + _group.internalId);
                    return null;
                }
                return {
                    group: _group,
                    field: ref
                };
            };

            var _type = "AND";
            var _depends = [];
        
            if (field.copyDepends) {
                d = getGroupAndField(field.copyDepends);
                if (d){
                    return getDependencies(d.group, d.field);
                }
            } else if (field.advancedDepends && field.advancedDepends.groups && field.advancedDepends.groups.length) {
                _type = field.advancedDepends.type;
                _.each(field.advancedDepends.groups, function(item) {
                    var group = {
                        type: item.type,
                        fields: []
                    };
                    _depends.push(group);
                    _.each(item.fields, function(field) {
                        d = getGroupAndField(field.name);
                        if (d) {
                            _.extend(d, { compare: field.compare, value: field.value });
                            group.fields.push(d);
                        }
                    });
                });
            }
            // this should meybe be reomved, keep for backward compability
            else if (field.depends) {
                d = getGroupAndField(field.depends);
                if (d) {
                    if (field.dependsValue) {
                        d.compare = "equals";
                        d.value = field.dependsValue;
                    } else {
                        d.compare = "notequals";
                        d.value = "";
                    }
                    _depends.push({
                        type: _type,
                        fields: [d]
                    });
                }
            }
            if (_depends.length) {
                return {
                    type: _type,
                    groups: _depends
                };
            }

            return null;

        };

        $scope.initField = function(group, field) {

            // get the dependencies for the field
            var dependencies = getDependencies(group, field);

            var fields = [];

            var checkVisibile = function() {

                var gvalid = _.filter(dependencies.groups, function(group) {

                    var fvalid = _.filter(group.fields, function(item) {

                        fields.push(item);
                        var fieldValue = model.groups[item.group.index].attributes[item.field.index].attributeValue || "";
                        var compareValue = item.value || "";
                        if (!item.field.visible) {
                            return false;
                        }
                        if (item.compare === "equals") {
                            return fieldValue === compareValue;
                        } else if (item.compare === "notequals") {
                            return fieldValue !== compareValue;
                        }
                        return true;
                    });

                    if (group.type === "AND") {
                        return fvalid.length === group.fields.length;
                    } else if (group.type === "OR") {
                        return fvalid.length > 0;
                    }
                    return false;

                });
    
                var show = false;

                if (dependencies.type === "AND") {
                    // all rules must apply
                    show = gvalid.length === dependencies.groups.length;
                } else if (dependencies.type === "OR") {
                    // at least one rule must apply
                    show = gvalid.length > 0;
                }
                
                var oldshow = field.visible;
                field.visible = show;

                if (show !== oldshow) {
                    var e = group.internalId + "|" + field.id;
                    $scope.$emit(e);
                    $timeout(function() {
                        if (validator) {
                            validator.validateField(field.id);
                        }
                    });
                }

            };

            if (dependencies) {
                
                checkVisibile();

                _.each(fields, function(d) {
                    var e = d.group.internalId + "|" + d.field.id;
                    $scope.$on(e, function() {
                        checkVisibile();
                    });
                });
            }

        };

        var isPageValid = function(page, current) {
            // TODO: some more logic here to prevent going to last page if not registered and only to last page if registered
            if ((!model && page > 1) || page < 1 || !definition || definition.pages < page || (model && model.status === "REGISTERED" && page !== definition.pages) || (model && model.status !== "REGISTERED" && page === definition.pages)) {
                return false;
            }
            // check if page validates
            if (page > current && validator && !validator.isFormValid()) {
                $scope.validationError = true;
                return false;
            }
            $scope.validationError = false;
            return true;

        };

        $scope.$on('$locationChangeStart', function(e, to, from) {
            
            var page = getPage();
            
            // TODO: some more logic here to prevent going to last page if not registered and only to last page if registered
            if (!isPageValid(page, $scope.page)) {
                e.preventDefault();
                return;
            }

            // update page in model
            helpers.page(page);

            $window.scrollTo(0,0);

            $scope.isLoading = false;
            $scope.page = page;
            
            $scope.isSummary = page === definition.pages - 1;
            $scope.isDone = page === definition.pages;

            $timeout(function() {
                if (validator) {
                    validator.setCallback(null);
                    validator.reinit(null, true);
                    validator.setCallback(validationCallback);
                }
            });

        });

        $scope.setPage = function(page) {

            $location.path('/' + page);

        };

        $scope.loadForm = function() {
            if (!model) {
                $scope.formLoadingStatus = "LOADING";
                $scope.chooseOrg.disabled = true;
                DCFService.populateForm(orgnr, formObject).then(function(data) {
                    $scope.model = data;
                    $scope.formLoadingStatus = "FINISHED";
                    $scope.formLoadingStatus = "";
                    $scope.setPage(2);
                }, function(message) {
                    $scope.formLoadingStatus = "FAILED";
                    $scope.controlError = message;
                });
            } else {
                $scope.formLoadingStatus = "";
                $scope.setPage(2);
            }
        };

        $scope.$on('shareClosed', function() {
            isShared = true;
        });

        $scope.shareForm = function(assign) {
            //$scope.share.shareDisabled = true;
            $scope.share.status = "LOADING";
            $scope.controlError = null;
            DCFService.assignForm(orgnr, assign, model).then(function(data) {
                $scope.share.status = "FINISHED";
                $scope.model = data;
            }, function(message) {
                $scope.share.status = "FAILED";
                $scope.controlError = message;
            });
        };

        $scope.unshareForm = function() {
            $scope.unshareStatus = "LOADING";
            $scope.controlError = null;
            DCFService.unassignForm(orgnr, model).then(function(data) {
                $scope.unshareStatus = "FINISHED";
                $scope.model = data;
                isShared = false;
            }, function(message) {
                $scope.unshareStatus = "FAILED";
                $scope.controlError = message;
            });
        };

        $scope.getPageTitle = function(page) {
            if ($scope.pages[page - 1]) {
                return $scope.pages[page - 1].title;
            }
            if (page  === $scope.pages.length) {
                return $scope.texts.summaryTitle;
            }
            if (page - 1 === $scope.pages.length) {
                return $scope.texts.doneTitle;
            }
            return "";
        };

        $scope.cancel = function() {
            // TODO: redirect to some page
            $window.location.href = constants.dcfCancelUrl.replace("{orgnr}", common.orgnr).replace("{category}", (definition.data.info || {}).category || "").replace("{subcategory}", (definition.data.info || {}).subcategory || "");
        };

        $scope.saveForm = function() {
            $scope.saveStatus = "LOADING";
            $scope.controlError = null;
            DCFService.saveForm(orgnr, model).then(function(data) {
                $scope.saveStatus = "FINISHED";
                $scope.model = data;
            }, function(message) {
                $scope.saveStatus = "FAILED";
                $scope.controlError = message;
            });
        };

        $scope.sendForm = function() {
            $scope.sendStatus = "LOADING";
            $scope.sendError = null;
            DCFService.sendForm(orgnr, model, definition.data.recipient).then(function(data) {
                $scope.sendStatus = "FINISHED";
                $scope.setPage($scope.page + 1);
                $scope.model = data;
            }, function(message) {
                $scope.sendStatus = "FAILED";
                $scope.sendError = message;
            });
        };

        $scope.saveTemplate = function() {
            $scope.templateStatus = "LOADING";
            $scope.templateError = null;

            // construct the group object
            var groupObject = {
                Group: _.map(_.filter($scope.templateGroups, function(x) { return x.save; }), function(y) {
                    var g = model.groups[y.index];
                    return {
                        id: g.groupId,
                        name: g.groupName,
                        Attribute: _.map(g.attributes, function(z) {
                            return {
                                id: z.attributeId,
                                name: z.attributeName,
                                value: z.attributeValue
                            };
                        })
                    };
                })
            };
            
            DCFService.saveTemplate(orgnr, groupObject).then(function(data) {
                $scope.templateStatus = "FINISHED";
            }, function(message) {
                $scope.templateStatus = "FAILED";
                $scope.templateError = message;
            });
        };

        $scope.downloadFile = function(file) {
            file.downloadStatus = "LOADING";
            file.error = null;
            DCFService.getFile(orgnr, model.instanceId, file.fileId).then(function() {
                file.downloadStatus = "FINISHED";
            }, function(message) {
                file.downloadStatus = "FAILED";
                file.error = message;
                $timeout(function() {
                    file.downloadStatus = "";
                }, 2000);
            });
        };

        $scope.removeFile = function(file) {
            file.removeStatus = "LOADING";
            file.error = null;
            DCFService.deleteFile(orgnr, model.instanceId, file.fileId).then(function(files) {
                file.removeStatus = "FINISHED";
                $timeout(function() {
                    $scope.files = files;
                }, 1000);
            }, function(message) {
                file.removeStatus = "FAILED";
                file.error = message;
                $timeout(function() {
                    file.removeStatus = "";
                }, 2000);
            });
        };

        $scope.uploadFile = function(file) {
            file.uploadStatus = "LOADING";
            file.error = null;
            var listener = $scope.$on("filechange", function(e, element) {
                if (element.val()) {
                    // do the upload
                    var isNew = false;
                    if (!file.fileId) {
                        isNew = true;
                        var max = _.max($scope.files, function(x) { return parseInt(x.fileId.replace(/file/, ""), 10); });
                        file.fileId = "file" + (parseInt((_.isEmpty(max) ? { fileId: "file1" } : max).fileId.replace(/file/, ""), 10) + 1);
                    }
                    DCFService.saveFile(orgnr, model, file, element.get(0)).then(function(data) {
                        file.uploadStatus = "FINISHED";
                        $timeout(function() {
                            file.uploadStatus = "";
                        }, 2000);
                        $scope.model = data.model;
                        if (isNew) {
                            $scope.files = data.files;
                        } else {
                            // just update the name
                            var f = _.find(data.files, function(x) { return x.fileId === file.fileId; });
                            if (f) {
                                file.filename = f.filename;
                            }
                        }
                        $scope.newFile.fileId = null;
                    }, function(message) {
                        file.error = message;
                        file.uploadStatus = "FAILED";
                        if (isNew) {
                            file.fileId = null;
                        }
                        $timeout(function() {
                            file.uploadStatus = "";
                        }, 2000);
                    });
                } else {
                    // cancel, need to have a scope apply here since we emit the event manually out of the digest process
                    $scope.$apply(function() {
                        file.uploadStatus = "";
                    });
                }
                // remove the listener
                listener();
            });
        };

        $scope.resetError = function(v) {
            if (typeof v === "object") {
                v.error = null;
            } else if (typeof v === "string") {
                $scope[v] = null;
            }
        };

        $scope.$on("loadingButtonReset", function(e, name) {
            if (name === "save") {
                $scope.saveStatus = "";
            } else if (name === "share") {
                $scope.share.status = "";
            } else if (name === "unshare") {
                $scope.unshareStatus = "";
            } else if (name === "template") {
                $scope.templateStatus = "";
            } else if (name === "send") {
                $scope.sendStatus = "";
            } else if (name === "formLoad") {
                $scope.formLoadingStatus = "";
            }
        });

    }]);

});