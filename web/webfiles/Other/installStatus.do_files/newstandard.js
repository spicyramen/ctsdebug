// Render a popup window for searching
// fieldName the name of the form field that where we should place the results of this search
// action - the endpoint url to use to perform the search
// multiSelect - is the search window single or multi-select?
//
function search(fieldName, action, multiSelect) {
	document.forms[0].currentFieldSearch.value = fieldName;
	var URL = action;
	var index = action.indexOf("?");
	if (index == -1)
	{
        URL += "?";
	}
	else if (index < (action.length - 1))
	{
        URL += "&";
    }
    URL += "lookup=true" + "&multiple=" + multiSelect;
  	newWindow = window.open(URL,"search","resizable=yes,height=600,width=700,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes");
}

// function addCurrentSearchItem
// a remote call function for the search page to add an option to a list box
function addCurrentSearchItem(text, val)
{
	if (document.forms[0].currentFieldSearch.value != null &&
	    document.forms[0].currentFieldSearch.value.length > 0)
	{
		var el=document.forms[0].elements[document.forms[0].currentFieldSearch.value];
		var oldselectedindex = el.selectedIndex;
	
		// test to see if it's already there
    	for (var i = 0; i < el.length; i++)
		{
			if (el.options[i].value == val)
			{
				el.options[i].selected = true;
				return;
			}
		}

		// if not found add to option list
		el.options[el.length] = new Option(text,val);
		el.options[el.length-1].selected = true;
		
		if ( (el.selectedIndex != oldselectedindex) && (el.onchange))	{
			el.onchange();
		}
	
	    return;
	}
}


// utility function for find-list pages
function onSelectAll(state) {
    var regex = /^result\[(.*)\].chked/;
	selectAll(document.forms[0], regex, state );
}

function clearAllButMe(elem)
{
	if (elem.checked == true)
	{
		// make all others false
		onSelectAll(false);
		elem.checked = true;
	}
}

// Utility function to open a new generic window.
function openWindow(URL) {
	d = new Date();
	t = d.getTime();
	newWindow = window.open(URL,String(t),"resizable=yes,height=550,width=900,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes");
	newWindow.focus();
}

function closeWin()
{
  window.close();
}

// utility function to concatenate the the selected element of a listbox  into a string separated by colon and assign it to 
// a simple element (text or hidden).
// input:  listElement - The select lement to concatenate
// output destElement - The element to receive the result.
//
function prepMemberList(listElement, destElement) {
 
  var tempArray = new Array();
  for (var i=0; (listElement) && (i < listElement.length); i++) {
    tempArray[tempArray.length] = listElement.options[i].value;
  } 
  destElement.value = tempArray.join(";");   
}

// Utility function to set all checkbox lements on a form which have the name matching a pattern and set their 
// checked property to a given state
// Input:  form - the form name
//         regex - The pattern to match to the element's name
//         state - true or false
function selectAll(form, regex, state) {

    for (var i = 0; i < form.length; i++) {
      if ( (form.elements[i].name != null) && (form.elements[i].name.match(regex)) ) {
        form.elements[i].checked = state;
      }
    }
}

// Utility function to return the count of selected elements (those that are checked)
// Input:  f - the form name
//  Returns: count of selected elements.

function getSelectedCount(f) {
	var regex = /^result\[(.*)\].chked/;
	var count = 0;
	
	for (var i=0; i < f.length; i++) {
	    if (f.elements[i].name != null) {
		if (f.elements[i].name.match(regex) && f.elements[i].checked)	{
			count++;
		}
	    }
	}	
	
	return count;
}




  
// This function copies the text value from elem
// and places it in targetElem, only if all characters
// in elem are in the ascii code 0-127
function copyASCII(elem, targetElem)
{
    var bCopy = true;
    
    // if a value has already been entered for target value, don't replace it
    if (targetElem.value.length <= 0)
    {
        for (var i=0; i < elem.value.length; i++)
        {
            if (elem.value.charCodeAt(i) > 127)
            {
                bCopy = false;
                break;
            }
        }
    }
    else
    {
        bCopy = false;
    }
    
    if (bCopy)
    {
        targetElem.value = elem.value;
    }
}

function testMACUnique (mac, tablename, colname)
{
	
	var arg = "";
	if (tablename) {
		arg += tablename + "," ;
  	}
	if (colname) {
		arg += colname + ",";
  	}
	if (mac) {
		arg += mac;
  	}
		
	var result = "true";
	return (result);
}


