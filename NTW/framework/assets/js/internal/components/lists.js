var Lists;

if (typeof Lists === "undefined") {
	Lists = {};
}
Lists = function () {

    // OnInit

    function _init() {
    }

    return {
    	ListAlignment:function(){
    		if($('.tsProductItem-Purchase').length > 0)
    		{
    			var elements = $('.tsProductItem-Purchase');
    			elements.css('min-height', highestElement(elements));
    		}
    		if($('.tsLogin-boxlist-item').length > 0) 
    		{
    			var items = $('.tsLogin-boxlist-item > a');
    			items.css('min-height', highestElement(items));
    		}

    		if ($("[data-visual=productList]").length > 0) {
    			var lists = $("[data-visual=productList]").not();
    			lists.each(function() {
    				var items = $(this).find("li.tsProductList-Item");
            //items.addClass("show");

            items = $(this).find(".tsProductItem-Desc");
            if(items.length > 0)
            {
            	$(items).css('min-height', highestElement(items));
            }

             //Sets height on secondary prices 
             var secondaryPrices = $(this).find('.tsProductItem-Price');
             if(secondaryPrices.length > 0)
             {
             	var highest = highestElement(secondaryPrices);
             	secondaryPrices.css('min-height', highest);

             }
             var tsProductItemDisclaimer = $(this).find('.tsProductItem-Disclaimer');
             if(tsProductItemDisclaimer.length > 0)
             { 
             	var highest = highestElement(tsProductItemDisclaimer);
             	tsProductItemDisclaimer.css('min-height', highest); 

             } 

             Lists.RemoveBorderFromLastElements($(this));

         });
    		}
    	},
    	RemoveBorderFromLastElements: function(list){
    		var elementsInRow = Lists.GetElementsInRow(list.hasClass('tsProductList--Alt')),
    		elements = list.find('[class*=tsProductList-Item].show'),
    		elementLenght = elements.length,
    		doubleelements = list.find('li.tsProductList-Item--tsCampaign--double , .tsProductList-Item--double'),
    		modulus= (elementLenght + doubleelements.length) % elementsInRow;
    		elements.removeClass('no-border-bottom');

    		if(modulus==0)
    		{
    			modulus = elementsInRow;
    		}

    		var i = 0;
    		while(modulus > i)
    		{
    			var elementhit = $(elements[elementLenght - (i+1)]); 

    			elementhit.addClass('no-border-bottom');
    			if(elementhit.hasClass('tsProductList-Item--tsCampaign--double'))
    			{
    				i++;
    			}

    			i++;
    		}
    		if(!list.hasClass('tsProductList')) {
    			Lists.RemoveBorderFromLastRigthElements(elements, elementsInRow);
    		}
    	},
    	RemoveBorderFromLastRigthElements:function(elements, elementsInRow) {
    		var counter = 1;
    		elements.removeClass('no-border-right');
    		elements.each(function(){
    			if($(this).hasClass('tsProductList-Item--tsCampaign--double'))
    			{
    				counter++;
    			}
    			if(counter % elementsInRow === 0)
    			{
    				$(this).addClass('no-border-right');
    			}
    			counter++;
    		});
    	},
    	GetElementsInRow :function (argument) {
    		var inRow = 1;    
    		if(mediaqueriesMin("mqXsmall") && mediaqueriesMax("mqLtSmall"))
    		{
    			altlist ? inRow = 1 : inRow = 2; 
    		}
    		else if(mediaqueriesMin("mqSmall") && mediaqueriesMax("mqLtMedium"))
    		{
    			inRow = 3;
    		}
    		else if(mediaqueriesMin("mqMedium") && mediaqueriesMax("mqLtLarge"))
    		{
    			inRow = 4;
    		}
    		else if(mediaqueriesMin("mqLarge"))
    		{
    			inRow = 5;
    		}
    		return inRow;
    	}

    }
}();


var highestElement = function(elements)
{
	var array = [];
	$.each(elements,function() {
		var height = $(this).outerHeight();

		array.push(height);
	});
	var max = Math.max.apply(null, array);
	return max;
}

function scrollToElement(parentoffset, thisoffset){
    var browser = checkBrowser();
    if(browser.split('|')[0].toLowerCase() == "explorer")
    {
         if(parentoffset!=undefined)
            $("html, body").animate({scrollTop: parentoffset + -62});
    }
    else
    {
       $("body, html").scrollTop(thisoffset);
    }

}
$(document).ready(function() {
	$('body').on('click', '.tsProductList-Item > a[href^="#"]', function(e) {
		e.preventDefault();
		$(this).closest('.tsProductList-Item').siblings().find('.tsProductItem-Extension').fadeOut();
		$(this).closest('.tsProductList-Item').find('.tsProductItem-Extension').fadeIn();
	});
	$('body').on('click', '.tsProductItem-Extension-CloseBtn', function(e) {
		e.preventDefault();
		$(this).closest('.tsProductItem-Extension').fadeOut();
	});
});
/*
function checkAddOrRemoveCollapse(list)
{
	var parent = list.find('[data-widget-collapse=inner]');
	if(parent!=undefined)
	{
        //initCollapse();
        var collapse = parent.closest('[data-widget=collapse]'),
        trigger = collapse.siblings('[data-widget-control=collapse-trigger]'),
        previewheight = parent.data("widget-previewheight");

        if(trigger.length == 0)
        {
        	addCollapse(collapse);
        }

        if(previewheight!=undefined)
        	previewheight = previewheight.replace('px','');

        if(previewheight > list.find('ul').height())
        {
        	if(collapse.hasClass("is-collapsed"))
        	{
        		trigger.click();
        	}
        	trigger.addClass("hide");
        }
        else
        {
        	trigger.removeClass("hide");
        }
    }
    removeBorderFromLastElements(list);
}*/

