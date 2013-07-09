//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2000 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

//----------------------------------------------------------------------------
// Code to determine the browser and version.
//----------------------------------------------------------------------------

function Browser() {

  var ua, s, i;

  this.isIE    = false;  // Internet Explorer
  this.isNS    = false;  // Netscape
  this.version = null;

  ua = navigator.userAgent;

  s = "MSIE";
  i = ua.indexOf(s);
  if (i >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  i = ua.indexOf(s);
  if (i >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.

  s = "Gecko";
  i = ua.indexOf(s);
  if (i >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}

var browser = new Browser();

//----------------------------------------------------------------------------
// Code for handling the menu bar and active button.
//----------------------------------------------------------------------------

var activeButton = null;

// Capture mouse clicks on the page so any active button can be
// deactivated.

if (browser.isIE) {
  document.onmousedown = pageMousedown;
}
else {
  document.addEventListener("mousedown", pageMousedown, true);
}

function pageMousedown(event) {

  var el;

  // If there is no active button, exit.

  if (activeButton == null) {
    return;
  }

  // Find the element that was clicked on.

  if (browser.isIE) {
    el = window.event.srcElement;
  }
  else {
    el = (event.target.tagName ? event.target : event.target.parentNode);
  }

  // If the active button was clicked on, exit.

  if (el == activeButton) {
    return;
  }

  // If the element is not part of a menu, reset and clear the active
  // button.

  if (getContainerWith(el, "DIV", "menubar-menu") == null) {
    resetButton(activeButton);
    showSearchDiv();
    activeButton = null;
  }
}

function buttonClick(event, menuId) {

  var button;

  // Get the target button element.

  if (browser.isIE) {
    button = window.event.srcElement;
  }
  else {
    button = event.currentTarget;
  }

  // Blur focus from the link to remove that annoying outline.

  button.blur();

  // Associate the named menu to this button if not already done.
  // Additionally, initialize menu display.

  if (button.menu == null) {
    button.menu = document.getElementById(menuId);
    if (button.menu.isInitialized == null) {
      menuInit(button.menu);
    }
  }

  // Reset the currently active button, if any.

  if (activeButton != null) {
    resetButton(activeButton);
  }

  // Activate this button, unless it was the currently active one.

  if (button != activeButton) {
    depressButton(button);
    activeButton = button;
  }
  else {
    activeButton = null;
  }

  return false;
}

function buttonMouseover(event, menuId) {

  var button;

  // Find the target button element.

  if (browser.isIE) {
    button = window.event.srcElement;
  }
  else {
    button = event.currentTarget;
  }

  // If any other button menu is active, make this one active instead.

  if (activeButton != null && activeButton != button) {
    buttonClick(event, menuId);
  }
}

function depressButton(button) {

  var x, y;

  // Update the button's style class to make it look like it's
  // depressed.

  button.className += " menubar-menubutton-active";

  // Position the associated drop down menu under the button and
  // show it.

  x = getPageOffsetLeft(button);
  y = getPageOffsetTop(button) + button.offsetHeight;

  // For IE, adjust position.

  if (browser.isIE) {
    x += button.offsetParent.clientLeft;
    y += button.offsetParent.clientTop;
  }

  button.menu.style.left = x + "px";
  button.menu.style.top  = y + "px";
  button.menu.style.visibility = "visible";

  if (navigator.appName.indexOf("Microsoft Internet Explorer") != -1) {
    var soichDiv0 = document.getElementById("searchDiv0");
 	soichDiv0.style.visibility = "hidden";
 	var soichDiv1 = document.getElementById("searchDiv1");
 	soichDiv1.style.visibility = "hidden";
  	var soichDiv2 = document.getElementById("searchDiv2");
 	soichDiv2.style.visibility = "hidden";
  	var soichDiv3 = document.getElementById("searchDiv3");
  	soichDiv3.style.visibility = "hidden";
  	var soichDiv4 = document.getElementById("searchDiv4");
 	soichDiv4.style.visibility = "hidden";
  	var soichDiv5 = document.getElementById("searchDiv5");
  	soichDiv5.style.visibility = "hidden";
  	var soichDiv6 = document.getElementById("searchDiv6");
  	soichDiv6.style.visibility = "hidden";
  	var soichDiv7 = document.getElementById("searchDiv7");
  	soichDiv7.style.visibility = "hidden";
  	var soichDiv8 = document.getElementById("searchDiv8");
  	soichDiv8.style.visibility = "hidden";  
  	var soichDiv9 = document.getElementById("searchDiv9");
  	soichDiv9.style.visibility = "hidden";
  	var soichDiv10 = document.getElementById("searchDiv10");
  	soichDiv10.style.visibility = "hidden"; 
  	var soichDiv11 = document.getElementById("searchDiv11");
  	soichDiv11.style.visibility = "hidden"; 
  	var soichDiv12 = document.getElementById("searchDiv12");
  	soichDiv12.style.visibility = "hidden";  
  	var soichDiv13 = document.getElementById("searchDiv13");
  	soichDiv13.style.visibility = "hidden"; 
  	var soichDiv14 = document.getElementById("searchDiv14");
  	soichDiv14.style.visibility = "hidden"; 
  	var soichDiv15 = document.getElementById("searchDiv15");
  	soichDiv15.style.visibility = "hidden";      
  }
}

function resetButton(button) {

  // Restore the button's style class.

  removeClassName(button, "menubar-menubutton-active");

  // Hide the button's menu, first closing any sub menus.

  if (button.menu != null) {
    closeSubMenu(button.menu);
    button.menu.style.visibility = "hidden";
  }
}

function showSearchDiv() {
  if (navigator.appName.indexOf("Microsoft Internet Explorer") != -1) {
  	var soichDiv0 = document.getElementById("searchDiv0");
  	soichDiv0.style.visibility = "visible";  
  	var soichDiv1 = document.getElementById("searchDiv1");
  	soichDiv1.style.visibility = "visible";
  	var soichDiv2 = document.getElementById("searchDiv2");
  	soichDiv2.style.visibility = "visible";
  	var soichDiv3 = document.getElementById("searchDiv3");
  	soichDiv3.style.visibility = "visible";
  	var soichDiv4 = document.getElementById("searchDiv4");
 	soichDiv4.style.visibility = "visible";
  	var soichDiv5 = document.getElementById("searchDiv5");
  	soichDiv5.style.visibility = "visible";
 	var soichDiv6 = document.getElementById("searchDiv6");
  	soichDiv6.style.visibility = "visible"; 
  	var soichDiv7 = document.getElementById("searchDiv7");
  	soichDiv7.style.visibility = "visible";  
  	var soichDiv8 = document.getElementById("searchDiv8");
  	soichDiv8.style.visibility = "visible";   
  	var soichDiv9 = document.getElementById("searchDiv9");
  	soichDiv9.style.visibility = "visible"; 
  	var soichDiv10 = document.getElementById("searchDiv10");
  	soichDiv10.style.visibility = "visible";
  	var soichDiv11 = document.getElementById("searchDiv11");
  	soichDiv11.style.visibility = "visible";
  	var soichDiv12 = document.getElementById("searchDiv12");
  	soichDiv12.style.visibility = "visible";
  	var soichDiv13 = document.getElementById("searchDiv13");
  	soichDiv13.style.visibility = "visible";
  	var soichDiv14 = document.getElementById("searchDiv14");
  	soichDiv14.style.visibility = "visible";
  	var soichDiv15 = document.getElementById("searchDiv15");
  	soichDiv15.style.visibility = "visible";  	
  }
}

//----------------------------------------------------------------------------
// Code to handle the menus and sub menus.
//----------------------------------------------------------------------------

function menuMouseover(event) {
  var menu;

  // Find the target menu element.

  if (browser.isIE) {
    menu = getContainerWith(window.event.srcElement, "DIV", "menubar");
  }
  else {
    menu = event.currentTarget;
  }

  // Close any active sub menu.

  if (menu.activeItem != null) {
    closeSubMenu(menu);
  }
}

function menuItemMouseover(event, menuId) {
  var item, menu, x, y;

  // Find the target item element and its parent menu element.

  if (browser.isIE) {
    item = getContainerWith(window.event.srcElement, "A", "menubar-menuitem");
  }
  else {
    item = event.currentTarget;
  }
  menu = getContainerWith(item, "DIV", "menubar-menu");

  // Close any active sub menu and mark this one as active.

  if (menu.activeItem != null) {
    closeSubMenu(menu);
  }
  menu.activeItem = item;

  // Highlight the item element.

  item.className += " menubar-menuitem-highlight";

  // Initialize the sub menu, if not already done.

  if (item.subMenu == null) {
    item.subMenu = document.getElementById(menuId);
    if (item.subMenu.isInitialized == null) {
      menuInit(item.subMenu);
    }
  }

  // Get position for submenu based on the menu item.

  x = getPageOffsetLeft(item) + item.offsetWidth;
  y = getPageOffsetTop(item);

  // Adjust position to fit in view.

  var maxX, maxY;

  if (browser.isNS) {
    maxX = window.scrollX + window.innerWidth;
    maxY = window.scrollY + window.innerHeight;
  }
  if (browser.isIE) {
    maxX = (document.documentElement.scrollLeft   != 0 ? document.documentElement.scrollLeft    : document.body.scrollLeft)
         + (document.documentElement.clientWidth  != 0 ? document.documentElement.clientWidth   : document.body.clientWidth);
    maxY = (document.documentElement.scrollTop    != 0 ? document.documentElement.scrollTop    : document.body.scrollTop)
         + (document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight);
  }
  maxX -= item.subMenu.offsetWidth;
  maxY -= item.subMenu.offsetHeight;

  if (x > maxX) {
    x = Math.max(0, x - item.offsetWidth - item.subMenu.offsetWidth
      + (menu.offsetWidth - item.offsetWidth));
  }
  y = Math.max(0, Math.min(y, maxY));

  // Position and show it.

  item.subMenu.style.left = x + "px";
  item.subMenu.style.top  = y + "px";
  item.subMenu.style.visibility = "visible";

  // Stop the event from bubbling.

  if (browser.isIE) {
    window.event.cancelBubble = true;
  }
  else {
    event.stopPropagation();
  }
}

function closeSubMenu(menu) {

  if (menu == null || menu.activeItem == null) {
    return;
  }

  // Recursively close any sub menus.

  if (menu.activeItem.subMenu != null) {
    closeSubMenu(menu.activeItem.subMenu);
    menu.activeItem.subMenu.style.visibility = "hidden";
    menu.activeItem.subMenu = null;
  }
  removeClassName(menu.activeItem, "menubar-menuitem-highlight");
  menu.activeItem = null;
}

//----------------------------------------------------------------------------
// Code to initialize menus.
//----------------------------------------------------------------------------

function menuInit(menu) {
  var itemList, spanList;
  var textEl, arrowEl;
  var itemWidth;
  var w, dw;
  var i, j;

  // For IE, replace arrow characters.

  if (browser.isIE) {
    menu.style.lineHeight = "2.5ex";
    spanList = menu.getElementsByTagName("SPAN");
    for (i = 0; i < spanList.length; i++) {
      if (hasClassName(spanList[i], "menubar-menuitem-arrow")) {
        spanList[i].style.fontFamily = "Webdings";
        spanList[i].firstChild.nodeValue = "4";
      }
    }
  }

  // Find the width of a menu item.

  itemList = menu.getElementsByTagName("A");
  if (itemList.length > 0) {
    itemWidth = itemList[0].offsetWidth;
  }
  else {
    return;
  }

  // For items with arrows, add padding to item text to make the
  // arrows flush right.

  for (i = 0; i < itemList.length; i++) {
    spanList = itemList[i].getElementsByTagName("SPAN");
    textEl  = null;
    arrowEl = null;
    for (j = 0; j < spanList.length; j++) {
      if (hasClassName(spanList[j], "menubar-menuitem-text")) {
        textEl = spanList[j];
      }
      if (hasClassName(spanList[j], "menubar-menuitem-arrow")) {
        arrowEl = spanList[j];
      }
    }
    if (textEl != null && arrowEl != null) {
      textEl.style.paddingRight = (itemWidth 
        - (textEl.offsetWidth + arrowEl.offsetWidth)) + "px";
    }
  }

  // Fix IE hover problem by setting an explicit width on first item of
  // the menu.

  if (browser.isIE) {
    w = itemList[0].offsetWidth;
    itemList[0].style.width = w + "px";
    dw = itemList[0].offsetWidth - w;
    w -= dw;
    itemList[0].style.width = w + "px";
  }

  // Mark menu as initialized.

  menu.isInitialized = true;
}

//----------------------------------------------------------------------------
// General utility functions.
//----------------------------------------------------------------------------

function getContainerWith(node, tagName, className) {

  // Starting with the given node, find the nearest containing element
  // with the specified tag name and style class.

  while (node != null) {
    if (node.tagName != null && node.tagName == tagName &&
        hasClassName(node, className)) {
      return node;
    }
    node = node.parentNode;
  }

  return node;
}

function hasClassName(el, name) {

  var i, list;

  // Return true if the given element currently has the given class
  // name.

  list = el.className.split(" ");
  for (i = 0; i < list.length; i++) {
    if (list[i] == name) {
      return true;
    }
  }

  return false;
}

function removeClassName(el, name) {

  var i, curList, newList;

  if (el.className == null) {
    return;
  }

  // Remove the given class name from the element's className property.

  newList = new Array();
  curList = el.className.split(" ");
  for (i = 0; i < curList.length; i++) {
    if (curList[i] != name) {
      newList.push(curList[i]);
    }
  }
  el.className = newList.join(" ");
}

function getPageOffsetLeft(el) {

  var x;

  // Return the x coordinate of an element relative to the page.

  x = el.offsetLeft;
  if (el.offsetParent != null) {
    x += getPageOffsetLeft(el.offsetParent);
  }

  return x;
}

function getPageOffsetTop(el) {

  var y;

  // Return the x coordinate of an element relative to the page.

  y = el.offsetTop;
  if (el.offsetParent != null) {
    y += getPageOffsetTop(el.offsetParent);
  }

  return y;
}

