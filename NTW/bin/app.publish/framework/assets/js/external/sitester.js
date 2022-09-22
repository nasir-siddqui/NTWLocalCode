var Sitester_average_number_of_executions = 6; // default 1; Raise this number to expose every N:th visitor to the survey (i.e. set to 10 and every 10th visitor is exposed etc.)
var Sitester_def_lang = "se"; // { "se", "en", "fi", "dk", "no", "de", "es", "pt", "cn", "ru", "fr", "it", "nl", etc}
var Sitester_swap_lang = ""; // { "", "se", "en", "fi", "dk", "no", "de", "es", "pt", "cn", "ru", "fr", "it", "nl", etc }
var Sitester_SurveyId = 1551; // Note! The Sitester Id for the survey.
var Sitester_sekunder1 = 600; // default 600; If the user in inactive longer than this timeinterval, [Sitester_sekunder2] must pass again before the user is exposed
var Sitester_sekunder2 = 120; // default 120; Seconds until the survey are exposed the first time.
var Sitester_sekunder3 = 7776000; // default 7776000; Once exposed. This is how many seconds until the user being exposed again.
var Sitester_sekunder4 = 31536000; // default 31536000; This is how many seconds until the exposure-memory cookies expire.
var Sitester_ExcludeURL = ""; // default ""; Add URLs or part of URLs that you want to exclude from the Survey separated by a comma ","




// Browser detection
var Sitester_BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++)  {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome",
        versionSearch: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari"
    },
    {
      prop: window.opera,
      identity: "Opera"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {    
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"

        }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};

function Sitester_Debug() 
{ 
  this.params = new Object();
  this.get=Sitester_Debug_get;  
  qs=location.search.substring(1,location.search.length);

  if (qs.length == 0)
    return;

  qs = qs.replace(/\+/g, ' ');
  var args = qs.split('&');
  
  for (var i=0;i<args.length;i++)
  {
    var value;
    var pair = args[i].split('=');
    var name = unescape(pair[0]);
    if (pair.length == 2)
      value = unescape(pair[1]);
    else
      value = name;    
    this.params[name] = value;
  }
}

function Sitester_Debug_get(key, default_)
{  
  if (default_ == null)
    default_ = null;  
  var value=this.params[key];
  if (value==null) value=default_;  
    return value;
}

function Sitester_RanLCase()
{
   return String.fromCharCode(97 + Math.round(Math.random() * 25));
}
function Sitester_RanUCase()
{
   return String.fromCharCode(65 + Math.round(Math.random() * 25));
}
function Sitester_r_nr()
{
  return Math.round((Math.random()*9))
}
function Sitester_Generate_guid()
{
  return "80b" + Sitester_r_nr() + Sitester_r_nr() + Sitester_r_nr() + Sitester_r_nr() + "-" + Sitester_RanLCase() + Sitester_r_nr() + Sitester_r_nr() + Sitester_r_nr() + "-" + Sitester_RanLCase() + Sitester_SurveyId + "-" + Sitester_r_nr() + Sitester_r_nr() + "-" + Sitester_r_nr() + Sitester_r_nr() + Sitester_RanLCase();
}

// Handle click on the layer
function Sitester_openWindow()
{
    var site_id = "";
    var user_id = "";
    var visit_id = "";

    if (window.Guanoo)
    {
        site_id = Guanoo.Sensor.data.site;
        user_id = Guanoo.getCookie('site' + site_id + '_user_id');
        visit_id = Guanoo.getCookie('site' + site_id + '_visit_id');
    }

  var Sitester_ref = unescape(Sitester_getCookieValue(Sitester_strReferrer));
  var Sitester_guid = Sitester_Generate_guid();
  var Sitester_protocol = (("https:" == document.location.protocol) ? "https" : "http");
  var Sitester_Location = new String(window.location.href);

  window.open(Sitester_protocol + "://www.sitester.com/sform/start.asp?PK_Id=" + Sitester_guid + "&Language=" + Sitester_def_lang + "&SwapLanguage=" + Sitester_swap_lang + "&Sitester_loc=" + Sitester_Location + "&Sitester_ref=" + Sitester_ref + "&Site_Id=" + site_id + "&User_Id=" + user_id + "&Visit_Id=" + visit_id + "", "", "scrollbars=yes,width=450,height=350,toolbars=no,status=no,menubar=no,resizable=no");     
  document.getElementById("Sitester").style.display="none";   
  
  // write LastExposure and Exposed
  if(Sitester_BrowserDetect.browser == "Safari")  
  {
    Sitester_setCookie(Sitester_strExposedDateTime, Sitester_strMacTime, Sitester_dat4);
  }
  else
  {
    Sitester_setCookie(Sitester_strExposedDateTime, Sitester_exposure_dat, Sitester_dat4);
  }  
  
  Sitester_setCookie(Sitester_strExposed, Sitester_strCookie, Sitester_dat4);

  // delete ActiveUser and Delay
  Sitester_deleteCookie(Sitester_strActiveUser);
  Sitester_deleteCookie(Sitester_strDelay);
  
  // remove the layer from all frames   
  for(i=0; (i<parent.frames.length); i++)
  {
    if(parent.frames[i].document.getElementById("Sitester") != null)
    {
      parent.frames[i].document.getElementById("Sitester").style.display="none";
    }
  }
  
}

