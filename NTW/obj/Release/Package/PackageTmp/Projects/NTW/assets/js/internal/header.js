$(function() {

	$('#mainNavigation .active ul').each(function() {
		$("<div />", { class: 'subMenuPlaceholder' }).css('height', $(this).height()).appendTo('header');
	});

});