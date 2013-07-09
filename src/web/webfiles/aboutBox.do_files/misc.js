/* Miscellaneous Javascript */

/* Creates toolbar button effect on rollover, to be called in onMouseOver and onMouseUp event */
function makeButton(id) {
var idR = id+'right';
var idL = id+'left';
var idC = id+'center';
newImage = "url(images/toolbar_button_tile.gif)";
document.getElementById(id).style.backgroundImage = newImage;
document[idL].src='images/toolbar_button_left.gif';
document[idR].src='images/toolbar_button_right.gif';
document.getElementById(idC).style.color = "#000000";
}

/* Creates toolbar button down on mouse click, to be called in onMouseDown event */
function makeButtonDown(id) {
var idR = id+'right';
var idL = id+'left';
var idC = id+'center';
newImage = "url(images/toolbarButtonDownTile.gif)";
document.getElementById(id).style.backgroundImage = newImage;
document[idL].src='images/toolbarButtonDownLeft.gif';
document[idR].src='images/toolbarButtonDownRight.gif';
document.getElementById(idC).style.color = "#FFFFFF";
}

/* Returns toolbar button to original state on mouse out, to be called in onMouseOut event */
function clearButton(id) {
var idR = id+'right';
var idL = id+'left';
var idC = id+'center';
newImage = "url(images/toolbarGradient.gif)";
document.getElementById(id).style.backgroundImage = newImage;
document[idL].src='images/toolbarGradient3px.gif';
document[idR].src='images/toolbarGradient3px.gif';
document.getElementById(idC).style.color = "#000000";
}

/* For two parallel group boxes, assign the taller height to both and align buttons at the bottom.  To be called in onload and onresize events of <body>. */
function setGroupBoxHeight() {
     OBJ1=document.getElementById('cuesColumnLeft');
     OBJ2=document.getElementById('cuesColumnRight');
     Hx=Math.max(OBJ1.offsetHeight,OBJ2.offsetHeight);
     OBJ1.style.height=Hx+'px';
     OBJ2.style.height=Hx+'px';
	 OBJ3=document.getElementById('cuesButtonRowLeft');
	 OBJ4=document.getElementById('cuesButtonRowRight');
	 OBJ5H=document.getElementById('cuesGroupBoxContentLeft').offsetHeight;
     OBJ6H=document.getElementById('cuesGroupBoxContentRight').offsetHeight;
     Hn=Math.min(OBJ5H,OBJ6H);
	 P=Hx-OBJ3.offsetHeight-Hn-14;
	 if (OBJ5H < OBJ6H) {OBJ3.style.top=P+'px';}
	 else {OBJ4.style.top=P+'px';}
}


/* Open a new window centered on the screen. To be called in onClick and onKeyPress events. */
function OpenWinCentered(url, name, width, height, scroll, status) {
   var left = Math.floor( (screen.width - width) / 2);
   var top = Math.floor( (screen.height - height) / 2);
   var winParms = "top=" + top + ",left=" + left + ",width=" + width + ",height=" + height +',scrollbars=' + scroll + ",status=" + status;
   var win = window.open(url, name, winParms);
   if (window.focus) {win.focus()}
   return win;
}