// Write layer 
function Sitester_Go()
{  
    var Sitester_protocol = (("https:" == document.location.protocol) ? "https" : "http");  
      
  document.write("<div id='Sitester' title='Sitester' style='position: absolute; left:0; top:0; width:100%; height:768px; z-index:9000; visibility: visible;'>");  
  document.write("<img src='" + Sitester_protocol + "://www.sitester.com/style/Sitesterlager50px.gif' width='100%' height='768' alt='Sitester' title='Sitester' onClick='Sitester_openWindow();'>");  
  document.write("</div>");
}

// Randomizer 
function Sitester_rnd(cases)
{
    //var ranNum = Math.round( Math.random() * (cases-1) );   
  var ranNum = Math.floor(Math.random() * (cases));  
    return (ranNum == 0);
}

// Cookie functions

// Set Cookie for Mac-Safari
function Sitester_setCookieSafari(name, value, expires, domain, secure) 
{ 
    var path = '/';
    
    var curCookie = name + "=" + escape(value) + 
    ((expires) ? "; expires=" + expires.toGMTString() : "") + 
    ((path) ? "; path=" + path : "") + 
    ((domain) ? "; domain=" + domain : "") + 
    ((secure) ? "; secure" : "");

    document.cookie = curCookie; 
}

// Set Cookie 
function Sitester_setCookie(name, value, expire)
{    
  // call the specialfunction for Cookies on Mac+Safari 
  if(Sitester_BrowserDetect.browser == "Safari")
  {    
    
    Sitester_setCookieSafari(name, value, expire, false, false); 
  }
  // other browsers 
  else
  { 
    document.cookie = name + "=" + value + "; path=/" + "" + "; expires=" + expire.toGMTString();  
  }
}

// Set Cookie 
function Sitester_setSessionCookie(name, value)
{    
  // call the specialfunction for Cookies on Mac+Safari 
  if(Sitester_BrowserDetect.browser == "Safari")
  {    
    var domain = false;
    var secure = false;
    var expires = false;    
    var path = '/';
    
    var curCookie = name + "=" + escape(value) + 
    ((expires) ? "; expires=" + expires.toGMTString() : "") + 
    ((path) ? "; path=" + path : "") + 
    ((domain) ? "; domain=" + domain : "") + 
    ((secure) ? "; secure" : "");

    document.cookie = curCookie;     
  }
  // other browsers 
  else
  { 
    document.cookie = name + "=" + value + "; path=/" + "" + "; expires=";  
  }
}

// Get Cookie - checks if the cookie [Name] exists
function Sitester_getCookie(Name)
{    
  var search = Name + "=";
  if (document.cookie.length > 0)
  {
    offset = document.cookie.indexOf(search);
    if (offset !=-1)
    {
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      
      if (end == -1)
      {
        end = document.cookie.length;
      }      
      if (document.cookie.substring(offset, end) == Sitester_strCookie);
      {          
        return true;
      }
    }    
  }    
  return false;
}

