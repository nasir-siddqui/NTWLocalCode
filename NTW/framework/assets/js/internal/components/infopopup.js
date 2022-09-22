(function (window, document, $, undef) {

	var visiblePopupCount = 0;
	var scrollTimer;

	/*
	 *  Align the popup so it fits in
	 *  all screen sizes
	 */
	var alignPopup = function ($popup){
		if ($popup == undef) return false;

		var $popupInner = $popup.find('.tsInfoPopup-Popup');

		/*
		 *  Reset the popup so calculations can be made
		 */
		$popup.removeClass('gravity-n gravity-e gravity-s gravity-w is-outOfBounds');
		$popupInner
			.removeAttr('style')
			.css('visibility', 'hidden');

		/*
		 *  Calculate gravity of the popup
		 */
		var scrollY    = window.scrollY || document.documentElement.scrollTop;
		var screenPosY = $popup.offset().top - scrollY + ($popup.width() / 2);
		var screenPosX = $popup.offset().left + ($popup.height() / 2);
		var winHeight  = $(window).height();
		var winWidth   = $(window).width();

		var triggerPosX = screenPosX/winWidth - 0.5;
		var triggerPosY = screenPosY/winHeight - 0.5;
		var gravity 	= 'gravity-e'; //set to ease, just in case.

		if (Math.abs(triggerPosX) > Math.abs(triggerPosY)) {
			if (triggerPosX > 0) gravity = 'gravity-w';
			else gravity = 'gravity-e';
		}
		else {
			if (triggerPosY > 0) gravity = 'gravity-n';
			else gravity = 'gravity-s';
		}

		$popup.addClass(gravity);

		/*
		 *  Check if the popup renders outside of the window
		 */
		var gravities = ['gravity-n', 'gravity-e', 'gravity-s', 'gravity-w'];
		for (var i = 0; i < 4; i++){
			if ($popupInner.offset().left + $popupInner.outerWidth(true) > (winWidth - 20) ||
				$popupInner.offset().top + $popupInner.outerHeight(true) > scrollY + (winHeight - 10) ||
				$popupInner.offset().top < scrollY - 10 ||
				$popupInner.offset().left < 0) {

				$popup
					.removeClass('gravity-n gravity-e gravity-s gravity-w')
					.addClass(gravities[i]);
			}
			else{
				break;
			}
		}

		if ($popupInner.offset().left + $popupInner.outerWidth(true) > (winWidth - 20) ||
			$popupInner.offset().top + $popupInner.outerHeight(true) > scrollY + (winHeight - 10) ||
			$popupInner.offset().top < scrollY - 10 ||
			$popupInner.offset().left < 0) {

			$popup.removeClass('gravity-n gravity-e gravity-s gravity-w is-active');

			var $popupClone = $popup.clone(true);
			var $popupCloneInner = $popupClone.find('.tsInfoPopup-Popup');

			$popupClone
				.prependTo('body')
				.addClass('is-outOfBounds is-active');

			$popupCloneInner.css({
				'top'		: scrollY,
				'visibility': 'visible',
				'opacity'	: 0
			});

			$popupCloneInner.animate({
				'top': scrollY + 20,
				'opacity': 1
			}, 100);
		}
		else{
			$popupInner.css({
				'visibility': 'visible',
				'opacity'	: 0
			});

			$popupInner.animate({
				'opacity': 1
			}, 50);
		}
	}


	/*
	 *  Show popup call
	 */
	var showPopup = function ($popup){
		if ($popup == undef) return false;
		closePopup($('[data-widget="infopopup"].is-active'));
		$popup.addClass('is-active');
		alignPopup($popup);
		visiblePopupCount++;
	}

	/*
	 *  Close popup call
	 *  (if no popup is called it will close all open)
	 */
	var closePopup = function ($popup){
		if ($popup == undef) {
			$popup = $('[data-widget="infopopup"].is-active');
			visiblePopupCount = 0;
		}

		$popup
			.find('.tsInfoPopup-Popup')
			.animate({
				'opacity': 0
			}, 50, function(){
				$popup.removeClass('is-active');
				if($popup.hasClass('is-outOfBounds')){
					$popup.remove();
					closePopup();
				}
			});

		visiblePopupCount = (visiblePopupCount <= 1) ? 0 : (visiblePopupCount - 1);
	}

	/*
	 *  Toggle popup call
	 */
	var togglePopup = function ($popup){
		if ($popup == undef) return false;
		
		if (!$popup.hasClass('is-active')){
			showPopup($popup);
		}
		else{
			closePopup($popup);
		}
	}

	var scrollCheck = function () {
		var $popupInner = $('[data-widget="infopopup"].is-active.is-outOfBounds .tsInfoPopup-Popup');

		if($popupInner == undef) return false;

		var top = parseInt($popupInner.css('top'));

		if (Math.abs(top - 20 - window.scrollY) > 80){
			closePopup($popupInner.closest('[data-widget="infopopup"]'));
		}
	}

	/*
	 *  Init
	 */
	$(document).on('click', '[data-widget-infopopup="trigger"]', function (e) {
		e.stopPropagation();
		/*added to prevent the close button default action*/
		e.preventDefault();
		togglePopup($(this).closest('[data-widget="infopopup"]'));
	});

	/*
	 *  Close popup if user clicks outside of it
	 */
	$(document).on('click', function(e){
		if (visiblePopupCount > 0 && $(e.target).closest('[data-widget="infopopup"].is-active').length <= 0){
			closePopup($('[data-widget="infopopup"].is-active'));
		}
	});

	$(window).on('resize', function(){

		/*
		 *  Fix visible popups if windows is resized
		 */
		if (visiblePopupCount > 0){
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(function() {
				alignPopup($('[data-widget="infopopup"].is-active'));
			}, 10);
		}
	});

	$(window).on('scroll', function(){

		/*
		 *  Close popups if user scrolls.
		 *  Only if 'out of bounds'.
		 */
		if (visiblePopupCount > 0){
			scrollCheck();
		}
	});

}(window, document, jQuery));