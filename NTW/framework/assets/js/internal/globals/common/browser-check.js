/*
cookie.js
attention.jquery.js
bowser.js module - dependency * https://github.com/ded/bowser
*/

function browserCheck(autoCheck){
	var obj = {
		autoCheck: autoCheck,
		cookieName: 'supportedBrowserAttentionHidden',
		cookieValidDays: 100,
		attention: null,
		minSupportedBrowsers: 
		[{
			name: 'Internet Explorer',
			version: 9
		}
		],
		

		init: function(){
			if(this.autoCheck){
				obj.check();
			}
		},



		addBrowser: function(name, version){
			this.minSupportedBrowsers.push(
				{
					name: name, 
					version: version
				});
		},

		isAttentionHidden: function(){
			var cookieValue = getCookies(this.cookieName);
			return (cookieValue && cookieValue !== "");
		},


		check : function(){
			if(this.isAttentionHidden()){ return; }

			var supportedBrowser = this.isSupportedBrowser();
			if(!supportedBrowser){
				this.getAttention().show();
			}
		},


		createAttentionEl: function(){
			if(!this.attention){
				var attention = new attentionObj('Webbläsar-stöd! ', 'Du använder en äldre webbläsare som inte längre har stöd på telia.se. Uppdatera din webbläsare till en nyare version eller välj en annan som telia.se stöder.', null, null, true);
				var ref = this;
				
				attention.onClose = function(){
					ref.setCookie();
				};

				$('body').prepend(attention.create());

				this.attention = attention;
				return attention;
			}
		},


		getAttention: function(){
			if(!this.attention){
				this.createAttentionEl();
			}

			return this.attention;
		},

		isSupportedBrowser: function(minSupportedBrowsers){
			minSupportedBrowsers = minSupportedBrowsers ? minSupportedBrowsers : this.minSupportedBrowsers;
			
			var name, version;
			for(var i = 0; i < minSupportedBrowsers.length; i++){
				name = minSupportedBrowsers[i].name;
				version = minSupportedBrowsers[i].version;

				if(bowser.name ===  name && bowser.version < version ){
					return false;
				}
			}

			return true;
		},


		setCookie: function(){
			addCookie(this.cookieName, '1', this.cookieValidDays);
		}


	};

	obj.init();
	return obj;
}