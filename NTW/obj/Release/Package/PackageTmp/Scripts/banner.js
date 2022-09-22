//NTW-2 (Jira Story Name) Begin -- Banner to My Business. The link to My Business from JavaScript Code.

var o = document.createElement("script");
o.src = "https://www.telia.se/modules/master/@telia/b2b-serviceweb-banner/*/dist/b2b-serviceweb-banner/b2b-serviceweb-banner.js";
o.type = "text/javascript";
document.head.appendChild(o);
var banner = document.createElement("b2b-serviceweb-banner");
banner.setAttribute("app-id", "NUMBER_SERVICE_WEB");
banner.setAttribute("app-name", "Nummertjänst Webb");
banner.setAttribute("language", "sv");
document.body.prepend(banner);

