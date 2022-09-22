(function(factory) {
    
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'helpers/common'], factory);
    } else {
        window.DCFServiceApi = factory(window.jQuery);
    }

})(function($, common) {
    
    var transform = function(form) {
        form.owner = form.ownedBy && form.ownedBy === String(common.userId) ? true : false;
        form.hasWriteAccess = (form.owner && !form.assignee) || (form.assignee && String(common.userId) === form.assignee);
        return form;
    };

    return {

        /**
         * This method populates the form object with values from templates that should
         * be used to prepopulate the form from the start
         * @param  {string} json  The form defintion as a JSON string
         * @param  {object} param callback handler 
         * @return {void}
         */
        populateForm: function(orgnr, json, param) {

            var form = JSON.parse(json);

            var result = {
                instanceId: null,
                formId: form.Form.id,
                formName: form.Form.name,
                owner: false,
                ownedBy: null,
                assignee: null,
                hasWriteAccess: false,
                groups: $.map(form.Form.Group, function(item) {
                    // check for template
                    var template = localStorage.getItem("template_" + item.id);
                    var attributes = [];
                    if (template) {
                        attributes = JSON.parse(template);
                    }
                    return {
                        groupId: item.id,
                        groupName: item.name,
                        attributes: $.map(item.Attribute, function(item) {
                            // check if there is
                            return {
                                attributeInstanceId: 0,
                                attributeId: item.id,
                                attributeName: item.name,
                                attributeValue: (_.find(attributes, function(x) { return x.id === item.id; }) || {}).value || item.value
                            };
                        })
                    };
                })
            };

            setTimeout(function() {
                param.callback(result);
            }, 200);

        },

        /**
         * sends the order
         * @param  {object} form  The form object
         * @param  {object} param The callback object
         * @return {void}
         */
        sendOrder: function(orgnr, form, param) {

            setTimeout(function() {
                param.callback(form);
            }, 200);

        },

        /**
         * Saves the form for later use
         * @param  {object} form  The form object with values 
         * @param  {object} param callback handler
         * @return {void}       
         */
        saveForm: function(orgnr, form, param) {
            console.log("MOCK: saveForm", orgnr, form);

            var id = form.instanceId;

            if (id) {

                var _form = transform(JSON.parse(localStorage.getItem("form-" + id)));

                var ok = _form.owner && !form.assingee;

                if (!ok && !_form.hasWriteAccess) {
                    param.errorHandler("NO_WRITE_ACCESS");
                    return;
                }

            } else {
                var _id = localStorage.getItem("form-id");
                if (_id === null) {
                    id = 1;
                } else {
                    id = parseInt(_id, 10) + 1;
                }
                localStorage.setItem("form-id", String(id));

            }

            var f = $.extend(true, {}, form, { instanceId: String(id), status: form.status || "SAVED", ownedBy: form.ownedBy || String(common.userId) });
            f.formName = "";
            for (var i = 0; i < f.groups.length; i++) {
                f.groups[i].groupName = "";
                for (var j = 0; j < f.groups[i].attributes.length; j++) {
                    f.groups[i].attributes[j].attributeName = "";
                }
            }

            localStorage.setItem("form-" + id, JSON.stringify(f));

            setTimeout(function() {
                param.callback(transform(f));
            }, 1000);

        },

        /**
         * Loads the form from the database
         * @param  {string} instanceId The form instance id
         * @param  {object} param      The callback handlers
         * @return {void}            
         */
        viewForm: function(orgnr, instanceId, param) {

            if (!instanceId) {
                param.errorHandler("NOT_A_VALID_INSTANCE_ID");
                return;
            }

            var form = JSON.parse(localStorage.getItem("form-" + instanceId));

            setTimeout(function() {
                if (form) {
                    param.callback(transform(form));
                } else {
                    param.errorHandler("FORM_DOES_NOT_EXIST");
                }
            }, 200);

        },

        getOrders: function(orgnr, param) {
            console.log("MOCK: getOrders", orgnr);
            var data = [
                 { "instanceId": "i1", "formId": "f1", "owner": "Christian Nagorka", "assignee": "", "status": "SAVED", "createdOn": "03/05/2014 06:49:40", "hasWriteAccess": true, "isOwner": true },
                 { "instanceId": "i2", "formId": 23424, "owner": "Christian Nagorka", "assignee": "", "status": "SAVED", "createdOn": "04/05/2014 06:49:40", "hasWriteAccess": true, "isOwner": true },
                 { "instanceId": "i3", "formId": "f1", "owner": "Peter Wintzell", "assignee": "Christian Nagorka", "status": "SHARED", "createdOn": "02/05/2014 06:49:41", "hasWriteAccess": false, "isOwner": false }
            ];

            setTimeout(function() {
                param.callback(data);
            }, 200);
        },

        registerOrder: function(orgnr, form, groupId, summaryPage, param) {
            console.log("MOCK: registerOrder", orgnr, form, groupId, summaryPage);

            this.saveForm(orgnr, $.extend(true, {}, form, { status: "REGISTERED" }), param);
        },

        emailOrder: function(orgnr, form, senderEmail, recipientEmail, subject, summaryPage, param) {

            console.log(arguments);
            setTimeout(function() {
                param.callback($.extend(true, {}, form));
            }, 200);

        },

        assignForm: function(orgnr, form, assignedUserId, senderEmailId, recipientEmailId, subject, message, param) {

            var _this = this;

            this.saveForm(orgnr, $.extend(true, {}, form, { assignee : String(assignedUserId), status: "SHARED" }), param);
        },


        unassignForm: function(orgnr, form, param) {

            this.saveForm(orgnr, $.extend(true, {}, form, { assignee : null }), param);
        },

        /**
         * Saves the specified groups and attributes as a personal template 
         * @param  {string} json  A json string representing an object with aGroup property
         * @param  {object} param Callback handler
         * @return {void}       
         */
        saveUserLevelGroupTemplate: function(orgnr, json, param) {
            console.log("MOCK: saveUserLevelGroupTemplate:", orgnr, json);

            var groupObject = JSON.parse(json);
            _.each(groupObject.Group, function(g) {
                localStorage.setItem("template_" + g.id, JSON.stringify(g.Attribute));
            });
            setTimeout(function() {
                param.callback(groupObject.Group);
            }, 1000);

        },

        /**
         * Deletes the specified groups and attributes as a personal template 
         * @param  {array} list A list of strings, where each string is the group id 
         * @param  {object} param Callback handler
         * @return {void}       
         */
        deleteUserLevelGroupTemplate: function(orgnr, list, param) {

            setTimeout(function() {
                param.callback([]);
            }, 1000);

        },



        /**
         * Gets a list of users for the current organisation
         * @param  {object} param
         * @return {void}
         */
        getUsersList: function(orgnr, param) {

            var data = [
                { tcwssId: "8013103", firstname: null, surname: 'Nagorka', email: 'christian@nagorka.com' },
                { tcwssId: "2", firstname: 'Joakim', surname: null, email: null },
                { tcwssId: "3", firstname: 'Lars', surname: "Karlsson", email: "lars.karlsson@teliasonera.com" }
            ];

            setTimeout(function() {
                param.callback(data);
            }, 200);

        },


        getFilesOnInstance: function(orgnr, instanceId, param) {

            var id = "files-" + orgnr + "-" + instanceId;
            var files = localStorage.getItem(id);

            if (files === null) {
                files = JSON.stringify([
                    { fileId: "file1", filename: "Order1.xlsx", contentType: '', size: 0 },
                    { fileId: "file2", filename: "Order2.xlsx", contentType: '', size: 0 }
                ]);
                localStorage.setItem(id, files);
            }

            var data = JSON.parse(files);

            setTimeout(function() {
                param.callback(data);
            }, 200);

        },

        getFile: function(orgnr, instanceId, fileId, param) {
            
            setTimeout(function() {
                param.callback("someurl");
            }, 1000);
        },

        deleteFile: function(orgnr, instanceId, fileId, param) {

            var id = "files-" + orgnr + "-" + instanceId;
            var files = JSON.parse(localStorage.getItem(id));
            for (var i=0; i<files.length;i++){
                if (files[i].fileId === fileId){
                    files.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem(id, JSON.stringify(files));
            setTimeout(function() {
                param.callback();
            }, 500);
        },

        saveFile: function(orgnr, instanceId, fileId, obj, param) {

            var id = "files-" + orgnr + "-" + instanceId;
            var files = JSON.parse(localStorage.getItem(id));

            if (files === null) {
                files = [];
            }

            if (!fileId) {
                param.errorHandler("NO_FILE_ID");
                return;
            }

            if (!instanceId) {
                param.errorHandler("NO_INSTANCE_ID");
                return;
            }

            var file = _.find(files, function(x) { return x.fileId === fileId; });
            filename = obj.val().replace(/^.*\\([^\\]+)$/, "$1");
            if (file) {
                file.filename = filename;
            } else {
                files.push({ fileId: fileId, filename: filename });
            }

            localStorage.setItem(id, JSON.stringify(files));

            setTimeout(function() {
                param.callback();
            }, 1000);
        }

    };

});