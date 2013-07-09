function createBreadCrumb(staticlink,activelink,activelinkaction){
	 	cuesBreadcrumb.clear();
		if (activelinkaction!=null){
			 cuesBreadcrumb.add(activelink,activelinkaction);
		}else{
			 cuesBreadcrumb.add(activelink);
			
			} 
			cuesBreadcrumb.setStatic(staticlink);

      cuesBreadcrumb.render();
	}


function switchSkin(){
	var theContentFrame = parent.frames['contentFrame'];
	if(document.getElementById("mycustomcss")!=null ){
				if(parent.checkChangeSkin==1){
					document.getElementById("mycustomcss").href = "<%= theContextPath%>/utility/cuftaglib.css";
					}else if(parent.checkChangeSkin==2){
					document.getElementById("mycustomcss").href = "<%= theContextPath%>/utility/cuftaglib2.css";
					}else if(parent.checkChangeSkin==3){
					document.getElementById("mycustomcss").href = "<%= theContextPath%>/utility/cuftaglib3.css";
					} else {
						document.getElementById("mycustomcss").href = "";
				}
		}
				
	}
	
	

function setTableColumnWidth(tableIds, togetherFlag) {
		var theTables = getTableElems(tableIds);
		var theLongest = 0;
		
		var theMeasureSpan = getElem("measureMe");
		for (var i=0; i<theTables.length; i++) {
			var theTable = theTables[i];
			if (theTable && theMeasureSpan) {
				if (!togetherFlag) {
					theLongest = 0;	
				}
				
				var theRow;
				var theRows = theTable.rows;
				var theLen = theRows.length;
				for (var j=0; j<theLen; j++) {
					theRow = theRows[j];
					var theCells = theRow.cells;
					if (theCells.length == 2) {
						var theLabelCell = theCells[0];
						theMeasureSpan.innerHTML = trimString(theLabelCell.innerHTML);
						var theWidth = theMeasureSpan.clientWidth;
						if (theWidth > theLongest) {
							theLongest = theWidth;
						}
					}
				}
				
				if (!togetherFlag && theLongest > 0) {
					setLableColumnWidth(theTable, theLongest);
				}
			}
		}
			
		if (togetherFlag && theLongest > 0) {
			for (var i=0; i<theTables.length; i++) {
				setLableColumnWidth(theTables[i], theLongest);
			}
		}
	}
	
	function setLableColumnWidth(table, width) {
		if (table) {
			var theRows = table.rows;
			var theLen = theRows.length;
			for (var j=0; j<theLen; j++) {
				theRow = theRows[j];
				var theCells = theRow.cells;
				if (theCells.length == 2) {
					var theLabelCell = theCells[0];
					theLabelCell.width = width + 5;
				}
			}
		}
	}
	
	function getTableElems(tableIds) {
		var theTables = new Array();
		var theIdx = 0;
		var allTables = document.getElementsByTagName("table");
		var theIds = tableIds.split(",");
		for (var i=0; i<allTables.length; i++) {
			var theTable = allTables[i];
			for (var j=0; j<theIds.length; j++) {
				if (theTable.id == trimString(theIds[j])) {
					theTables[theIdx] = theTable;
					theIdx++;
				}
			}
		}
		return theTables;
	}
	function goToWaitForServer(aCtxPath) {
		var theURL = aCtxPath + "/homeNoNav.do?cl=/waitForServer.do";
		var theSelf = self;
		var theTopWindow = findTop(self, true);
		if (theSelf != theTopWindow) {
			theTopWindow.location.href = theURL;
			theSelf.close();
		} else {
			theSelf.window.location.href = theURL;
		}
	}

			
	// create a new XMLHttpRequest object for AJAX operation
	function newHttpReq() {
		var theHttpReq = false;
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest) {
			try {
				theHttpReq = new XMLHttpRequest();
			} catch (e) {
				alert(e);
				theHttpReq = false;
			}
		// branch for IE/Windows ActiveX version
		} else if(window.ActiveXObject) {
			try {
				theHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					theHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e2) {
					theHttpReq = false;
				}
			}
		}
		return theHttpReq;
	}
			
	function getRandomNumber(aRange) {
		var now = new Date();
		var seed = now.getMilliseconds();
		var random_number = Math.floor(Math.random(seed) * aRange);
		return random_number;
	}
			
	function noenter() {
		return !(window.event && window.event.keyCode == 13); 
	}
	
	function removeAllChildren(aParentElem) {
		if (aParentElem && aParentElem.hasChildNodes()) {
			while (aParentElem.childNodes.length >= 1) {
				aParentElem.removeChild(aParentElem.firstChild);       
			} 
		}
	}
	
	function getFormAsString(formName, exclude){
		//alert("I am new js");
		//Setup the return String
		returnString = "";
			
		//Get the form values
		formElements=document.forms[formName].elements;
			
		//loop through the array, building up the url
		//in the format '/strutsaction.do&name=value'
	 
		for(var i=0; i<formElements.length; i++) {
			//alert("elem: " + formElements[i].name);
			
			if (formElements[i] != null && 
				formElements[i].name != null) {
				
				if(formElements[i].type == "radio" && formElements[i].id ==""){  //for new cues select option
					continue;	
				}else if(formElements[i].type == "checkbox" && formElements[i].id ==""){ //for new cues select option
					continue;
				}else if (formElements[i].type == "radio" &&
					!getElem(formElements[i].id).checked) {
					// skip radio button that is not selected
					continue;
				} else if (formElements[i].type == "checkbox" &&
					!getElem(formElements[i].id).checked) {
					// skip checkbox button that is not selected
					continue;
				} else {
					//we escape (encode) each value
					var theName = formElements[i].name;
					if (!isEmpty(theName)) {
						if (exclude != null && exclude != "") {
							theName = theName.replace(exclude, "");
						}
								returnString +="&" 
								+ encodeURI(theName) + "=" 
								+ (encodeAmpersandValue(trimString(formElements[i].value)));
					}
				}
			}
		}
			
		//return the values
		return returnString; 
	}
	
	function encodeAmpersandValue(aVal){
		var str = aVal;
		var res="";
		var temp = new Array();
		temp = str.split('&');
		for(var n=0;n<temp.length;n++){
			res=res+encodeURI(temp[n]);
			if(n<(temp.length-1)){
				res=res+escape('&');
				}
			}
			return res;
		}
	
	function getFormAsStringSelectedElements(formName, exclude){
		//Setup the return String
		returnString = "";
			
		//Get the form values
		formElements=document.forms[formName].elements;
			
		//loop through the array, building up the url
		//in the format '/strutsaction.do&name=value'
	 
		for(var i=0; i<formElements.length; i++) {
			//alert("elem: " + formElements[i].name);
			
			if (formElements[i] != null && 
				formElements[i].name != null) {
				
				if (formElements[i].type == "radio" &&
					!getElem(formElements[i].id).checked) {
					// skip radio button that is not selected
					continue;
				} else if (formElements[i].type == "checkbox" &&
					!getElem(formElements[i].id).checked) {
					// skip checkbox button that is not selected
					continue;
				} else {
					//we escape (encode) each value
					var theName = formElements[i].name;
					if (!isEmpty(theName)) {
						if (exclude != theName ) {
								returnString +="&" 
								+ encodeURI(theName) + "=" 
								+ encodeURI(trimString(formElements[i].value));
						}
								
								
					}
				}
			}
		}
			
		//return the values
		return returnString; 
	}
	
	function setChecked(elemId, value) {
		var theElem = getElem(elemId);
		if (theElem != null) {
			theElem.checked = value;
		}
	}
	
	function setDisabled(elemId, value) {
		var theElem = getElem(elemId);
		if (theElem != null) {
			theElem.disabled = value;
		}
	}
	
	function setFocus(elemId) {
		var theElem = getElem(elemId);
		if (theElem != null) {
			try {
				theElem.focus();
			} catch (e) {
				// ignore exception which could happen if the elem is not visible
			}
		}
	}
	
	function setValue(elemId, value) {
		var theElem = document.getElementById(elemId);
		if (theElem != null) {
			// convert value to string to my isEmpty will work
			var theVal = value + '';
			if (isEmpty(theVal)) {
				theVal = "";
			}
			theElem.value = theVal;
		}
	}
	
	function getElem(elemId) {
		return document.getElementById(elemId);
	}
	
	function replaceEspChars(aVal){
		
		var myString = new String(); 
		myString = aVal; 
		var myResult="";
		
		var myRegExp = new RegExp("\"","g"); 
		 myResult = myString.replace(myRegExp, "&quot;"); 
		var myRegExp1 = new RegExp("[+]","g"); 
		myResult = myResult.replace(myRegExp, "&#043;"); 
		var myRegExp2 = new RegExp("&","g"); 
		myResult = myResult.replace(myRegExp, "&amp;"); 
		var myRegExp3 = new RegExp("'","g"); 
		myResult = myResult.replace(myRegExp, "&apos;"); 
		var myRegExp4 = new RegExp("\'","g"); 
		myResult = myResult.replace(myRegExp, "\\\'"); 
		var myRegExp5 = new RegExp("<","g"); 
		myResult = myResult.replace(myRegExp, "&lt;"); 
		var myRegExp6 = new RegExp(">","g"); 
		myResult = myResult.replace(myRegExp, "&gt;"); 
		
		return myResult;
		}
		
		
		function replacePlusChar(aVal){
			var myRegExp1 = new RegExp("&#043;","g"); 
			return  aVal.replace(myRegExp1, "+"); 
		}
	
	function getElemInFrame(frameID, elemID) {
		var theFrame = getFrame(frameID);
		if (theFrame) {
			return theFrame.document.getElementById(elemID);	
		} else {
			return null;
		}
	}
	
	function getFrame(frameID) {
		return parent.frames[frameID];	
	}
	
	function getValue(elemId) {
		var theElem = getElem(elemId);
		if (theElem != null) {
			
			//adding to trim leading zeros if any
			//theElem.value=trimNumber(theElem.value);

			//adding to trim leading zeros if any 
			return trimString(theElem.value);
		} else {
			return "";
		}
	}
	
	function isNotInRange(sText, aMin, aMax) {
		return !isInRange(sText, aMin, aMax);
	}
	
	function isInRange(sText, aMin, aMax) {
		if (isInteger(sText)) {
			var theInt = parseInt(sText);
			if (theInt >= aMin && theInt <= aMax) {
				return true;
			}
		}
		return false;
	}
	
	function isNotInteger(sText) {
		return !isInteger(sText);
	}
	
	function isFloat(str) {   
		  if (str.match(/^\d+$|^\d+\.\d+$/ ) )  {
			  return  false;
		  }
		  return true;
	  }
	  
	function isInteger(sText) {
		var ValidChars = "0123456789";
		var IsNumber=true;
		var Char;
	 
		if (sText == null || sText.length == 0) {
			return false;
		}
	 
		for (i = 0; i < sText.length && IsNumber == true; i++) { 
			Char = sText.charAt(i); 
			if (ValidChars.indexOf(Char) == -1) {
				IsNumber = false;
			}
		}
		return IsNumber;
	}
	
	function isUTCTime(sText) {
		var theTokens = sText.split(":");
		if (theTokens.length == 2 || theTokens.length == 3) {
			var theHour = theTokens[0];
			var theMins = theTokens[1];
			var theSecs = theTokens[2];
			
			// it's possible that they do not enter seconds
			if (!isInteger(theHour) || !isInteger(theMins)) {
				return false;
			}
			if (!isInRange(theHour, 0, 23) || !isInRange(theMins, 0, 59)) {
				return false;
			}
			
			// if they entered the secs then validate it
			if (theSecs != null) {
				if (!isInteger(theSecs) || !isInRange(theSecs, 0, 59)) {
					return false;
				}
			}
			
			return true;
		} else {
			return false;
		}
	}
	
	function trimString(aStr) {
		if (aStr != null) {
			return aStr.replace(/^\s+/,'').replace(/\s+$/,'');
		} else {
			return "";
		}
	}
				
	function isEmpty(sText) {
		return (sText == null || sText == "" || trimString(sText) == "" || trimString(sText) == "null");
	}
	
	function getTimeZoneOffsetDouble() {
		return (new Date().getTimezoneOffset()/60)*(-1.0);
	}
	
	function getTimeZoneOffset() {
		// * -1 because I am looking at the diff from the specific zone's perspective
		var theOffsetMins = new Date().getTimezoneOffset() * -1.0;
		var theHours = Math.abs(Math.floor(theOffsetMins / 60));
		var theMins = Math.abs(theOffsetMins % 60);
		var theOffsetStr = padString(theHours, 2) + ":" + padString(theMins, 2);
		if (theOffsetMins > 0.0) {
			theOffsetStr = "+" + theOffsetStr;
		} else {
			theOffsetStr = "-" + theOffsetStr;
		}
		return theOffsetStr;
	}
	
	function padString(aDigit, aLen) {
		var thePaddedStr = aDigit;
		var thePaddedLen = 0;
		if (aDigit < 10) {
			thePaddedLen = aLen - 1;
		} else if (aDigit < 100) {
			thePaddedLen = aLen - 2;
		}
		for (var i=0; i<thePaddedLen; i++) {
			thePaddedStr = "0" + thePaddedStr;
		}
		return thePaddedStr;
	}
	
	function isNotPhoneNumber(sText) {
		return !isPhoneNumber(sText);
	}
	
	function isPhoneNumber(sText) {
		if (!isEmpty(sText)) {
			// matches any digit or space
			if (sText.match(/^[0-9 ]+$/)) {
				return true;
			}
		}
		return false; 
	}
	
	function trimSpaceCharacters(sText){
		if (!isEmpty(sText)) {
			var sTextR="";
			var sTokens=sText.split(" ");
			for(var n=0;n<sTokens.length;n++){
				sTextR=sTextR+sTokens[n];
			}
			return (sTextR);
		}
		return "";
	}
	
	function extractCharacters(sText){
		if (!isEmpty(sText)) {
			var sTextR="";
			if(sText.search("[+]")==0){
				var sTokens=sText.split("+");
				for(var n=0;n<sTokens.length;n++){
					sTextR=sTextR+sTokens[n];
				}
				return ('&#043;'+sTextR);
				
			}else{
				return sText;
				}
		}
		return "";
	}
	
	function filterIntercompanyNumber(sText){
		if (!isEmpty(sText)) {
			sText=trimSpaceCharacters(sText);
			var sTextR="";
			if(sText.search("[+]")!=-1){
				var sTokens=sText.split("[+]");
				for(var n=0;n<sTokens.length;n++){
					sTextR=sTextR+sTokens[n];
				}
				//return (sTextR);
				
			}else{
				 sTextR=sText;
				}
				var sTextV="";
				if(sTextR.search(".")!=-1){
					var sTokens1=sTextR.split(".");
					for(var n=0;n<sTokens1.length;n++){
						sTextV=sTextV+sTokens1[n];
					}
				}else{
					sTextV=sTextR;
					}
				return (sTextV);
		}
		return "";
	}
	function isContentFrame(aWindow) {
		try {
			if (aWindow != null) {
				if (aWindow.name) {
					return (aWindow.name == "contentFrame") || 
						(aWindow.name == "meetingOccurrenceDetailsFrame") ||
						(aWindow.name == "meetingOccurrencesFrame") ||
						(aWindow.name == "summaryFrame");
				}
			}
		} catch (e) {
			// do nothing here
		}
		return false;
	}
	
	function hasContentFrame(aWindow) {
		// first check whether it has any frames at all
		if (isContentFrame(aWindow)) {
			return true;
		} else {
				try{
					if (aWindow != null && aWindow.frames) {
						var theFrames = aWindow.frames;
						if (theFrames) {
							var theLen = theFrames.length;
							for (var i=0; i<theLen; i++) {
								if (isContentFrame(theFrames[i])) {
									return true;
								}
							}
						}
					}
				}catch(e){
					return false;
				}
			return false;
			}
		}
	
	function isFirstTimeSetupWizard(aWindow) {
		try {
			// check whether there if a firstTimeForm in this window
			if (aWindow && aWindow.document && aWindow.document.firstTimeForm) {
				return true;
			}
		} catch (e) {
			//alert(e.message);
		}
		return false;
	}
	
	function findTop(aWindow, closeDialog) {
		if (aWindow != null) {
			if (hasContentFrame(aWindow)) {
				return aWindow.top;
			} else {
				// if the content frame is null, meaning it's possible that I am a modal dialog
				// opened from the main page (wizard for example), in that case I might have
				// an opener or dialogArguments.  However, it could be that
				// I am also being opened from a link somewhere.  So try to look for top 
				// on this opener.
				
				var theOpener;
				if (aWindow.opener) {
					theOpener = aWindow.opener;
				} else if (aWindow.dialogArguments) {
					theOpener = aWindow.dialogArguments.win;
				}
				
				// this opener might be CTM or it might not.  If not then I need to return the window itself
				// to check whether this opener is a CTM window, check whether it has a content frame
				if (hasContentFrame(theOpener) || isFirstTimeSetupWizard(theOpener)) {
					return theOpener.top;
				} else {
					return aWindow;
				}
			}
		}
		return aWindow;
	}
	
	function validateField(id, func, displayName, i18nMsg, existingMsg, extra1, extra2, extra3) {
		
		var theMsg = existingMsg;
		
		// I want to automatically trim all fields
		// the getValue() call will trim the data
		setValue(id, getValue(id));
		
		if (func(getValue(id), extra1, extra2, extra3)) {
			if (theMsg != "") {
				theMsg += "\n";
			}
			theMsg += getI18NMessage(i18nMsg, displayName, getValue(id), extra1, extra2, extra3);
		}
		
		return theMsg;
	}
	
	function fileNotExist(aFileName) {
		try {
			if (!isEmpty(aFileName)) {
				 var fso = new ActiveXObject("Scripting.FileSystemObject");
				 return !fso.FileExists(aFileName);
			}
		} catch (e) {
			// always return false because if unsafe activex control is 
			// disabled then just warn them at log in page already.
			// So return false here means I don't bother to check
			//alert(e.message);
		}
		return false;
	}
	
	function setModuleState(elemID, state) {
		var theElem = getElem(elemID);
		if (theElem) {
			theElem.innerHTML = state;
			var theClassName = "cuesOKText";
			if (theElem.href && theElem.href != "") {
				if (state == theModuleErrorState || state == theModuleUnInitState ||
							state == theModuleStoppedState) {
					theClassName = "cuesErrorTextLink";
				} else if (state == theModuleStartingState) {
					theClassName = "cuesWarnTextLink";
				} else {			
					theClassName = "cuesOKTextLink";
				}	
			} else {
				if (state == theModuleErrorState || state == theModuleUnInitState ||
							state == theModuleStoppedState) {
					theClassName = "cuesStatusTextErrorNoPadding";
				} else if (state == theModuleStartingState) {
					theClassName = "cuesWarnText";
				} else {			
					theClassName = "cuesOKText";
				}	
			}
			theElem.className = theClassName;
		}
	}

	function setModuleStateMessage(elemID, stateMsg) {
		if (!isEmpty(stateMsg) && stateMsg != theModuleOkState) {
			var theElem = getElem(elemID);
			var theExistingVal = theElem.innerHTML;
			theElem.innerHTML = theExistingVal + " (" + stateMsg + ")";
		}
	}
	
	function isNotIpAddress (IPvalue) {
		
		//alert("checking: " + IPvalue);
		
		var errorString = "";
		var theName = "IPaddress";
		
		var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
		var ipArray = IPvalue.match(ipPattern);
		
		if (IPvalue == "0.0.0.0")
			errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
		else if (IPvalue == "255.255.255.255")
			errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
		
		if (ipArray == null)
			errorString = errorString + theName + ': '+IPvalue+' is not a valid IP address.';
		else {
			for (i = 0; i < 4; i++) {
				thisSegment = ipArray[i];
				if (thisSegment > 255) {
					errorString = errorString + theName + ': '+IPvalue+' is not a valid IP address.';
					i = 4;
				}
				if ((i == 0) && (thisSegment > 255)) {
					errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
					i = 4;
				}
			}
		}
		
		//extensionLength = 3;
		if (errorString == "") {
			return false;
		} else {
			return true;
		}
	}
	
	function keyDownEvent(aFunc) {
		if (window.event) {
			var theCode = window.event.keyCode;
			if (theCode == 8 || theCode == 46 || theCode ==67 || theCode == 86 || theCode == 22 || theCode ==850) {
				//alert("the code is "+ theCode );
				eval(aFunc);
			}
		}
	}
	
	function submitOnEnterKey(aFunc) {
		if (window.event) {
			var theCode = window.event.keyCode;
			if (theCode == 13) {
				if (eval(aFunc)) {
					// return true here will cause the form to be submitted
					return true;
				} else {
					// here is the thing: if users hit Enter key but then aFunc evaled to false
					// then I must abort the form submission since this is done by default
					// by the system
					return false;
				}
			}
		}
		// if users did not hit Enter key however, then I return true because I don't
		// want to intefere with how the system works
		return true;
	}
	
	function setAutoComplete(anElemId, aFlag) {
		var theElem = getElem(anElemId);
		if (theElem != null) {
			var theSetting = "off";
			if (aFlag) {
				theSetting = "on";
			}
			// IE specific
			theElem.setAttribute("autocomplete", theSetting);
		}
	}
	
	function showWaitCursor() {
		 document.body.style.cursor = 'wait';
	}
	
	function clearCursor() {
		 document.body.style.cursor = 'default';
	}
	
	function showXmlHttpRequestError(aRequest) {
		clearCursor();
		
		if (aRequest) {
			if(aRequest.status==12029 ){
				var theMsg = "Lost Connection";
				theMsg += "\n\tStatus Code: " + aRequest.status;
				theMsg += "\n\tMessage: " + "Connection to the server is lost";
				alert(theMsg);
			}else{
				var theMsg = "Error processing request.";
				theMsg += "\n\tStatus Code: " + aRequest.status;
				theMsg += "\n\tMessage: " + aRequest.statusText;
				alert(theMsg);
			}
		}
	}
	
	
	function trimNumber(s) {
  		while (s.substr(0,1) == '0' && s.length>1)
		{
	  	s = s.substr(1,9999); 
		}
  		return s;

	}
	
	function validateEmail(fieldValue,calendarServer){ //reference to email field passed as argument
			//alert("fieldValue is "+ fieldValue);
		// Begin Valid Email Address Tests
		
		//if field is not empty
		if(fieldValue != ""){ 
			if(calendarServer==1){
			var atSymbol = 0
			
			//loop through field value string
			for(var a = 0; a < fieldValue.length; a++){ 
			
			//look for @ symbol and for each @ found, increment atSymbol variable by 1
			if(fieldValue.charAt(a) == "@"){ 
			atSymbol++
			}
			
			}
			
			// if more than 1 @ symbol exists
			if(atSymbol > 1){ 
			// then cancel and don't submit form
			alert("Please Enter A Valid Email Address") 
			return false
			}
			
			// if 1 @ symbol was found, and it is not the 1st character in string
			if(atSymbol == 1 && fieldValue.charAt(0) != "@"){ 
			//look for period at 2nd character after @ symbol 
			var period = fieldValue.indexOf(".",fieldValue.indexOf("@")+2) 
			
			// "." immediately following 1st "." ? 
			var twoPeriods = (fieldValue.charAt((period+1)) == ".") ? true : false 
			
			//if period was not found OR 2 periods together OR field contains less than 5 characters OR period is in last position
			if(period == -1 || twoPeriods || fieldValue.length < period + 2 || fieldValue.charAt(fieldValue.length-1)=="."){
			// then cancel and don't submit form
			alert("Please Enter A Valid Email Address") 
			return false
				}
			var validEmaildIdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-@_";
			var invalidCharsInEmailId =stripCharsInBag(fieldValue,validEmaildIdChars);
			if("" != invalidCharsInEmailId){
				alert("Please Enter A Valid Email Address") 
				return false
			}	
			

			}
			// no @ symbol exists or it is in position 0 (the first character of the field)
			else{ 
			// then cancel and don't submit form
			alert("Please Enter A Valid Email Address")
			return false 
				}
			return true;
			}
			
		}
		// if field is empty
		else{ 
		// then cancel and don't submit form
		alert("Please Enter A Valid Email Address")
		return false 
		}
		
		//all tests passed, submit form
		//alert("VALID EMAIL ADDRESS!")
		return true
		}

