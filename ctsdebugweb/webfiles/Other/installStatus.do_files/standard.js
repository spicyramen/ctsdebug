// <br>
// <b>*** Do not edit in Design View ***</b><br>
// <br>
// This JavaScript library file contains functions common to<br>
// all pages in the CCM Administration application.<br>
// <br>
// <script>

// Generic error status message displayed in browser's status bar (localize)
var jsStatusProcessing = "Processing...";
var jsStatusValidating = "Validating...";
var jsStatusError = "The form contains one or more errors";
var jsMsgErrorNo = "Error No. ";
var jsErrNoItemLeft = "No item is available for the given criteria, Please enter new search criteria";
var jsErrInputNotString = "The specified form element (%S1) failed the test \"isValidStringData\" because it is the wrong type of form field (%S2) for this function.";
// Remote Scripting support messages (localize)
var lblRemoteScriptingError = "Remote Scripting Error";
var lblErrorInfo = "Error Information"
var lblSource = "Source";
var lblDetails = "Details";
var lblClose = "Close";

// string validation character sets; concatenate these in scripts to form strings for 
// validation. E.g., validChars = maskAlphaNumeric + charUnderScore + charDash
var charAmpersand = "&";
var charAsterisk = "*";
var charBackSlash = "\\";       // double backslash here evaluates to single slash where used
var charBang = "!";
var charBraces = "{}";
var charBrackets = "<>";
var charCarrot = "^";
var charComma = ",";
var charColon = ":";
var charDash = "-";
var charDot = ".";
var charDoubleQuote = "\"";
var charForwardSlash = "/";
var charParens = "()";
var charPercent = "%";
var charPlus = "+";
var charQuestionMark = "?";
var charSingleQuote = "'";
var charSpace = " ";
var charSquareBrackets = "[]";
var charUnderscore = "_";
var charX = "xX";               //these characters are used for route pattern
var charN = "N";                //these characters are used for route pattern
var charPound = "#";            //these characters are used for route pattern
var charAtSign = "@";           //these characters are used for route pattern
var charPrefixDigits = "[+]";   //these characters are used for route pattern
var charSufixDigits = "!";

var maskAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";  // base ASCII chars only
var maskNumeric = "1234567890";
var maskHexDigits = "0123456789abcdefABCDEF";
var maskAlphaNumeric = maskAlpha + maskNumeric;
var maskMACAddress = maskHexDigits;
var maskIPAddress = maskNumeric + charDot;
var maskDate = maskNumeric + charForwardSlash;

// Masks for validating characters in DNs and Patterns
var maskRangeNotation = "[^-]";                                             // allowable range or set of chars
var maskMultiChar = "+?";                                                   // 0 or more, 1 or more of preceeding char/range

var maskNumericDigits = maskNumeric;                                        // 0-9
var maskAllDigits = maskNumericDigits + charAsterisk + charPound;           // 0-9 *#
var maskMask = maskAllDigits + charX;                                       // 0-9 *# X
var maskPattern = maskMask + maskRangeNotation + maskMultiChar + charBang;  // 0-9 *# X [^-] +? !
var maskAtPattern = maskPattern + charDot + charAtSign;                     // 0-9 *# X [^-] +? ! .@

var flgInProcess = false;       // used to prevent multiple calls to same remote scripting function

//
// functions to produce standard error message for common validation
//

function displayDeviceDNDependencies(deviceName, dependencies)
{
    var msg = jsMsgDNDependency.replace(/@/, deviceName).toString();
    var list = "";
    for (var i = 0; i < dependencies.length; i++)
    {
      list += dependencies[i].dn;
      list += (dependencies[i].partition) ? ("/" + dependencies[i].partition) : "";
      list += jsMsgUsedin + dependencies[i].pilot + "\n";
    }
    alert( msg.replace(/%list%/, list).toString() );
    return;
}

function getDeleteFailedInUseMessage(itemName, fromList)
{
  var msg;
  if (fromList)
  {
    // message for delete failed from Find/List page
    msg = jsErrDeleteInUse_List.replace(/@/g, itemName).toString();
  }
  else
  {
    // message for delete failed from configuration page
    msg = jsErrDeleteInUse.replace(/@/g, itemName).toString();
  }
  return msg;
}