// Validate MaC Address
// This generic function can be called to validate Mac address on device pages. 
// parameters are
// _element - the HTML form element
// _dspName - Display Name of the element

function macAddressValidation(_element,_dspName, _isPopup)
{
	var _errorArr = new Array();
	reset_errors(_errorArr);
	msg = "";
	 _element.value = jTrim(String(_element.value).toUpperCase()); 
	 _errorArr[1] = _dspName;
	
	if ((_element.value == null) ||(_element.value.length == 0))
      {
      	_errorArr[2] = msgIsRequired;
      	_errorArr[0] = "true";
	  }

	if (_element.value.length != 12)
      {
      	_errorArr[3] = msgMACTooShort;
      	_errorArr[0] = "true";
	  }
    
	  
    if (!isValidString(_element.value, maskHexDigits))
        {
			_errorArr[4] =  msgMACCharacters;
      		_errorArr[0] = "true";
		}
	
	if (_errorArr[0] == "false" && testMACUnique(_element.value) != "true")
        {
			_errorArr[5] =  msgNotUnique;
      		_errorArr[0] = "true";
		}
  
    msg = build_error_string(_errorArr);
	if(_isPopup == true)
		{ display_errors(msg);}
	return msg;
  }
  
// function showVendorConfigHelp:
//   Display the Vendor Config Help  in a secondary window
// Takes as input:
//   url = the xml url.
// Returns:
//   nothing - opens a new browser window and shows the vendor config help.
//
function showVendorConfigHelp(url, title, showAll, tag)
{
  // Display the settings for the currently selected Device Pool 
  // in a secondary window;
  var detailsURL="vendorConfigHelp.do";
  var options = "resizable=yes,height=510,width=510,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,width=500,height=510,top=200,left=300";

// if neither url nor title is present, then abandon processing and return.  
  if (!(url || title))	{
	return;
  }
  
  // url looks like : "xmldi://cisco.com/..
  if (url)	{
	  detailsURL   += "?url=" + url;
  }
  
  // if title is present, then add it to the detailsURL.
  if (title)	{
  	if (detailsURL.indexOf("?") > -1)	{
	  	 detailsURL += "&title=" + title;
	}
	else	{
	  	 detailsURL += "?title=" + title;		
	}
  }
  
  if(showAll)	{
  	detailsURL += "&showAll=" + "1";
  }
  
  // tag is what that comes after the "#" in the url.
  if (tag)	{
  	 detailsURL += "#" + tag;
  }

  var w = window.open(detailsURL, "vcHelpWin", options);
  w.focus();
}

