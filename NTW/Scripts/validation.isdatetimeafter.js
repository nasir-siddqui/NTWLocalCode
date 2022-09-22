$.validator.unobtrusive.adapters.add(
    'isdatetimeafter', ['propertytested', 'allowequaldatetimes'], function (options) {
    	options.rules['isdatetimeafter'] = options.params;
    	options.messages['isdatetimeafter'] = options.message;
    });
$.validator.addMethod("isdateafter", function (value, element, params) {
	alert(params.propertytested);
	var startdatevalue = $('input[name="' + params.propertytested + '"]').val();
	if (!value || !startdatevalue) return true;
	return (params.allowequaldates) ? Date.parse(startdatevalue) <= Date.parse(value) : Date.parse(startdatevalue) < Date.parse(value);
}, '');