// Gets the value for the cookie [Name] 
function Sitester_getCookieValue(Name)
{  
  var search = Name + "=";
  
  if (document.cookie.length > 0)
  {
    offset = document.cookie.indexOf(Name);
    if (offset !=-1)
    {
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1)
      {
        end = document.cookie.length;    
      }            
      return escape(document.cookie.substring(offset, end));
    }    
  }  
  return '';
}

function Sitester_deleteCookie(name) 
{ 
  var expire_IE=new Date();
  expire_IE.setTime(1);
  var expire_firefox=new Date("Thu Jan 01 00:00:01 1970");
    
  // delete cookie for FireFox 
  if(Sitester_BrowserDetect.browser == "Firefox")
  {    
    if(Sitester_getCookie(name))
    {
      Sitester_setCookie(name, Sitester_strCookie, expire_firefox);   
    }
  }
  // delete cookie for other browsers   
  else
  {   
    if(Sitester_getCookie(name))
    {
      Sitester_setCookie(name, Sitester_strCookie, expire_IE);   
    }
  }
}

// Calculates if the latests exposure has occured before todays date + the parameter time
function Sitester_checkTime(time)
{    
  var created_date = new Date();
  var current_date = new Date();  
  var search = Sitester_strExposedDateTime + "=";
  
  if (document.cookie.length > 0)
  {
    offset = document.cookie.indexOf(Sitester_strExposedDateTime);
    if (offset !=-1)
    {
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1)
      {
        end = document.cookie.length;    
      }
            
      current_date.getTime();      

      check_date = new Date(document.cookie.substring(offset, end));      
    
      if((check_date.getTime()+time*1000) < current_date.getTime())
      {          
        return true;
      }
    }    
  }  
  return false;
}


// Cookie variables
var Sitester_strCookie = "true";
var Sitester_strDelay = "Sitester_DelayId" + Sitester_SurveyId;
var Sitester_strActiveUser = "Sitester_ActiveUserId" + Sitester_SurveyId;
var Sitester_strExposed = "Sitester_ExposedId" + Sitester_SurveyId;
var Sitester_strExposedDateTime = "Sitester_ExposedDateTimeId" + Sitester_SurveyId;
var Sitester_strReferrer = "Sitester_Referrer" + Sitester_SurveyId;
var Sitester_strNth = "Sitester_Nth" + Sitester_SurveyId;

var Sitester_Trigger = false;
var Sitester_dat1 = new Date();
var Sitester_dat2 = new Date();
var Sitester_dat3 = new Date();
var Sitester_dat4 = new Date();
var Sitester_exposure_dat = new Date();
var Sitester_referrer = "";

///////////
// Start //
///////////

Sitester_BrowserDetect.init();

Sitester_Location = new String(window.location.href);
var Sitester_Debug_Opt = new Sitester_Debug();
var do_Sitester_Debug;
var Sitester_splitString = Sitester_ExcludeURL.split(",");
var Sitester_DoExclude = false

var Sitester_referrer = document.referrer;

if(Sitester_Debug_Opt.get("SitesterDebug") == "day8")
{
  do_Sitester_Debug = true;
  alert('Sitester_average_number_of_executions: ' +Sitester_average_number_of_executions+"\n"
      +'Sitester_def_lang: ' +Sitester_def_lang+"\n"
      +'Sitester_swap_lang: ' +Sitester_swap_lang+"\n"
      +'Sitester_SurveyId: ' +Sitester_SurveyId+"\n"
      +'Sitester_sekunder1: ' +Sitester_sekunder1+"\n"
      +'Sitester_sekunder2: ' +Sitester_sekunder2+"\n"
      +'Sitester_sekunder3: ' +Sitester_sekunder3+"\n"
      +'Sitester_sekunder4: ' +Sitester_sekunder4+"\n"
      +'Sitester_ExcludeURL: ' +Sitester_ExcludeURL+"\n");      
  Sitester_Go();
}

if(Sitester_ExcludeURL != "")
{
  for(i=0; i<(Sitester_splitString.length); i++)
  {  
    if(Sitester_Location.toLowerCase().indexOf(Sitester_splitString[i].toLowerCase()) > -1 && !Sitester_DoExclude)
    {      
      Sitester_DoExclude = true;
    }
    else
    {      
      Sitester_DoExclude = false;
    }
  }
}
else
{
  Sitester_DoExclude = false;
}

