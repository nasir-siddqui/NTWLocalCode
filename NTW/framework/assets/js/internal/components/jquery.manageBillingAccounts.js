/*global define */
/*jshint unused: false*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery', 'service/billedAccountsApi', 'helpers/serviceErrorHandling',  'helpers/common', 'modules/jquery.validation'], factory);
    } else if (window.jQuery && window.BilledAccountsApi) {
        factory(window.jQuery, window.BilledAccountsApi);
    }

})(function($, billedAccountsApi, errorHandler, common) {
  
    $.fn.manageBillingAccounts = function(options) {

        var KEYCODE_ESC = 27;
        var KEYCODE_RETURN = 13;

        var postalMethodEnum = "POSTAL";
        var emailMethodEnum = "EMAIL";

        var billingAccountsContainer = this;


        var displayAddRemoveStatus = function(header, message){
            options.emailStatusContainer.removeClass("tsAttention--Panic");
            options.emailStatusContainer.slideDown();
            options.statusHeader.text(header);
            options.statusText.text(message);
        }       

        var displayAddRemoveError = function(header, message){
            displayAddRemoveStatus(header, message);
            options.emailStatusContainer.addClass("tsAttention--Panic");
        }

        var failedAddEmail = function(message){
            options.addEmailInputButton.removeAttr("disabled");
            setDisabled(options.cancelAddEmailButton, false);
            setDisabled(options.emailField, false);
            setDisabled(options.emailRepeatField, false);
            options.addEmailInfoContainer.slideUp(function() {
                options.addEmailErrorContainer.slideDown();
            });
            options.addEmailButton.trigger("fail");
            options.addEmailErrorHead.text(message);
        }

        var successAddEmail = function(emailAddress){
            options.addEmailButton.trigger("finish");
            options.addEmailSection.slideUp(function() {
                displayAddRemoveStatus(options.emailAddedHead, options.emailAddedText);
                options.addEmailInputButton.removeAttr("disabled");
                enableAll.call(options.invoiceSettingsForm);       
            });
            $(options.emailSelectQuery, billingAccountsContainer).dropdownAddValue(emailAddress.emailAddressID, emailAddress.emailAddress + " " + options.notVerifiedText);
            $(options.emailSelectQuery, billingAccountsContainer).dropdownVal(emailAddress.emailAddressID);
            initDropdownOnClick();
        }

        var failedDeleteEmail = function(message){
            options.confirmDeleteEmailButton.removeAttr("disabled");
            options.removeEmailStatusHeader.text(message);
            options.removeEmailStatusText.text("");
            setDisabled(options.abortDeleteEmailButton, false);
            setDisabled(options.invoiceSettingsCancelButton, false);
            setDisabled(options.invoiceSettingsSaveButton, false);
            options.confirmDeleteEmailButton.trigger("fail");
        }


        var successDeleteEmail = function(){
            var selectedInvoiceMethod = options.selectedMethodHidden.val();
            var deletedEmail = $(options.emailSelectQuery, billingAccountsContainer).dropdownVal();
            $(options.emailSelectQuery, billingAccountsContainer).dropdownRemove(deletedEmail);

            if (selectedInvoiceMethod === emailMethodEnum){
                var selectedBillingAccountEmail = options.selectedEmailHidden.val();
                if (deletedEmail === selectedBillingAccountEmail){
                    $(options.methodSelectQuery, billingAccountsContainer).dropdownVal(postalMethodEnum);
                    options.selectedMethodHidden.attr("value", postalMethodEnum);
                    displayAddRemoveStatus(options.emailDeletedText, options.emailDeletedChangedIMText);
                } else {
                    $(options.emailSelectQuery, billingAccountsContainer).dropdownVal(selectedBillingAccountEmail);
                    displayAddRemoveStatus(options.emailDeletedText, "");
                }
            } else {
                displayAddRemoveStatus(options.emailDeletedText, "");
            }
            options.confirmDeleteEmailButton.trigger("finish");
            options.deleteEmailForm.slideUp(function() {
                options.confirmDeleteEmailButton.removeAttr("disabled");
                enableAll.call(options.invoiceSettingsForm);
            });
            saveChangesToGUI.call(options.invoiceSettingsForm);
        }   

        var successSaveBillingAddress = function(errorList) {
            if (errorList.length > 0){
                var errorMessage = options.multipleErrorText;
                for (var i = 0; i < errorList.length; i++) {
                    errorMessage += "<br />" + errorList[i]["billingAccount"] + ": " + errorList[i]["responseCode"];
                }
                failedSaveBillingAddress(errorMessage);
                return;
            }
            enableAll.call(options.billingAddressForm);
            options.billingAddressForm.trigger("save");
            //options.billingAddressSaveButton.removeClass("active");
        }

        var failedSaveBillingAddress = function(message) {
            enableAll.call(options.billingAddressForm);
            setDisabled(options.billingAddressCancelButton, false);
            $(options.billingAddressForm).trigger("fail", message);
            options.billingAddressSaveButton.trigger("fail");
        }

        var successSaveInvoiceSettings = function(errorList) {
            if (errorList.length > 0){
                var errorMessage = options.multipleErrorText;
                for (var i = 0; i < errorList.length; i++) {
                    errorMessage += "<br />" + errorList[i]["billingAccount"] + ": " + errorList[i]["responseCode"];
                }
                failedSaveInvoiceSettings(errorMessage);
                return;
            }
            options.addRemoveButtonSection.addClass(options.hiddenClass);
            enableAll.call(options.invoiceSettingsForm);
            $(options.invoiceSettingsForm).trigger("save");
            options.invoiceSettingsSaveButton.trigger("reset");
            var emailAddress = $(options.emailSelectQuery, billingAccountsContainer).dropdownText();
            var emailAddressId = $(options.emailSelectQuery, billingAccountsContainer).dropdownVal();
            options.selectedEmailHidden.attr("value", emailAddressId);
            options.selectedMethodHidden.attr("value", $(options.methodSelectQuery, billingAccountsContainer).dropdownVal());
            if (emailAddress.indexOf(options.notVerifiedText, emailAddress.length - options.notVerifiedText.length) !== -1 && $(options.methodSelectQuery, billingAccountsContainer).dropdownVal() === emailMethodEnum){
                options.invoiceSettingsStatus.text(options.successNotVerifiedEmailText);
            }
        }

        var failedSaveInvoiceSettings = function(message) {
            enableAll.call(options.invoiceSettingsForm);
            setDisabled(options.invoiceSettingsCancelButton, false);
            $(options.invoiceSettingsForm).trigger("fail", message);
            options.invoiceSettingsSaveButton.trigger("fail");
        }

        var performAddEmail = function() {
            options.addEmailInputButton.attr("disabled", "disabled");
            options.addEmailInputButton.trigger("loading");
            setDisabled(options.cancelAddEmailButton, true);
            setDisabled(options.emailField, true);
            setDisabled(options.emailRepeatField, true);
            //var addEmailStatus = $("[data-id='addEmailStatus']", this);
            var emailAddress = $("[name='email']", options.addEmailForm).val();
            var callbackFunctions = errorHandler.serviceCallbacks(successAddEmail, failedAddEmail);
            
            billedAccountsApi.addEmailForInvoiceDelivery(common.orgnr, emailAddress, callbackFunctions);
        }

        var saveChangesToGUI = function() {
            var $this = this;
            $("[data-editable-type=dropdown]", this).each(function(){
                var select = $("[data-name='" + $(this).data("editable-name") + "']", $this);
                if (select.dropdownVal() !== ""){
                    $(this).text(select.dropdownText());
                    $(this).attr("data-editable-selected-value", select.dropdownVal());
                } else {
                    $(this).text("");
                }
            });
        }

        var getAddressFromForm = function() {
            var street = $("[name='streetAddress']", this).val();
            var postalCode = $("[name='zipCode']", this).val();
            var city = $("[name='city']", this).val();
            var country = $("[data-id='countrySelect']", this).dropdownVal();

            var address = {
                "street" : street,
                "postalCode" : postalCode,
                "city" : city,
                "country" : country
            };

            return address;
        }


        var setDisabled = function(element, disabled){
            var disabledString = disabled ? "disabled" : "";
            $(element).attr("disabled", disabled);
        }


        var disableAll = function() {
            $("button[type=submit], button[type=reset], input[type=reset], input[type=submit], input[type=text], a, div ." + options.dropdownClass, this).each(function() {
                setDisabled(this, true);
            });
            for (var i = 0; i < arguments.length; i++) {
                setDisabled(arguments[i], false);
            }
        }

        var enableAll = function() {
            $("button[type=submit], button[type=reset], input[type=reset], input[type=submit], input[type=text], a, div ." + options.dropdownClass, this).each(function() {
                setDisabled(this, false);
            });
            if ($(options.emailSelectQuery, this).length && $(options.emailSelectQuery, this).dropdownVal() === ""){
                setDisabled(options.deleteEmailToggleButton, true);
            }
            for (var i = 0; i < arguments.length; i++) {
                setDisabled(arguments[i], true);
            }
        }

        var initDropdownOnClick = function() {
            $(options.emailSelectQuery + " li", options.invoiceSettingsForm).click(function() {
                options.emailStatusContainer.slideUp();
                setDisabled(options.deleteEmailToggleButton, false);
            });
            $(options.methodSelectQuery + " li", options.invoiceSettingsForm).click(function() {
                if ($(options.methodSelectQuery, options.invoiceSettingsForm).dropdownVal() === "EMAIL") {
                    options.emailDataRows.show();
                    options.emailStatusContainer.slideUp();
                } else {
                    options.emailDataRows.hide();
                    if (options.selectedMethodHidden.val() === "EMAIL"){
                        displayAddRemoveStatus(options.consequencesText);
                    }
                }
            });
        }


        // Can't use a form in a form, hence can't use jquery.valdiation for this form.
        var emailValidation = function(value){
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value) && value.length <= 50;
        }

        var cancelInvoiceSettings = function() {
            if (typeof $(this).attr("disabled") !== "undefined"){
                return false;
            }
            if (options.selectedMethodHidden.val() === ""){
                options.emailDataRows.hide();
            }
            options.addRemoveButtonSection.addClass(options.hiddenClass);
            options.deleteEmailForm.hide();
            enableAll.call(options.invoiceSettingsForm);
            return false;
        }

        var handleEmailKeyUp = function(e) {
            var isEmailValid = emailValidation(options.emailField.val());
            var isSameEmail = options.emailField.val() == options.emailRepeatField.val();
            var isValid = isEmailValid && isSameEmail;
            setDisabled(options.addEmailButton, !isValid);
            setDisabled(options.addEmailInputButton, !isValid);
            if (isEmailValid){
                options.addEmailValidation.hide();
                options.addEmailValidation.parent().css('margin-bottom', "");
            }
            if (isSameEmail){
                options.addEmailRepeatValidation.hide();
                options.addEmailRepeatValidation.parent().css('margin-bottom', "");
            }
            if (e.keyCode === KEYCODE_ESC){
                options.addEmailButton.trigger("reset");
                options.addEmailSection.slideUp();
                enableAll.call(options.invoiceSettingsForm, options.addEmailButton, options.emailField, options.emailRepeatField);
            } else if((e.keyCode === KEYCODE_RETURN || e.type === "click") && isValid){
                options.addEmailButton.trigger("start");
                performAddEmail();
            } else if ((e.keyCode === KEYCODE_RETURN || e.type === "click") && !isEmailValid) {
                options.addEmailValidation.show();
                $(options.addEmailValidation.parent()).attr("style", "");
                var parentMarginBottom = parseInt($(options.addEmailValidation.parent()).css('margin-bottom'), 10);
                options.addEmailValidation.parent().css('margin-bottom', parentMarginBottom + options.addEmailValidation.height());
                options.emailField.focus();
            } else if ((e.keyCode === KEYCODE_RETURN || e.type === "click") && !isSameEmail) {
                options.addEmailRepeatValidation.show();
                $(options.addEmailRepeatValidation.parent()).attr("style", "");
                var parentMarginBottom = parseInt($(options.addEmailRepeatValidation.parent()).css('margin-bottom'), 10);
                options.addEmailRepeatValidation.parent().css('margin-bottom', parentMarginBottom + options.addEmailRepeatValidation.height());
                options.emailRepeatField.focus();
            }
        }

        return this.each(function() {

            var container = this; 

            options.addEmailValidation.hide();
            options.addEmailRepeatValidation.hide();

            options.invoiceSettingsEditButton.click(function() {
                options.addRemoveButtonSection.removeClass(options.hiddenClass);
                initDropdownOnClick();
                enableAll.call(options.invoiceSettingsForm, options.emailField);
                if (typeof $(this).data("keyEventsAdded") === "undefined"){
                    $("[name='contactName'], [name='telephoneNumber']").on("keyup", function(e) {
                        if (e.keyCode === KEYCODE_ESC){
                            cancelInvoiceSettings.call(options.invoiceSettingsCancelButton);
                        }
                    });
                }
                $(this).data("keyEventsAdded", true);
                if ($(options.methodSelectQuery, billingAccountsContainer).dropdownVal() === emailMethodEnum) {
                    options.emailDataRows.show();
                } else {
                    options.emailDataRows.hide();
                }
            });

            options.invoiceSettingsCancelButton.click(function() {
                cancelInvoiceSettings.call(this);
            });

            options.deleteEmailToggleButton.click(function() {
                if (typeof $(this).attr("disabled") !== "undefined"){
                    return false;
                }
                disableAll.call(options.invoiceSettingsForm, options.confirmDeleteEmailInputButton, options.abortDeleteEmailButton);
                options.deleteEmailForm.slideDown();
                options.confirmDeleteEmailButton.trigger("reset");
                options.removeEmailStatusHeader.text(options.deleteEmailInfoHeadText);
                options.removeEmailStatusText.text(options.deleteEmailInfoText);
                return false;
            });


            options.addEmailToggleButton.click(function() {
                options.addEmailButton.trigger("reset");
                options.addEmailButton.attr("disabled", "disabled");
                options.addEmailInfoContainer.show();
                options.addEmailErrorContainer.hide();
                options.addEmailSection.slideDown(400, function() { 
                    options.emailField.focus();
                });
                options.invoiceSettingsForm.trigger("re-init");
                disableAll.call(options.invoiceSettingsForm, options.emailField, options.emailRepeatField, options.cancelAddEmailButton);
                options.emailField.val("");
                options.emailRepeatField.val("");
                return false;
            });

            options.cancelAddEmailButton.click(function() {
                if (typeof $(this).attr("disabled") !== "undefined"){
                    return false;
                }
                options.addEmailButton.trigger("reset");
                options.addEmailSection.slideUp();
                enableAll.call(options.invoiceSettingsForm, options.addEmailButton, options.emailField);
                return false;
            });

            // Can't use a form in a form, hence can't use jquery.valdiation for this form.
            options.emailField.on('keyup', function(e) {
                handleEmailKeyUp(e);
            });
            options.emailRepeatField.on('keyup', function(e) {
                handleEmailKeyUp(e);
            });

            options.abortDeleteEmailButton.click(function(){
                enableAll.call(options.invoiceSettingsForm, options.emailField);
                options.deleteEmailForm.slideUp();
            });

            $("button[type=submit], input[type=submit], input[type=reset], a", this).on("click", function() {
                options.emailStatusContainer.slideUp();
            });



            options.billingAddressEditButton.click(function(){
                options.billingAddressSaveButton.trigger("reset");
            });


            options.billingAddressForm.submit(function(e) {
                disableAll.call(this);

                var address = getAddressFromForm.call(this);
                var callbackFunctions = errorHandler.serviceCallbacks(successSaveBillingAddress, failedSaveBillingAddress);

                billedAccountsApi.updateBillingAddress(common.orgnr, options.selectedBillingAccounts, address, callbackFunctions);
                e.preventDefault();
            });

            options.invoiceSettingsForm.submit(function(e) {
                disableAll.call(this);
                options.emailStatusContainer.slideUp();

                var deliveryMethod = $(options.methodSelectQuery, billingAccountsContainer).dropdownVal();
                if (deliveryMethod == "EMAIL") {
                    var emailAddressID = $(options.emailSelectQuery, billingAccountsContainer).dropdownVal();
                    var contactName = $("[name='contactName']", this).val();
                    var telephoneNumber = $("[name='telephoneNumber']", this).val();
                    if (telephoneNumber.substring(0,2) === "00"){
                        telephoneNumber = "+" + telephoneNumber.substring(2);
                    }
                }
 
                var callbackFunctions = errorHandler.serviceCallbacks(successSaveInvoiceSettings, failedSaveInvoiceSettings);
                billedAccountsApi.updateDeliverMethodConfiguration(common.orgnr, options.selectedBillingAccounts, emailAddressID, contactName, deliveryMethod, telephoneNumber, callbackFunctions);

                e.preventDefault();
            });

            options.confirmDeleteEmailButton.click(function(e) {
                if (typeof $(this).attr("disabled") !== "undefined"){
                    e.preventDefault();
                    return false;
                }
                $(this).attr("disabled", "disabled");
                disableAll.call(options.invoiceSettingsForm);

                var emailAddressID = $(options.emailSelectQuery, billingAccountsContainer).dropdownVal();
                var callbackFunctions = errorHandler.serviceCallbacks(successDeleteEmail, failedDeleteEmail);

                billedAccountsApi.deleteEmailForInvoiceDelivery(common.orgnr, emailAddressID, callbackFunctions);
                return false;
            });


            options.addEmailButton.click(function(e){
                if (typeof $(options.addEmailInputButton).attr("disabled") !== "undefined"){
                    e.preventDefault();
                    handleEmailKeyUp(e);
                    return false;
                }
                performAddEmail();
            });

        });

    };


    $("[data-widget=manageBillingAccounts]").each(function() {
        var options = {
            invoiceSettingsEditButton : $("[data-id='invoiceSettingsEditButton']", this),
            invoiceSettingsCancelButton : $("[data-id='invoiceSettingsCancelButton']", this),
            invoiceSettingsSaveButton : $("[data-id='invoiceSettingsSaveButton']", this),
            billingAddressCancelButton : $("[data-id='billingAddressCancelButton']", this),
            billingAddressEditButton : $("[data-id='billingAddressEditButton']", this),
            billingAddressSaveButton : $("[data-id='billingAddressSaveButton']", this),
            deleteEmailToggleButton : $("[data-id='deleteEmailToggleButton']", this),
            addEmailToggleButton : $("[data-id='addEmailToggleButton']", this),
            abortDeleteEmailButton : $("[data-id='abortDeleteEmailButton']", this),
            confirmDeleteEmailButton : $("[data-id='confirmDeleteEmailButton']", this),
            confirmDeleteEmailInputButton : $("[data-id='confirmDeleteEmailButton']", this),
            addEmailButton : $("[data-id='addEmailButton']", this),
            addEmailInputButton : $("[data-id='addEmailButton']", this),
            cancelAddEmailButton : $("[data-id='cancelAddEmailButton']", this),

            emailSelectQuery : "[data-id='emailSelect']",
            methodSelectQuery : "[data-id='methodSelect']",
            selectedMethodHidden : $("[name='selectedMethod']", this),
            selectedEmailHidden : $("[name='selectedEmail']", this),
            emailField : $("[name='email']", this),
            emailRepeatField : $("[name='emailRepeat']", this),

            addRemoveButtonSection : $("[data-id='addRemoveButtonSection']", this),
            emailStatusContainer : $("[data-id='generalAddRemoveEmailStatusContainer']"),
            billingAddresStatusContainer : $("[data-id='billingAddresStatusContainer']"),
            addEmailSection : $("[data-id='addEmailForm']", this),
            addEmailInfoContainer : $("[data-id='addEmailInfoContainer']", this),
            addEmailValidation :  $("[data-id='addEmailValidation']", this),
            addEmailRepeatValidation :  $("[data-id='addEmailRepeatValidation']", this),
            addEmailErrorContainer :  $("[data-id='addEmailErrorContainer']", this),
            addEmailErrorHead :  $("[data-id='addEmailErrorHead']", this),
            invoiceSettingsStatus : $("[data-id='invoiceSettingsStatusText']", this),
            emailDataRows : $("[data-group-id='emailDataRows']", this),

            deleteEmailForm : $("[data-id='deleteEmailForm']", this),
            invoiceSettingsForm : $("[data-id='invoiceSettingsForm']", this),
            billingAddressForm : $("[data-id='billingAddressForm']", this),

            hiddenClass : "tsHidden",
            dropdownClass : "tseDropdown",
            dropdownDisabledClass : "tsDropdown-disabled",
            selectedBillingAccounts : $(this).data("value-selected-billing-accounts"),
            selectedOrgNr : $(this).data("value-orgnr"),

            emailDeletedText : $(this).data("text-email-deleted"),
            emailDeletedChangedIMText : $(this).data("text-email-deleted-invoice-changed"),
            deleteEmailInfoHeadText : $(this).data("text-delete-email-info-head"),
            deleteEmailInfoText : $(this).data("text-delete-email-info"),
            emailAddedText : $(this).data("text-email-added"),
            emailAddedHead : $(this).data("text-email-added-header"),
            notVerifiedText : $(this).data("text-not-verified"),
            successNotVerifiedEmailText : $($("[data-id='invoiceSettingsForm']", this)).data("success-unverified-email"),
            multipleErrorText : $(this).data("text-multiple-error"),
            consequencesText : $(this).data("text-consequences"),

            statusHeader : $("[data-id='generalAddRemoveEmailStatusHeader']"),
            statusText : $("[data-id='generalAddRemoveEmailStatusText']"),
            removeEmailStatusHeader : $("[data-id='removeEmailStatusHeader']"),
            removeEmailStatusText : $("[data-id='removeEmailStatusText']"),            
        };

        $(this).manageBillingAccounts(options);
    });

});