/**
 *  date validation script. 
 */
// Declaring valid date character, minimum year and maximum year

	var minYear=1980;
	var maxYear=2030;
	var pos1=-1;
	var pos2=-1;
	var strMonth=0;
	var strDay=0;
	var strYear=0;
	var dtCh="/";
	function isIntegerNo(s){
		var i;
		for (i = 0; i < s.length; i++){   
			// Check that current character is number.
			var c = s.charAt(i);
			if (((c < "0") || (c > "9"))) return false;
		}
		// All characters are numbers.
		return true;
	}
	
	function stripCharsInBag(s, bag){
		var i;
		var returnString = "";
		// Search through string's characters one by one.
		// If character is not in bag, append to returnString.
		for (i = 0; i < s.length; i++){   
			var c = s.charAt(i);
			if (bag.indexOf(c) == -1) returnString += c;
		}
		return returnString;
	}
	
	function daysInFebruary (year){
		// February has 29 days in any year evenly divisible by four,
		// EXCEPT for centurial years which are not also divisible by 400.
		return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
	}
	function DaysArray(n) {
		for (var i = 1; i <= n; i++) {
			this[i] = 31
			if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
			if (i==2) {this[i] = 29}
	   } 
	   return this
	}
	
	function isValidDate(dtStr,aLocale,aSeparator,aField,aFormat){
		var daysInMonth = DaysArray(12)
		/*var pos1=dtStr.indexOf(dtCh)
		var pos2=dtStr.indexOf(dtCh,pos1+1)
		var strMonth=dtStr.substring(0,pos1)
		var strDay=dtStr.substring(pos1+1,pos2)
		var strYear=dtStr.substring(pos2+1)*/
		getAllDateFields(dtStr,aLocale,aSeparator);
		strYr=strYear

		if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
		if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
		for (var i = 1; i <= 3; i++) {
			if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
		}
		month=parseInt(strMonth)
		day=parseInt(strDay)
		year=parseInt(strYr)
		if((pos1==-1 || pos2==-1) 
		   || (strMonth.length<1 || month<1 || month>12)
		   || (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month])		
		   || (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false)
			) 
		{
			alert("Please enter a valid date in "+aFormat+" for "+aField)
			return false

		}
		
		/*if (pos1==-1 || pos2==-1){
			//alert("The date format should be :"+ aField)
			alert("Invalid Date Format for "+ aField+". Date should have separator '"+ aSeparator+"'");
			return false
		}
		if (strMonth.length<1 || month<1 || month>12){
			alert("Please enter a valid month for "+aField)
			return false
		}
		if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
			alert("Please enter a valid day for "+aField)
			return false
		}
		if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
			alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear+" for "+aField)
			return false
		}
		if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
			alert("Please enter a valid date for "+aField)
			return false
		}*/
		if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
			alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear+" for "+aField)
			return false
		}
		
	return true
	}

	//get the months,year and day according to the locale format
	function getAllDateFields(dtStr,aLocale,dtCh){
	//alert("date string passed on is "+dtStr);
		if(aLocale="Locale.US"){
		//var aLocale="<bean:message key='date.localeFormat'/>";
		 pos1=dtStr.indexOf(dtCh)
		 pos2=dtStr.indexOf(dtCh,pos1+1)
		 strMonth=dtStr.substring(0,pos1)
		//alert("strMonth"+strMonth);
		 strDay=dtStr.substring(pos1+1,pos2)
		//alert("strDay"+strDay);
		 strYear=dtStr.substring(pos2+1)
		//alert("strYear"+strYear);
		}
	
	}

	function ValidateDate(dtValue,aLocale,aSeparator,aMsg){
		//TODO: change the following statement to one getting value passed on from function itself.
		//var dt=document.frmSample.txtDate
		//if (isValidDate(dt.value)==false){
			if (isValidDate(dtValue,aLocale,aSeparator,aMsg)==false){
			//dt.focus()
			return false
		}
		return true
	 }

