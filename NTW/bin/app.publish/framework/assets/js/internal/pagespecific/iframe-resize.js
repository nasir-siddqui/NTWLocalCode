try {
  document.domain='www.telia.se';
} catch (e) {
  // do nothing
}
    
function iframeResize(extraHeight, minHeight, growOnly) {
  iframeResizeName('targetSite', extraHeight, minHeight, growOnly);
}

function iframeResizeToFixedHeight(height) {
	  iframeResizeNameToFixedHeight('targetSite', height);
}
function iframeResizeNameToFixedHeight(name, height) {
	  var size = height + 200;
	 
      try {
        parent.document.getElementsByName(name)[0].height = size;
      } catch (e) {
        // do nothing
      }
}

function avatarResize() {
  avatarResizeId('avatar_iframe', 5);
}

function iframeResizeName(name, extraHeight, minHeight, growOnly) {
  //iframeResizeNameScheduled(name, extraHeight, minHeight, growOnly);
  setTimeout('iframeResizeNameScheduled("'+name+'", '+extraHeight+', '+minHeight+', '+growOnly+')', 1);
  setTimeout('iframeResizeNameScheduled("'+name+'", '+extraHeight+', '+minHeight+', '+growOnly+')', 100);
  setTimeout('iframeResizeNameScheduled("'+name+'", '+extraHeight+', '+minHeight+', '+growOnly+')', 500);
  setTimeout('iframeResizeNameScheduled("'+name+'", '+extraHeight+', '+minHeight+', '+growOnly+')', 1000);
  setTimeout('iframeResizeNameScheduled("'+name+'", '+extraHeight+', '+minHeight+', '+growOnly+')', 2000);
}

function iframeResizeNameScheduled(name, extraHeight, minHeight, growOnly) {
  if(extraHeight == null) {
	  extraHeight = 25;
  }

  if(minHeight == null) {
	minHeight = 530;
  }
  
  if(growOnly == null) {
    growOnly = false;
  }
	
  var size = document.body.scrollHeight + (document.body.offsetHeight - document.body.clientHeight) + extraHeight;
  
  if(size > 0) {
    if(size < minHeight) {
      size = minHeight;
    }
    
    try {
      if(parent.document.getElementsByName(name)[0] != null) {
        if(!growOnly || parent.document.getElementsByName(name)[0].height < size) {
          parent.document.getElementsByName(name)[0].height = size;
        }
      }
    } catch (e) {
      // do nothing
    }
  }
}

function avatarResizeId(name, extraHeight) {
  var size = document.body.scrollHeight + (document.body.offsetHeight - document.body.clientHeight) + extraHeight;
  
  if(size > 0) {
    if(size < 200) {
      size = 200;
    }
    
    try {
      parent.document.getElementById(name).height = size;
    } catch (e) {
      // do nothing
    }
  }
}