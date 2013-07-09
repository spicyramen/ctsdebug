// Global variable
var isDirty = false;

function setAllRows(flag) {
	for(var i = 0; i < document.forms[0].length; i++) {
		var str = document.forms[0][i].type;
		switch( str.toLowerCase() ) {
			case 'checkbox':
			 if(!document.forms[0][i].disabled){
                    document.forms[0][i].checked = flag;
		     }
		     
			default:
				continue;
		}
	}
}

function selectAllRows() {
	setAllRows(true);
}

function clearAllRows() {
	setAllRows(false);
}

function displayHelp(strPage) {
	alert("To Be Implemented");
}

function setSort(sortAction) {
	document.forms[0].action = sortAction;  
	document.forms[0].submit();
}

function changePageSize() {
	var control = document.getElementById("select");
	var url = control.options[control.selectedIndex].value;
	window.location = url; 
}

function onPageFlip(url) {
    if (!isDirty) {
        isDirty = true;
        window.location = url;
    }
}

function onFindSubmit(sortColumn, sortAscend) {
   alert("PARAMS :: " + sortColumn + " :: " + sortAscend + " :: " + isDirty);
	
      //
      //CSCsc99037 -- Find and List phones page retains page number even on new query
      //
      var pageNumber = document.getElementById("pageNumber");
      if( pageNumber != null )
      {
            pageNumber.value = 1;
      }
      if (f.action.indexOf("?") > 0) {
         f.action += "?sortColumn=" + sortColumn + "&sortAscend=" + sortAscend;
      } else {
	 f.action += "&sortColumn=" + sortColumn + "&sortAscend=" + sortAscend;
      }
      alert("ACTION :: " + f.action);
      //document.forms[0].submit();
   
}

function onFindSubmit()
{
   if (!isDirty) {
      isDirty = true;
 
      //
      //CSCsc99037 -- Find and List phones page retains page number even on new query
      //
      var pageNumber = document.getElementById("pageNumber");
      if( pageNumber != null )
      {
            pageNumber.value = 1;
      }
      if (document.forms[0].searchString) {
	if ((document.forms[0].searchString.value.indexOf('<script>') >= 0) || 
	    (document.forms[0].searchString.value.indexOf('</script>') >= 0)) {
	    alert(msgScriptInjection);	
        } else {
           document.forms[0].submit();
        }
      } else {  
      	document.forms[0].submit();
      }
   }
}

// Render a popup window for searching
function searchComboBox(URL) {
 	newWindow = window.open(URL,"search","resizable=no,height=300,width=600,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes");
}

function setGotoPageNum(url) {
	var control = document.getElementById("pageNumber");
	var pageNumber = control.value;
	if (pageNumber != ""){
	    if (!isDirty) {
	        isDirty = true;
		    window.location = url+ pageNumber; 
		}
	}
}

function setPageSize(control) {
	var url = control.options[control.selectedIndex].value;
	if (!isDirty) {
		isDirty = true;
	    window.location = url; 
	}
}	

function initfocus() {
	var control = document.getElementById("pageNumber");
	control.focus();
}		
 
 // function addCurrentSearchItem
// a remote call function for the search page to add an option to a list box
//
function addCurrentSearchItem(text, val, elementId) {

   var el=document.getElementById(elementId);

   // test to see if it's already there
   selectItemByValue(el, val);
   if (getValue(el) != val) {
      el[el.length] = new Option(text, val);
      el.selectedIndex = el.length-1;
   }
   return; 
}

