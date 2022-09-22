
// Breakpoint variables

var mqXsmall   = "13em",
    mqLtSmall  = "30.99em",
    mqSmall    = "31em",
    mqLtMedium = "43.99em",
    mqMedium   = "44em",
    mqLtLarge  = "55.99em",
    mqLarge    = "56em";

/*    mqLtXlarge = "74.9em",
    mqXlarge   = "75em",
    none       = "0em";
*/




function mediaqueries(widget) {
    // A widget may have min and max values corresponding to layout breakpoints
    // Checks if the viewport is within a widget's min and max values
    // If not, the class "is-disabled" is set on the widget container
    // The visual presentaiton is set with LESS/CSS

    var valueMin = "0";
    var valueMax = "0";
    
    if (widget.data('widget-mqmin')) {
        valueMin = widget.data('widget-mqmin')
    }
    if (widget.data('widget-mqmax')) {
        valueMax = widget.data('widget-mqmax')
    }

    if (valueMin != "0") {
        if (valueMax != "0") {
            //Set max or min values for this, !widget.hasClass('prevent-disable')
            //if (!Modernizr.mq('only screen and (min-width: ' + window[valueMin] + ') and (max-width: ' + window[valueMax] + ')') && !widget.hasClass('prevent-disable')) {
            if (!Modernizr.mq('only screen and (min-width: ' + window[valueMin] + ') and (max-width: ' + window[valueMax] + ')')) {
                widget.addClass('is-disabled');
            } else {
                widget.removeClass('is-disabled');
            }            
        } else {
            //Set max or min values for this, !widget.hasClass('prevent-disable')
           // if (!Modernizr.mq('only screen and (min-width: ' + window[valueMin] + ')') && !widget.hasClass('prevent-disable')) {
            if (!Modernizr.mq('only screen and (min-width: ' + window[valueMin] + ')')) {
                widget.addClass('is-disabled');
            } else {
                widget.removeClass('is-disabled');
            }            
        }
    } else if (valueMax != "0") {
        if (!Modernizr.mq('only screen and (max-width: ' + window[valueMax] + ')')) {
            widget.addClass('is-disabled');
        } else {
            widget.removeClass('is-disabled');
        }
        
    }
}

function isWithinInterval(min, max) {
    if(typeof min == "string") {
        min = window[min];
    }
    if(typeof max == "string") {
        max = window[max];
    }
    if(min != undefined && min != "" && max != undefined && max != "") {
        return Modernizr.mq('only screen and (min-width: ' + min + ') and (max-width: ' + max + ')');
    } else if(min != undefined && min != "") {
        return Modernizr.mq('only screen and (min-width: ' + min + ')');
    } else if(max != undefined && max != "") {
        return Modernizr.mq('only screen and (max-width: ' + max + ')');
    }
    return false;
}


function mediaqueriesMin(value) {
    if (value!=undefined) {
        if(typeof value == "string") {
            value = window[value];
        }
        return Modernizr.mq('only screen and (min-width: ' + value + ')');
    }
    return false;
}


function mediaqueriesMax(value) {
    if (value!=undefined) {
        if(typeof value  == "string") {
            value = window[value];
        }
        return Modernizr.mq('only screen and (max-width: ' + value + ')');
    }    
    return false;
}