/*
   name - name of the cookie
   value - value of the cookie
   [expires] - expiration date of the cookie
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/

function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}


/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf(prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) {
		return null;
	}
  } 
  var end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }
  return unescape(dc.substring(begin + prefix.length, end));
}


// function showTree:
//   Show/hide the left hand side application tree
// Takes as input:
//   expand: true for show, false for hide
// Returns:
//   nothing - opens a new browser window and shows the vendor config help.
//
function showTree(expand) {
	//var treeDiv = document.getElementById("treeDiv");
 
    //if (expand == "1") {
    //    treeDiv.style.display="inline";
     //   setCookie("showAppTree","1",null, null, null, null);
     //   document.getElementById('HMexpandLink').style.display='none'; 
     //   document.getElementById('HMcollapseLink').style.display='inline'; 
//	} else {
     //   treeDiv.style.display="none";
    //    setCookie("showAppTree","0",null, null, null, null);  
     //   document.getElementById('HMexpandLink').style.display='inline'; 
     //   document.getElementById('HMcollapseLink').style.display='none';             
//	}
	
}


//
// removes all of the selected items from a <SELECT> form element.
// appends the value of each removed item to the removeList (if not null).
//
function removeSelectedItems(list, removeList)
{
  if (list.selectedIndex == -1)
    { return; }
  
  var selectedIndex;
  while (list.selectedIndex != -1)
  {
    selectedIndex = list.selectedIndex;
    
    // add value to remove list
    if (removeList != null && list.options[selectedIndex] != null)
    {
        var itemValue = list.options[selectedIndex].value;
    
        // don't add it if it's already there
        if (removeList.value.indexOf(itemValue) == -1)
        {
            if (removeList.value.length > 0)
            {
                removeList.value += ",";
            }
            removeList.value += "'" + itemValue + "'";
        }
    }
    
    // remove from list
    list.options[selectedIndex] = null;
  }
  return;
}


function buildColNamesAndValuesForOverridenNames(elName,overridename)
{
	
	var vl = "";
	var frm = document.forms[0];
	
	var el = frm.elements[elName];
	// get real element value
	vl = getValue(el);
	
	if ((el.type == "checkbox")	&& (vl == null)){
		vl = false;
	}	
	return (buildXMLWithCols(overridename,vl,el));
}
function buildColNamesAndValues(elName)
{
	
	var vl = "";
	var frm = document.forms[0];
	
	var el = frm.elements[elName];
	// get real element value
	vl = getValue(el);
	
	if ((el.type == "checkbox")	&& (vl == null)){
		vl = false;
	}	
	return (buildXMLWithCols(elName,vl,el));
}

function buildXMLWithCols(eName, val, el)
{
	var colxml = "";
	var vl = "";
	var txt="";
	if (eName)	{
		if (val == undefined)	{
			vl = "";
		}
		else	{
			vl = val;
		}
		
		if (el)
		{
			colxml = openXMLTag("column");
			colxml += openXMLTag("name") + eName + closeXMLTag("name");
			colxml += openXMLTag("value") + vl + closeXMLTag("value");
			
			if (el.type == "select-one")
			{
				txt = getText(el,vl);
				colxml += openXMLTag("text") + txt + closeXMLTag("text");
			}
			colxml += closeXMLTag("column");	
		
		}
		/*
		if ((el) && (el.type=="select-one"))	{
			txt = getText(el,vl);
			colxml = " <column name=\"" + eName + "\"" + " value=\"" + vl + "\"" + " text=\"" + txt + "\" />";
			
		}	
		else	{
			colxml = " <column name=\"" + eName + "\"" + " value=\"" + vl + "\"/>";
		}
		*/
	}

	return colxml;

}

function getText(el,vl)
{
	  //if the combobox is empty then just return null
	  if(el.selectedIndex < 0) {
	  	return null;
	  }
	  if (jTrim(vl).length == 0)	{
	  	return "";
	  }
	  else {
	      return el.options[el.selectedIndex].text;
	  }

}

function openXMLTag(item)
{
	var xml = "<" + item + ">";
	return xml;
}

function closeXMLTag(item)
{
	var xml = "</" + item + ">";
	return xml;

}

function getValueChkBox(elem)
{

	var vl = getValue(elem);
	if (vl == null)
	{
		vl = false;
	}
	return vl;

}

function validateTheFileSelected(pathname) 
{
	if (pathname == 0)
	{
		alert("Please select an input file for viewing its contents");
		return false;
	}
	return true;
}

function viewTheSelectedFileContents(pathname)
{
	if (validateTheFileSelected(pathname))
	{
		window.open("bulkviewfilecontents.do?fileName="+pathname, "FileContentsWin", "toolbar=no,height=510,width=510,menubar=no,scrollbars=yes,resizable=yes,location=no,status=yes,width=500,heigth=510,top=200,left=300");
	}
}

function instanceIdValidation(ele, isPopup, dispName)
{
  var _errorArr = new Array();
  var check = /^[a-zA-Z0-9\._-]{1,128}$/;
  reset_errors(_errorArr);
  msg = "";
  _errorArr[1] = dispName;
  
  if ((ele.value == null) ||(ele.value.length == 0)) {
   	_errorArr[2] = msgIsRequired;
   	_errorArr[0] = "true";
  }
	  
  if (!check.test(ele.value)) {
	_errorArr[3] =  msgInvalidInstanceID;
    _errorArr[0] = "true";
  }
  msg = build_error_string(_errorArr);
  if (isPopup)  display_errors(msg); 
  return msg;
}

function authenticationStringValidation(isPopup, dispName, certOper, authMode, authString) 
{
  var msg = "";
  var errorArr = new Array();
  reset_errors(errorArr);
  errorArr[1] = dispName;
 
  // if authmethod is byAuthString, auth string must be present.
  if ( ( (certOper == "2") || (certOper == "3") || (certOper == "4") ) &&  // install/upgrade, delete, or troubleshoot
       (authMode == "1")  &&     // by auth string
       (authString.length == 0) ) {
      errorArr[0] = "true";
      errorArr[2] = msgIsRequired;
      msg = build_error_string(errorArr);  
      if (isPopup)  display_errors(msg); 
  }
  
  return msg;
}



