 function loadShareScripts(){
	if($('.tsShare-wrap').length > 0)
	{
			var idx=0, shareLocation = window.location.href;

				var handleLocation = function(l) {
					var _s = idx++ +" "+l+" -> ";
					if(l.search(/https/i) != -1 && l.search(/tewss/i) != -1){
						l = l.replace("https", "http");
						l = l.replace("tewss.", "");
						
						//dojo.attr(dojo.byId("twitter-share-button"), "data-url", shareLocation);
						//dojo.attr(dojo.byId("fb-like"), "data-href", shareLocation);
						//dojo.attr(dojo.byId("googlePlusButton"), "data-href", shareLocation);
					}
				}

				handleLocation(shareLocation);
				handleLocation("http://www.telia.se");
				handleLocation("http://www.telia.se/privat");
				handleLocation("http://www.telia.se/privat/privat.page");
				handleLocation("https://www.telia.se/privat/privat.page");
				handleLocation("https://www.tewss.telia.se/privat/privat.page");
				handleLocation("https://www.tewss.telia.se/privat/foretag.page");
				handleLocation("https://mgnl-author.www.telia.se/privat/privat");

				/* replace the href without https and tewss */
				/*if(shareLocation.search(/https/i) != -1 && shareLocation.search(/tewss/i) != -1){
					shareLocation = shareLocation.replace("https", "http");
					shareLocation = shareLocation.replace("tewss.", "");
					dojo.attr(dojo.byId("twitter-share-button"), "data-url", shareLocation);
					dojo.attr(dojo.byId("fb-like"), "data-href", shareLocation);
					dojo.attr(dojo.byId("googlePlusButton"), "data-href", shareLocation);
				}*/

				window.___gcfg = {lang: 'sv'}; // Google Plus
				(function(d, s, id_fb, id_tw) {
					var js, fjs = d.getElementsByTagName(s)[0];
					// Twitter
					if(!d.getElementById(id_tw)) {js=d.createElement(s);js.id=id_tw;js.src='//platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}
					// Google Plus
					js=d.createElement(s);js.type='text/javascript';js.async=true;js.src='https://apis.google.com/js/plusone.js';fjs.parentNode.insertBefore(js, fjs);
					// Facebook 
					if (d.getElementById(id_fb)) return;
					js = d.createElement(s);js.id = id_fb;js.async = true;
					js.src = "//connect.facebook.net/sv_SE/all.js#xfbml=1"; // Need to add parameter appId=YOUR_APP_ID, http://developers.facebook.com/docs/reference/javascript/FB.init/
					fjs.parentNode.insertBefore(js, fjs);
				}(document,'script','facebook-jssdk','twitter-wjs'));
	}
}



// TEMPORARILY PLACED HERE
$(window).load(function(){
    loadShareScripts();
});

