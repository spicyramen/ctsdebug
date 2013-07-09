// Function to call the appropriate online help page based on the provided 
// input.  The input should match a context page.  If blank, then the top level
// help page with be loaded.
function showCMPlatformOnlineHelp(context,locale) {
    // The location of the help pages
	// path for help is /Help/<locale>/<application>/ctx/
    var HELP_DIR = "/Help/";
    var APP_DIR = "/platform";
    var CONTEXT_DIR = "/ctx/plt_";
    var helpURL = "";
	
    // Load either the request context page or the main help page
    if (context.length > 0) { 
        // Set the help page URL based on the provided context
        helpURL = HELP_DIR + locale + APP_DIR + CONTEXT_DIR + context + ".html";
    } else {
    	// No context page provided so go to the help index.
    	helpURL = HELP_DIR + locale + APP_DIR + "/index.html";
    }

    // Open a new window for the help page.
    hw = window.open(helpURL, "HelpSystem");
    return;
}
