/******************************************************************************
 * Foreign price calculator - autocomplete countries
 *****************************************************************************/

$(document).ready(function() {
     
    // fetch the data and add to array
    var countryList = false;
    
    $.getJSON("/framework/assets/js/internal/components/fpc-countries.json",function(data){
        countryList =$.map(data.countries, function(item) {
            return {
               label: item.name,
               value: item.name,
               zone: item.zone   
            }
        });
    }).success(function(){
    
         $('[data-autocomplete="countries"]').autocomplete({
            source: countryList,
            minLength: 1,
            delay: 0,
            autoFocus: true,
            scroll: true,
            highlight: true,
            select: function(event, ui) {
                $(this).attr('data-fpc-country',ui.item.label);
                $(this).attr('data-fpc-zone',ui.item.zone);  
            },
            close: function(event, ui) {
                foreignPriceCalcultor();
            }
        }); 
        
    });
    

    // show result on selecting option in dropdown
    $('[data-fpc-component="form"] select').on('change',function(){
        if ($('#fpcFrom[data-fpc-country').val() != '') foreignPriceCalcultor();
    });
    
    
    // show result on change with checkbox
    $('[data-fpc-component="form"] input:checkbox').click(function(){
        foreignPriceCalcultor();
    });
    
});



/******************************************************************************
 * Foreign price calculator - fetch and populate prices
 *****************************************************************************/

foreignPriceCalcultor = function () {
    
    // display loading icon
    $('.tsLoading-icon-large').removeClass('is-hidden');
    
    // fetch form values
    var fromCountry     = $('#fpcFrom[data-fpc-country]').val();
    //var fromZone        = $('#fpcFrom[data-fpc-zone]').val();
    var toCountry       = $('#fpcTo[data-fpc-country]').val() == '' ? 'Sverige' : $('#fpcTo[data-fpc-country').val();   
    //var toZone          = $('#fpcTo[data-fpc-zone]').val() == '' ? 'Zon1' : $('#fpcTo[data-fpc-country').val();
    var withMethod      = $('#fpcWith').val();
    var subscription    = $('#fpcSubs').val();
    var isAbroad        = $('#isAbroad:checked').length ? true : false;
    var toAbroad        = $('#toAbroad:checked').length ? true : false;
    var oresund         = $('#oresundPrices:checked').length ? true : false;
    var travellersTalk  = $('#travellersTalk:checked').length ? true : false;
    var extraDataDela   = false; // från prislistan???
    
    
    // set sweden as default toCountry if none given
    if (toCountry == 'Sverige') $('#fpcTo[data-fpc-country').val('Sverige');
    
    // subscription details
    $('[data-fpc="fromCountry').text(fromCountry);
    $('[data-fpc="toCountry').text(toCountry);
    $('[data-fpc="with').text(withMethod);
    
    // units
    $('[data-fpc="unit"]').text('kr');
    $('[data-fpc="unit_per_time"]').text('kr/min'); // med eller utan en eller två asterixer... !
    $('[data-fpc="unit_per_data"]').text('kr/MB');
    $('[data-fpc="surfabroad_unit_per_time"]').text('kr/dag');
    $('[data-fpc="subscribe_unit_per_time"]').text('kr/mån');
    $('[data-fpc="data_unit"]').text('MB');
    $('[data-fpc="data_unit_per_time"]').text('MB/dag');
    $('[data-fpc="footnote"]').text('*');
    $('[data-fpc="footnote2"]').text('**');
    
        
    var url = '/framework/assets/js/internal/components/fpc-pricedata.json';
    
    $.getJSON(url, function (data) {

        // subscription prices
        $.each(data.pricedata.postpaid, function (index, value) {
            $('[data-fpc="'+index+'"]').text(value);
            $('[data-fpc-component="'+index+'"]').removeClass('is-hidden');
        });
        
            
        // extra services - hur prioretars de? billigast? eller någon som väger tyngre?
        $.each(data.pricedata.extaservices, function (index, value) {
            var this_service = '';
            $.each(value, function (index, value) {
                if (index == "name") this_service = value;
                
                if (index == "data") {
                    $.each(value, function (index, value) {
                        
                        if (isAbroad && this_service == 'is_abroad') {
                            $('[data-fpc="'+index+'"]').text(value);
                        }
                        if (travellersTalk && this_service == 'travellers_talk') {
                            $('[data-fpc="'+index+'"]').text(value);
                        }
                        if (oresund && this_service == 'oresund_prices') {
                            $('[data-fpc="'+index+'"]').text(value);
                        }
                        if (subscription == 'mobil_total' && this_service == 'mobil_total') {
                            $('[data-fpc="'+index+'"]').text(value);
                            //console.log(this_service + ': ' +index + ' = '+value);
                        }
                        
                    });
                } 
            }); 
        });
        
        
        // infodata / disclaimer
        if (data.pricedata.infodata) {
            $('[data-fpc="infodata"]').text(data.pricedata.infodata);
            $('[data-fpc-component="infodata"]').removeClass('is-hidden');
        }
        

        // list operators
        if (data.pricedata.operatornames) {
            var operatorListItems = '';
            $('[data-fpc="operatornames"]').html('');
            $.each(data.pricedata.operatornames, function (index, value) {
                operatorListItems += '<li>'+value+'</li>';
            });
            $('[data-fpc="operatornames"]').append(operatorListItems);
            $('[data-fpc-component="operatornames"]').removeClass('is-hidden');
        }
        
//        var servicebox = '<div class="tsFactsBox tsBodyText is-hidden">'+
//                            '<h4 class="h3">Ring billigare till '+fromCountry+' -'+ 
//                                '<span>'+subscribe_price+'</span>'+
//                                '<span>'+subscribe_unit_per_time+'</span>'+
//                            '</h4>'+
//                            '<dl>'+
//                                '<dd>Ringa</dd>'+
//                                '<dt>'+call_price+'</dt>'+
//                            '</dl>'+
//                            '<a class="tsBtn tsBtn--Internal tsBtn--Fullwidth">Läs mer om '+service_name+'</a>'+
//                        '</div>';


        // show/hide fact boxes
        if (data.pricedata.extaservices) {
            $('[data-fpc-component="extraservices"]').removeClass('is-hidden');
            $.each(data.pricedata.extaservices, function (index, value) {
                $.each(value, function (index, value) {
                    if (index == 'name') $('[data-fpc-component="'+value+'"]').removeClass('is-hidden');
                    //if (index == "name") this_service = value;
                });
                
                $.each(value.factbox_data, function (index, value) {
                    //console.log(index + ' / '+value);
                    $('[data-fpc="'+index+'"]').text(value);
                });
                
                if (index == 'mobil_total' && subscription != 'mobil_total') 
                    $('[data-fpc-component="'+index+'"]').addClass('is-hidden');
                
            });
            
            // special special! 
            if (extraDataDela == true) $('[data-fpc="extradata_dela"]').removeClass('is-hidden');
        }
        
    
        // better solution?
        if (withMethod == 'Mobilt bredband') {
            $('[data-fpc-component="mobile_broadband"]').removeClass('is-hidden');
        }
        
    });
    

    // remove loading icon & show the result
    $('.tsLoading-icon-large').addClass('is-hidden');
    $('[data-fpc-component="resultlist"]').removeClass('is-hidden');

};

