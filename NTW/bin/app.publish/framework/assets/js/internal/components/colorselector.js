var ColorSelector;

if (typeof ColorSelector === "undefined") {
    ColorSelector = {};
}

ColorSelector = function () {

    // OnInit

    var imageId = 0;
    var instocktext = '';
    var outofstocktext = '';


    return {
        SetSelectedProduct: function(){
            var leadins = $("[class*='tsProductLeadins']");

            leadins.each(function(){


                var element = $(this),
                    preselect = element.data("preselect"),
                    colorElement = $('.tsColorlist').find('[value='+preselect+']'),
                    //colorElement = $(this).find('[value='+preselect+']'),
                    offers = element.find(".tsProductList-Item");
                
                ColorSelector.SetInStockStatus(colorElement);
                ColorSelector.ChangeImage(colorElement);

                offers.each(function(){   
                    ColorSelector.UpdateColorId(preselect, $(this));
                })   

            });
        },
        SetInStockStatus: function(element){

            var value = element.data('label'),
                valuelabel = element.closest('.tsColorlist').siblings('.tsColorlist-header').find('.tsColorlist-selectedcolor');

                $('.tsColorlist-selectedcolor').text(value);

                var instockstatus = element.data('instock'),
                    date = element.data('delivery-date');

                if(instockstatus)
                {
                    $('.tsInstock-Icon').removeClass('is-outofstock');
                    $('.tsInstock-Icon').addClass('is-instock');
                    $('.tsInstock-Label').text('Finns i lager');
                }
                else
                {
                    $('.tsInstock-Icon').addClass('is-outofstock');
                    $('.tsInstock-Icon').removeClass('is-instock');
                    $('.tsInstock-Label').text('Ej i lager, leveransdatum ' + date);
                }

        },
        ChangeImage: function(element){
            if(element!=undefined && element.length > 0)
            {
                  var parent = element.closest('.tsColorlist');
                parent.find('label').removeClass('is-selected');
                element.closest('label').addClass('is-selected');
                
                /*
                var parent = element.closest('.tsProductLeadins');
                //parent.find('label').removeClass('is-selected');
                //element.closest('label').addClass('is-selected');
                var allRadio = parent.find('.tsColorlist-Item');//.addClass('is-selected');
                
                allRadio.each(function(){
                    var test = $(this);
                    if(test.find('input').val()==element.val()){
                        test.addClass('is-selected');
                    }else{
                        test.removeClass('is-selected');
                    }
                });
                */


                var imgUrl = element.data('attr-variant-image'),
                    productImage = $('.tsProductImage'),
                    thisImages = productImage.find("img[src='"+imgUrl+"']"),
                    allImages = productImage.find('> img');

                allImages.addClass("hide");

                if(thisImages.length > 0) {
                    thisImages.removeClass("hide");
                }
                else {
                    var id ="tsProductImage"+imageId;

                    var img = '<img id="'+id+'" src="'+imgUrl+'" alt=""/>';
                    productImage.append(img);

                    /*
                    var image = new Image();
                    image.src = imgUrl; 
                    image.id = id;
                    image.onload = function() {                       
                        productImage.append(image);
                    }; */
                    imageId++; 
                }
            }

        },

        UpdateColorId: function(id, parent, oldid) {


            if(id==undefined || id =='')
                return;


            var links = parent.find('.tsSelectList-wrap--alt > .tsSelectList').find("a").not('[data-notpreselect="true"]'),
                buttons = parent.find('a.tsBtn--Primary');
                if(links.length > 0)
                    links.each(function(){
                        buttons.push($(this));
                    });                    
            buttons.each(function(){

                var currentUrl = $(this).attr('href');
                if(currentUrl != undefined)
                {
                    var fixedUrl = currentUrl.replaceAll("?","").replaceAll("=","").replaceAll("/","").replaceAll(".","");
                    var pattern = new RegExp(/^.*value.*$/);

                        pattern = pattern.source.replace('value', 'privatkatalogVisaProduktdoproductRef'),
                        key = "productIds";

                    if(fixedUrl.match(pattern)) {
                        key = "preselectproducts";
                    }


                    var newUrl = replaceQueryString(currentUrl, key, id, oldid),
                        newUrl = replaceQueryString(newUrl, "featured", id, oldid);

                    if(newUrl != undefined || newUrl != '')
                    {
                        $(this).attr('href', newUrl);  
                    }
                }
            });
        }
    }
}();

function replaceQueryString(url, param, value, oldid) {

    if(url == undefined || url == '')
        return '';

    var old = "";
   
    var params = url.split("&");

    if(params.length > 1)
    { 
        
            
        // loop through the parameters
        var i = 0;
        while (i < params.length) {
            // compare param name against arg passed in
            var param_item = params[i].split("="),
                index = $('body').hasClass('lt-ie9') ? indexof(param_item, param) : param_item.indexOf(param),
                oldIndex = -1;

            if(oldid != undefined)
            {
                for (var j = 0; j < param_item.length; j++) {
                    param_item[j] = param_item[j].replaceAll(oldid + '_','').replaceAll(oldid,'');
                                       
                };
            }
            if(index > -1)
            {    
                old = param_item[1];
                old = old.replaceAll(oldid + '_', '');
            }

            i++;
        }
    }

    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re))
      return  old.length > 0 ? url.replace(re,'$1' + param + "=" + value+'_'+old + '$2') : url.replace(re,'$1' + param + "=" + value + '$2');
    else
       
        return old.length>0 ? url + '&' + param + "=" + value +'_'+ old : url + '&' + param + "=" + value;
}



$(document).ready(function(){
    ColorSelector.SetSelectedProduct();

    if(!$('body').hasClass("lt-ie9"))
    {
        $('body').on('change', '[name="colorlist"]', function(){
                if($(this).is(':checked'))
                {
                var clicked = $(this),
                    val = clicked.val(),
                    leadins = $("[class*='tsProductLeadins']");

                leadins.each(function(i){
                    
                    var element = $(this),
                         offers = element.find(".tsProductList-Item");

                    ColorSelector.SetInStockStatus(clicked);
                    ColorSelector.ChangeImage(clicked);    

                    offers.each(function(){
                        ColorSelector.UpdateColorId(val, $(this), element.data("preselect"));
                    });
                    element.data("preselect",val);

                });   
            }
        });
    }
    else
    {
        
        $('.tsColorlist > li').on('click', 'label', function(){

            var clicked =$(this).find('input'),
                val = clicked.val(),
                leadins = $("[class*='tsProductLeadins']");

            leadins.each(function(){

                var element = $(this),
                     offers = element.find(".tsProductList-Item, .tsProductList-Item--single");

                ColorSelector.SetInStockStatus(clicked);
                ColorSelector.ChangeImage(clicked);    

                offers.each(function(){
                    ColorSelector.UpdateColorId(val, $(this));
                })
   
                element.data("preselect",val);
            });;
        });
    }
})

