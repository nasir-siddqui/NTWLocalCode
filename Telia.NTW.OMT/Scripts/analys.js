//$(function () {

//	//var categories = [
//	//	{ id: 'Users', name: 'users', label: 'Användare', url: "users/", icon: "tsIcon-Star" },
//	//	{ id: 'PhoneNumbers', name: 'numbers', label: 'Telefonnummer', url: "phones/", icon: "tsIcon-Telephone" },
//	//	{ id: 'Billing', name: 'billing', label: 'Fakturor', url: "billing/", icon: "tsIcon-MyPages" }
//	//];


//	$('#Abonnemang').autocomplete({
//		delay: 0,
//		source: abonnemang,
//		//select: function (event, ui) {
//		//	abonnemangChanged();
//		//}
//		//source: function (request, response) {
//		//	//var term = $.ui.autocomplete.escapeRegex(request.term);
//		//	//searchApi.search(term, function (data) {
//		//	//	data.forEach(function (item) {
//		//	//		var _categories = $.grep(categories, function (cat) { return item.category && cat.id === item.category; });
//		//	//		item.category = _categories.length ? _categories[0] : (item.category ? { id: 'Unknown', name: 'unknown', label: 'Okänd', icon: "tsIcon-TeliaLogo", url: "" } : null);
//		//	//	});
//		//	//	response(data);
//		//	//});

//		//	response($.grep(data, function (abonnemang) { return matcher.test(item.value); }));
//		//},
//		//select: function (event, ui) {
//		////	if (ui.item.category && ui.item.id) {
//		////		// an item is selected from the category dropdown
//		////		var url = ui.item.category.url + ui.item.id;
//		////		window.location = url;
//		////	} else {
//		////		$(this).closest('form').submit();
//		////	}
//		//}
//	});

//	//$('#Abonnemang').autocompletechange(function (event, ui) {
		
//	//});

//	$('#Abonnemang').focus(function () {
//		$(this).autocomplete('search', $('#Abonnemang').val());
//	});

//	$('#Abonnemang').keypress(function (event) {
//		if (event.which === 13) {
//			abonnemangChanged();
//		}
//	});

//	$('#Abonnemang').data('ui-autocomplete')._renderItem = function (ul, item) {
//		var li = $("<li />").append(
//			$("<a />", { href: "" }).text(item.label).click(function(e) {
//				e.preventDefault();
//			})
//		);
//		if (item.category) {
//			// get the category headline
//			var cat = $("h2.category-" + item.category.name, ul);
//			// if it doesn't exist, create it and place it at the end of the list
//			if (!cat.length) {
//				cat = $("<h2 />", { 'class': 'category-' + item.category.name }).append(
//					$("<i />", { 'class': item.category.icon }),
//					$("<span />").text(item.category.label)
//				).appendTo(ul);
//			}
					
//			// append the list item at the end of the item section
//			cat.nextUntil('h2').addBack(cat).last().after(li);
//		} else {
//			li.appendTo(ul);
//		}
//		return li.data('ui-autocomplete-item', item);
//	};
			
//	$('#Abonnemang').data('ui-autocomplete')._renderMenu = function (ul, items) {
//		var t = this;
//		$(ul).addClass('categories');
//		$.each(items, function(index, item) {
//			t._renderItem(ul, item);
//		});
//	};
//});