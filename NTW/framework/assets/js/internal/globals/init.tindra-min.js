function updateInstockStatus() {
    return !0;
}

var jQuery_1_9_1 = jQuery.noConflict(!0);

jQuery_1_9_1(document).ready(function() {
    jQuery_1_9_1("input[type=search]").focus(function() {
        jQuery_1_9_1(this).siblings("label").addClass("visuallyhidden");
    });
    jQuery_1_9_1("input[type=search]").blur(function() {
        jQuery_1_9_1.trim(this.value).length || jQuery_1_9_1(this).siblings("label").removeClass("visuallyhidden");
    });
    if (!Modernizr.input.placeholder && jQuery_1_9_1("[data-visual=placeholder]").length > 0) {
        jQuery_1_9_1("[data-visual=placeholder]").each(function() {
            var e = '<div class="textinput-placeholder"></div>', t = "<label>" + jQuery_1_9_1(this).attr("placeholder") + "</label>";
            jQuery_1_9_1(this).wrap(e);
            jQuery_1_9_1(this).before(t);
        });
        jQuery_1_9_1("[data-visual=placeholder]").focus(function() {
            jQuery_1_9_1(this).siblings("label").addClass("visibilityhidden");
        });
        jQuery_1_9_1("[data-visual=placeholder]").blur(function() {
            jQuery_1_9_1.trim(this.value).length || jQuery_1_9_1(this).siblings("label").removeClass("visibilityhidden");
        });
        jQuery_1_9_1(".textinput-placeholder").click(function() {
            jQuery_1_9_1(this).find("[data-visual=placeholder]").focus();
        });
    }
    jQuery_1_9_1("body").on("click", ".tsNavPrimary-TopLevelTarget", function(e) {
        Modernizr.touch && e.preventDefault();
    });
    jQuery_1_9_1(".tsSearch-form-input").focus(function() {
        jQuery_1_9_1(this).closest("form").addClass("focus");
    });
    jQuery_1_9_1(".tsSearch-form-input").focusout(function() {
        jQuery_1_9_1(this).closest("form").removeClass("focus");
    });
    initCollapse();
    jQuery_1_9_1("body").on("click", "[data-widget-collapse=trigger],[data-widget-control=collapse-trigger]", function(e) {
        e.preventDefault();
        togglecollapse(jQuery_1_9_1(this).closest("[data-widget=collapse]"));
    });
});

jQuery_1_9_1(window).on("load", function() {});

jQuery_1_9_1(window).on("load orientationchange", function() {
    jQuery_1_9_1(".no-fouc").removeClass("no-fouc");
    collapse();
});

jQuery_1_9_1(window).resize(function() {
    if (!jQuery_1_9_1("body").hasClass("lt-ie9")) {
        this.resizeTO && clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            jQuery_1_9_1(this).trigger("resizeEnd");
        }, 500);
    }
});

jQuery_1_9_1(window).bind("resizeEnd", function() {
    jQuery_1_9_1("body").hasClass("lt-ie9") || collapse();
});