/* Creates a modal dialog box across browsers. It is done using showModalDialog for IE, and dispalying a mask layer that blocks the content in parent window in non-IE broswers. To be called in onClick and onKeyPress events.  */
var winModal;
function OpenModalWin(url, name, width, height, scroll, status, help, resizable) { 
if (window.showModalDialog) {
	winParms = "dialogWidth:" + width + "px;dialogHeight:" + height + "px;scroll:" + scroll + ";status:" + status + ";help:" + help;
	if (resizable) {
		winParms += ";resizable:" + resizable;
	}
	var winName = new Object();
    winName.name = name;
    winName.win = window;
	winModal=window.showModalDialog(url, winName, winParms); //
} else { 
	if (parent.frames.length != 0) {
		parent.contentFrame.popupMask = parent.contentFrame.document.getElementById("cuesPopupMask");
		parent.contentFrame.popupMask.style.visibility = "visible";
		parent.navFrame.popupMask = parent.navFrame.document.getElementById('cuesPopupMask');
		parent.navFrame.popupMask.style.visibility = "visible";
		parent.topFrame.popupMask = parent.topFrame.document.getElementById('cuesPopupMask');
		parent.topFrame.popupMask.style.visibility = "visible";
	} else {
		popupMask = document.getElementById("cuesPopupMask");
		popupMask.style.visibility = "visible";			
	}
	left = Math.floor( (screen.width - width) / 2);
	top = Math.floor( (screen.height - height - 20) / 2);
	if (height <= 182) {
	   winParms = "top=" + top + ",left=" + left + ",width=" + width + ",outerheight=" + (height) +',scrollbars=' + scroll + ",status=" + status + ",modal=yes, dialog=yes"; 
		}
	else {
		winParms = "top=" + top + ",left=" + left + ",width=" + width + ",height=" + (height-32) +',scrollbars=' + scroll + ",status=" + status + ",modal=yes, dialog=yes";
		}
   winModal=window.open(url, name, winParms);
	}
}

/* For non-IE broswers, returns the focus back to modal window. To be called in onClick and onFocus events of <body> that opens the modal window.  */
function checkWinModal() {
	setTimeout("finishChecking()", 50)
	return true
}
function finishChecking() {
	if (winModal && !winModal.closed) {
		winModal.focus() 
	}
}

/* For non-IE broswers, removes the mask layer that blocks the content in parent window. To be called in onUnload events of the modal window's <body> .  */
function removeMask() {
  if (!window.showModalDialog) {
	if (window.opener.parent.frames.length != 0) {
		window.opener.parent.contentFrame.popupMask = window.opener.parent.contentFrame.document.getElementById("cuesPopupMask");
		window.opener.parent.contentFrame.popupMask.style.visibility = "hidden";
		window.opener.parent.navFrame.popupMask = window.opener.parent.navFrame.document.getElementById('cuesPopupMask');
		window.opener.parent.navFrame.popupMask.style.visibility = "hidden";
		window.opener.parent.topFrame.popupMask = window.opener.parent.topFrame.document.getElementById('cuesPopupMask');
		window.opener.parent.topFrame.popupMask.style.visibility = "hidden";
	} else {
		window.opener.popupMask = window.opener.document.getElementById("cuesPopupMask");
		window.opener.popupMask.style.visibility = "hidden";
		}	  
	  }
}

/* Close the dependent windows. To be called in onUnload events of the parent window's <body>.  */
function closeDep() {
  if (win && win.open && !win.closed) win.close();
  if (winModal && winModal.open && !winModal.closed) winModal.close();
}

/* Allows form buttons to navigate to other pages. This is mainly to address onClick links in IE's modal window called by showModalDialog alway opens a new window. To be called in onClick/onKeyPress event of form buttons. This needs to be used in conjuction of <base target="_self"> which should be included in the head of each linked page.*/
function navigateFormButton(url, formId)
{
  var obj = document.getElementById(formId);
  if(obj != null)
  {
    obj.action = url;
    obj.submit();
  }
}

/* Assign a height between wizard step title and navigation buttons to the content body so it is the portion that's scrollable if needed, while step title and nav buttons are always visible. To be called in onLoad event, and onResize if the window is resizable, of wizard's <body>.  */
function assignWizardContentBodyHeight() {
	if (self.innerWidth)
	{
		winHeight = self.innerHeight;
	}
	else if (document.body)
	{
		winHeight = document.body.clientHeight;
	}
	heightButtons = document.getElementById("cuesWizardContentNavButtons").offsetHeight;
	if (document.getElementById("cuesWizardStepTitle"))
	{
		heightTitle = document.getElementById("cuesWizardStepTitle").offsetHeight;
		document.getElementById("cuesWizardContentBody").style.height = winHeight - heightTitle - heightButtons - 45 ;
	}
	else if (document.getElementById("cuesWizardWelcomeTitle"))
	{
		heightTitle = document.getElementById("cuesWizardWelcomeTitle").offsetHeight;
		document.getElementById("cuesWizardContentBody").style.height = winHeight - heightTitle - heightButtons - 13 ;
	}
	
}

