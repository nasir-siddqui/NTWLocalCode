/* Deprecated! Use jquery.animateButton.js instead */

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    var to = null;

    $('.tsAnimateBtn').click(function(e) {
        e.preventDefault();
        var animatedButton = $(this);
        console.log(animatedButton);
        var content = animatedButton.attr("data-content");
        var success = animatedButton.attr("data-success");
        var successTime = animatedButton.attr("data-success-time");
        var finalStep = animatedButton.attr("data-final-step");
        var finalStepTime = animatedButton.attr("data-final-step-time");
        animatedButton.addClass("clicked");
        if (animatedButton.is("input")) {
            console.log("inputfält");
            animatedButton.val(content);
        }
        to = setTimeout(function(){
            animatedButton.attr( "data-content", success);
        }, successTime);
        if (finalStep) {
            setTimeout(function(){
                animatedButton.before('<input type="submit" class="tsBtn" value="' + finalStep + '">');
                animatedButton.hide();
            }, finalStepTime);
        }
    }).on('done', function() {
        clearTimeout(to);
        $(this).attr('data-content', $(this).attr("data-success")).addClass('done');
    });


});