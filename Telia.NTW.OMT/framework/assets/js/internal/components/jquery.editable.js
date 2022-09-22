/*global define */
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'elements/jquery.dropdown'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    var KEYCODE_ESC = 27;

    var editable = function(options) {

        var form = this;
        var elements = {};

        var transformTextToInput = function(){
            var name = $(this).data("editable-name");
            var val = $(this).text();
            var input = $("<input />").attr("type", "text").attr("name", name);
            transferAttributes(this, input);

            addElement.call(this, input, name);
            input.attr("value",val);

            elements[name] = input;
        };

        var transformInputToText = function(save){
            var input = $("[name='" + $(this).data("editable-name") + "']", form);
            if (save){
                input.attr("value", input.val());
                $(this).text(input.val());
            }
            $(this).show();
            input.prop("disabled", true);
            input.blur();
            input.hide();
        };

        var transformTextToCustomSelect = function(){
            var $this = $(this);
            var name = $this.data("editable-name");
            var val = $this.text();
            var select = $("<select />").attr("name", name);
            transferAttributes(this, select);

            var values = $this.data("editable-values");
            $.each(values, function(i, obj){
                var option = $("<option />").val(obj.key).text(obj.value);
                if (val === obj.value){
                    option.attr("selected", "selected");

                    // Remember selected value if canceled
                    $this.attr("data-editable-selected-value", obj.key);
                }
                select.append(option);
            });

            addElement.call(this, select, name);
            select = select.initDropdown();

            elements[name] = select;
        };

        var transformCustomSelectToText = function(save){
            var select = $("[data-name='" + $(this).data("editable-name") + "']", form);
            if (save){
                $(this).text(select.dropdownText());

                // Set new selected value
                $(this).attr("data-editable-selected-value", select.dropdownVal());
            } else {
                select.dropdownVal($(this).attr("data-editable-selected-value"));
            }
            $(this).show();
            select.hide();
        };


        var typeMapping = {
            "text" : {
                "to" : transformTextToInput,
                "from" : transformInputToText
            },
            "dropdown" : {
                "to" : transformTextToCustomSelect,
                "from" : transformCustomSelectToText
            }
        };


        var addElement = function(element, name){
            var otherPlacementElement = $("[data-editable-placeholder='" + name +"']", form);
            if (otherPlacementElement.length) {
                // IE fix here, .after() has some bugs
                var parent = otherPlacementElement.parent();
                parent.append(element);
            } else {
                $(this).after(element);
            }
        }

        var transferAttributes = function(fromElement, toElement){
            $.each(fromElement.attributes, function(i, attribute) {
                if (attribute.name.match(/^data-attr-/)){
                    var attributeKey = attribute.name.replace("data-attr-","");
                    $(toElement).attr(attributeKey, attribute.value);
                }
            });
        };

        var displayStatusMessage = function(header, text, isError) {
            if (options.statusContainer === null){
                return;
            }
            options.statusContainer.slideUp(function () {
                options.statusContainer.removeClass(options.statusContainerErrorClass);
                if (isError){
                    options.statusContainer.addClass(options.statusContainerErrorClass);

                }
                if (header === null || typeof header === "undefined"){
                    header = "";
                }
                $(options.statusHeader, options.statusContainer).html(header);
                if (text === null || typeof text === "undefined"){
                    text = "";
                }
                $(options.statusText, options.statusContainer).html(text);
                options.statusContainer.slideDown();
            });
        }

        var edit = function() {
            setToEditMode(true);
            options.items.each(function() {
                var name = $(this).data("editable-name");
                $(this).hide();
                if (typeof elements[name] !== "undefined"){
                    elements[name].show();
                } else {
                    typeMapping[$(this).data("editable-type")].to.call(this);
                    elements[name].on('keyup', function(e) {
                        if (e.keyCode === KEYCODE_ESC){
                            cancel();
                        }
                    });
                }
                elements[name].prop("disabled", false);
            });
            form.trigger("re-init").trigger('editable', true);
        };

        var save = function() {
            setToEditMode(false);
            options.items.each(function() {
                typeMapping[$(this).data("editable-type")].from.call(this, true);
            });
            form.trigger("re-init").trigger('editable', false);
            displayStatusMessage(options.successHeader, options.successText);
            return false;
        };

        var cancel = function() {
            if (typeof $(this).attr("disabled") !== "undefined"){
                return false;
            }
            setToEditMode(false);
            options.items.each(function() {
                typeMapping[$(this).data("editable-type")].from.call(this, false);
            });
            form.trigger("re-init").trigger('editable', false);
        };

        var setToEditMode = function(editMode){
            if (options.statusContainer !== null){
                options.statusContainer.slideUp();
            }
            if (editMode){
                options.editButton.addClass(options.hiddenClass);
                options.cancelButton.removeClass(options.hiddenClass);
                options.saveButton.removeClass(options.hiddenClass);
            } else {
                options.editButton.removeClass(options.hiddenClass);
                options.cancelButton.addClass(options.hiddenClass);
                options.saveButton.addClass(options.hiddenClass);
            }
        }

        return this.each(function() {
            options.editButton.attr("disabled", false);
            options.editButton.click(edit);
            options.cancelButton.click(cancel);
            $(this).submit(function(e) {
                if (!options.preventSave){
                    save();
                }
                e.preventDefault();
            });

            $(this).on("save", function(e) {
                save();
                e.stopPropagation();
            });

            $(this).on("fail", function(e, header, text) {
                displayStatusMessage(header, text, true);
                e.stopPropagation();
            });

            options.editButton.show();
        });
    };

    $.fn.initEditable = function() {
        var options = {
            editButton : $("[data-editable-role=edit]", this) || null,
            saveButton : $("[data-editable-role=save]", this) || null,
            cancelButton : $("[data-editable-role=cancel]", this) || null,
            statusContainer : $(this).data("editable-status-container") || null,
            statusHeader : $(this).data("editable-status-header") || null,
            statusText : $(this).data("editable-status-text") || null,
            successHeader : $(this).data("editable-success-header") || null,
            successText : $(this).data("editable-success-text") || null,
            preventSave : $(this).data("editable-prevent-save"),
            statusContainerErrorClass : "tsAttention--Panic",
            hiddenClass : "tsHidden",
            items : $("[data-editable-name]", this)
        };

        if (options.statusContainer !== null || $(options.statusContainer).length){
            options.statusContainer = $(options.statusContainer);
        }
        
        if (options.editButton === null || options.saveButton === null || options.cancelButton === null || !options.items.length){
            console.error("Required settings not available.");
            return;
        }
        editable.call(this, options);
    };

    $("[data-widget=editable]").each(function() {
        $(this).initEditable();
    });

});