function getIsDuplicateNameMessage(duplicateName, itemName)
{
  if (!itemName)
    itemName = lblAnItem;
    
  var msg = jsErrDuplicate.replace(/@/, itemName).toString();
  return msg.replace(/#/, duplicateName).toString();
}

function getIsRequiredMessage(name)
{
  return jsErrIsRequired.replace(/@/gi, name).toString();
}

function getIsTooLongMessage(name, len)
{
 var msg = jsErrIsTooLong.replace(/@/gi, name).toString();
 return msg.replace(/#/, len).toString();
}

function getOutOfRangeMessage(name, min, max)
{
 var msg = jsErrOutOfRange.replace(/@/gi, name).toString();
 msg = msg.replace(/#/, min).toString();
 return msg.replace(/%/, max).toString();
}

function getNamedCharTests()
{
  var tests = new Array();
  var count = 0
  tests[count++] = { mask: maskHexDigits, friendlyName: "hexadecimal numbers", expression: maskHexDigits };
  tests[count++] = { mask: maskAlpha, friendlyName: "letters", expression: maskAlpha };
  tests[count++] = { mask: maskNumeric, friendlyName: "numbers", expression: maskNumeric };
  tests[count++] = { mask: charX, friendlyName: "the letter X", expression: charX };
  tests[count++] = { mask: charSpace, friendlyName: "spaces", expression: charSpace };
  tests[count++] = { mask: charDash, friendlyName: "dashes", expression: "\\-" };
  tests[count++] = { mask: charDot, friendlyName: "dots (periods)", expression: charDot };
  tests[count++] = { mask: charComma, friendlyName: "commas", expression: charComma };
  tests[count++] = { mask: charUnderscore, friendlyName: "underscores", expression: charUnderscore };
  
  tests[count++] = { mask: charAmpersand, friendlyName: "ampersand (&)", expression: charAmpersand };
  tests[count++] = { mask: charBraces, friendlyName: "braces ({})", expression: charBraces };
  tests[count++] = { mask: charBrackets , friendlyName: "less than or greater than (<>)", expression: charBrackets };
  tests[count++] = { mask: charPercent, friendlyName: "percent sign (%)", expression:   charPercent };
  tests[count++] = { mask: charDoubleQuote, friendlyName: "double quotes (\")", expression: charDoubleQuote };
  tests[count++] = { mask: charSingleQuote, friendlyName: "single quote (')", expression: charSingleQuote };
 
  return tests;
}

function getValidStringMessage(mask, displayName)
{
  var friendlyNames = "";
  var namedCharacters = "";
  var namedCharTests = getNamedCharTests();
  var charSets = new Array();
  var lastCharSet;
    
  for (var i=0; i< namedCharTests.length; i++)
  {
    if (mask.indexOf(namedCharTests[i].mask) != -1)
    {
      // mask contains this named set of characters
      if (lastCharSet)
        { charSets[charSets.length] = lastCharSet; }
      lastCharSet = namedCharTests[i].friendlyName;
    }
    namedCharacters += namedCharTests[i].expression;
  }
    
  var reCharsNotTested = new RegExp("[^" + namedCharacters + "]","gi");
  var arrayOtherValidChars = mask.match(reCharsNotTested);
  if (arrayOtherValidChars)
  {
      if (lastCharSet)
        { charSets[charSets.length] = lastCharSet; }
      lastCharSet = msgOtherValidChars + arrayOtherValidChars.join(" ");
  }
    
    
  // create friendly name string for named characters
  if (charSets.length > 0)
    friendlyNames = charSets.join(", ") + msgConjunction + lastCharSet;
  else
    friendlyNames = lastCharSet;
    
  var msg = msgValidCharacters.replace(/@/gi, displayName).toString();
  msg = msg.replace(/#/, friendlyNames).toString();
  if (!arrayOtherValidChars) msg += charDot;  // add a period if only named sets are present
    
  return msg;
}

// This is a copy of getvalidStringMessage.

function getInvalidStringMessage(mask, displayName)
{
  var friendlyNames = "";
  var namedCharacters = "";
  var namedCharTests = getNamedCharTests();
  var charSets = new Array();
  var lastCharSet;
    
  for (var i=0; i< namedCharTests.length; i++)
  {
    if (mask.indexOf(namedCharTests[i].mask) != -1)
    {
      // mask contains this named set of characters
      if (lastCharSet)
        { charSets[charSets.length] = lastCharSet; }
      lastCharSet = namedCharTests[i].friendlyName;
    }
    namedCharacters += namedCharTests[i].expression;
  }
    
  var reCharsNotTested = new RegExp("[^" + namedCharacters + "]","gi");
  var arrayOtherInvalidChars = mask.match(reCharsNotTested);
  if (arrayOtherInvalidChars)
  {
      if (lastCharSet)
        { charSets[charSets.length] = lastCharSet; }
      lastCharSet = msgOtherValidChars + arrayOtherInvalidChars.join(" ");
  }
    
    
  // create friendly name string for named characters
  if (charSets.length > 0)
    friendlyNames = charSets.join(", ") + msgConjunction + lastCharSet;
  else
    friendlyNames = lastCharSet;
    
  var msg = msgInvalidCharacters.replace(/@/gi, displayName).toString();
  msg = msg.replace(/#/, friendlyNames).toString();
  if (!arrayOtherInvalidChars) msg += charDot;  // add a period if only named sets are present
    
  return msg;
}


// function isValidString:
//   checks the contents of a string (s) to make sure all characters 
//   are in the set of specified valid characters (validChars).
// Takes as input:
//   s - the string to validate. An empty string is always valid.
//   mask - the list of valid characters, which can include letters, number, symbols, 
//          etc. Use the string validation character sets above to construct the mask.
//   displayName - (optional) name of the field being validated; if supplied, the function
//                displays standard validation error message using displayName.
// Returns:
//   Boolean - true if all characters in s are valid, or if s is empty; false if any 
//   characters in s are not in the specified valid character set.
//
function isValidString(s, mask, displayName, isRequired)
{
  if ( (typeof(s) == "string") && (s.length > 0) )
  {
    for (var i = 0; i < s.length; i++)
    {
      if (mask.indexOf(s.charAt(i)) == -1)
      {
        if (displayName)
        {
          alert(getValidStringMessage(mask, displayName));
        }
        return false;                       // a character was found that is not valid
      }
    }
  }
  else if (isRequired && displayName)
  {
    alert(getIsRequiredMessage(displayName));
    return false;
  }
  return true;                              // all characters in the string were valid
}


// function isValidStringData:
//   same as isValidString, but accepts element object as first parameter, and
//   takes care of error messages and selecting element on error condition.
// Takes as input:
//   el - the text element to validate (INPUT type="text").
//   mask - the list of valid characters, which can include letters, number, symbols, 
//          etc. Use the string validation character sets above to construct the mask.
//   displayName - (optional) name of the field being validated; if supplied, the function
//                displays standard validation error message using displayName.
//   maxLength - the maximum number of characters allowed in the string
//   isRequired - whether or not to allow zero-length string
// Returns:
//   Boolean - true if all characters in el.value are valid, or if el.value is empty string; 
//   false if any characters in el.value are not in the specified valid character set.
//
function isValidStringData(el, mask, displayName, maxLength, isRequired)
{
  if (!el.type.match(/text|textarea|hidden|password/))
  {
    msg = jsErrInputNotString.replace(/%S1/, el.name).toString();
    showValidationError(el, msg.replace(/%S2/, el.type).toString(), 0);
    return false; // not text data
  }
  
  var s = jTrim(el.value);
  el.value = s;

  if (!maxLength)
    maxLength = 255;
  
  if (s.length > 0)
  {
    if (s.length > maxLength)
    {
      showValidationError(el, getIsTooLongMessage(displayName, maxLength), 1);
      return false;
    }
    
    if (!isValidString(s, mask, displayName))
    {
      el.focus();
      el.select();
      return false;
    }
  }
  else if (isRequired)
  {
    showValidationError(el, getIsRequiredMessage(displayName), 0);
    return false;
  }

  return true;
}


function isValidDNOrPattern(pattern, type)
{
  //
  // !!! Remote Scripting must be enabled on any page that calls this function !!!
  //
  
  // optional third parameter "fieldName"
  var fieldName;
  
  if (isValidDNOrPattern.arguments.length == 3)
    fieldName = isValidDNOrPattern.arguments[2];
  
  var rs_result = RSExecute("_RemoteScripts/rs_numplan.asp", "isValidPatternSyntax", type, pattern);
  var err = getSafeReturnValue(rs_result);
  if (err)
  {
    alert(((fieldName) ? fieldName + ":\n" : "") + err);
    return false;
  }
  return true;
}

// function isValidTextData:
//   validates the contents of a Description field to make sure restricted characters 
//   are not used (angle brackets, square brackets, ampersand, double quote and percent).
// Takes as input:
//   el - the form element to validate (assumes a description, but can be any text input).
//   maxLength - maximum number of characters to accept.
//   displayName - (optional, string) name of the field being validated. Description is the default. 
// Returns:
//   Boolean - true if all characters in elDescription.value are valid, or if elDescription is empty; 
//   false if any invalid (restricted) characters are present in elDescription.value.
//
function isValidTextData(el, maxLength, displayName, isRequired, invalidString)
{
  if (invalidString)
    {
    var invalidChars = invalidString;
    }
  else
    { 
    var invalidChars = charDoubleQuote + charPercent + charBrackets + charSquareBrackets + charAmpersand;
    }
  var s = jTrim(el.value);
  el.value = s;
  if (!displayName) displayName = lblDescription;
  
  
  if (s.length > 0)
  {
    if ( (maxLength) && (s.length > maxLength) )
    {
      showValidationError(el, getIsTooLongMessage(displayName, maxLength), 1);
      window.status = jsStatusError;
      return false;
    }
    
    for (var i = 0; i < s.length; i++)
    {
      if (invalidChars.indexOf(s.charAt(i)) != -1)
      {
          if (!invalidString)
          {
            showValidationError(el, jsErrInvalidDescription.replace(/@/gi, displayName), 1);
           } 
          else
          {
            var msg = getInvalidStringMessage(invalidChars, displayName)
            showValidationError(el, msg , 1);
          }
        window.status = jsStatusError;
        return false;
      }
    }
  }
  else if (isRequired)
  {
    showValidationError(el, getIsRequiredMessage(displayName), 0);
    window.status = jsStatusError;
    return false;
  }
  return true;  // all characters in the string were valid
}

// function isDataInRange:
//   validates the contents of a numeric data field to make sure entered value falls 
//   within the specified range.
// Takes as input:
//   el - the form element to validate (assumes a description, but can be any text input).
//   displayName - name of the field being validated, used in alert on error.
//   maxLength - the maximum number of digits in the entry
//   minVal - the lower bound of the valid range
//   maxVal - the upper bound of the valid range 
// Returns:
//   Boolean - true if the value is within the range, or if it is empty and not required;
//             false if the value is out of range, too long, or missing when required.
//
function isDataInRange(el, displayName, maxLength, minVal, maxVal, isRequired)
{
  window.status = jsStatusValidating;
  var s = jTrim(el.value);
  el.value = s;
    
  if (s.length == 0)
  {
    if (isRequired)
    {
      showValidationError(el, getIsRequiredMessage(displayName), 0);
      return false;
    }
    else
      return true;
  }
    
  if (!isValidString(s, maskNumeric, displayName))
  {
    el.focus();
    el.select();
    return false;
  }
    
  if ( (Number(s) < minVal) || (Number(s) > maxVal) )
  {
    showValidationError(el, getOutOfRangeMessage(displayName, minVal, maxVal), 1);
    return false;
  }
  
  // not really needed given prior tests which require an integer, but kept for backward compatibility
  if (s.length > maxLength)
  {
    showValidationError(el, getIsTooLongMessage(displayName, maxLength), 1);
    return false;
  }
    
  // not really needed given prior tests which require an integer, but kept for backward compatibility
  if (s.length > maxLength)
  {
    showValidationError(el, getIsTooLongMessage(displayName, maxLength), 1);
    return false;
  }
    
  window.status = "";
  return true;
    
}

// function confirmDelete:
//   prompts user to confirm that they want to delete the specified item.
// inputs:
//   item - a description of the type of item being deleted. For example, if 
//     you are deleting a Device Pool, use "Device Pool". The user will see this 
//     in the prompt ("You are about to permanently delete this Device Pool...").
// returns:
//     Boolean - true if the user clicks Yes (continue); false if the user clicks No.
//
function confirmDelete(item)
{
  if (confirm(msgDeleteConfirm.replace(/@/, item)))
    return true;
  else
    return false;
}

// function jLTrim:
//   javascript version of VBScript LTrim function
// inputs:
//   s - a string object
// returns:
//   s with leading spaces removed
//
function jLTrim(s)
{
  if (typeof(s) == "string")
  {
    while ((s.length > 0) && (s.charAt(0) == " "))
    {
      s = s.substring(1, s.length)
    }
  }
  return s;
}

// function jRTrim:
//   javascript version of VBScript RTrim function
// inputs:
//   s - a string object
// returns:
//   s with trailing spaces removed
//
function jRTrim(s)
{
  if (typeof(s) == "string")
  {
    while ((s.length > 0) && (s.charAt(s.length -1) == " "))
    {
      s = s.substring(0, s.length - 1)
    }
  }
  return s;
}

// function jTrim:
//   javascript version of VBScript Trim function
// inputs:
//   s - a string object
// returns:
//   s with leading and trailing spaces removed (spaces within string remain intact)
//
function jTrim(s)
{
  if (typeof(s) == "string")
    s = jRTrim(jLTrim(s));
  return s;
}

// function getBaseURL
//   utility function to get the virtual root for the project
// inputs:
//   none
// returns:
//   the base URL (virtual root) of the Cisco CallManager Admin web
//
function getBaseURL()
{
    var secondSlash, path;
    var projectBase = '';
    if ((secondSlash = (path = window.location.pathname).indexOf('/',1)) != -1) {
      projectBase = path.substring(0,secondSlash);
    }
    return projectBase;
}

function showErrorMessage(data)
{
  // since IE and NN handle window positioning differently, do browser specific options
  if (document.all)
    var options = "status,resizable,scrollbars,top=" + (window.screenTop + 50) + ",left=" + (window.screenLeft + 150) + ",width=500,height=350";
  else if (document.layers)
    var options = "status=yes,resizable=yes,scrollbars=yes,screenY=" + (window.screenY + 100) + ",screenX=" + (window.screenX + 150) + ",width=500,height=350";

  var errWin = window.open('','errWin', options);
  errWin.document.open();
  errWin.document.write('<HTML>\n');
  errWin.document.write('<HEAD>\n');
  errWin.document.write('<TITLE>' + lblRemoteScriptingError + '</TITLE>\n');
  errWin.document.write('<LINK rel="stylesheet" href="' + getBaseURL() + '/styles/basic.css" type="text/css">\n');
  errWin.document.write('</HEAD>\n');
  errWin.document.write('<BODY class="secondary">\n');
  errWin.document.write('<H4><FONT color="#800000">' + lblErrorInfo + '</FONT></H4>\n');
  errWin.document.write(data);  // user supplied HTML data
  errWin.document.write('<DIV align="center"><FORM><INPUT type="button" value="' + lblClose + '" onClick="javascript: self.close()" id=button1 name=button1></FORM></DIV>\n');
  errWin.document.write('</BODY>\n');
  errWin.document.write('</HTML>');
  errWin.document.close();
  errWin.focus();
}

function rsCallSuccessful(rs_result)
{
  if (rs_result.status == 0) return true;
  
  var data = '<P>' + rs_result.message + '</P>\n';
  data += '<H4>' + lblDetails + ':</H4>\n';
  data += '<P>' + unescape(rs_result.data) + '</P>';
  showErrorMessage(data);
  return false;
}

function showDBLError(DBLErr)
{
  var data = '';
  if (DBLErr.dblNumber)
  {
    data += '<P><SPAN style="font-size: 10pt;">' + DBLErr.dblDescription + ' ';
    data += (DBLErr.context) ? DBLErr.context + ' ' : '';
    data += '(' + DBLErr.dblNumber + ')</SPAN></P>\n';
  }
  if (DBLErr.source)
  {
    data += '<H4>' + lblSource + ':</H4>\n';
    data += '<P>' + DBLErr.source + '</P>\n';
  }
  data += '<H4>' + lblDetails + ':</H4>\n';
  data += '<P>' + jsMsgErrorNo + DBLErr.number + ' (0x' + DBLErr.hexNumber + '):<BR>\n'
  data += DBLErr.description + '</P>\n';
  
  showErrorMessage(data);
}

// function getSafeReturnValue
//   utility function to convert remote scripting return values to
//   useful values
// inputs:
//   rs_result - the result object from a remote scripting call
// returns:
//   the return_value property of the remote scripting result object, with
//   "undefined" converted to the JavaScript undefined value if needed;
//   if errors occur on the remote scripting page, the actual error message
//   from the page is shown in a separate browser window.
//  
function getSafeReturnValue(rs_result)
{
  // utility routine for remote scripting
  var isUndefined;
  if (rs_result.status == -1)
  {
    var errWin = window.open('','errWin','height=300,width=500');
    errWin.document.write(rs_result.data);
    errWin.focus();
  }
    
  // convert string "undefined" to value undefined
  if (rs_result.return_value == "undefined")
    return isUndefined;
  else
    return rs_result.return_value;
}


// function getElement:
//   utility for accessing form elements
// inputs:
//   formName - name of the form (string) containing the element
//   elName - name of the element to get
// returns:
//   specified element, if it exists; null if element doesn't exist;
//
function getElement(formName, elName)
{
  el = eval('document.' + formName + '.' + elName);
  if (typeof(el) == "object")
    return el;
  else
    return null;
}

// function getValue:
//   utility to get the value of any form element
// inputs:
//   el - the form element object
// returns:
//   value of the element object, or null if there is no
//   value defined for the element; in the case of multi-select
//   lists, returns an array of selected values;
//
function getValue(el)
{
  var isUndefined;
  
  if (!el) return isUndefined;    // element (el) doesn't exist
  
  // gets the specified elements value based on type
  switch (el.type)
  {
    case "select-one":
    {
      //if the combobox is empty then just return null
          if(el.selectedIndex < 0) {
                return null;
          }
      return el.options[el.selectedIndex].value;
    }
    case "select-multiple":
    {
      var hr = new Array();
      for (var i = 0; i < el.options.length; i++)
      {
        if (el.options[i].selected)
        {
          hr[hr.length] = el.options[i].value;
        }
      }
      return hr;  // array of selected values!
    }
    case "radio":
    {
      var buttonGroup = el.form.elements[el.name];

      if (typeof(buttonGroup.value) != "undefined")
        return buttonGroup.value;
      else
      {
        for (var i = 0; i < buttonGroup.length; i++)
        {
          if (buttonGroup[i].checked)
            return buttonGroup[i].value;
        }
      }
      return null;
    }
    case "checkbox":
    {
      if (el.checked)
        return el.value;
      else
        return null;
    }
    case "undefined":
    {
      return null;
    }
    default:
    {
      return el.value;
    }
  }
}

// function setValue:
//   utility to set the value of any form element
// inputs:
//   formName - the name of the form object (object is not required)
//   elNameOrID - the name or unique ID of the element; unique ID is required if
//                the target element is a radio button in a group
//   newValue - the value to set for the form element
// returns:
//   result - true if the value was set, false if not; for non-text elements (checkbox,
//            radio, select), and the selection state of the element is changed to true
//            if new value matches an existing value, or false if the values don't match
//   
function setValue(formName, elNameOrID, newValue)
{
  var el = eval('document.' + formName + '.' + elNameOrID);
  if (typeof(el) == "object")
    var type = el.type;
  else
    return false;
      
  switch (type)
  {
    case "checkbox":
    case "radio":
    {
      if (el.value == newValue)
        el.checked = true;
      else
        el.checked = false;
      return true;
    }

    case "select-one":
    case "select-multiple":
    {
      // sets the new value of the specified select list form element
      for (var i = 0; i < el.options.length; i++)
      {
        if (el.options[i].value == newValue)
        {
          el.selectedIndex = i;
          return true;
        }
      }
      return false;
    }

    default:
    {
      // sets the new value of the specified text or hidden form element
      el.value = newValue;
      return true;
    }
  }
}

// function selectItemByValue:
//   selects an item in a select list using a specified value.
// Takes as input:
//   elSelectList - the selectList object by name/ID
//   newValue - the value to be selected
// Returns:
//   nothing - if the value is found that item is selected
//             otherwise the list is not changed
//
function selectItemByValue(elSelectList, newValue)
{
  if (!newValue)
    return;
      
  for (var i = 0; i < elSelectList.length; i++)
  {
    if (elSelectList.options[i].value == newValue)
    {
      elSelectList.selectedIndex = i;
      break;
    }
  }
  return;
}

// function selectItemByText:
//   selects an item in a select list using a text value. 
// Takes as input:
//   elSelectList - the selectList object by name/ID
//   newText - the text (display) string value to be selected
// Returns:
//   nothing - if the value is found that item is selected
//             otherwise the list is not changed
//
function selectItemByText(elSelectList, newText)
{
  if (newText.length == 0)
    return;
      
  for (var i = 0; i < elSelectList.length; i++)
  {
    if (elSelectList.options[i].text.toLowerCase() == newText.toLowerCase())
    {
      elSelectList.selectedIndex = i;
      break;
    }
  }
  return;
}

// function selectItemByPartialText:
//   selects an item in a select list if it starts with a specified string (partial text). 
// Takes as input:
//   elSelectList - the selectList object by name/ID
//   partialText - the partial text string to match against
// Returns:
//   nothing - if the partial text is found, the first item starting with that string is selected, 
//             otherwise the first item greater than the partial text is selected
function selectItemByPartialText(elSelectList, partialText)
{
  var strOption, strMatch;  //holds temp strings
      
  if (partialText.length == 0)
    return;
  else
    strMatch = partialText.toLowerCase();  // make match case-insensitive
      
  for (var i = 0; i < elSelectList.length; i++)
  {
    strOption = elSelectList.options[i].text.toLowerCase();
    // stop if exact match is found, or if the partial text is less than the current option text (no further match possible)
    if ( (strOption.indexOf(strMatch) == 0) || (strMatch < strOption.substring(0, strMatch.length)) )
    {
      elSelectList.selectedIndex = i;
      break;
    }
  }
  return;
}


// function selectOptionByValue:
//   selects a radio button from a group of radio buttons using a value. 
// Takes as input:
//   buttonGroup - the radio button group name
//   newValue - the value of the button to selected
// Returns:
//   nothing - if the value is found that button is selected
//             otherwise the button group is not changed
//
function selectOptionByValue(buttonGroup, newValue)
{
  for (var i = 0; i < buttonGroup.length; i++)
  {
    if (buttonGroup[i].value == newValue)
    {
      buttonGroup[i].checked = true;
      break;
    }
  }
  return;
}

// 
// Utility functions for moving items between lists
//
function _switchItems(list, a, b)
{
  var optionA = { text: list.options[a].text, value: list.options[a].value };
  var optionB = { text: list.options[b].text, value: list.options[b].value };
    
  list.options[a].text = optionB.text;
  list.options[a].value = optionB.value;

  list.options[b].text = optionA.text;
  list.options[b].value = optionA.value;
    
}

function moveSelectedItem(fromList, toList)
{
  if (fromList.selectedIndex == -1)
    { return; }
  
  var fromSelectedIndex, toSelectedIndex, itemValue, itemText, itemIndex;
  while (fromList.selectedIndex != -1)
  {
    fromSelectedIndex = fromList.selectedIndex;
    toSelectedIndex = toList.selectedIndex;
      
    itemValue = fromList.options[fromSelectedIndex].value;
    itemText = fromList.options[fromSelectedIndex].text;
    itemIndex = toList.length;
    toList.options[itemIndex] = new Option(itemText, itemValue);
      
    // if there is a selection in toList, move new item after selection
    fromList.options[fromSelectedIndex] = null;
    if (toSelectedIndex != -1)
    {
      while (toSelectedIndex < itemIndex - 1)
      {
        _switchItems(toList, itemIndex, --itemIndex);
      }
    toList.selectedIndex = itemIndex;
    }
  }
  toList.focus();
  return;
}
  
function moveSelectedItemUp(list)
{
  if (list.selectedIndex < 1)
    { return; }
      
  _switchItems(list, list.selectedIndex, list.selectedIndex - 1);
  list.selectedIndex = list.selectedIndex - 1;
}
  
function moveSelectedItemDown(list)
{
  if ( (list.selectedIndex == -1) || (list.selectedIndex == list.length - 1) )
    { return; }
  
  _switchItems(list, list.selectedIndex, list.selectedIndex + 1);
  list.selectedIndex = list.selectedIndex + 1;
}

function reverseListOrder(list)
{
  var tempList = new Array();
  var item;
  for (var i=0; i< list.length; i++)
  {
    item = new Object();
    item = {val: list.options[i].value, txt: list.options[i].text};
    tempList[i] =  item; 
  }
   
  var j=list.length-1; 
  for (var i=0;i < list.length; i++)
  {
    list.options[i].value = tempList[j].val;
    list.options[i].text = tempList[j].txt;
    j--;
  }
}
  

// function setIESelectWidth:
//   Changes the width of select lists (drop-downs) in IE to be at 
//   least a specified width.
// Takes as input:
//   thisForm - the form containing elements to be updated
//   widhtInPixels - the minimum width to apply to select elements in the form
// Returns:
//   nothing
//
function setIESelectWidth(thisForm, widthInPixels)
{
  var width;
  if ((thisForm) && (document.all))
  {
    for (var i = 0; i < thisForm.length; i++)
    {
      el = thisForm.elements[i];
      if ((el.type == "select-one") || (el.type == "select-multiple"))
      {
        if (el.minWidth)
          width = el.minWidth;
        else
          width = widthInPixels;
        
        if ((el.offsetWidth - el.offsetLeft) < Number(width))
          el.style.width = width + "px";
      }
    }
  }
  return;
}
  

// function showValidationError:
//   Display an alert message for invalid data, and put focus on the 
//   element that has the error. Optionally select the error value.
// Takes as input:
//   el - the element that you want to get focus (usually the element that
//        contains the error, but not always)
//   msg - message that you want displayed in a JavaScript alert dialog.
//   doSelect - 1 = select the data in el (usually only needed for text); 0 = don't do select
// Returns:
//   nothing - pops up alert dialog and sets window.status to generic error message
//
function showValidationError(el, msg, doSelect)
{
  alert(msg);
  el.focus();
  if (doSelect) el.select();
  status = jsStatusError;
}

// **** DEPRECATED: Use showDetailPage() instead ****
// function showDevicePoolDetail:
//   Display the settings for the currently selected Device Pool 
//   in a secondary window
// Takes as input:
//   pkid = the pkid of the Device Pool to display
// Returns:
//   nothing - opens a new browser window and shows the device pool settings
//
function showDevicePoolDetail(devicePoolID)
{
  // Display the settings for the currently selected Device Pool 
  // in a secondary window;
  var detailsURL = "devicePoolDetail.do?key=" + devicePoolID;

  var options = "resizable=yes,height=510,width=600,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,width=500,height=510,top=200,left=300";

  var w = window.open(detailsURL, "dpDetailWin", options);
  w.focus();
}

// function showDetailPage:
//   Display the settings for the currently selected Device Pool 
//   in a secondary window
// Takes as input:
//   action = the action that will display the page
//   pkid = the pkid of the particular object you want to show 
// Returns:
//   nothing - opens a new browser window and shows a details page
//
function showDetailPage(action, pkid)
{
  // Display the settings for the currently selected object 
  // in a secondary window;
  var detailsURL = action + "?setToken=0&key=" + pkid;

  var options = "resizable=yes,height=510,width=600,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,width=500,height=510,top=200,left=300";

  var w = window.open(detailsURL, "detailsWin", options);
  w.focus();
}

// function showPhoneTemplateDetail:
//   Display the settings for the currently selected Phone Template 
//   in a secondary window; shows selected feautes and button positions.
// Takes as input:
//   pkid = the pkid of the phone template to display
// Returns:
//   nothing - opens a new browser window and shows the template layout
//
function showPhoneTemplateDetail(pkid)
{
  var detailsURL = "phonetemplatedetail.asp?pkid=" + pkid;

  // since IE and NN handle window positioning differently, do browser specific options
  if (document.all)
    var options = "resizable=yes,top=" + (window.screenTop) + ",left=" + (window.screenLeft + 200) + ",width=300,height=520";
  else if (document.layers)
    var options = "resizable=yes,screenY=" + (window.screenY + 25) + ",screenX=" + (window.screenX + 250) + ",width=300,height=500";

  var w = window.open(detailsURL, "ptDetailWin", options);
  w.focus();
}

// function showDNDetail:
//   Display and update directory number settings for the currently phone, AS-x gateway
//   or POTS port in a secondary window; shows selected feautes and button positions.
// Takes as input:
//   url - a url containing either the NumPlanMapID of the DN information to update, or
//         a DeviceID and NumPlanIndex to use when inserting a DN for the device.
// Returns:
//   nothing - opens a new browser window and shows the DN configuration page
//
function showDNDetail(url)
{
  // since IE and NN handle window positioning differently, do browser specific options

  if (document.all)
    var options = "status,resizable,scrollbars,top=" + (window.screenTop - 90) + ",left=" + (window.screenLeft + 200) + ",width=560,height=555";
  else if (document.layers)
    var options = "status=yes,resizable=yes,scrollbar=yes,screenY=" + (window.screenY + 5) + ",screenX=" + (window.screenX + 205) + ",width=565,height=555";

  if (!dnWin)
  {
    var d = new Date();
    dnWin = d.getTime().toString();
  }
  
  var w = window.open(url, dnWin, options);
}
var dnWin; // used to manage windows
  
// function editDN:
//   used to call showDNDetail by NumPlanMapID
//
function editDN(numPlanMapID)
{
  //showDNDetail("directorynumber.asp?NumPlanMapID=" + numPlanMapID);
  self.location = "directorynumber.asp?NumPlanMapID=" + numPlanMapID;
}
  
// function insertDNDetail:
//   used to call showDNDetail by DeviceID and NumPlanIndex
//
function insertDN(deviceID, numPlanIndex)
{
  // showDNDetail("directorynumber.asp?DeviceID=" + deviceID + "&NumPlanIndex=" + numPlanIndex);
  self.location = "directorynumber.asp?DeviceID=" + deviceID + "&NumPlanIndex=" + numPlanIndex;
}

// function ResetSelected:
//   calls the resetDevice for initiating reset or restart of one or more devices
// Takes as input:
//   index - The index of the column holding the pkid value
//   type - Type of reset requested
//   errorMessage - error message for when/if user does not select any checkboxes.
// Returns:
//   nothing
//
function resetSelected(index, type, errorMessage) {
    var els = document.forms[0].elements;
    var numCheckboxes = -1;
    var resetCtr = 0;
    var pkidList = new Array(1);
  
    // scan checkboxes for selected rows
    for (var i = 0; i < els.length; i++)
    {
        if (els[i].type == "checkbox") {
            // only concerned about checkboxes in the result table.
            if (els[i].name.indexOf("result") == 0) {
                numCheckboxes++;
                    if (els[i].checked) {
                    // extract the hidden values for this row from form
                    var elValue = "result[" + numCheckboxes + "].col[" + index + "].stringVal";
                    pkidList[resetCtr] = els[elValue].value;
                    resetCtr++; 
                }
            }
        }
     } 
     if (resetCtr > 0) {
         //call the reset method passing in the pkid list 
         resetDevice(pkidList, type);
     } 
     else {
         alert(errorMessage);
     }
}

// function resetDevice:
//   calls the reset.do action for initiating reset or restart of one or more devices
// Takes as input:
//   Pkid - One or more pkids for device(s) to reset/restart; multiple pkids should be separated
//           by commas (as separate arguments for the function)
//   Type - Type of reset requested.  NOTE: If type is not passed in, the popup window
//            will show both a reset and a restart button and the user will have to choose
//            which type of reset signal to send.
// Returns:
//   nothing - displays secondary window with prompts and messages
//
function resetDevice() {
	var pkid;
  	var path = getBaseURL();
  	var url = path + "/reset.do";
  	var formPostFlag = false;
  	var f = document.forms[1];
  	if (typeof(resetDevice.arguments[0]) == "object") {
  		formPostFlag = true;
		var pkidList = resetDevice.arguments[0];
    	f.pkid.value = pkidList.join(":");
  	}
  	else {
    	for (var i = 0; i < resetDevice.arguments.length; i++) {
    		pkid = resetDevice.arguments[i];
    		url += ((i > 0) ? "&pkid=" : "?pkid=") + pkid;
    	}
  	}
  	var supportedReset = "&supportedReset=";
  	if (resetDevice.arguments[1] == "undefined") {
      	supportedReset += "0";
  	}
  	else {
    	supportedReset = resetDevice.arguments[1];
  	}
  	
  	// set supportedReset value in form to post
  	if (formPostFlag) {
  		f.supportedResetType.value = supportedReset;
  	}
  	
  	var options = "resizable=yes,height=450,width=650,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300";
  
  	if (formPostFlag) {
  		doFormPost(f, options);
  	}
  	else {
	  	url += "&type=" + resetDevice.arguments[1] + "&supportedResetType=" + supportedReset;
  		window.open(url, "resetWin", options);
  	}
}

// function doFormPost
// Opens a new window and waits for the window to open 
// and then submits a form.
// Takes as input:
//		options - window options for opening new window
//	Returns:
//		nothing - displays secondary window with prompts and messages
function doFormPost(formObject, options) {
	var oNewWin = window.open("", "newTarget", options);
  	while(!oNewWin.document) {
    	//Wait for window to open
  	}
  	formObject.submit();
}

// function doMultiDeviceRestart:
//   calls the resetMultiple.do action for initiating reset or restart of one or more devices
//       associated with a table.  eg. DevicePool or CallManager
// Takes as input:
//   tableID - name of table pkid is in
//   pkid - pkid of the associated item 
//   affectedDevices - number of devices that will be reset
//   type - Type of reset requested.  NOTE: If type is not passed in, the popup window
//            will show both a reset and a restart button and the user will have to choose
//            which type of reset signal to send.
// Returns:
//   nothing - displays secondary window with prompts and messages
//
function doMultiDeviceRestart(tableID, pkid, affectedDevices)
{ 
  if (affectedDevices > 0)
  {
        var path = getBaseURL();
        var url = path + "/resetMultiple.do?tableid=" + tableID + "&pkid=" + pkid + "&affectedDevices=" + affectedDevices + "&supportedResetType=" + doMultiDeviceRestart.arguments[3];
        var options = "resizable=yes,height=450,width=650,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300";
  
        window.open(url, "resetWin", options);  
  }
  else
  {
    alert(msgMultiDeviceResetNoDevices);
  }
}

// function isDuplicateName:
//   uses remote scripting to check for device of specified type with specified name
// Takes as input:
//   type - type of object to check. E.g., CallManager, Location, RoutePartition;
//          must be a user defined type (not an Enum) with SelectByName method. Can
//          also be used for Device (does SelectByDeviceName).
//   name - the name you want to check
// Returns:
//   true if a device with the specified name is already in the database;
//   false if there are no devices using the name in the specified table.
//
function isDuplicateName(type, name)
{
  //
  // !!! Remote Scripting must be enabled on pages calling this function !!!
  //
  if (type != "Device")
  {
    var scriptSource = getBaseURL() + "/_RemoteScripts/rs_common.asp";
    var rs_result = RSExecute(scriptSource, "isDuplicateName", type, name);
  }
  else  // Device uses SelectByDeviceName
  {
    var scriptSource = getBaseURL() + "/_RemoteScripts/rs_device.asp";
    var rs_result = RSExecute(scriptSource, "isDuplicateName", name);
  }
  
  return getSafeReturnValue(rs_result);
  
}

// function macAddressExists:
//   uses remote scripting to check for device names with MAC address conflict
// Takes as input:
//   MAC address of the current device
// Returns:
//   true if a device with the specified MAC address is already in the database;
//   false if there are no devices using the MAC address
//
function getDevicesByMACAddress(MACAddress)
{
  //
  // !!! Remote Scripting must be enabled on pages calling this function !!!
  //
  var scriptSource = getBaseURL() + '/_RemoteScripts/rs_device.asp';
  var rs_result = RSExecute(scriptSource, 'getDevicesByMACAddress', MACAddress);
  
  return getSafeReturnValue(rs_result);
  
}

// function getErrorMessage:
//   uses remote scripting to retrieve the standard error message for DBL or 
//   other errors.
// Takes as input:
//   err - the error object (usually from a try...catch)
// Returns:
//   string - an error message in the format "error message text (error number)" 
//
function getErrorMessage(err)
{
  //
  // !!! Remote Scripting must be enabled on pages calling this function !!!
  //
  var scriptSource = getBaseURL() + '/_RemoteScripts/rs_common.asp';
  
  // strip out return character from Win2K error messages
  err.description = err.description.replace(/\r\n/gi, '').toString();
  
  var rs_result = RSExecute(scriptSource, 'rsGetErrMsg', err.number, err.description);
  
  return rs_result.return_value;
}

function absoluteValue(number)
{
  return Math.abs(number);
}


/*****************************************
*     Added for internationalization
******************************************/

// function langSpecificEncode:
//   converts unicode values to window-125x values (required for Russian)
// inputs:
//   sWide = string to convert, which may or may not contain Unicode characters
// returns:
//   String - input string with extended characters mapped to value in 0-255 range
//            for display using the proper Window-125x character set
//
function langSpecificEncode (sWide)
{
  for (i=0, sSingle=""; i < sWide.length; i++)
  {
    var iCode = sWide.charCodeAt(i);
    if (iCode >= 258 && iCode <= 733)
    {
      iCode = mapUnicodeToLatin2(iCode);  // returns 0x3F (?) for non-Latin2 characters
    }
    else if (iCode >= 900 && iCode <= 974)
    {
      // if mapping to Windows-1253
      if (iCode == 901)       //0x0385
        iCode = 161;          //0xA1
      else if (iCode == 902)  //0x0386
        iCode = 162;          //0xA2
      else
        iCode -= (900-180);   //0x384 -> 0xB4
      //map Greek Unicode to iso-8859-7
      //iCode -= (900-180);
    }
    else if (iCode >= 1040 && iCode <= 1103) 
    { 
      //map Russian Unicode to windows-1251
      iCode -= (1040-192);
    }
    else if (iCode >= 65377 && iCode <= 65439)
    {
      //map Japanese Katakana Unicode to Shift-JIS
      iCode -= (65377-161);
    }
    
    // convert single-byte value back to string
    if (iCode >= 32 && iCode <= 255 )
    {
      sSingle += String.fromCharCode(iCode);
    }
    else
    {
      sSingle += "?";  // not a single-byte, printable character!
    }
  }
  return sSingle;
}

function mapUnicodeToLatin2(iCode)
{
  switch (iCode)
  {
    case 0x0102: iCode = 0xC3; break; // LATIN CAPITAL LETTER A WITH BREVE
    case 0x0103: iCode = 0xE3; break; // LATIN SMALL LETTER A WITH BREVE
    case 0x0104: iCode = 0xA1; break; // LATIN CAPITAL LETTER A WITH OGONEK
    case 0x0105: iCode = 0xB1; break; // LATIN SMALL LETTER A WITH OGONEK
    case 0x0106: iCode = 0xC6; break; // LATIN CAPITAL LETTER C WITH ACUTE
    case 0x0107: iCode = 0xE6; break; // LATIN SMALL LETTER C WITH ACUTE
    case 0x010C: iCode = 0xC8; break; // LATIN CAPITAL LETTER C WITH CARON
    case 0x010D: iCode = 0xE8; break; // LATIN SMALL LETTER C WITH CARON
    case 0x010E: iCode = 0xCF; break; // LATIN CAPITAL LETTER D WITH CARON
    case 0x010F: iCode = 0xEF; break; // LATIN SMALL LETTER D WITH CARON
    case 0x0110: iCode = 0xD0; break; // LATIN CAPITAL LETTER D WITH STROKE
    case 0x0111: iCode = 0xF0; break; // LATIN SMALL LETTER D WITH STROKE
    case 0x0118: iCode = 0xCA; break; // LATIN CAPITAL LETTER E WITH OGONEK
    case 0x0119: iCode = 0xEA; break; // LATIN SMALL LETTER E WITH OGONEK
    case 0x011A: iCode = 0xCC; break; // LATIN CAPITAL LETTER E WITH CARON
    case 0x011B: iCode = 0xEC; break; // LATIN SMALL LETTER E WITH CARON
    case 0x0139: iCode = 0xC5; break; // LATIN CAPITAL LETTER L WITH ACUTE
    case 0x013A: iCode = 0xE5; break; // LATIN SMALL LETTER L WITH ACUTE
    case 0x013D: iCode = 0xA5; break; // LATIN CAPITAL LETTER L WITH CARON
    case 0x013E: iCode = 0xB5; break; // LATIN SMALL LETTER L WITH CARON
    case 0x0141: iCode = 0xA3; break; // LATIN CAPITAL LETTER L WITH STROKE
    case 0x0142: iCode = 0xB3; break; // LATIN SMALL LETTER L WITH STROKE
    case 0x0143: iCode = 0xD1; break; // LATIN CAPITAL LETTER N WITH ACUTE
    case 0x0144: iCode = 0xF1; break; // LATIN SMALL LETTER N WITH ACUTE
    case 0x0147: iCode = 0xD2; break; // LATIN CAPITAL LETTER N WITH CARON
    case 0x0148: iCode = 0xF2; break; // LATIN SMALL LETTER N WITH CARON
    case 0x0150: iCode = 0xD5; break; // LATIN CAPITAL LETTER O WITH DOUBLE ACUTE
    case 0x0151: iCode = 0xF5; break; // LATIN SMALL LETTER O WITH DOUBLE ACUTE
    case 0x0154: iCode = 0xC0; break; // LATIN CAPITAL LETTER R WITH ACUTE
    case 0x0155: iCode = 0xE0; break; // LATIN SMALL LETTER R WITH ACUTE
    case 0x0158: iCode = 0xD8; break; // LATIN CAPITAL LETTER R WITH CARON
    case 0x0159: iCode = 0xF8; break; // LATIN SMALL LETTER R WITH CARON
    case 0x015A: iCode = 0xA6; break; // LATIN CAPITAL LETTER S WITH ACUTE
    case 0x015B: iCode = 0xB6; break; // LATIN SMALL LETTER S WITH ACUTE
    case 0x015E: iCode = 0xAA; break; // LATIN CAPITAL LETTER S WITH CEDILLA
    case 0x015F: iCode = 0xBA; break; // LATIN SMALL LETTER S WITH CEDILLA
    case 0x0160: iCode = 0xA9; break; // LATIN CAPITAL LETTER S WITH CARON
    case 0x0161: iCode = 0xB9; break; // LATIN SMALL LETTER S WITH CARON
    case 0x0162: iCode = 0xDE; break; // LATIN CAPITAL LETTER T WITH CEDILLA
    case 0x0163: iCode = 0xFE; break; // LATIN SMALL LETTER T WITH CEDILLA
    case 0x0164: iCode = 0xAB; break; // LATIN CAPITAL LETTER T WITH CARON
    case 0x0165: iCode = 0xBB; break; // LATIN SMALL LETTER T WITH CARON
    case 0x016E: iCode = 0xD9; break; // LATIN CAPITAL LETTER U WITH RING ABOVE
    case 0x016F: iCode = 0xF9; break; // LATIN SMALL LETTER U WITH RING ABOVE
    case 0x0170: iCode = 0xDB; break; // LATIN CAPITAL LETTER U WITH DOUBLE ACUTE
    case 0x0171: iCode = 0xFB; break; // LATIN SMALL LETTER U WITH DOUBLE ACUTE
    case 0x0179: iCode = 0xAC; break; // LATIN CAPITAL LETTER Z WITH ACUTE
    case 0x017A: iCode = 0xBC; break; // LATIN SMALL LETTER Z WITH ACUTE
    case 0x017B: iCode = 0xAF; break; // LATIN CAPITAL LETTER Z WITH DOT ABOVE
    case 0x017C: iCode = 0xBF; break; // LATIN SMALL LETTER Z WITH DOT ABOVE
    case 0x017D: iCode = 0xAE; break; // LATIN CAPITAL LETTER Z WITH CARON
    case 0x017E: iCode = 0xBE; break; // LATIN SMALL LETTER Z WITH CARON
    case 0x02C7: iCode = 0xB7; break; // CARON
    case 0x02D8: iCode = 0xA2; break; // BREVE
    case 0x02D9: iCode = 0xFF; break; // DOT ABOVE
    case 0x02DB: iCode = 0xB2; break; // OGONEK
    case 0x02DD: iCode = 0xBD; break; // DOUBLE ACUTE ACCENT
    default: iCode = 0x3F;  // unknown character returns "?"
  }
  return iCode;
}

// function changeCharSetCode:
//   rewrites current url to add or replace a "charsetcode" parameter for encoding document
//   and loads the resulting page
// inputs:
//   elCharSet = a form element for character encoding system (e.g., value = "iso-8859-1")
// returns:
//   nothing - the page is reloaded with the new URL
//
function changeCharSetCode(elCharSet)
{
  var path = document.location.pathname;
  var search = document.location.search;
  var key = "charsetcode=";
  var revisedSearch = "";
    
  if (search.length > 0)
  {
    search = search.substring(1, search.length);
    var params = search.split("&");
    for (var i = 0; i < params.length; i++)
    {
      if (params[i].indexOf(key) == -1)
        revisedSearch += "&" + params[i];
    }
  }
  
  var charsetcode = getValue(elCharSet);
  var url = path + "?" + key + charsetcode + revisedSearch;
  document.location = url;
}

// function to get number characters in str that can be URL encoded in query string
function _getChunkSize(s)
{
    var max = 1600;                                                       // max length for spike function
    var e = escape(s);                                                    // URL encoded version of string
    if (e.length <= max)                                                  // compare encoded length to limit
      return s.length                                                     // string can be encoded within limit
    else                                                                  // encoded string too long
      return _getChunkSize(s.substring(0, Math.ceil(s.length/2)), max);   // try again with half the string
}


// Function spike:
//   uses remote scripting to store data as a server variable to be used by 
//   other remotes scripting functions; used to avoid URL too long errors
//   
// Takes as input:
//   varName    - name for the serverVariable that holds the spiked data
//   str        - the data (string) to spike
//   maxLength  - (optional) if supplied, test to see if the maximum length of 
//                URL encoded data exceeds this length, and spike only if it does
// Returns:
//   Boolean - false means the remote scripting call failed before all data was spiked
//
function spike(varName, str, maxLength)
{
  var strEscaped = escape(str);           // URL encoded version of string which may be longer than original
  if (typeof(maxLength) != "undefined")
  {
    if (strEscaped.length <= maxLength)
      return false;                       // don't need to spike data
  }
  
  var chunkSize;                          // used to send chunks of data within GET URL limit
  while (str.length > 0)
  {
    chunkSize = _getChunkSize(str, maxLength);
    co = RSExecute("_RemoteScripts/rs_common.asp", "spike", varName, str.substring(0, chunkSize));
    if (!rsCallSuccessful(co))
    {
      // remote scripting call failed, so stop here
      return false;
    }
    str = str.substring(chunkSize, str.length);
  }
  return true;
}


  // Function getDisplayList
  // build a selection list consist of a subset of a list retrieved from the database.
  // This function is used for displaying a long selection list in managable chunks.
  // The user scroll through the list by double clicking on the first/last line in the list with label prev../
  // next... 
  // fullList:    The list of object of all the items retrieved from db
  //              object has val(option value) , text(option text), avail(bool. if =true, the item is placed on 
  //              displayList) property
  // displayList: The selection list built from a subset of fullList
  // pos:         an object with property prev, next.  Next is the first position of the next subset
  //              The user can either maintain this object themselves or pass in an empty object and the 
  //              function will maintain it for him 
  // maxItems: The maximum number of items to dislay on the selection list displayList
  
  function getDisplayList(fullList, displayList, pos, maxItems)
  {
     var selIndex;
     var optText;

     // save off needed fields from the old list, truncate all items in displayList
     selIndex = displayList.selectedIndex;
     if (selIndex >= 0)
        optText = displayList.options[selIndex].text;
     else
        optText = "";
     displayList.length = 0;
     
     // if user request previous group, set the position              
     if (optText == lblPrevSetOfItems)
       pos.next = pos.prev;
       
     // set pos.prev for the next round  
     var j=0;
     var i=0;
     for (i = pos.next; ( (i > 0) && ( j < maxItems) ); i--)
     {
       if (fullList[i].avail)
         j++;
     }
     if (j > 0)
     {
       pos.prev = i;
       displayList.options[displayList.length] = new Option(lblPrevSetOfItems, 0);
     }
     else
       pos.prev = 0;       
       
     // get the subset for display
     j=0;
     var k=0;
     for (k=pos.next; ( (k < fullList.length) && (j < maxItems) ); k++)
     {
       if (fullList[k].avail)
       {
        displayList.options[displayList.length] = new Option(fullList[k].text, fullList[k].val);
        j++;
      }
     }
     if (j == 0)  // no item to display
     {
       return;
     }
     
     // set position for next round
     while ( (k < fullList.length) && (!fullList[k].avail) )
       k++; 
     pos.next = k;  
     
     if ( pos.next < fullList.length)
       displayList.options[displayList.length] = new Option(lblNextSetOfItems, displayList.length);
     else
       pos.next = fullList.length-1; 
  }

// function getMLPPDomainID
//   used to convert string MLPP Domain ID to long value used in DB
// inputs:
//   el - MLPP Domain ID field
// returns:
//   long value; hex string converted to decimal number
//
function getMLPPDomainID(el)
{
  if (!getValue(el))
    return -1;
  else
    return Number("0x" + getValue(el));
}

// Function gotoWhoUsesMe:
// This is used to open a window for Record search (WhousesMe) 
// It will open a new window 

function gotoWhoUsesMe(hrefString)
  {
    d = new Date();
                t = d.getTime();
    hrefString = hrefString + "&timeNow=" + t;  
    var window_handle = window.open(hrefString  ,'whoUsesMeWindow',"resizable=yes,height=650,width=650,status=yes,toolbar=yes,menubar=no,location=no,scrollbars=yes");
    window_handle.focus();
    return false;
  }

// Function zeroFill:
//   pad string with leading zeros to specified length
//
// Takes as input:
//   length - length of the padded string
//   str_or_num - a string or number to be padded; all numbers are converted to base 10, so convert number
//                to a string using toString(base) before passing value as argument
function zeroFill(length, str_or_num)
{
  var str = new String(str_or_num);
  while (length > str.length) { str = "0" + str; }
  return str;
}

// Function isIPAddressHostNameValid:
//   This function will validate an IPAddress or a Host Name. 
//
// Takes as input:
//   element - document.form.element - the form element for keeping focus on and get the value
//   validateThruDNS - true: to validate by sending to DNS, false: not to do this validation.
//   FQDomainAllowed - true/false -  Is  Fully Qualified Domain Name a valid value for this field?
//   fldName - label of the field . Optional. If present, this function will  display all error messages 
// Returns
//   Boolean - True if it is valid
//           - False if not valid or can not resolve the IP from DNS. 
 
function isIPAddressHostNameValid(element,FQDomainAllowed, validateThruDNS,fldName)
{
    var hostOrIP = getValue(element);
    var ipRegExp = /^(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})$/;
  
   if (ipRegExp.test(hostOrIP))
    {
      var result = isIPAddressValid(element, fldName);
    }
    else
    {
      result = isHostNameValid(element, FQDomainAllowed, validateThruDNS, fldName) 
    }    
    return result;
}


// Function isIPAddressValid :
//   This function will validate an IPAddress  
//
// Takes as input:
//   element - document.form.element - the form element for keeping focus on 
//   fldName - label of the field . Optional. If present, this function will  display all error messages 
// Returns
//   Boolean - True if it is valid
//           - False if not valid  

function isIPAddressValid(element, fldName)
{ 
 
var ipAddress = getValue(element); 
var ipRegExp=  /^((25[0-5])|(2[0-4][0-9])|(1[0-9][0-9])|([1-9][0-9])|([0-9]))(\.((25[0-5])|(2[0-4][0-9])|(1[0-9][0-9])|([1-9][0-9])|([0-9]))){3}$/;

if ((ipAddress == "0.0.0.0") || (ipAddress == "255.255.255.255") ) // Special case of IP address
    {
        if (fldName)
          { 
            if (confirm(jsErrSpecialIP.replace(/@/,fldName)))
              return true;
            else
              element.focus();
              element.select(); 
              return false;
          }
          else 
          { return false;}
     }
    else 
    if (!(ipRegExp.test(ipAddress))) // Test with Regular expression. 
      { 
       if (fldName) {
                showValidationError(element,jsErrInvalidIP.replace(/@/,fldName),1);
                element.focus();
                element.select(); 
                }
            return false;
      }
  
    return true;
 }
 
 
 // Function isHostNameValid
//   This function will validate an  a Host Name. 
//
// Takes as input:
//   element - document.form.element - the form element for keeping focus on 
//   validateThruDNS - true: to validate by sending to DNS, false: not to do this validation.
//   FQDomainAllowed - true/false - Is  Fully Qualified Domain Name ("www.cisco.com") a valid value for this field? 
//   fldName - label of the field . Optional. If present, this function will  display all error messages 
// Returns
//   Boolean - True if it is valid
//           - False if not valid or can not resolve the IP. 
 
 
 function isHostNameValid(element, FQDomainAllowed, validateThruDNS, fldName )
 {
    var hostName = getValue(element); 
    var firstCh = hostName.charAt(0);
    var lastCh = hostName.charAt(hostName.length-1);
    
    if (FQDomainAllowed)
        var validChars =  maskAlpha + maskNumeric + charDash + charDot ;
    else
        var validChars =  maskAlpha + maskNumeric + charDash ;
        
    if (!isValidString(hostName, validChars, fldName ))
        {
            element.focus();
            element.select();
            return false;
        }
    if (!isValidString(firstCh , maskAlpha  )  )
        {
          if (fldName) 
            {
            showValidationError(element, jsErrDNSInvalidFirstChars.replace(/@/gi,fldName), 1);
            element.focus();
            element.select(); 
            }
          return false;
        }
     if ( !isValidString( lastCh, maskAlpha + maskNumeric ))
        {
          if (fldName) 
            {
            showValidationError(element, jsErrDNSInvalidLastChars.replace(/@/gi,fldName), 1);
            element.focus();
            element.select(); 
            }
          return false;
        }
     if (validateThruDNS)
      {
      var scriptSource = getBaseURL() + '/_RemoteScripts/rs_common.asp';
      var rs_result = RSExecute(scriptSource, 'getIPFromDNS', hostName);
      var returnIP = rs_result.return_value;
      if (returnIP == "")
        {
        if (fldName)
          { 
            if (confirm(jsErrCouldNotResolveDNS.replace(/@/,fldName)))
              return true;
            else
              element.focus();
              element.select(); 
              return false;
          }
          else 
          { return false;
          }
              
        }
     }
     
     return true;
   }  
  
 // Function getIncrementedDN
//   This function will increment a DN by the given increment. 
//   There is matching server side routine on standard.asp. If update this, need to update .asp also.
//
// Takes as input:
//   pilotDN - The first DN in the range. 
//   increment - The number to increment.
//
// CM allows DN up to 24 digits.  In order to increment, we must convert the pilotDN
// to a number, increment it, then convert the number back to string.  The problem is there is no
// number large enough to hold 24 digits numbers (without using scientific notation).  The solution is
// to split the number into 2 parts, increment the right portion, handles overflow, and rejoin the 2 parts.
//   
// Returns
//   endDN - The pilotDN incremented by increment . 
    
   function getIncrementedDN(pilotDN, increment)
  {
    var endDN;
    var splitPoint;

    if (pilotDN.length < maxNumSize )
      {
      endDN = Number(pilotDN) + increment;
      }
    else // DN is too big to treat as  as number split up the number and process as 2 parts then join them
      {
      splitPoint =  maxNumSize-1;
      var leftHalf = pilotDN.substring(0,splitPoint);
      var svLeftLen = leftHalf.length;

      var rightHalf = pilotDN.substring(splitPoint,pilotDN.length);
      var svRightLen = rightHalf.length;

      var rightHalfNum  = Number(rightHalf) + increment;
      rightHalf = rightHalfNum.toString();

      if (rightHalf.length == svRightLen) // right half number incremented ok without overflow
        {endDN = leftHalf.concat(rightHalf);}
      else // right half over flow, increment the left half 
        {
        // truncate overflow on right half
        var RHSplitPoint = rightHalf.length - svRightLen;

        var RHOverflow = rightHalf.substr(0, RHSplitPoint);
        rightHalf = rightHalf.substring(RHSplitPoint, rightHalf.length);

        //increment left half
        var leftHalfNum = Number(leftHalf) + Number(RHOverflow);
        leftHalf = leftHalfNum.toString();
        if (leftHalf.length == svLeftLen) // left half number incremented without overflow
          {endDN = leftHalf.concat(rightHalf);}
        else  // left half incremented caused overflow, throw error.
          {return "";}  // error, new DN is too long
        }
      }
    return endDN;
  }   
    
// Function : mlaIsErrorCondition
// 
function mlaIsErrorCondition( co ) {
       var  return_value = co.return_value;
       var number = return_value.number;
       if( co.status == -1 || return_value.number != 0 ){
           return true;
       }
       else 
          return false;
    }

// Function that will deactivate or activate the searchString
// text box based on the selected searchLimit value.
function deactivateSearchString(searchLimitElement, searchStringElement) {
  var val = getValue(searchLimitElement);
  if ((val == "isEmpty") || (val == "isNotEmpty")) {
     searchStringElement.disabled = true;
  } else { 
     searchStringElement.disabled = false;
  }
}

// function applyConfig:
//   calls the applyConfig.do action for appling config of one or more devices
// Takes as input:
//   Pkid - One or more pkids for device(s) to apply config; multiple pkids should be separated
//           by commas (as separate arguments for the function)
// Returns:
//   nothing - displays secondary window with prompts and messages
//
function applyConfig() {
	var pkid;
  	var path = getBaseURL();
  	var url = path + "/resetApplyConfig.do";
  	var formPostFlag = false;
  	var f = document.forms[2];
  	
  	if (typeof(applyConfig.arguments[0]) == "object") {
  	    formPostFlag = true;
		var pkidList = applyConfig.arguments[0];
    	f.pkid.value = pkidList.join(":");
  	} else {
    	for (var i = 0; i < applyConfig.arguments.length; i++) {
    		pkid = applyConfig.arguments[i];
    		url += ((i > 0) ? "&pkid=" : "?pkid=") + pkid;
    	}
  	}

  	var options = "resizable=yes,height=450,width=650,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300";
  
    if (formPostFlag) {
  		doFormPost(f, options);
  	} else {
  	   url += "&type=3";
  	   window.open(url, "applyconfigWin", options);
    }
}

// function applyConfigSelected:
//   calls the applyConfig for initiating apply config of one or more devices
// Takes as input:
//   index - The index of the column holding the pkid value
//   errorMessage - error message for when/if user does not select any checkboxes.
// Returns:
//   nothing
//

function applyConfigSelected(index, errorMessage) {

    var els = document.forms[0].elements;
    var numCheckboxes = -1;
    var resetCtr = 0;
    var pkidList = new Array(1);

    // scan checkboxes for selected rows
    for (var i = 0; i < els.length; i++)
    {
        if (els[i].type == "checkbox") {
            // only concerned about checkboxes in the result table.
            if (els[i].name.indexOf("result") == 0) {
                numCheckboxes++;
                    if (els[i].checked) {
                    // extract the hidden values for this row from form
                    var elValue = "result[" + numCheckboxes + "].col[" + index + "].stringVal";
                    pkidList[resetCtr] = els[elValue].value;
                    resetCtr++; 
                }
            }
        }
     } 
     if (resetCtr > 0) {
         //call the apply config method passing in the pkid list 
         applyConfig(pkidList);
     } 
     else {
         alert(errorMessage);
     }
}

// function doMultiDeviceApplyConfig:
//   calls the resetApplyconfigMultiple.do action for initiating reset or restart of one or more devices
//       associated with a table.  eg. DevicePool or CallManager
// Takes as input:
//   tableID - name of table pkid is in
//   pkid - pkid of the associated item 
//   affectedDevices - number of devices that will be reset
//   type - Type of reset requested.  NOTE: If type is not passed in, the popup window
//            will show both a reset and a restart button and the user will have to choose
//            which type of reset signal to send.
// Returns:
//   nothing - displays secondary window with prompts and messages
//
function doMultiDeviceApplyConfig(tableID, pkid, affectedDevices)
{ 
  if (affectedDevices > 0)
  {
        var path = getBaseURL();
        var url = path + "/resetApplyConfigMultiple.do?tableid=" + tableID + "&pkid=" + pkid + "&affectedDevices=" + affectedDevices + "&type=3";
        var options = "resizable=yes,height=450,width=650,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300";
  
        window.open(url, "resetWin", options);  
  }
  else
  {
    alert(msgMultiDeviceResetNoDevices);
  }
}



// ---------------- End of file -------------------------------
