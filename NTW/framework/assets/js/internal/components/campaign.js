(function($) {

    $.fn.verticalAlignImage = function() {
        
        if(mediaqueriesMin("mqMedium")) {
            
            var parent              = this; // ul || div
            var containerType       = this.attr('data-valign-container'); // "li" || false
            
            
            $(parent).find(containerType).each(function() {
                
                var thisContainer   = $(this); // li || div
                var itemImg         = thisContainer.find('[data-valign-img]'); // img
                var itemText        = thisContainer.find('[data-valign-item]'); // div
                var textHeight      = itemText.outerHeight();
                var padding         = thisContainer.outerHeight()-thisContainer.height();
                var paddingTop      = parseInt(thisContainer.css('padding-top'));

                $(thisContainer).css('max-height',textHeight+padding);

                $(itemImg).on('load', function() {
                    
                    var imgHeight   = itemImg.height();
                    var margin      = (imgHeight - (textHeight+padding))/2;
                    
                    //alert(imgHeight + ' / ' + textHeight + ' / ' + margin);
                    $(this).css('margin-top',-(margin+paddingTop));
                    
                }).each(function() {
                    if(this.complete) $(this).load();
                });

           });
        }

    }
    
}(jQuery));




$(function() {

    $('[data-valign-container]').each(function() {
        $(this).verticalAlignImage();   
    });
     
});