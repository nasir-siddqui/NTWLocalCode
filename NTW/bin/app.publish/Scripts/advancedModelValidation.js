/* Required if client-side validator */
$.validator.addMethod("requiredif", function (value, element, params) {
	if ($(element).val() != '') return true;

	var $other = $('input[name=' + params.other + ']');

	if ($other.attr('type').toLowerCase() == "radio") {
		$other = $('input[name=' + params.other + ']:checked');
	}

	var otherVal = ($other.attr('type').toLowerCase() == "checkbox")
		? ($other.attr("checked") ? "true" : "false")
		: $other.val().toLowerCase();

	return params.comp == 'isequalto' ? (otherVal != params.value)
					  : (otherVal == params.value);
}, "Obligatoriskt");

$.validator.unobtrusive.adapters.add("requiredif", ["other", "comp", "value"],
	function (options) {
		options.rules['requiredif'] = {
			other: options.params.other,
			comp: options.params.comp,
			value: options.params.value
		};

	options.messages['requiredif'] = options.message;
	}
);

/* Future date client-side validator */
$.validator.addMethod("futuredate", function (value, element, params) {
	if (value == null || value == '') return true;

    var dateParts = value.split(/[- :]/);
    var dateValue = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);

    if (dateValue > new Date()) {
        return true;
    } else {
        return false;
    }

}, "Måste vara framtida datum");

$.validator.unobtrusive.adapters.add("futuredate", ["other", "comp", "value"],
	function (options) {
	    options.rules['futuredate'] = {
		    other: options.params.other,
		    comp: options.params.comp,
		    value: options.params.value
		};

	    options.messages['futuredate'] = options.message;
    }
);

$.validator.addMethod(
    'date',
    function (value, element, params) {
        if (this.optional(element)) {
            return true;
        };
        var result = false;
        try {
            result = (value.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/) != null);
        } catch (err) {
            result = false;
        }
        return result;
    }
);

/* Re-evaluate required if on form change. */
$('input').change(function () {
    $('form').valid();
});

/* This file is loaded asynchronously by requirejs. By then the validators are already added to the form.
   In order to add the above new validators we have to remove the existing validators and re parse.*/
$('form')
    .removeData("validator") /* added by the raw jquery.validate plugin */
    .removeData("unobtrusiveValidation");
$.validator.unobtrusive.parse('form');

/* Function below should be called when new input fields have been dynamically added. Input parameter should be the form. */
/* This is called from combobox.js */
(function ($) {
    $.validator.unobtrusive.parseDynamicContent = function (selector) {
        //use the normal unobstrusive.parse method
        $.validator.unobtrusive.parse(selector);

        //get the relevant form
        var form = $(selector).first().closest('form');

        //get the collections of unobstrusive validators, and jquery validators
        //and compare the two
        var unobtrusiveValidation = form.data('unobtrusiveValidation');
        var validator = form.validate();

        $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
            if (validator.settings.rules[elname] == undefined) {
                var args = {};
                $.extend(args, elrules);
                args.messages = unobtrusiveValidation.options.messages[elname];
                //edit:use quoted strings for the name selector
                $("[name='" + elname + "']").rules("add", args);
            } else {
                $.each(elrules, function (rulename, data) {
                    if (validator.settings.rules[elname][rulename] == undefined) {
                        var args = {};
                        args[rulename] = data;
                        args.messages = unobtrusiveValidation.options.messages[elname][rulename];
                        //edit:use quoted strings for the name selector
                        $("[name='" + elname + "']").rules("add", args);
                    }
                });
            }
        });
    }
})($);

/* Sets default error message for jQuery validation required to Swedish text. */
$.extend($.validator.messages, {
    required: "Obligatoriskt"
});