//for cookies
	function set_cookie ( name, value, exp_y, exp_m, exp_d, path, domain, secure )
	{
		try {
			// var cookie_string = name + "=" + escape ( value );
			 var cookie_string = name + "=" + ( value );
				 if ( exp_y )
				 {
				var expires = new Date ( exp_y, exp_m, exp_d );
				cookie_string += "; expires=" + expires.toGMTString();
				 }
				 if ( path )
					cookie_string += "; path=" + escape ( path );
				 if ( domain )
					cookie_string += "; domain=" + escape ( domain );
				 if ( secure )
					cookie_string += "; secure";
				 document.cookie = cookie_string;
		}catch(e){
			//alert("set: " + e.message);
					//do nothing
		}
	}
	
	
	// the following cookies functions are taken from http://www.csgnetwork.com/directcookiesinfo.html
	function reldate(days) {
		var d;
		d = new Date();

		/* We need to add a relative amount of time to
		the current date. The basic unit of JavaScript
		time is milliseconds, so we need to convert the
		days value to ms. Thus we have
		ms/day
		= 1000 ms/sec *  60 sec/min * 60 min/hr * 24 hrs/day
		= 86,400,000. */

		d.setTime(d.getTime() + days*86400000);
		return d.toGMTString();
	}

	function readCookie(name) {
		var s = document.cookie, i;
		if (s)
			for (i=0, s=s.split('; '); i<s.length; i++) {
				s[i] = s[i].split('=', 2);
				if (unescape(s[i][0]) == name)
					return unescape(s[i][1]);
			}
		return null;
	}

	function makeCookie(name, value, p) {
		var s, k;
		s = escape(name) + '=' + escape(value);
		if (p) for (k in p) {
			/* convert a numeric expires value to a relative date */
			
			if (k == 'expires')
				p[k] = isNaN(p[k]) ? p[k] : reldate(p[k]);
				
			/* The secure property is the only special case
			here, and it causes two problems. Rather than
			being '; protocol=secure' like all other
			properties, the secure property is set by
			appending '; secure', so we have to use a
			ternary statement to format the string.
			
			The second problem is that secure doesn't have
			any value associated with it, so whatever value
			people use doesn't matter. However, we don't
			want to surprise people who set { secure: false }.
			For this reason, we actually do have to check
			the value of the secure property so that someone
			won't end up with a secure cookie when
			they didn't want one. */
				
			if (p[k])
				s += '; ' + (k != 'secure' ? k + '=' + p[k] : k);
		}
		document.cookie = s;
		return readCookie(name) == value;
	}
	

	function rmCookie(name) {
		return !makeCookie(name, '', { expires: -1 });
	}
	
	
	//validate dates entered in start date and end date fields to be projected and used by calendar widget.
	function validateDates(theStartDate,theEndDate,checkDates,returnFlag){

					var now = new Date();
					var theMonth = now.getMonth() + 1;
					var theTodayStr = theMonth + "/" + now.getDate() + "/" + now.getFullYear();
					var isReturnVal = false;
				//check if start date or end date is empty ; in order to prevent Javascript error to pop for fAfterSelected func of //calendar widget put today's date if field are empty
				if(isEmpty(theStartDate.value)){
					alert("Start on: invalid blank value.");
					theStartDate.value=theTodayStr;
					isReturnVal = true;
				}
				if(isEmpty(theEndDate.value)){
					alert("End on: invalid blank value.");
					theEndDate.value=theTodayStr;
					isReturnVal = true;
				}
				if(isReturnVal){
					return false;
				}
				if(checkDates){
						var dt1=(theStartDate.value);  
						var dt2=(theEndDate.value); 
						
						if (dt1==null) { 
							//alert("dt1");

							alert("Invalid date format for Start date, valid format : MM/DD/YYYY"); 
							theStartDate.value=theTodayStr;
							if(returnFlag){
								return false;
							}
						}else{
							try {
								var flag = false;
								flag = isValidDate(dt1,'Locale.US','/','Start Date', 'MM/DD/YYYY')
								if (!flag)
									return flag
								flag =  isValidDate(dt2,'Locale.US','/','End Date', 'MM/DD/YYYY')
								if (!flag)
									return flag
								
									/*
								var dt_start1 =gfPop.theBeginDate;
								var dt_start2=gfPop.theEndDate;
								
								//alert("dt_start1 is : "+ dt_start1);
								date1=new Date(dt1[0],dt1[1]-1,dt1[2]);
								if(date1<dt_start1 || date1> dt_start2){
									alert("Start date should not be earlier than  "+ dt_start1 + " and later than "+ dt_start2);
									//getElem("endDate").value = theTodayStr;
									theStartDate.value = theTodayStr;
									if(returnFlag){
										return false;
									}
								}
								*/
							}
							catch(err) {
								//alert("caugth error");
								return true							
							}
						}
					 
						if (dt2==null) { 
							alert("dt2");
							alert("Invalid date format for End date, valid format : MM/DD/YYYY");
							theEndDate.value=theTodayStr;
							if(returnFlag){
								return false;
							}
						}else{
							
							try {
								var date2=new Date(dt2[0],dt2[1]-1,dt2[2]); //user entered value
								var dt_updated ;
								return isValidDate(dt2,'Locale.US','/','End Date', 'MM/DD/YYYY')
								dt_updated=gfPop.fParseInput(theStartDate.value);
								var date_end1=new Date(dt_updated[0],dt_updated[1]-1,dt_updated[2]); // trying to get value considering start date field user entered
								var date_end2=new Date(dt_updated[0]+2,dt_updated[1]-1,dt_updated[2]);// considering start date field userentry as above
								if( date2<date_end1 || date2> date_end2){
									alert("End date should not be earlier than  "+ date_end1 + " and no later than "+ date_end2);
										theEndDate.value = theStartDate.value;
									if(returnFlag){
									return false;
									}
									
								}
								
							}
							catch (err){
								return true;
							}
						}
					}
				}
			
			
			function setReadOnly(elemId, value) {
				var theElem = getElem(elemId);
				if (theElem != null) {
					theElem.readOnly = value;
				}
				//alert("after read only");
			}
			
			
			
			function validateLengthOfString(str,maxLenExpected,minLenExpected){
				if(str.length > maxLenExpected){
						return false;
						}
				if(minLenExpected){
					if(str.length < minLenExpected ){
					return false;
					}
				}
				return true;
			}
			
			
			
			
			// Replace the &amp;, &gt;, &lt;, &quot;, &apos; entities