if (!Sitester_getCookie(Sitester_strNth))
{
    if (Sitester_rnd(Sitester_average_number_of_executions)) 
    {
        // show the survey this session        
      Sitester_setSessionCookie(Sitester_strNth, true);
    }
    else
    {
        // dont show the survey this session         
      Sitester_setSessionCookie(Sitester_strNth, false);  
    }
}

if(Sitester_DoExclude || do_Sitester_Debug || ( Sitester_getCookieValue(Sitester_strNth) == 'false' ))
{
  // dont run the script
}
else
{  
  // Delete cookies from v3-v6 
  if(Sitester_getCookie("BefInt"))
  {  
    Sitester_deleteCookie("BefInt");
    Sitester_deleteCookie("AllReady");
    Sitester_deleteCookie("Delay");
    Sitester_deleteCookie("LastExposure");
    Sitester_deleteCookie("Exposed");
  }
  if(Sitester_getCookie("LastExposure"))
  {  
    Sitester_deleteCookie("BefInt");
    Sitester_deleteCookie("AllReady");
    Sitester_deleteCookie("Delay");
    Sitester_deleteCookie("LastExposure");
    Sitester_deleteCookie("Exposed");
  }
  // Set the referrer cookie 
  if(!Sitester_getCookie(Sitester_strReferrer))
  {     
    Sitester_setSessionCookie(Sitester_strReferrer, Sitester_referrer);
  }

  // If not ActiveUser and not Delay, = not inside the 2- or 10-minute interval 
  if(!Sitester_getCookie(Sitester_strActiveUser) && !Sitester_getCookie(Sitester_strDelay))
  {  
    // ActiveUser = true 
    Sitester_dat1.setTime(Sitester_dat1.getTime()+(Sitester_sekunder1*1000));
    Sitester_setCookie(Sitester_strActiveUser, Sitester_strCookie, Sitester_dat1);    
    
    // Delay = true 
    Sitester_dat2.setTime(Sitester_dat2.getTime()+(Sitester_sekunder2*1000));
    Sitester_setCookie(Sitester_strDelay, Sitester_strCookie, Sitester_dat2);      
  }

  // is there a Exposed-cookie? 
  if(Sitester_getCookie(Sitester_strExposed))
  {    
    // Is the time interval since the last exposure greater than Sitester_sekunder3? 
    if (Sitester_checkTime(Sitester_sekunder3))
    {      
      // ActiveUser = true 
      Sitester_dat1.setTime(Sitester_dat1.getTime()+(Sitester_sekunder1*1000));
      Sitester_setCookie(Sitester_strActiveUser, Sitester_strCookie, Sitester_dat1);  
      
      // Delay = true 
      Sitester_dat2.setTime(Sitester_dat2.getTime()+(Sitester_sekunder2*1000));
      Sitester_setCookie(Sitester_strDelay, Sitester_strCookie, Sitester_dat2);    
      
      // delete the Exposed-cookies 
      Sitester_deleteCookie(Sitester_strExposed);
      Sitester_deleteCookie(Sitester_strExposedDateTime);
    }    
  }
  // If no Exposed-Cookie exists 
  else
  {        
    // ActiveUser and no Delay ? 
    if (Sitester_getCookie(Sitester_strActiveUser) && !Sitester_getCookie(Sitester_strDelay))
    {        
      // Run the survey 
      Sitester_Trigger=true;
    }
  }

  // If not ActiveUser and the time interval since the last exposure is greater than Sitester_sekunder3 
  if (!Sitester_getCookie(Sitester_strActiveUser) && Sitester_checkTime(Sitester_sekunder1))
  {
    // Reset ActiveUser 
    Sitester_dat1.setTime(Sitester_dat1.getTime()+(Sitester_sekunder1*1000));
    Sitester_setCookie(Sitester_strActiveUser, Sitester_strCookie, Sitester_dat1);    
  }

  // Should the survey run? 
  if (Sitester_Trigger)
  {      
    Sitester_exposure_dat.setTime(Sitester_exposure_dat.getTime());    
    Sitester_dat4.setTime(Sitester_dat4.getTime()+(Sitester_sekunder4*1000));
    Sitester_strMacTime=Sitester_exposure_dat.getTime();    
        
    // Write the layer 
    Sitester_Go();          
  }
}