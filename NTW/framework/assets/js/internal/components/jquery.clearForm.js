/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.clearForm = function() {

        return this.each(function() {
            var _this = this;
            var clearFormButton = $("[data-options*=clearFormButton]", _this);
            var inputFields = $('.tseInput', _this);
            console.log(clearFormButton);
            $(clearFormButton).click(function(){
                $.each(inputFields, function() {
                    //console.log($(this).attr("placeholder"));
                    //$(this).val($(this).attr("placeholder"));
                    $(this).val("");
                    console.log('clear');
                });

            });
        });
        
    };


});