function attentionObj(heading, text, cssType, cssIcon, closable, closeMessage, closeCssButton){
  heading = heading ? heading : '';
  text = text ? text : '';
  cssType = cssType ? cssType : 'tsAttention--Panic';
  cssIcon = cssIcon ? cssIcon : 'tsIcon-Information';
  closable = closable ? closable : true;
  closeMessage = closeMessage ? closeMessage : 'Stäng';
  closeCssButton = closeCssButton ? closeCssButton : 'tsBtn--Attention--Panic';

  var obj = {
    onClose: null,
    el: null,

    closable: closable,
    closeMessage: closeMessage,
    heading: heading,
    text: text,
    cssType: cssType,
    cssIcon: cssIcon,
    closeCssButton: closeCssButton,


    create: function(){
      var attentionContainer = $('<div'+ this.getClassAttr(this.cssType) +'>');

      
      //create message elements
      var messageWrapper = $('<div class="tsAttention-Message tsWrapInner">');
      var messageIcon = $('<i'+ this.getClassAttr(this.cssIcon) +'></i>');
      var messageContainer = $('<p class="tsAttention-WrapHeading">');
      var messageHeader = $('<strong class="tsAttention-heading">'+ this.heading +'</strong>');
        var messageText = $('<span>'+ this.text +'</span>');

        messageContainer.append(messageHeader);
        messageContainer.append(messageText);

        messageWrapper.append(messageIcon);
        
        //create close elements
      if(this.closable){
        var ref = this;
        var closeContainer = $('<a'+ this.getClassAttr(this.closeCssButton)+'>' +this.closeMessage+ '</a>');
          
        closeContainer.click(function(){
          ref.hide();

          if(ref.onClose){
            ref.onClose();
          }
        });
        
        messageContainer.append(closeContainer);
      }

        messageWrapper.append(messageContainer);

      attentionContainer.append(messageWrapper);

      this.el = attentionContainer;
        return attentionContainer;
    },

    getClassAttr: function(val){
      return (val && val.length > 0) ? ' class="'+ val +'"' : '';
    },

    show: function(){
      if(!this.el){ return; }
      this.el.fadeIn();
    },

    hide: function(){
      if(!this.el){ return; }
      this.el.fadeOut();
    }
  };

  return obj;
}
