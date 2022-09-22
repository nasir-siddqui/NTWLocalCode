

$(document).ready(function() {
    

    // Hides search input label on focus and on blur if the field is not empty

    $('input[type=search]').focus(function() {
        $(this).siblings('label').addClass('visuallyhidden');
    });

    $('input[type=search]').blur(function() {
        if(!$.trim(this.value).length) {
            $(this).siblings('label').removeClass('visuallyhidden');
        }
    });
    if(!Modernizr.input.placeholder)
    {
        if($('[data-visual=placeholder]').length > 0)
        {
            $('[data-visual=placeholder]').each(function(){   
                var div = '<div class="textinput-placeholder"></div>',
                text = '<label>' + $(this).attr('placeholder') + '</label>';
                $(this).wrap(div);
                $(this).before(text);
                
                if ($(this).attr('value') != '') {
                   $(this).focus();    
                 } 
            });

            $('[data-visual=placeholder]').focus(function(){
                $(this).siblings('label').addClass('visibilityhidden');
            });

            $('[data-visual=placeholder]').blur(function(){
                if(!$.trim(this.value).length) {
                    $(this).siblings('label').removeClass('visibilityhidden');
                }
            });
            $('.textinput-placeholder').click(function(){
                $(this).find('[data-visual=placeholder]').focus();                
            });
        } 
    }


    
    
    // Prevents touch screen taps on Primary Navigation top level targets from following the link
    // Opens the Sublevel panel instead
    $('body').on('click', '.tsNavPrimary-TopLevelTarget', function(e) {
        if (Modernizr.touch) e.preventDefault();
    });
    
    $('.tsSearch-form-input').focus(function(){
        $(this).closest('form').addClass('focus');
    });

    $('.tsSearch-form-input').focusout(function(){
        $(this).closest('form').removeClass('focus');
    });

    

    // Used this implementation to limit the scrolling to specific elements. Otherwise it would
    // try to scroll all # links.
   /* $('.scrollable').on('click', function(e){
        $.scrollTo( $(e.target).attr('href'),  400);
    });*/
    /*
    $('body').on('click', '.scrolling',  function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        window.scrollTo($(target).offset().top, {duration: 500});
    });*/

    
  $('body').on('click', '.scrolling',  function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        $('html,body').animate({scrollTop:$(target).offset().top - 20}, 500);
    });

/*
    // Adds a hover event for the primary navigation top level in Medium size and up

//    $(".tsNavPrimaryHover-TopLevelTarget").on(
    $(".tsNavPrimaryHover-TopLevel").on(
        {
        mouseenter: function() {
            if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
//                toggleCollapse($(this).parent('[data-widget=collapse]'));
                toggleCollapse($(this));
//                toggleCollapse($(this).siblings());
            }
        },
        mouseleave: function() {
            if (Modernizr.mq('only screen and (min-width: ' + mqMedium + ')')) {
//                toggleCollapse($(this).parent('[data-widget=collapse]'));
                toggleCollapse($(this));
//                toggleCollapse($(this).siblings());
            }
        }
    });
*/
    //Makes iframes responsive
   // $('iframe').responsiveIframe({ xdomain: '*'});

    $('[name="loginRadioType"]').change( function(e) {
        var formid = $(this).data('formid');
        $('#tsLogin-submit').attr('form', formid);
        $('.tsLogin-form').removeClass('show');
        $('#'+formid).addClass('show');
    });

    $('body').on('click', '#tsLogin-submit', function(e){
        e.stopPropagation();
        var form  =$(this).attr("form");
        $('#'+form).submit();
    });



    //For Selectlist on productdetails page
    $('body').on('click', '[data-widget=selectList-trigger-alt]', function(e){
        e.stopPropagation();
        e.preventDefault();
        var list = $(this).siblings('[data-widget=selectList]');
        var open = list.hasClass('hide');
        $('.tsSelectList').addClass('hide');
        open ? list.removeClass('hide') : list.addClass('hide');
        open ? $(this).addClass("active") : $(this).removeClass("active");
      
    });
    //For Selectlist on productdetails page
    $('body').click(function() {     
        if($('[data-widget=selectList-trigger-alt]').hasClass("active"))
        {   
            $('[data-widget=selectList-trigger-alt]').removeClass("active");
        }
    });


    if(!$('body').hasClass("lt-ie8"))
    {
        ListFilter.InitFilter();
    }
    ListFilter.FilterOnHash();

    if(!$('body').hasClass("lt-ie8"))
    {
        
        ListFilter.SetSelectListPositions();
        ListFilter.CheckCookie();
    }
    initCollapse();
    $('body').on('click', '[data-widget-collapse=trigger],[data-widget-control=collapse-trigger]', function(e) {
        //console.log("clicked a collapse trigger");

        e.preventDefault();
        togglecollapse($(this).closest('[data-widget=collapse]'));
        
    });
    openCollapseFromHash();

});





// *** MOVED TO SHARE.JS TEMPORARILY //pekkos
// $(window).load(function(){
//     loadShareScripts();
// });
// 

//TODO Check instockstatus with ajax.?
/*function updateInstockStatus()
{
    return  true; // true : false;
}*/






//Moved to list
//Moved to cookie

//TODO: Make this dynamic

// Initialize widgets and functions


// Initialize widgets and functions
$(window).on('load', function() {
//    navprimary();
    BrowserDetect.init();
});

$(window).on('load orientationchange', function() {
    
    var links = $('.tsEasyToFind-links > li');
    links.find('a').css("height","");
    Lists.ListAlignment();
    Feedback.feedbackPosition();
    ListFilter.SetSelectListPositions();
    $('.no-fouc').removeClass('no-fouc');
//    NavPrimary.SetSubNavPosition();
    collapse();
    Carousel.Fix();
});

$(window).resize(function() {
    if(!$('body').hasClass('lt-ie9'))
    {
        if(this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function() {
                $(this).trigger('resizeEnd');
        }, 500);
    }
});

$(window).bind('resizeEnd', function() {
    if(!$('body').hasClass('lt-ie9'))
    {
        Lists.ListAlignment();
        //setAllLinksToSameHeight();
        
       
        Feedback.feedbackPosition();
        ListFilter.SetSelectListPositions();
        collapse();

//        NavPrimary.SetSubNavPosition();
        var hCarousels = $("[data-widget=hero-carousel]");
        if(hCarousels.length > 0)
        {            
            Carousel.Init(hCarousels);
        }
       
    }

});
