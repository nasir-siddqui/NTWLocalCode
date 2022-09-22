/**
 * Please use jquery.dropdown.js instead.
 */
jQuery(document).ready(function() {
    
    /**
     * Function to be used for redrawing and initializing the select element. Supports
     *     variations of dropdowns. 
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
    jQuery.fn.initDropdown = function (customClasses) {
        var newDefaultClasses = {
            wrapper: "tseDropdown",
            selected: "tseDropdown-selected",
            label: "tseDropdown-label",
            arrow: "tseDropdown-arrow",
            list: "tseDropdown-list",
            listId: "tseList",
            listItem: "tseDropdown-listItem",
            listItemSelected: "tseDropdown-listItem--selected"
        };
        var classes = $.extend(newDefaultClasses, customClasses);
       
        // Created as a element instead of module
        $(this).drawDropdown(classes);
        return $('.tseDropdown:not(.tsInitiated)').dropdown(classes);        
    };

    /**
     * Function for redrawing the select element. Extended to support variations of dropdowns but still
     *     with the backwards compatibility. No support for custom classes for the colorwheel etc. but
     *     can easily be added by extending the classes object.
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
	jQuery.fn.drawDropdown = function (customClasses) {

        var oldDefaultClasses = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList"
        };

        var classes = $.extend(oldDefaultClasses, customClasses);       
         

		// ..for every browser except ie7 or lower
		if (!$('html').is('.ie7', '.lt-ie7')) {
			
	
			var list_i = $('[data-id^="' + classes.listId + '"]').length;
			
			return $(this).each(function(){
			
				if ($(this).length) {
					var attributes_list = ''; 
		         $.each($(this)[0].attributes, function( index, attr ) {
						attributes_list += attr.name + '="' + attr.value + '" ';
		         }); 	
	         }  
			
				var attr = '';
				if ($(this).attr('data-colorwheel') == "true") {
					attr = '<span class="tsDropdown-colour"></span><i class="tsPict-colorwheel"></i>';
				}
			
				$(this).before('<div class="' + classes.wrapper + ' ' + ($(this).attr('data-class') !== undefined ? $(this).attr('data-class') : '') + '" '+attributes_list+'>'+
					'<span class="' + classes.selected + '" data-value="">'+attr+
						'<span class="' + classes.label + '">' + $(this).attr('data-placeholder') + '</span>'+
						'<div class="' + classes.arrow + '"></div>'+
					'</span>'+
					'<ul class="' + classes.list + '" data-id="' + classes.listId + list_i+'"></ul>'+
					'</div>');
				
				
				$(this).children('option').each(function(){
					var data = '';
					if ($(this).attr('data-color') !== undefined) {
						data = ' data-color="' + $(this).attr('data-color')+ '" ';
                    }
					if ($(this).attr('data-stock') !== undefined) {
						data += ' data-stock="' + $(this).attr('data-stock')+ '" ';
                    }
                    var classString = '';
					if (classes.listItem !== undefined){
                        classString = 'class="'+ classes.listItem +'"';
                    }
					$('[data-id='+classes.listId+list_i+']').append('<li data-value="' + $(this).val() +'" '+ data + ' ' + classString + '>'+$(this).text()+'</li>');
				});
				
				list_i++;
				
				$(this).remove();
			});
		
		}
	}
	
	
    /**
     * Activates the dropdown object.
     *
     * @param {object} customClasses - an object containing css class names to be used for the rendered
     *     html.
     * @return {object} The jQuery object for further chaining
    */
	jQuery.fn.dropdown = function (customClasses) {
	
        var defaultClasses = {
            wrapper: "tsDropdown",
            selected: "tsDropdown-selected",
            label: "tsDropdown-label",
            arrow: "tsDropdown-arrow",
            list: "tsDropdown-list",
            listId: "tsList",
            listItemSelected: "selected"
        };

        var classes = $.extend(defaultClasses, customClasses);

        var defaults = {
            button: null,
            list: null,
            items: null,
            selected: null,
            arrow: null,
            visible: false
        };
			
	    return this.each(function () {
			
				if (!$(this).hasClass('tsInitiated')){	     
		     		$(this).addClass('tsInitiated');

					
		        var options = $.extend({}, defaults, options);
		
		        options.button = $(this);
		        options.list = $(this).find('.'+classes.list);
		        options.selected = $(this).find('.'+classes.selected);
		        options.items = $(this).find('.'+classes.list+' li');
		        options.arrow = $(this).find('.'+classes.arrow);
		
		         
		        $(document).click(lift);
		         
		        // close dropdown on esc
		        $(document).keydown(function (e) {
		            if (e.keyCode == 27){
		                lift();
	                }
		        });
	
	
	            options.selected.find('.tsDropdown-colour').hide();	
			      
	            // set the color samples
	            options.items.each(function(){
	                if ($(this).attr('data-color') !== undefined ) {
	                    if ($(this).attr('data-color') != 'wheel') {
	                        if ($(this).attr('data-color') == 'white' || $(this).attr('data-color') == '#ffffff'|| $(this).attr('data-color') == '#fff') {
	                            $(this).prepend('<span class="tsDropdown-colour" style="background: white; border: 1px solid #c7c2ba"></span>');	
	                        } else {
	                            $(this).prepend('<span class="tsDropdown-colour" style="background:'+$(this).attr('data-color')+' "></span>');
	                        }
	                    } else {
	                       $(this).prepend('<i class="tsPict-colorwheel"></i>');
	                    }
	
	                    $(this).append('<i class="tsPict-'+$(this).attr('data-stock')+'"></i>');	
	                }
	            });
		         	         
		
		        options.button.click(function (e) {
	                if (!$(this).hasClass('tsDropdown-disabled')) { 
	                    options.list.is(':visible') ? lift() : drop();
						e.stopPropagation();
						}
	            });
	            
			
		
	
	            options.items.click(function (e) {
	                if ($(this).hasClass('tsOverlay-opener')) {
	                    // todo: open overlay
	                } else if ($(this).attr('data-stock') != 'na')  { // should not be able to select n/a-items
	                    options.selected.find('.' + classes.label).text($(this).text	());
	
	                    $(this).siblings().removeClass(classes.listItemSelected);
	                    $(this).addClass(classes.listItemSelected);
	
	                    options.selected.attr('data-value', $(this).attr('data-value'));
	                    options.selected.find('.tsDropdown-colour').css('background',$(this).attr('data-color'));
				
	
	                    
	
	                    if (options.selected.find('.tsPict-colorwheel').length > 0) {
	                    	options.selected.find('.tsPict-colorwheel').hide();
	                    	options.selected.find('.tsDropdown-colour').show();	
	                    }
	
	
	                    // white background? set a grey border
	                    if ($(this).attr('data-color') == 'white' || $(this).attr('data-color') == '#ffffff'){
	                    	options.selected.find('.tsDropdown-colour').css('border','1px solid #c7cdba');
	                    } else {
	                    	options.selected.find('.tsDropdown-colour').css('border','0px');
	                    }
	
	
	                    if ($(this).parents('[data-behaviour="checkbox"]')) {
	                    	$(this).parents('[data-behaviour="checkbox"]').addClass('tsItem--selected');
	                    }
	                }
	            }); 
	            
				}
	
            function drop() {
                $('.' + classes.wrapper).removeClass('open');
                $('.' + classes.list).hide();
                if (options.button.parents('.tsProductAttribute').length > 0) {
                     //options.button.css('position', 'absolute');
                     // if(mediaqueriesMin("mqMedium") || $('body').hasClass('lt-ie9'))
                     // 		options.button.css('right', '12px');	
                }
                options.button.addClass('open');
                options.list.show();
            }

            function lift() {
                options.list.hide();
                options.button.removeClass('open');
                if (options.button.parents('.tsProductAttribute').length > 0) {
                     //options.button.css('position', 'relative');
                     // if(mediaqueriesMin("mqMedium") || $('body').hasClass('lt-ie9'))
                     // 	 options.button.css('right', '0');	
                }	
            }
	          
        }); 

	};
	 

    $('.tseSelectDropdown').initDropdown();

    // Smaller size
    $('.tseSelectDropdown--small').initDropdown({wrapper: "tseDropdown--small"});
	 
    // For backward compatibility
	$('.tsSelectDropdown').drawDropdown();	
	
	//$('.tsDropdown:not(.tsInitiated)').dropdown();
	$('.tsDropdown').dropdown();
	 
	 
	 
 });
 
 