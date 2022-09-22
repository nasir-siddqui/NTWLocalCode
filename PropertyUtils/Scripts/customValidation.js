/* Norwegian SSN */
$.validator.addMethod("norwegianSsn",
    function (value, element) {
        try {
            if (value == "") return true;
            //if (value == "12121212123") return true; // Allow a test SSN number
            var ssn = value.toString().replace(" ", "");
            
            // Check that enterned ssn has a valid length and only contains digits.
            if (ssn.length != 11 || isNaN(ssn))
                return false;

            // Check day value
            if (ssn.substr(0, 2) > 31)
                return false;

            // Check month value
            if (ssn.substr(2, 2) > 12)
                return false;

            // Split up digits for checksum calculation
            var digits = new Array();
            for (var i = 0; i < 11; i++) {
                digits[i] = ssn.substr(i, 1);
            }

            // Checksum calculation
            var sum1 = digits[0] * 3 +
                digits[1] * 7 +
                digits[2] * 6 +
                digits[3] * 1 +
                digits[4] * 8 +
                digits[5] * 9 +
                digits[6] * 4 +
                digits[7] * 5 +
                digits[8] * 2;
            var checksum1 = 11 - (sum1 % 11);
            if (checksum1 == 11) checksum1 = 0;

            var sum2 = digits[0] * 5 +
                digits[1] * 4 +
                digits[2] * 3 +
                digits[3] * 2 +
                digits[4] * 7 +
                digits[5] * 6 +
                digits[6] * 5 +
                digits[7] * 4 +
                digits[8] * 3 +
                checksum1 * 2;
            var checksum2 = 11 - (sum2 % 11);
            if (checksum2 == 11) checksum2 = 0;

            // Check if control numbers are correct
            if (checksum1 == digits[9] && checksum2 == digits[10]) {
                return true;
            }
            else {
                return false;
            }
        } catch (err) {
            return false;
        }
    });

$.validator.unobtrusive.adapters.add("norwegianSsn", [], function (options) {
    options.messages["norwegianSsn"] = options.message;
    options.rules["norwegianSsn"] = options.params;
});

/* Required If */
jQuery.validator.addMethod("requiredif", function (value, element, params) {
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
});

jQuery.validator.unobtrusive.adapters.add("requiredif", ["other", "comp", "value"],
	function (options) {
		options.rules['requiredif'] = {
			other: options.params.other,
			comp: options.params.comp,
			value: options.params.value
		};

		options.messages['requiredif'] = options.message;
	}
);

/* Date after */
$.validator.addMethod("dateAfter", function (value, element, params) {
	var dateBeforePropertyId = params.dateBeforePropertyId;

	var dateBeforePropertyValue = $("#" + dateBeforePropertyId).val();

	if (value <= dateBeforePropertyValue) {
		return false;
	} else {
		return true;
	}
});

$.validator.unobtrusive.adapters.add(
    "dateAfter",
    ["dateBeforePropertyId"],
    function (options) {
    	options.messages["dateAfter"] = options.message;
    	options.rules["dateAfter"] = options.params;
    }
);

/* General logic */
$('input').change(function () {
	// validation crashes on the radio inputs used for unknown reason
	$("input[type!='radio']").each(function (index, element) {
		$('form').validate().element(element);
	});
});

var form = $('form')
            .removeData("validator") /* added by the raw jquery.validate plugin */
            .removeData("unobtrusiveValidation");
$.validator.unobtrusive.parse('form');