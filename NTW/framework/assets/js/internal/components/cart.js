(function($) {

	$.fn.cartController = function() {
		
		var stickyCartTop = {};
		var stickyCartBottom = {};
		var removedItems = {};
		
		var _thisCart = this;
		var _thisCartList = _thisCart.find('.tsCart-List');
		var _thisContainer = _thisCart.parents('.tsProductsAndCartContainer');
		var _thisPageSection = _thisContainer.find('.tsPageSection');
		var _theseInfoPopups = _thisContainer.find('.tsInfoPopup');
		var _thisCartMaxItems = _thisContainer.attr('data-cart-maxitems');
		var _isIE8 = $('body').hasClass('ie8');
		
		_thisContainer.find('[data-cart-items="max"]').text(_thisCartMaxItems);
		_thisContainer.find('input:checkbox').prop('checked', false);
			
			
				
		/*
			calculating the position(s) where the cart(s) should be sticky and not
		*/
		var calculateStickyPositions = function (){
		
			$('.tsProductsAndCartContainer').each(function () {
				var thisContainer = $(this);
				var containerID = thisContainer.attr('id');
				var thisProductList = thisContainer.find('.tsProductListContainer--alt');
				
				stickyCartTop[containerID] = thisProductList.offset().top;
				stickyCartBottom[containerID] = thisProductList.offset().top + thisProductList.outerHeight(true);
			});
				
		} 
	
	
		
		/*
			making cart(s) sticky depeding on where we are on the page
		*/
		var stickyCart = function(){
		
			calculateStickyPositions();  
			var scrollTop = $(window).scrollTop() + $(window).height() - _thisCart.outerHeight();  
				
			$.each(stickyCartTop, function(key, value) {
				if (scrollTop >= value && scrollTop <= stickyCartBottom[key]) {   
				    $('#'+key +' .tsCart').addClass('is-sticky');
				}
				else {  
				    $('#'+key +' .tsCart').removeClass('is-sticky');  
				}  				
			});       
			
		} 
		
		
		 
		/*
			add and remove from cart via compare checkboxes in the product list
		*/
		var addRemoveFromCart = function() {
			
			var thisCheckbox = $(this);
			var prodID 	= thisCheckbox.attr('id');
			var prodListItem = thisCheckbox.parents('.tsProductList-Item');
			var thisInfoPopup = thisCheckbox.siblings('.tsInfoPopup');
			var thisCartItem = $('[data-prod-id="'+prodID+'"]');
			var cartItems = thisCartItem.parents('.tsCart-List').find('.tsCartItem');
			
		
			// expand collape when selecting		
			if (_thisPageSection.hasClass('is-collapsed')) {
				togglecollapse(_thisPageSection);
				//calculateStickyPositions();
			}	
			
			// checked checkbox = add to cart
			if (thisCheckbox.prop('checked') == true) { 
				
				// only show cart in medium or larger
				if(mediaqueriesMin('mqLtMedium') || _isIE8) {
					_thisCart.fadeIn('fast');
					calculateStickyPositions();
				}
				
				var count = _thisContainer.find('input:checked').length;
				
				// only add to cart if 2 (small), _thisCartMaxItems (large) or less selected
				if (count <= 2 && mediaqueriesMax('mqLtMedium') || count <= _thisCartMaxItems && (mediaqueriesMin('mqLtMedium') || _isIE8)) {
					var title 				= prodListItem.find('.tsProductItem-Name').text();
					var image 				= prodListItem.find('.tsProductItem-Img span img').attr('src');
					var price_primary 	= prodListItem.find('.tsProductItem-Price--Primary').text();
					var price_secondary 	= prodListItem.find('.tsProductItem-Price--Secondary').text();
					
					var cart_item = '<li class="tsCartItem"  data-prod-id="'+prodID+'">'+ 
											'<img src="'+image+'" class="tsCartItem-Img" />'+
								 			'<button data-widget-cart="remove" class="tsCartItem-Remove">'+
								 				'<i class="tsIcon-Close2 tsCartItem-Remove-Icon"></i>'+
								 			'</button>'+
								 			'<div class="tsCartItem-Content">'+
												'<h4 class="tsCartItem-Title">'+title+'</h4>'+
												'<span class="tsCartItem-Price">'+price_primary+'</span>'+
												'<span class="tsCartItem-Secondaryprice">'+price_secondary+'</span>'+
											'</div>'+
										 '</li>';
					
					// adding cart to list
					if (prodID in removedItems) {
						_thisCartList.append(removedItems[prodID]);
					}
					else {
						_thisCartList.append(cart_item);
					}
						
					_thisCart.find('[data-widget-cart="remove"]').on('click', removeFromCart);
					
				}
				
				// exceeding maximum number of concurrent choises
				else {
					thisCheckbox.prop('checked', false);
					// show tooltip with warning
					if (mediaqueriesMin('mqLtMedium') || _isIE8) {
						_theseInfoPopups.find('.is-small').hide();	
						_theseInfoPopups.find('.is-large').show();	
					}
					else {
						_theseInfoPopups.find('.is-large').hide();	
						_theseInfoPopups.find('.is-small').show();							
					}
					thisInfoPopup.addClass('is-active');
					thisInfoPopup.find('.tsInfoPopup-Popup').css('opacity','1');
				}
			}
			
			// uncheck checkbox = remove item from cart
			else {		
		
				var count = cartItems.length;
				
				if (count == 1 && (mediaqueriesMin('mqLtMedium') || _isIE8)) {
					_thisCart.hide();//fadeOut('fast');	
					calculateStickyPositions();
				}	
				
				removedItems[prodID] = $(thisCartItem).detach();
				// close all tooltips
				_theseInfoPopups.removeClass('is-active');
				_theseInfoPopups.find('.tsInfoPopup-Popup').css('opacity','0');
				
			}
			
			createCompareURL(_thisCart);
		
		}
		
		
		
		/*
			remove from cart via the cart
		*/
		var removeFromCart = function() {
	
			var thisItem = $(this);
			var thisListItem = thisItem.parents('li');
			var prodID = thisListItem.attr('data-prod-id');
			var count = thisItem.parents('.tsCart-List').find('.tsCartItem').length;
			
			if (count == 1 && (mediaqueriesMin('mqLtMedium') || _isIE8)) {
				thisItem.parents('.tsCart').hide();//fadeOut('fast');	
				calculateStickyPositions();
			}	
			
			$('#'+prodID).prop('checked', false);
			removedItems[prodID] = thisListItem.detach();
			
			// close all tooltips
			_theseInfoPopups.removeClass('is-active');
			_theseInfoPopups.find('.tsInfoPopup-Popup').css('opacity','0');
			
			createCompareURL(_thisCart);
		}
			
		
		
		/*
			generate url to the compare page
		*/
		var createCompareURL = function(theCart) {
			
			var cartCompareButton = theCart.find('.tsCart-Buttons a');
			var productCompareButton = theCart.parents('.tsProductsAndCartContainer').find('.tsProductItem-Compare-Button');
			var base_url = cartCompareButton.attr('data-cart-baseurl');
			var param = '';
			
			theCart.find('.tsCartItem').each(function(){
				var the_id = $(this).attr('data-prod-id').split('---');
				param += the_id[0]+'/';
			});
			
			var new_url = base_url+param;
			cartCompareButton.attr('href',new_url);
			productCompareButton.attr('href',new_url);
			
			if (theCart.find('.tsCartItem').length <= 1) {
				cartCompareButton.attr('disabled','disabled');
				productCompareButton.attr('disabled','disabled');
				
				cartCompareButton.on('click',function(e){
					e.preventDefault();
				});
				productCompareButton.on('click',function(e){
					e.preventDefault();
				});
			}
			else {
				cartCompareButton.removeAttr('disabled');
				productCompareButton.removeAttr('disabled');
				
				cartCompareButton.unbind('click');
				productCompareButton.unbind('click');
			}
		}
		

		/*
			initiate onscoll-event - not for mobile
		*/	
		if (mediaqueriesMin('mqLtMedium') || _isIE8) {
			calculateStickyPositions();
			stickyCart();  
			  
			$(window).scroll(function() {  
			    stickyCart();  
			}); 	
		}
	
		
		/*
			assign on-click event
		*/
		_thisContainer.find('[data-widget-cart="add"]').on('click', addRemoveFromCart);	
   	
   	
   	
		/*
			returning a function 
		*/
		/*return {
			calculate : function(){
				calculateStickyPositions();
			}
		}*/

		
	}
	
	
}(jQuery));


$(function() {

	$('.tsCart').each(function(){
		$(this).cartController();		
		//var controller = $(this).cartController();		
		//controller.calculate();
	});
	   
});
