var Feedback;

if (typeof Feedback === "undefined") {
    Feedback = {};
}

Feedback = function () {

    // OnInit

    function _init() {

    }

    return {


        feedbackPosition: function () {/*
        
            if($('.tsFeedback')==undefined || $('.tsFeedback').length < 1)
                return;

            
          var i = $('.tsFeedback').find('i'),
              a = $('.tsFeedback').find('a');
            var headerpos = 0;
            if(mediaqueriesMin("mqMedium") || $('body').hasClass('lt-ie9'))
            {
               headerpos = 200;
               if(headerpos!=undefined)
               {
                    $('.tsFeedback').css('top', headerpos + "px");
               } 

                var top = $('.tsFeedback').offset().top;
                i.before(a);
                
                $(window).scroll(function (event) {
                // what the y position of the scroll is
              
                // whether that's below the form
                if ($(this).scrollTop() + 20 >= top)
                 {
                    // if so, ad the fixed class
                    $('.tsFeedback').addClass('fixed');

                } else {
                    // otherwise remove it
                    $('.tsFeedback').removeClass('fixed');
                }
              });
            }

            else
            {
                $('.tsFeedback').removeClass('fixed');
                $('.tsFooter').before($('.tsFeedback'));
                a.before(i);
                $(window).unbind('scroll');
            }*/
        }
    }
} ();

$(document).keydown(function(e){
    var code = e.keyCode ? e.keyCode : e.which;
    if(code == 27)
    {
        $('.tsFeedback-label').removeClass('show');
    }
});
$(document).ready(function(){

    $('.tsFeedback-button').on('click',"i",function(e) {
        e.stopPropagation();
        var link = $(this).siblings('.tsFeedback-label');
        link[0].click();
    });

});