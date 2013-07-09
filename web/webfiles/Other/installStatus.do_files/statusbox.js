var gDivID     = "user-status-box";
var gDivWidth  = 250;
var gDivHeight = 50;
var gDivTop    = "47%";
var gDivLeft   = "40%";
var gNoToggle  = 0;

var iE = ( navigator.appName == "Microsoft Internet Explorer" ? true : false );

document.write("<div id=\"" +gDivID+ "\" style=\"position:absolute;top:" +gDivTop+ ";left:" +gDivLeft+ ";visibility:visible;z-index:40000;width:" +gDivWidth+ "px;height:" +gDivHeight+ "px;padding:0px\">");
document.write("<iframe src='/ccmadmin/loading-please-wait.jsp' id='loadstatusbox' name='loadsatusbox' width='" +gDivWidth+ "' height='" +gDivHeight+ "' marginwidth='0' margintop='0' scrolling='no' frameborder='no' style='border:none;z-index:10000'></iframe>");
document.write("</div>");




function chckElementOnClick(myEvent)
{

	if (!myEvent)
	{
		myEvent = window.event
	}

	try
	{
		var mPattern = /.bin|.exe|.zip|.lic|.pem|.der|.csr|.tlv/i;		// List of all extensions that popups a download window
		var myTarget = (myEvent.target) ? myEvent.target : myEvent.srcElement
		var myAction = document.forms[0].action;

		// if either the target (href) or the form action contains a commond download extension, hide the loading window
		if (mPattern.test(myTarget.href) || mPattern.test(myAction))
		{
			//myTarget.setAttribute("href",myTarget.href.replace('10.89.80.199:8844','10.89.80.149'));

			if (iE)
			{
				gNoToggle = 2;
			}
			else
			{
				gNoToggle = 1;				
			}
		}
	}
	catch (e)
	{
		/********* DEBUGGER INFO ****************************
		var debug = ""

		for (i in e)
		{
			debug += i + "=" + e[i] + "\n"
		}
		
		debug += "==========================\n";

		for (i in myEvent)
		{
			debug += i + "=" + myEvent[i] + "\n"
		}

		alert(debug)
		****************************************************/

		// Do nothing if event can not be captured
	}
}



function toggleBox(strObjID, isHidden)
{
	//alert(gNoToggle);

	if (gNoToggle > 0)
	{
		gNoToggle -= 1;
	}
	else
	{
		if(document.layers)						//NN4+
		{
			document.layers[strObjID].visibility = isHidden ? "show" : "hide";
		}
		else if(document.getElementById)		//NN6+ IE5+
		{
			var obj = document.getElementById(strObjID);
			obj.style.visibility = isHidden ? "visible" : "hidden";
		}
		else if(document.all)					//IE4
		{
			document.all[strObjID].style.visibility = isHidden ? "visible" : "hidden";
		}
	}
}



/**************************************************************
 * Use function below to add additional onload event handlers *
 **************************************************************/

function addOnloadEvent(func)
{
	if (typeof window.addEventListener != "undefined")
	{
		window.addEventListener("load", func, false);
	}
	else if (typeof window.attachEvent != "undefined")
	{
		window.attachEvent("onload", func);
	}
	else
	{
		if (window.onload != null)
		{
			var prevOnload = window.onload;
			window.onload = function (e)
			{
				prevOnload(e);
				window[func]();
			};
		}
		else
		{
			window.onload = func;
		}
	}

}



function resetDivPosition()
{
     if (iE)
     {
          document.getElementById(gDivID).style.top  = document.body.scrollTop + (document.body.offsetHeight - gDivHeight)/2;
          document.getElementById(gDivID).style.left = document.body.scrollLeft + (document.body.offsetWidth - gDivWidth)/2;
     }
     else
     {
          document.getElementById(gDivID).style.top  = window.pageYOffset + (window.innerHeight - gDivHeight)/2;
          document.getElementById(gDivID).style.left = window.pageXOffset + (window.innerWidth - gDivWidth)/2;
     }
}



/**************************************************************
 * This function append "toggleBox(id,hide)" to  
 * any hrefs with javascript validation function calls
 **************************************************************/

function reJsHref()
{
	var js_link = document.links;

	for (var i=0; i<js_link.length; i++)
	{
		if (js_link[i].href.indexOf('javascript')>=0 && js_link[i].href.indexOf('onPageFlip')==-1)
		{
			js_link[i].onclick = new Function(unescape(js_link[i].href.substring(11)));
			js_link[i].setAttribute("href","#");
		}
	}
}






if ( !(!document.all&&document.getElementById) )
{
	addOnloadEvent(reJsHref);
}

addOnloadEvent(function (){toggleBox(gDivID,0)});

window.onbeforeunload = function (){ resetDivPosition(); toggleBox(gDivID,1) };

if (window.captureEvents)
{ 
	window.captureEvents(Event.CLICK);
	window.onclick = chckElementOnClick;
}
else
{
	document.onclick = chckElementOnClick;
}
