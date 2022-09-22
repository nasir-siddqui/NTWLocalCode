define(function () {

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    function getParameter(index) {
        if (typeof index === "string") {
            return getUrlParameter(index);
        }
        if (index === undefined) index = 0;
        var parameters;
        if (window.location.search.length > 1) {
            // Get from start of query string if it exists
            // Example: test.html?111&222
            var qString = window.location.search.substr(1);
            parameters = qString.split("&");
        } else {
            // Otherwise try to parse the last segment of the url path
            // Example: test/111-222
            var subpaths = window.location.pathname.split("/");
            parameters = subpaths[subpaths.length - 1].split("-");
        }
        if (parameters.length < index - 1) return null;
        return parameters[index];
    }

    return {
        getQueryInt: function (index) {
            return parseInt(getParameter(index), 10);
        },
        getQueryString: function(index) {
            return getParameter(index);
        }
    };

});