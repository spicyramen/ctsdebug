// context sensitive help page override variable
// This variable will be assigned a value in the jsp
// if the DB entry in WebPageInfo must be overridden
var csHelpPage;

function showOnlineHelp(locale, context) {
	var HELP_DIR = "/Help/";
	var APP_DIR = "/ccm";
	var CONTEXT_DIR = "/ctx";
	var helpURL = "";
    // get the target help page
    if  ( (context) && context == "index" )
    {
          helpURL = HELP_DIR + locale + APP_DIR +  "/" + context + ".html";
    }
    else if ((!csHelpPage) && (context)) { 
      		// help page is passed in as parameter and Global var csHelpPage is null
      		helpURL = HELP_DIR + locale + APP_DIR + CONTEXT_DIR + "/" + context + ".html";
    }
    else if (csHelpPage) {
      	// help page is defined in javascript on page (overrides menu)
      	helpURL = HELP_DIR + locale + APP_DIR + CONTEXT_DIR + "/" + csHelpPage;
    }
    else {
    	//We don't know where to go, so go to the help index.
    	helpURL = HELP_DIR  + locale + APP_DIR + "/index.html";
    }
    
	hw = window.open(helpURL, "HelpSystem");
    return;
}
