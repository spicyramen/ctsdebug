
var NS4 = false;
var Opera = false;
var IE4 = false;
var mac = false;
var mswnd = false;
var DOM = false;

var version = "";

var imgFolder = "/ciscopca/images/";
var maxlev = 1;
var popupWidth = 175;
var levelOffset = 20;
var bord = 1;
var vertSpace = 4;
var sep = 0;
var sepFrame = false;
var openSameFrame = false;
var cntFrame = "content";
var contentFrame = "content";
var mout = true;
var iconSize = 16;
var closeDelay = 500;
var tlmOrigBg = "#336666";
var tlmOrigCol = "White";
var bBitmapScheme = false;
var bBitmapPopups = false;
var popupOpenHeight = 0;
var popupLeftPad = 0;
var popupRightPad = 0;
var tlmHlBg = "#336666";
var tlmHlCol = "White";
var borderCol = "#336666";
var menuHorizontal = true;
var scrollHeight=6;
var popupOffset=0;
var canUseMenus = false;

NS4=(document.layers);

Opera=(navigator.userAgent.indexOf('Opera')!=-1)||(navigator.appName.indexOf('Opera')!=-1)||(window.opera);

IE4=(document.all&&!Opera) ;

mac=((IE4)&&(navigator.appVersion.indexOf ("Mac")!=-1));

FFX=(navigator.appVersion.indexOf("firefox")!=-1);

DOM=document.documentElement&&!NS4&&!IE4&&!Opera;

mswnd=(navigator.appVersion.indexOf("Windows")!=-1||navigator.appVersion.indexOf("WinNT")!=-1);

if(IE4){
  av=navigator.appVersion;
  avi=av.indexOf("MSIE");
  if (avi==-1){
    version = parseInt (av) ;
  }
  else{
    version = parseInt(av.substr(avi+4)) ;
  }
}


if(NS4||IE4||DOM||Opera){
  canUseMenus = true;
}

absPath="";
if (sepFrame && !openSameFrame){
	if (document.URL.lastIndexOf("\\")>document.URL.lastIndexOf("/")) {sepCh = "\\" ;} else {sepCh = "/" ;}
	absPath = document.URL.substring(0,document.URL.lastIndexOf(sepCh)+1);
}