function HtmlDecode(text)
{
    var result = text; 

    var amp = "&";
    var gt = ">";
    var lt = "<";
    var quot = "\"";
    var apos = "'"; 

    var html_gt = /&gt;/gi;
    var html_lt = /&lt;/gi;
    var html_amp = /&amp;/gi;
    var html_quot = /&quot;/gi; 
    var html_apos = /&apos;/gi; 

    result = result.replace(html_amp, amp);
    result = result.replace(html_quot, quot);
    result = result.replace(html_lt, lt); 
    result = result.replace(html_gt, gt); 
    result = result.replace(html_apos, apos); 

    return result;
}

			function checkInternationalPhone(strPhone){
			// non-digit characters which are allowed in phone numbers
				var phoneNumberDelimiters = ".";
				var ValidChars = "0123456789";
			// characters which are allowed in international phone numbers
			// (a leading + is OK)
				var validWorldPhoneChars = ValidChars +phoneNumberDelimiters + "+";
				strPhone=trimString(trimSpaceCharacters(strPhone))
				var s=stripCharsInBag(strPhone,validWorldPhoneChars);
				if(""== s){
					return true;
				}else{
					return false;
				}
			}
			
	// 	checks if the passed in string is a valid Host Name	
	function isInValidHostName (hostName) {
		var validHostNameChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-";
		var invalidCharAtStartAndEnd = "-";
		//If HostName is empty return false
		if (isEmpty(hostName) || hostName.length > 255){
			return true;
		}
		
		var labelsInHostName = hostName.split(".");
		if(labelsInHostName.length > 1){
			for (var i=0; i<labelsInHostName.length; i++) {
				var theLabel = labelsInHostName[i];
				if(theLabel.length < 1 || theLabel.length > 63){
					return true;
				}
			}
		}
		//if the Hostname does not contain char from above string return false.
		//If the there is .- in the start or end, return false
		hostName=trimString(hostName);
		var invalidCharsInHostName =stripCharsInBag(hostName,validHostNameChars);
		if("" != invalidCharsInHostName 
		   || invalidCharAtStartAndEnd.indexOf(hostName.charAt(0)) > -1 
		   || invalidCharAtStartAndEnd.indexOf(hostName.charAt((hostName.length-1))) > -1){
			return true;
		}else{
			// This means host name is valid
			return false;
		}
	}

    function getCurrrentDateMMDDYY () {
  	  var currentTime = new Date()
  	  var month = currentTime.getMonth() + 1
  	  var day = currentTime.getDate()
  	  var year = currentTime.getFullYear()
  	  var c_date = month + "/" + day + "/" + year;
  	  return c_date;		      
	  }
    

    function sanitizeTextBoxInput(input){
    	input = input.replace(/&#60;/g, "<");
    	input = input.replace(/&#62;/g, ">");
    	//input = input.replace(/&quot;/g, "\"");
    	//input = input.replace(/&#x27;/g, "'");
    	return input;  
    }
    

	  
	