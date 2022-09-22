/*
cookie.js
attention.jquery.js
*/

function integrityCookie(){
    var obj = {
    cookieName: 'cookieAttentionHidden',
    cookieValidDays: 90,
    attention: null,

    init: function(){
        
        obj.check();
    },


    isAttentionHidden: function(){
      var cookieValue = getCookies(this.cookieName);
      return (cookieValue && cookieValue !== "");
    },


    check : function(){
      if(this.isAttentionHidden()){ return; }
       
       this.getAttention().show();
    },


    createAttentionEl: function(){
      if(!this.attention){
        var attention = new attentionObj('Information: ', '<a href="/privat/om/tekniska-krav">Godkänn cookie annars blir du uppäten av kakmonstret!</a>.', 'tsAttention--Info--button', null, true, "OK", "tsBtn--Attention--Info");
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


    setCookie: function(){
      addCookie(this.cookieName, '1', this.cookieValidDays);
    }


  };

  obj.init();
  return obj;
}