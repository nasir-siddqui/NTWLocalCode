/*global define*/

(function(factory) {

    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery) {
        factory(window.jQuery);
    }

})(function($) {

    $.fn.loadVideo = function() {

        return this.each(function() {
            var _this = this;
            var loadVideo = $("[data-widget*=loadVideo]");
            $.each($(loadVideo, _this), function() {
                var $this = $(this);
                var youtubeId = $(this).attr("data-youtubeid");
                var video = $("<iframe src='//www.youtube.com/embed/" + youtubeId + "?rel=0' frameborder='0' allowfullscreen></iframe>");
                setTimeout(function() {
                    $this.append(video);
                }, 600);

            });
        });
        
    };


});