function MM_jumpMenu(targ,selObj, contextPath, restore){
  //v3.0
  if (selObj != null && selObj.selectedIndex >= 0) {
      ourpageval = contextPath + selObj.options[selObj.selectedIndex].value;
      if (ourpageval.search("whoUsesMe.do") != -1) {
          window.open(ourpageval, "whousesme", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");
      } else if (ourpageval.search("speedDialEdit.do") != -1) {
          window.open(ourpageval, "speeddial", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");
      } else if (ourpageval.search("serviceUrlEdit.do") != -1) {
          newWin = window.open(ourpageval, "serviceurl", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");      
          newWin.focus();
      } else if (ourpageval.search("BLFSpeeddialEdit.do") != -1) {
          newWin = window.open(ourpageval, "BLFSpeeddial", "resizable=yes,status=yes,width=800,height=450,scrollbars=yes");      
          newWin.focus();
      } else if (ourpageval.search("BLFDirectedCallparkEdit.do") != -1) {
          newWin = window.open(ourpageval, "BLFDirectedCallpark", "resizable=yes,status=yes,width=800,height=450,scrollbars=yes");      
          newWin.focus();          
      } else if (ourpageval.search("phoneServiceSubscribeEdit.do") != -1) {
          window.open(ourpageval, "phoneServiceSubscribe", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");
	  } else if (ourpageval.search("concertoAddUserEdit.do") != -1) {
	      window.open(ourpageval, "createUnityUser", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");  
	  } else if (selObj.options[selObj.selectedIndex].value.search("cuadmin/user.do") != -1) {
	      window.open(selObj.options[selObj.selectedIndex].value, "", "");  
      } else if (ourpageval.search("ViPRCCMExternalAddrListEdit.do") != -1) {
          newWin = window.open(ourpageval, "vipraddrlist", "resizable=yes,status=yes,width=650,height=450,scrollbars=yes");      
          newWin.focus();
	  } else {
	// toggle the 'please wait' box off for phoneCapFile action
	if (selObj.options[selObj.selectedIndex].value.indexOf("phoneCapfFile") != -1) {
	    eval(targ+".location='"+ contextPath + selObj.options[selObj.selectedIndex].value + "'");	
	    toggleBox(gDivID, 0);
	    if (!FFX)
			{
				gNoToggle = 1;
			}	 
	} else {
        	eval(targ+".location='"+ contextPath + selObj.options[selObj.selectedIndex].value + "'");	
	}
      }
  }

  if(restore) {
    selObj.selectedIndex=0;
  }
}

function MM_findObj(n, d) {
  //v4.01
  var p;
  var i;
  var x;

  if(!d) {
    d = document;
  }

  p=n.indexOf("?");
  if( p > 0 && parent.frames.length){
    d = parent.frames[n.substring(p+1)].document;
    n = n.substring(0,p);
  }

  x=d[n];
  if(!(x) && d.all) {
    x = d.all[n];
  }

  for (i=0; !x&&i<d.forms.length; i++) {
    x = d.forms[i][n];
  }

  for(i=0; !x&&d.layers&&i<d.layers.length; i++) {
    x = MM_findObj(n,d.layers[i].document);
  }

  if(!x && d.getElementById) {
    x = d.getElementById(n);
  }

  return x;
}

function MM_jumpMenuGo(selName,targ,restore){
  //v3.0
  var selObj = MM_findObj(selName);

  if (selObj) {
    MM_jumpMenu(targ, selObj, restore);
  }
}

//holds the current context of the help window
var helpContext = "";

//holds the help window object
var helpWindow = null;
var aboutWindow = null;
var ABOUT_URI = "/ciscopca/unityassistant/about.do";
var ONLINEHELP_URI = "/ciscopca/onlinehelp/";
var HELP_URI = "/help/";
var DEFAULTHELP_URI = "/CPCAHelp.htm";
var CONTENTS_URI = "/UGTOC.html";
var INDEX_URI = "/UGIX.html";
var LOTUS_URI = "/domino/";
var WINDOWS_STR = "windows";
var LOTUS_STR = "lotus";

function closeUtilityWindows(){
	closeHelp();
	closeAbout();	
}

function closeAbout(){
	if ((aboutWindow == null) || (aboutWindow.closed == true)) {
		return;
	} 
	else{
		aboutWindow.close();	
	}
}

function closeHelp(){
	if ((helpWindow == null) || (helpWindow.closed == true)) {
		return;
	} 
	else{
		helpWindow.close();	
	}
}

function showAbout(){ 
	// Set the properties of the window
	var sBars  = 'scrollbars=no, location=no, menubar=no, status=no';
	var sOptions = 'left=100, top=50, width=400, height=350';
	var sFeatures = sBars + ',' + sOptions;

	// Check to see if the address book isn't already loaded.  window.open has
	// to be used instead of showModalDialog because showModalDialog has no
	// connection via opener or parent to the window that opened it.  If the 
	// address book is still open just set the focus to it.
	if ((aboutWindow == null) || (aboutWindow.closed == true)) {
		aboutWindow = window.open(ABOUT_URI, "about", sFeatures);
	} 
	else {
		aboutWindow.location = ABOUT_URI;
		aboutWindow.focus();
	}
}

// Pops up Help Contents for Windows
function showHelpContents(lang){
	showHelpContents(lang, WINDOWS_STR);
}

// Pops up Help Contents for a given provider (eg: windows, lotus)
function showHelpContents(lang, provider){
	showHelpWithContext(lang, CONTENTS_URI, provider); 	
}

// Pops up Help Index for Windows 
function showHelpIndex(lang){
	showHelpIndex(lang, WINDOWS_STR);
}

// Pops up the Help Index for a given provider (eg: windows, lotus)
function showHelpIndex(lang, provider){
	showHelpWithContext(lang, INDEX_URI, provider); 	
}

// Pops up default PCA online help
function showHelp(lang){
	showHelpWithContext(lang, "", WINDOWS_STR);
}

// Pops up online help for default provider "windows"
function showHelpWithContext(lang, context){
	showHelpWithContext(lang, context, WINDOWS_STR);
}

// Pops up online help, given the language, context and provider (eg: windows, lotus)
function showHelpWithContext(lang, context, provider){
	if(lang == null || lang == ""){
		//remember URIs ARE case sensitive
		lang = "enu";	
	}

	//create localized help URI
	var helpURI = ONLINEHELP_URI + lang;

	if (provider == LOTUS_STR){
		helpURI += LOTUS_URI;
	}

	if(!(context == null || context == "")){
		helpURI +=  HELP_URI + context;
	}
	else{
		helpURI +=  HELP_URI + DEFAULTHELP_URI;
	}
	
	launchHelp(helpURI); 	
}

function launchHelp(helpURI){ 
	// Set the properties of the window
	var sBars  = 'scrollbars=yes, location=no, menubar=no, status=no';
	var sOptions = 'left=100, top=50, width=600, height=500';
	var sFeatures = sBars + ',' + sOptions;

	// Check to see if the address book isn't already loaded.  window.open has
	// to be used instead of showModalDialog because showModalDialog has no
	// connection via opener or parent to the window that opened it.  If the 
	// address book is still open just set the focus to it.
	if ((helpWindow == null) || (helpWindow.closed == true)) {
		helpWindow = window.open(helpURI, "Help", sFeatures);
	} 
	else {
		helpWindow.location = helpURI;
		helpWindow.focus();
	}
}