/** Preloading Images **/
var _toolbar_button_tile     = new Array(); _toolbar_button_tile.src    = "themes/VtgBlaf/toolbar_button_tile.gif";
var _toolbar_button_left     = new Array(); _toolbar_button_left.src    = "themes/VtgBlaf/toolbar_button_left.gif";
var _toolbar_button_right    = new Array(); _toolbar_button_right.src   = "themes/VtgBlaf/toolbar_button_right.gif";
var _toolbarButtonDownTile   = new Array(); _toolbarButtonDownTile.src  = "themes/VtgBlaf/toolbarButtonDownTile.gif";
var _toolbarButtonDownLeft   = new Array(); _toolbarButtonDownLeft.src  = "themes/VtgBlaf/toolbarButtonDownLeft.gif";
var _toolbarButtonDownRight  = new Array(); _toolbarButtonDownRight.src = "themes/VtgBlaf/toolbarButtonDownRight.gif";
var _toolbarGradient         = new Array(); _toolbarGradient.src        = "themes/VtgBlaf/toolbarGradient.gif";
var _toolbarGradient3px      = new Array(); _toolbarGradient3px.src     = "themes/VtgBlaf/toolbarGradient3px.gif";
/** End preloading images **/


function cuesMakeButton(id) 
{
  try
  {
    document.getElementById(id).style.backgroundImage="url(" +_toolbar_button_tile.src+ ")";
    document[id+'left'].src  = _toolbar_button_left.src;
    document[id+'right'].src = _toolbar_button_right.src;
    document.getElementById(id+'center').style.color = "#000000";
  }
  catch(e){}
}

function cuesMakeButtonDown(id) 
{   
  try
  { 
    document.getElementById(id).style.backgroundImage="url(" + _toolbarButtonDownTile.src + ")";
    document[id+'left'].src  = _toolbarButtonDownLeft.src;
    document[id+'right'].src = _toolbarButtonDownRight.src;
    document.getElementById(id+'center').style.color = "#FFFFFF";
  }
  catch(e){}
}

function cuesClearButton(id)
{
  try
  {
    document.getElementById(id).style.backgroundImage="url(" + _toolbarGradient.src + ")";
    document[id+'left'].src  = _toolbarGradient3px.src;
    document[id+'right'].src = _toolbarGradient3px.src;
    document.getElementById(id+'center').style.color = "#000000";
  }
  catch(e){}
}

function cuesToolbarItemOnclickHandler(id,evt)
{
  if(evt == null) evt = window.event;
  try
  {
    var obj = (document.all)?evt.srcElement:evt.target;
    if(obj.tagName.toLowerCase()=="td")
    {
      var toolbarLink = document.getElementById(id+'link');
      if(toolbarLink.disabled)
        return;
      if(document.all)
        toolbarLink.click();
      else
      {
        if(toolbarLink.href.indexOf("javascript:")==0)
          eval(toolbarLink.href);
        else
          document.location.href=toolbarLink.href;
      }
    }
  }
  catch(e){}
}

// Add for Trunk Licensing Feature in unison release
function isTrunkLicenseRequired(productNumber)
{
   if (productNumber != null && productNumber.length > 0 ){
       switch (productNumber) {
            case '1' :   //Cisco Catalyst 6000 T1 VoIP Gateway
            case '2' :   //Cisco Catalyst 6000 E1 VoIP Gateway
            case '4' :   //Cisco Catalyst 6000 12 port FXO Gateway
            case '17':   //H.323 Gateway
            case '18':   //Cisco MGCP FXO Port
            case '52':   //Cisco MGCP T1 Port
            case '55':   //Cisco MGCP E1 Port
            case '75':   //H225 trunk (Gatekeeper controlled)
            case '76':   //Inter-Cluster Trunk (Gatekeeper Controlled)
            case '77':   //Inter-Cluster Trunk (Non-Gatekeeper Controlled)
            case '90':   //Cisco MGCP BRI Port
            case '95':   //SIP Trunk
            case '10001'://WS-SVC-CMM-MS
                   return true;
            }
       }
      return false;
}

function validateTheFileName(filename)
{
	var regExp = /^[a-zA-Z0-9_-][a-zA-Z0-9._-]{0,99}$/;
	if(regExp.test(filename))
	{
		return "true";
	}
	else
	{
		return "false";
	}
}

