define(['angular', 'underscore', 'service/DCFServiceApi', 'helpers/serviceErrorHandling', 'helpers/common', 'dwr/engine'], function (angular, _, serviceApi, errorHandler, common, engine) {
    "use strict";

    var app = angular.module('DCFService', []);

    app.factory('DCFService', ['$http', '$q', function ($http, $q) {

            // Generate callback that includes returned data
            function getDataCallback(deferred) {
                return {
                    callback: function(data) {
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            }

            // Generate callback that includes returned data and caches the result
            function getCachedDataCallback(deferred, cacheObject, cacheKey) {
                return {
                    callback: function(data) {
                        cacheObject[cacheKey] = data;
                        deferred.resolve(data);
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            }

            function getCachedData(cacheObject, cacheKey) {
                return cacheObject[cacheKey];
            }

            // Generate callback that does not return any data
            function getVoidCallback(deferred) {
                return {
                    callback: function() {
                        deferred.resolve();
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                };
            }


            function hash() {
                if (arguments.length === 0) return "singleton";
                return [].join.call(arguments, ':');
            }

            var service = {};

            service.allGroups = null;
            service.formObject = null;

            /**
             * This method is called as a wrapper for all service methods that returns the form model
             * - It repopulates the form, group and attribute names, which are not stored in the database
             * - It stores the META groups at the top
             * - It adds the regular groups and attributes in the same order as the definition
             * - It removes groups and attributes from the model that doen't exist in the definition
             * - It resets the refering group/attribute index of the model in the definition  
             * @param  {promise} promise The promise that will resolve to the model
             * @return {object}          The new reorganized model
             */
            service.transformModel = function(promise) {
                console.log("SERVICE: transformModel", promise);
                return promise.then(function(model) {
                    model.formName = service.formObject.Form.name;

                    var modelGroups = model.groups;
                    // set the meta data groups first;
                    model.groups = _.filter(modelGroups, function(x) { return x.groupId.match(/^META/); });
                    
                    // create the META_GUI group if it is not there, should only happen for old forms that are not saved with the META_GUI
                    var group = _.find(model.groups, function(x) { return x.groupId === "META_GUI"; });
                    if (!group) {
                        group = {
                            groupId: "META_GUI",
                            groupName: "",
                            attributes: []
                        };
                        model.groups.push(group);
                    }
                    var attribute = _.find(group.attributes, function(y) { return y.attributeId === "page"; });
                    if (!attribute) {
                        attribute = {
                            attributeId: "page",
                            attributeName: "",
                            attributeValue: ""
                        };
                        group.attributes.push(attribute);
                    }

                    if (service.allGroups) {
                        // loop through all groups in the definition
                        _.each(service.allGroups, function(group) {

                            if (group.removeGroupInModel) {
                                return;
                            }

                            // find the group in the model
                            var g = _.find(modelGroups, function(x) { return x.groupId === group.id; });

                            // create the group if it isn't there
                            if (!g) {
                                g = {
                                    groupId: group.id,
                                    attributes: []
                                };
                            }
                            // set the group name and add it
                            g.groupName = group.title;
                            group.index = model.groups.push(g) - 1;

                            // reset the attributes
                            var groupAttrs = g.attributes;
                            g.attributes = [];

                            // loop through all fields in the definition
                            _.each(group.$allFields, function(field) {

                                if (field.removeFieldInModel) {
                                    return;
                                }

                                // find the attribute in the model group
                                var a = _.find(groupAttrs, function(x) { return x.attributeId === field.id; });

                                // create the attribute if it doesn't exist
                                if (!a) {
                                    a = {
                                        attributeId: field.id,
                                        attributeValue: ""
                                    };
                                }

                                // set the default value if it is blank
                                a.attributeValue = a.attributeValue || field.defaultValue || "";
                                
                                // set the attribute name and add it
                                a.attributeName = field.name;
                                field.index = g.attributes.push(a) - 1;

                            });

                        });

                    }
                    return model;
                });
            };

            /////////////////////////////////////
            // Orders
            service.getOrders = function(organzationNumber) {
                var deferred = $q.defer();
                serviceApi.getOrders(organzationNumber, getDataCallback(deferred));
                return deferred.promise;
            };

            service.getOrdersAssignedToMe = function(organzationNumber) {
                var deferred = $q.defer();
                serviceApi.getOrders(organzationNumber, getDataCallback(deferred));
                return deferred.promise.then(function(data) {
                    /*var orders = [];
                    data.forEach(function (order) {
                        if (!order.owner) {
                            orders.push(order);
                        }
                    });
                    return orders;*/
                    return _.filter(data, function(order) {
                        return !order.owner;
                    });
                });
            };

            service.getMySharedOrders = function(organzationNumber) {
                var deferred = $q.defer();
                serviceApi.getOrders(organzationNumber, getDataCallback(deferred));
                return deferred.promise.then(function(data) {
                    /*var orders = [];
                    data.forEach(function (order) {
                        if (order.status === "SHARED" && !order.owner) {
                            orders.push(order);
                        }
                    });
                    return orders;*/
                    return _.filter(data, function(order) {
                        return order.status === "SHARED" && !order.owner;
                    });
                });
            };

            service.getSavedOrders = function(organzationNumber) {
                var deferred = $q.defer();
                serviceApi.getOrders(organzationNumber, getDataCallback(deferred));
                return deferred.promise.then(function(data) {
                    /*var orders = [];
                    data.forEach(function (order) {
                        if (order.status === "SAVED" && order.hasWriteAccess) {
                            orders.push(order);
                        }
                    });
                    return orders;*/
                    return _.filter(data, function(order) {
                        return order.status === "SAVED" && order.hasWriteAccess;
                    });

                });
            };

            var transformDepends = function(depends) {
                
                if (!depends) {
                    return null;
                }

                var groups = [];
                var group = null;
                _.each(depends.fields, function(field) {
                    if (field.group) {
                        group = {
                            type: field.type,
                            fields: []
                        };
                        groups.push(group);
                    } else {
                        if (!group) {
                            group = {
                                type: depends.type,
                                fields: []
                            };
                            groups.push(group);
                        }
                        group.fields.push(field);
                    }
                });

                return {
                    type: depends.type,
                    groups: groups
                };
            };

            service.getDefinition = function(url, instance, orgnr) {
                console.log("SERVICE: getDefinition", url, instance, orgnr);
                var deferred = $q.defer();
                deferred.notify("Loading definition");
                $http.get(url).success(function(data) {
                    deferred.notify("Defintion loaded");
                    var definition = {};
                    var title = null;
                    var pages = [{
                        title: "Välj organisation",
                        type: "choose_org"
                    }];
                    var page = null;
                    var templateGroups = [];
                    var nonTemplateGroups = [];
                    var allGroups = [];
                    var groupIndex = 0;
                    var formObject = {
                        Form: {
                            id: data.id,
                            name: data.title || data.name,
                            Group: []
                        }
                    };
                    var texts = {
                        defaultPageTitle: "Beställning"
                    };
                    service.formObject = formObject;
                    _.each(data.params.values, function(v) {
                        if (v.type === "page" || (v.type === "group" && !page)) {
                            page = {
                                title: v.label || texts.defaultPageTitle,
                                groups: [],
                                fieldsWithRules: []
                            };
                            pages.push(page);
                        }
                        if (v.type === "group") {
                            var wrapper = {
                                fields: [],
                                sections: [],
                            };
                            var group = {
                                title: v.group.title || v.name,
                                sections: [],
                                wrappers: [wrapper],
                                full: v.group.fullwidth || false,
                                id: data.category + "_" + v.group.id,
                                internalId: v.group.id,
                                $allFields: [],
                                template: v.group.saveAsTemplate,
                                removeGroupInModel: false
                            };
                            var groupObject = {
                                id: group.id,
                                name: v.group.name,
                                Attribute: []
                            };
                            formObject.Form.Group.push(groupObject);
                            page.groups.push(group);
                            allGroups.push(group);
                            if (v.group.saveAsTemplate) {
                                group.save = true;
                                templateGroups.push(group);
                            } else {
                                nonTemplateGroups.push(group);
                            }
                            var section = null;
                            var fields = wrapper.fields;
                            var attributeIndex = 0;
                            var prefix = "";
                            _.each(v.group.attributes.values, function(a) {
                                if (a.type === "label") {
                                    section = {
                                        isSection: true,
                                        fields: [],
                                        title: a.label,
                                        description: a.description,
                                        advancedDepends: transformDepends(a.advancedDepends),
                                        copyDepends: a.copyDepends,
                                        visible: true
                                    };
                                    prefix = a.prefix.replace(/([^_])$/, "$1_");
                                    wrapper.sections.push(section);
                                    fields = section.fields;
                                }
                                if (a.type === "attribute") {
                                    if (a.breakSection) {
                                        wrapper = {
                                            fields: [],
                                            sections: [],
                                            allFields: []
                                        };
                                        group.wrappers.push(wrapper);
                                        fields = wrapper.fields;
                                        prefix = "";
                                    }
                                    var classes = [];
                                    var field = {
                                        isSection: false,
                                        type: a.atype,
                                        name: a.name,
                                        title: a.label || a.name,
                                        opt: {},
                                        id: prefix + a.id,
                                        depends: a.depends,
                                        dependsValue: a.dependsValue,
                                        fieldset: a.atype !== 'link' && a.atype !== 'label',
                                        description: a.description,
                                        rules: a.rules || "",
                                        visible: true,
                                        classes: "",
                                        hideLabel: a.hideLabel || false,
                                        defaultValue: v.values[a.id] || a.value,
                                        removeFieldInModel: a.atype === "link",
                                        advancedDepends: transformDepends(a.advancedDepends),
                                        copyDepends: a.copyDepends,
                                        inline: a.inline,
                                        strongLabel: a.strongLabel
                                    };
                                    field.required = /\brequired\b/.test(field.rules);
                                    if (field.rules) {
                                        page.fieldsWithRules.push(field);
                                    }
                                    _.each(a.options, function(opt) {
                                        field.opt[opt.name] = opt.value;
                                    });
                                    if (field.type === "checkbox") {
                                        field.defaultValue = field.opt[field.opt.defaultValue ? "checked" : "unchecked"];
                                    }
                                    classes.push("type-" + field.type);
                                    if (field.inline) {
                                        classes.push("inline");
                                    }
                                    if (field.type === "radiospot" && field.opt.options) {
                                        var g = null;
                                        _.each(field.opt.options, function(o) {
                                            if (o._type && o._type === "group") {
                                                g = {
                                                    title: o.label,
                                                    options: []
                                                };
                                                field.groups = field.groups || [];
                                                field.groups.push(g);
                                            } else if (g) {
                                                g.options.push(o);
                                            } else {
                                                field.single = field.single || [];
                                                field.single.push(o);
                                            }
                                        });
                                    }
                                    /*if (a.includeInPrevious && fields.length > 0) {
                                        var f = _.last(fields);
                                        f.extra = f.extra || [];
                                        f.extra.push(field);
                                    } else {
                                        fields.push(field);
                                    }*/
                                    fields.push(field);
                                    field.classes = classes.join(" ");
                                    group.$allFields.push(field);
                                    if (!field.removeFieldInModel && field.id) {
                                        var attributeObject = {
                                            id: field.id,
                                            name: field.name,
                                            value: field.defaultValue
                                        };
                                        groupObject.Attribute.push(attributeObject);
                                        if (!title && field.type === "label" && attributeObject.value) {
                                            title = attributeObject.value;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    definition = {
                        pages: pages.length + 2,
                        data: data
                    };
                    // add gui meta
                    formObject.Form.Group.push({
                        id: "META_GUI",
                        name: "",
                        Attribute: [
                            {
                                id: "page",
                                name: "",
                                value: "1"
                            },
                            {
                                id: "orgnr",
                                name: "",
                                value: ""
                            }
                        ]
                    });
                    service.allGroups = allGroups;
                    var promise = null;
                    if (instance && orgnr) {
                        deferred.notify("Loading form");
                        promise = service.viewForm(orgnr, instance);
                    } else {
                        //deferred.notify("Populating form");
                        //promise = service.populateForm(formObject);
                        var q = $q.defer();
                        promise = q.promise;
                        q.resolve(null);
                    }
                    promise.then(function(data) {
                        
                        deferred.notify(instance && orgnr ? "Form loaded" : "Form populated");

                        var success = function(files) {
                                
                            console.log('model', data);
                            console.log('defintion', definition);

                            deferred.resolve({
                                model: data,
                                files: files || null,
                                definition: definition,
                                pages: pages,
                                templateGroups: templateGroups,
                                nonTemplateGroups: nonTemplateGroups,
                                allGroups: allGroups,
                                title: title || formObject.Form.name,
                                formObject: formObject
                            });
                        };

                        if (instance && orgnr) {
                            deferred.notify("Loading files on form");
                            service.getFilesOnInstance(orgnr, instance).then(function(files) {
                                deferred.notify("Files on form loaded");
                                success(files);
                            });
                        } else {
                            success();
                        }

                    }, function(message) {
                        console.log(message);
                        deferred.reject(message);
                    });
                });
                return deferred.promise;
            };

            service.viewForm = function(orgnr, instance) {
                console.log("SERVICE: viewForm", orgnr, instance);
                var deferred = $q.defer();
                serviceApi.viewForm(orgnr, instance, getDataCallback(deferred));
                return this.transformModel(deferred.promise);
            };

            service.populateForm = function(orgnr, formObject) {
                console.log("SERVICE: populateForm", orgnr, formObject);
                var deferred = $q.defer();
                serviceApi.populateForm(orgnr, JSON.stringify(formObject), getDataCallback(deferred));
                return this.transformModel(deferred.promise);
            };

            service.getUsersList = function(orgnr) {
                console.log("SERVICE: getUsersList");
                var deferred = $q.defer();
                serviceApi.getUsersList(orgnr, getDataCallback(deferred));
                return deferred.promise;
            };

            service.assignForm = function(orgnr, assign, model) {
                console.log("SERVICE: assignForm", orgnr, assign, model);
                var deferred = $q.defer();
                serviceApi.assignForm(orgnr, model, assign.user.tcwssId, null, null, null, null, getDataCallback(deferred));
                return this.transformModel(deferred.promise);
            };

            service.unassignForm = function(orgnr, model) {
                console.log("SERVICE: unassignForm", orgnr, model);
                var deferred = $q.defer();
                serviceApi.unassignForm(orgnr, model, getDataCallback(deferred));
                return this.transformModel(deferred.promise);
            };

            service.sendForm = function(orgnr, model, recipient) {
                console.log("SERVICE: sendForm", orgnr, model, recipient);
                var deferred = $q.defer();
                if (recipient && recipient.type && recipient.type === "alpha") {
                    var url = "";
                    // maybe send an email to alpha here?
                    serviceApi.registerOrder(orgnr, model, recipient.value, url, getDataCallback(deferred));
                } else if (recipient && recipient.type && recipient.type === "email") {
                    // send the order as an email
                    serviceApi.emailOrder(orgnr, model, null, recipient.value, "", "", getDataCallback(deferred));
                }
                 return this.transformModel(deferred.promise);
           };

            service.saveTemplate = function(orgnr, groupObject) {
                console.log("SERVICE saveTemplate", orgnr, groupObject);
                var deferred = $q.defer();
                serviceApi.saveUserLevelGroupTemplate(orgnr, JSON.stringify(groupObject), getDataCallback(deferred));
                return deferred.promise;
            };

            service.saveForm = function(orgnr, model) {
                console.log("SERVICE: saveForm", orgnr, model);
                var deferred = $q.defer();
                serviceApi.saveForm(orgnr, model, getDataCallback(deferred));
                return this.transformModel(deferred.promise);
            };

            service.populateNames = function(model, form) {
                console.log("SERVICE: populateNames", model, form);
                model.formName = form.Form.name;
                _.each(model.groups, function(group) {
                    var g = _.find(form.Form.Group, function(x) { return x.id === group.groupId; });
                    if (g) {
                        group.groupName = g.name;
                        _.each(group.attributes, function(attribute) {
                            var a = _.find(g.Attribute, function(x) { return x.id === attribute.attributeId; });
                            if (a) {
                                attribute.attributeName = a.name;
                            }
                        });
                    }
                });
                return model;
            };

            service.getFilesOnInstance = function(orgnr, instance) {
                console.log("SERVICE: getFilesOnInstance", orgnr, instance);
                var deferred = $q.defer();
                serviceApi.getFilesOnInstance(orgnr, instance, getDataCallback(deferred));
                return deferred.promise;
            };

            service.getFile = function(orgnr, instance, id) {
                console.log("SERVIVE: getFile", orgnr, instance, id);
                var deferred = $q.defer();
                serviceApi.getFile(orgnr, instance, id, {
                    async: false,
                    callback: function(url) {
                        engine.openInDownload(url);
                        deferred.resolve(true);
                    },
                    errorHandler: function(errorString) {
                        errorHandler.translateToMessage(function(message) {
                            deferred.reject(message);
                        }, errorString);
                    }
                });
                return deferred.promise;
            };

            service.deleteFile = function(orgnr, instance, id) {
                console.log("SERVICE: deleteFile", orgnr, instance, id);
                var deferred = $q.defer();
                serviceApi.deleteFile(orgnr, instance, id, getDataCallback(deferred));
                return deferred.promise.then(function() {
                    return service.getFilesOnInstance(orgnr, instance);
                });
            };

            service.saveFile = function(orgnr, model, file, element) {
                console.log("SERVICE: saveFile", orgnr, model, file, element);
                var _model = model;
                var deferred = $q.defer();
                if (!model.instanceId) {
                    service.saveForm(orgnr, model).then(function(data) {
                        _model = data;
                        serviceApi.saveFile(orgnr, _model.instanceId, file.fileId, element, getDataCallback(deferred));
                    });
                } else {
                    serviceApi.saveFile(orgnr, _model.instanceId, file.fileId, element, getDataCallback(deferred));
                }
                return deferred.promise.then(function() {
                    return service.getFilesOnInstance(orgnr, _model.instanceId).then(function(files) {
                        return {
                            model: _model,
                            files: files
                        };
                    });
                });
            };

            return service;
        }
    ]);


    return app;
});
