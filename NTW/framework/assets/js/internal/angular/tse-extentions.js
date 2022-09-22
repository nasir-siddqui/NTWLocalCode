var getOffset = function( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
	return { top: _y, left: _x };
}


/*Array.prototype.equals = function (array, strict) {
    if (!array)
        return false;

    if (arguments.length == 1)
        strict = true;

    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i], strict))
                return false;
        }
        else if (strict && this[i] != array[i]) {
            return false;
        }
        else if (!strict) {
            return this.sort().equals(array.sort(), true);
        }
    }
    return true;
}*/
var removeSpaces = function(content, removeWith) {
    content = content.replace(/\s/g, removeWith);
    return content;
};
 //Cleans content from space, åäö
var cleanContent = function(content) {
    if(content!= null) {
        content = content.toLowerCase();
        content = content.replaceAll('å','a');
        content = content.replaceAll('ä','a');
        content = content.replaceAll('ö','o');
        content = removeSpaces(content, "-");
    }
    return content;
};

String.prototype.replaceAll = function (stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) {
        return this;
    }

    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index !== -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }

    return temp.toString();
};