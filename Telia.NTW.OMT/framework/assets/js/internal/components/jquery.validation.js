define(['jquery'], function($) {
    
    var validationRules = {

        required: function (value) {
            if (this.name && this.type) {
                if (this.type === 'radio') {
                    return $("input[type=radio]", this.field).is(':checked');
                }
                if (this.type === 'checkbox') {
                    return $("input[type=checkbox]", this.field).is(':checked');
                }
            }
            if ($(this.field).is(':checkbox')) {
                return $(this.field).is(':checked');
            }
            if (typeof $(this.field).data('value') !== "undefined") {
                return $(this.field).data('value') !== "";
            }
            var selectValue = $(this.field).attr('data-select-value');
            if (typeof selectValue !== "undefined") {
                return selectValue !== "";
            }
            return value !== "";
        },
        url: function(value) {
            if (!value.match(/^http(?:s)?\:\/\//)) {
               value = "http://" + value;
            }
            return value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
            //return value.match(/^(http(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/);
        },
        lazyurl: function(value) {
            if (!value.match(/^http(?:s)?\:\/\//)) {
                value = "http://" + value;
            }
            return validationRules.url(value);
        },
        personnummer: function(value) {
            var info = value.match(/((\d)(\d)(\d)(\d))((\d)(\d))((\d)(\d))\-(\d)(\d)(\d)(\d)/);
            if (info) {
                // check that the date is ok
                var year = parseInt(info[1], 10);
                var month = parseInt(info[6], 10) - 1;
                var day = parseInt(info[9], 10);

                var d = new Date(year, month, day);
                if (!(d.getFullYear() === year && d.getMonth() === month && d.getDate() === day)) {
                    return false;
                }

                // check that the numbers are valid
                var numbers = $.map($.grep(info, function(item, index) { return index > 3 && index !== 6 && index !== 9; }), function(item) { return parseInt(item, 10); });
                
                var checksum = 0;
                $.each(numbers, function(index, item) {
                    var sum = item * (index % 2 === 0 ? 2 : 1);
                    checksum += sum > 9 ? 1 + sum - 10 : sum;
                });
                return checksum % 10 === 0;

            }
            return false;
        },
        organisationsnummer: function(value) {//5560410010
            var v = value.replace("-","");
            var info = v.match(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/);
            if (info) {
                // check that the numbers are valid
                var numbers = $.map($.grep(info, function(item, index) { return index > 0 && index !== 10; }), function(item) { return parseInt(item, 10); });

                var checksum = 0;
                $.each(numbers, function(index, item) {
                    var sum = item * (index % 2 === 0 ? 2 : 1);
                    checksum += sum > 9 ? 1 + sum - 10 : sum;
                });
                return checksum % 10 === (10 - parseInt(info[10], 10)) % 10;

            }
            return false;
        },
        email: function(value){
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return value === "" || (re.test(value) && value.length <= 50);
        },
        swedishNumber: function(value){
            var re = /^\+46/;
            return value === "" || re.test(value);
        },
        numberPrefix: function(value){
            var re = /^\+|^00/;
            return value === "" || re.test(value);
        },
        telephoneNumber: function(value) {
            return (value === "" || /^[0-9\-\+\s]*$/.test(value));
        },
        dateAndTime: function(value) {
            return (value === "" || /^[0-9\-\+\s\:]*$/.test(value));
        },
        fax: function(value) {
            return (value === "" || /^[0-9\-\+]*$/.test(value));
        },
        mobilnummer: function(value) {
            if(value.match("-")) {
                value = value.replace("-", "");
            }
            var re = /^[+]{0,1}\d+$/;
            return value === "" || (re.test(value) && (value.substring(0,2) === "07")) || (re.test(value) && (value.substring(1,3) === "46"));
        },
        mobilenumber: function(value) {
            // this is the same regexp as in agora
            var re = /^07{1}\d{1,2}[ ]?[-]?\d{6,7}$/;
            return value === "" || re.test(value);
        },
        password: function(value) {
            var validLength = (value.length > 5);
            passwordRules = /^[-]*[a-zA-z0-9]*$/;

            return validLength && passwordRules;
        },
        userName: function(value) {
            return (/^[a-zA-z0-9\-\@\_\.]*$/).test(value);
        },
        name: function(value) {
            return (value === "" || /^[a-zA-zäöåÄÖÅ\-\s\/]*$/.test(value));
        },
        syncPassword: function(value) {
            var syncPassword = $("[data-input=password]", $(this.field).closest('form')).val();
            return value === syncPassword;
        },
        userTerms: function(value){
            return $(this.field).is(':checked');
        },
        zipCode: function(value){
            return (/^[0-9]*$/).test(value);
        }
        
    };

    var Validator = function(form, options) {

        this.form = form;
        this.fields = [];
        this.showErrorMessages = false;
        this.options = $.extend({ submitSelector: "[type=submit]", defaultMessage: true, validateHidden: true, disableSubmitButton: true, defaultMessageIncludeName: true }, options);

        this.errorElement = this.options.element || 'span';

        this.valid = null;
        this.showAll = false;

        var _this = this;

        $(form).attr('novalidate', '').data('validator', this).on('submit', function(e) {

            console.log(e);

            if (_this.options.preventSubmit) {
                return;
            }

            if (!_this.isFormValid()) {
                _this.showErrorMessages = true;
                _this.showAllErrorMessages(true);
                e.preventDefault();
                e.stopImmediatePropagation();
            }

        });

        // Make sure that validate submit event is envoked first
        var handlers = $._data(form, 'events')["submit"];
        var handler = handlers.pop();
        handlers.splice(0, 0, handler);

        this.submit = $(this.options.submitSelector, this.form).filter(function() {
            return $(this).closest("[ts-validator], [data-toggle='validate']").get(0) === form;
        });
        
    };

    Validator.prototype.getFieldObject = function(field) {
        var f = null;
        if (typeof field === "object" && field.field) {
            return field;
        }
        for (var i = 0; i < this.fields.length; i++) {
            if ((typeof field === "object" && this.fields[i].field === field) || (typeof field === "string" && this.fields[i].name === field)) {
                f = this.fields[i];
                break;
            }
        }
        return f;
    };

    Validator.prototype.addField = function(field, options) {
        
        this.fields.push({ field: field, value: $(field).attr('value'), rules: options.rules, name: options.name, title: options.title, type: options.type, messages: options.messages, pushMargin : $(field).data("push-margin-bottom") || false, error: null, lastError: null, displayError: false });
        var value = $(field).val();

        this.validateField(field);
        var _this = this;

        $(field).on('keyup', function(e) {
            
            e.stopPropagation();

            if (value != $(this).val()) {
                value = $(this).val();
                _this.validateField(this);
                _this.toggleSubmitButton();
                _this.validate();
            }

        });

        if (navigator.appName == "Microsoft Internet Explorer"){
            $(field).bind('propertychange', function(e) {
                if (e.originalEvent.propertyName == "value") {
                    if (value != $(this).val()) {
                        value = $(this).val();
                        _this.validateField(this);
                        _this.toggleSubmitButton();
                    }
                }
            });
        }

        $(field).on('change', function(e) {
            var f = _this.getFieldObject(this);
            e.stopPropagation();
            _this.validateField(this);
            _this.toggleSubmitButton();
            _this.showErrorMessage(this, true);
            _this.validate();
        });

        // check if the value of the field differs from the html value attribute
        /*if (($(field).attr('value') || "") !== $(field).val()) {
            //console.log('trigger');
            //$(field).trigger('change');
        }*/
    };

    Validator.prototype.toggleSubmitButton = function() {
        var valid = this.isFormValid();
        if (this.options.disableSubmitButton) {
            this.submit.attr('disabled', !valid);
        }
    };

    Validator.prototype.reinit = function(form, keepValues) {
        this.valid = null;
        this.showAllErrorMessages(false);
        if (!keepValues) {
            for (var i = 0; i < this.fields.length; i++) {
                $(this.fields[i].field).val($(this.fields[i].field).attr("value"));
            }
        }
        this.fields = [];
        this.showErrorMessages = false;
        this.init();
    };

    Validator.prototype.init = function(form) {
        var validator = this;
        //setTimeout(function() {
        
        var rules = $("[data-rules]", validator.form).filter(function() {
            var rules = $(this).attr('data-rules') || "";
            return $(this).closest("[ts-validator], [data-toggle='validate']").get(0) === validator.form && rules !== "";
        });

            rules.each(function() {
                var o = { rules: $(this).data('rules').split(' '), name: $(this).data('name') || $(this).attr('name'), type: $(this).data('type'), title: $(this).data('title') || null };
                var $this = $(this);
                var messages = [];
                $.each(o.rules, function(i, rule) {
                    var message = null;
                    var _rule = rule.toLowerCase();
                    if (typeof $this.data('message-' + _rule) !== "undefined") {
                        message = $this.data('message-' + _rule);
                    } else if (validator.options.defaultMessage) {
                        message = "VALIDATION_" + rule.toUpperCase() + (validator.options.defaultMessageIncludeName ? "_" + o.name.toUpperCase() : "") + "_ERROR";
                    }
                    messages.push(message);
                });
                o.messages = messages;
                validator.addField(this, o);
            });
            validator.toggleSubmitButton();
        //}, 0);
    };

    Validator.prototype.validateField = function(field, force) {

        var f = this.getFieldObject(field);

        if (f === null || $(f.field).is(':disabled')){
            return;
        }

        var value = $(f.field).val();
        f.error = null;
        if (this.options.validateHidden || $(f.field).is(':visible') || force) {
            $.each(f.rules, function(i, rule) {
                if (!validationRules[rule].call(f, value)) {
                    f.error = i;
                    return false;
                }
            });
        }

        this.showErrorMessage(field);
        this.validate();
        
    };

    Validator.prototype.isFormValid = function() {
 
        for (var i = 0; i < this.fields.length; i++) {
            if (this.fields[i].error !== null) {
                return false;
            }
        }
        return true;

    };

    Validator.prototype.validate = function() {
        var valid = this.isFormValid();
        if (this.valid !== valid && this.callback && this.showAll) {
            this.valid = valid;
            this.callback(valid);
        }
    };

    Validator.prototype.resetErrors = function() {
        this.showAllErrorMessages(false);
    };

    Validator.prototype.showAllErrorMessages = function(force) {
        var _this = this;
        _this.showAll = force;
        $.each(this.fields, function(i, field) {
            _this.showErrorMessage(field.field, force);
        });
    };

    Validator.prototype.getFieldIndex = function(field) {
        var index = false;
        $.each(this.fields, function(i, f) {
            if ((typeof field === "object" && f.field === field) || (typeof field === "string" && f.field.name === field)) {
                index = i;
                return false;
            }
        });
        return index;
    };

    Validator.prototype.getMessage = function(f) {
        var message = null;
        if (f.error !== null && f.messages[f.error]) {
            message = f.messages[f.error];
        }
        if (message && this.options.translation && this.options.translation.translate) {
            return this.options.translation.translate(message, f.title ? [f.title] : []);
        }
        return message;
    };

    Validator.prototype.showErrorMessage = function(field, force) {
        var f = this.getFieldObject(field);
        if (typeof force !== "undefined") {
            f.displayError = force;
        }
        $(this.errorElement + ".error[for='" + f.name + "']", this.form).remove();
        var _this = this;
        var message = this.getMessage(f);
        if (f.error !== f.lastError && f.onerror && typeof f.onerror === "function") {
            f.onerror(message);
        }
        f.lastError = f.error;
        if (f.supressError) {
            return;
        }
        if (f.error !== null && f.displayError && message) {
            var e = $("<" + this.errorElement + " />").addClass('error').attr('for', f.name).text(message);
            if (this.options.addHasErrorOnWrapper) {
                $(f.field).closest(this.options.addHasErrorOnWrapper).addClass("hasError");
            }
            if (this.options.errorElementClass) {
                e.addClass(this.options.errorElementClass);
            }
            if (this.options.container) {
                var errors = $(".error", this.options.container);
                if ($(this.options.container).length > 1){ // more than one container, append message to the right container for each message by checking 'for'-attribute
                    e.appendTo(this.options.container+"[for='"+f.name+"']");
                }
                else if (errors.length > 0) {
                    var i = _this.getFieldIndex(field);
                    var added = false;
                    errors.each(function(i, error) {
                        if (i < _this.getFieldIndex($(error).attr('for'))) {
                            added = true;
                            $(error).before(e);
                            return false;
                        }
                    });
                    if (!added) {
                        e.appendTo(this.options.container);
                    }
                } else {
                    e.appendTo(this.options.container);
                }
            } else {
                $(f.field).parent().append(e);
                if (f.pushMargin){
                    f.errorParent = e.parent();
                    var parentMarginBottom = parseInt($(f.errorParent).css('margin-bottom'), 10);
                    f.errorParent.css('margin-bottom', parentMarginBottom + e.height());
                }
            }
        } else {
            if (typeof f.errorParent !== "undefined") {
                f.errorParent.css('margin-bottom', "");
            }
            if (this.options.addHasErrorOnWrapper) {
                $(f.field).closest(this.options.addHasErrorOnWrapper).removeClass("hasError");
            }
        }
    };

    Validator.prototype.clearForm = function(clearAllFields) {
        var _this = this;
        _this.resetErrors();
        $.each(this.fields, function(index, item) {
            $(item.field).val('');
            if (typeof $(item.field).data('value') !== "undefined") {
                $(item.field).data('value', '');
            }
            _this.validateField(item.field);
        });
        if (clearAllFields) {
            // clear fields that don't have rules
            $("textarea:not([data-rules]), select:not([data-rules]), input:not([data-rules])", this.form).each(function(item) { $(item).val(''); });
        }
        _this.toggleSubmitButton();
    };

    Validator.prototype.setCallback = function(func) {
        this.callback = func;
    };

    $.fn.validation = function(options) {

        return this.each(function() {
            var validator = new Validator(this, options);
            validator.init(this);

        });

    };

    $.fn.valid = function() {

        var v = this.data('validator');
        if (typeof v !== "undefined") {
            return v.isFormValid();
        }
        return false;

    };

    $(function() {
        $("[data-toggle=validate]").each(function() {

            var container = $(this).data('validate-container') || null;
            var element = $(this).data('validate-element') || null;
            var options = { container: container, element: element, disableSubmitButton: ($(this).attr('data-disable-submit-button') || "true") === "true" };
            $(this).validation(options);
            $(this).on("re-init", function(){
                $(this).data("validator").reinit(this);
            });
        });
    });

    return Validator;
});