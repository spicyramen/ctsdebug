

 
if (typeof(Wicket) == "undefined") {
Wicket = { };
}
if (Wicket.Class == null) {
Wicket.Class = {
create: function() {
return function() {
this.initialize.apply(this, arguments);
}
}
};
}
if (Wicket.Object == null) {
Wicket.Object = { };
}
if (Wicket.Object.extend == null) {
Wicket.Object.extend = function(destination, source) {
for (property in source) {
destination[property] = source[property];
}
return destination;
}
}

Wicket.Iframe = {

findPosX: function(e) {
if (e.offsetParent) {
var c = 0;
while (e.offsetParent) {
c += e.offsetLeft
e = e.offsetParent;
}
return c;
} else if (e.x) {
return e.x;
} else {
return 0;
}
},

findPosY: function(e) {
if (e.offsetParent) {
var c = 0;
while (e.offsetParent) {
c += e.offsetTop
e = e.offsetParent;
}
return c;
} else if (e.y) {
return e.y;
} else {
return 0;
} 
},

forwardEvents: function(doc, iframe, revertList) {
try {
var idoc = iframe.contentWindow.document;
idoc.old_onmousemove = idoc.onmousemove;
idoc.onmousemove = function(evt) {
if (evt == null)
evt = iframe.contentWindow.event;
var e = new Object(); 
var dx = 0;
var dy = 0; 
if (Wicket.Browser.isIE() || Wicket.Browser.isGecko) {
dx = Wicket.Window.getScrollX();
dy = Wicket.Window.getScrollY();
}
e.clientX = evt.clientX + Wicket.Iframe.findPosX(iframe) - dx;
e.clientY = evt.clientY + Wicket.Iframe.findPosY(iframe) - dy; 
doc.onmousemove(e); 
}
idoc.old_onmouseup = idoc.old_onmousemove;
idoc.onmouseup = function(evt) {
if (evt == null)
evt = iframe.contentWindow.event;
var e = new Object();
var dx = 0;
var dy = 0; 
if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
dx = Wicket.Window.getScrollX();
dy = Wicket.Window.getScrollY();
}
e.clientX = evt.clientX + Wicket.Iframe.findPosX(iframe) - dx;
e.clientY = evt.clientY + Wicket.Iframe.findPosY(iframe) - dy; 
doc.onmouseup(e);
}
revertList.push(iframe);
Wicket.Iframe.documentFix(idoc, revertList);
} catch (ignore) {
} 
},

revertForward: function(iframe) {
var idoc = iframe.contentWindow.document;
idoc.onmousemove = idoc.old_onmousemove;
idoc.onmouseup = idoc.old_onmouseup;
idoc.old_onmousemove = null;
idoc.old_onmouseup = null;
},

documentFix: function(doc, revertList) {
var iframes = doc.getElementsByTagName("iframe");
for (var i = 0; i < iframes.length; ++i) {
var iframe = iframes[i]; 
if (iframe.tagName != null) 
Wicket.Iframe.forwardEvents(doc, iframe, revertList); 
}
},

documentRevert: function(revertList) {
for (var i = 0; i < revertList.length; ++i) {
var iframe = revertList[i];
Wicket.Iframe.revertForward(iframe);
}
}
}

Wicket.Window = Wicket.Class.create();

Wicket.Window.unloadConfirmation = true;

Wicket.Window.create = function(settings) {
var win;
	if (typeof(settings.src) != "undefined" && Wicket.Browser.isKHTML() == false) {
 try { 
win = window.parent.Wicket.Window; 
} catch (ignore) { 
}
}
	if (typeof(win) == "undefined") {
win = Wicket.Window;
}
	return new win(settings);
}

Wicket.Window.get = function() {
var win = null;
if (typeof(Wicket.Window.current) != "undefined") {
win = Wicket.Window.current;
} else
{
try {
win = window.parent.Wicket.Window.current;
} catch (ignore) {
}
}
return win;
}

Wicket.Window.close = function() {
var win;
try { 
win = window.parent.Wicket.Window;
} catch (ignore) { 
}
if (typeof(win) != "undefined" && typeof(win.current) != "undefined") {
  window.parent.setTimeout(function() {
win.current.close(); 
}, 0);
}
}
Wicket.Window.prototype = {

initialize: function(settings) {
 this.settings = Wicket.Object.extend({
minWidth: 200, 
minHeight: 150, 
className: "w_blue", 
width: 600, 
height: 300, 
resizable: true,
widthUnit: "px", 
heightUnit: "px", 
src: null, 
element: null, 
iframeName: null,  
cookieId: null, 
title: null, 
onCloseButton: function() { 

this.caption.getElementsByTagName("a")[0].focus();
this.caption.getElementsByTagName("a")[0].blur();
this.close();
return false;
}.bind(this), 
onClose: function() { }, 
mask: "semi-transparent" 
}, settings || { });
},

isIframe: function() {
return this.settings.src != null;
},

createDOM: function() {
var idWindow = this.newId();
var idClassElement = this.newId();
var idCaption = this.newId();
var idFrame = this.newId();
var idTop = this.newId();
var idTopLeft = this.newId();
var idTopRight = this.newId();
var idLeft = this.newId();
var idRight = this.newId();
var idBottomLeft = this.newId();
var idBottomRight = this.newId();
var idBottom = this.newId();
var idCaptionText = this.newId();
var markup = Wicket.Window.getMarkup(idWindow, idClassElement, idCaption, idFrame,
idTop, idTopLeft, idTopRight, idLeft, idRight, idBottomLeft, idBottomRight,
idBottom, idCaptionText, this.isIframe()); 
var element = document.createElement("div");
document.body.appendChild(element); 
Wicket.replaceOuterHtml(element, markup);
var _ = function(name) { return document.getElementById(name); }
this.window = _(idWindow);
this.classElement = _(idClassElement); 
this.caption = _(idCaption);
this.content = _(idFrame);
this.top = _(idTop);
this.topLeft = _(idTopLeft);
this.topRight = _(idTopRight);
this.left = _(idLeft);
this.right = _(idRight);
this.bottomLeft = _(idBottomLeft);
this.bottomRight = _(idBottomRight);
this.bottom = _(idBottom);
this.captionText = _(idCaptionText);
if (Wicket.Browser.isIE()) {
 if (Wicket.Browser.isIE7() == false || Wicket.Browser.isIEQuirks()) {
this.topLeft.style.marginRight = "-3px";
this.topRight.style.marginLeft = "-3px";
this.bottomLeft.style.marginRight = "-3px";
this.bottomRight.style.marginLeft = "-3px";
} 
} 
   if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
this.window.style.position = "absolute";
}
 if (this.settings.resizable == false) {
this.top.style.cursor = this.topLeft.style.cursor = this.topRight.style.cursor =
this.bottom.style.cursor = this.bottomLeft.style.cursor = this.bottomRight.style.cursor =
this.left.style.cursor = this.right.style.cursor = "default";
} 
},

newId: function() {
return "_wicket_window_" + Wicket.Window.idCounter++;
},

bind: function(element, handler) {
Wicket.Drag.init(element, this.onBegin.bind(this), this.onEnd.bind(this), handler.bind(this));
},

unbind: function(element) {
Wicket.Drag.clean(element);
},

bindInit: function() {
this.bind(this.caption, this.onMove);
if (this.settings.resizable) { 
this.bind(this.bottomRight, this.onResizeBottomRight);
this.bind(this.bottomLeft, this.onResizeBottomLeft);
this.bind(this.bottom, this.onResizeBottom);
this.bind(this.left, this.onResizeLeft);
this.bind(this.right, this.onResizeRight);
this.bind(this.topLeft, this.onResizeTopLeft); 
this.bind(this.topRight, this.onResizeTopRight);
this.bind(this.top, this.onResizeTop);
} else {
this.bind(this.bottomRight, this.onMove);
this.bind(this.bottomLeft, this.onMove);
this.bind(this.bottom, this.onMove);
this.bind(this.left, this.onMove);
this.bind(this.right, this.onMove);
this.bind(this.topLeft, this.onMove); 
this.bind(this.topRight, this.onMove);
this.bind(this.top, this.onMove);
}
this.caption.getElementsByTagName("a")[0].onclick = this.settings.onCloseButton.bind(this);
},

bindClean: function() { 
this.unbind(this.caption);
this.unbind(this.bottomRight);
this.unbind(this.bottomLeft);
this.unbind(this.bottom);
this.unbind(this.left);
this.unbind(this.right);
this.unbind(this.topLeft); 
this.unbind(this.topRight);
this.unbind(this.top);
this.caption.getElementsByTagName("a")[0].onclick = null;
},

getContentDocument: function() {
if (this.isIframe() == true) {
return this.content.contentWindow.document;
} else {
return document;
}
},

center: function() {
var scTop = 0;
var scLeft = 0;
if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
scLeft = Wicket.Window.getScrollX();
scTop = Wicket.Window.getScrollY();
}
var width = Wicket.Window.getViewportWidth();
var height = Wicket.Window.getViewportHeight();
var modalWidth = this.window.offsetWidth;
var modalHeight = this.window.offsetHeight;
var left = (width / 2) - (modalWidth / 2) + scLeft;
var top = (height / 2) - (modalHeight / 2) + scTop;
if (left < 0) left = 0;
if (top < 0) top = 0;
this.window.style.left = left + "px";
this.window.style.top = top + "px";
},
cookieKey: "wicket-modal-window-positions",
cookieExp: 31,
findPositionString: function(remove) {
var cookie = Wicket.Cookie.get(this.cookieKey);
var entries = cookie != null ? cookie.split("|") : new Array();
for (var i = 0; i < entries.length; ++i) {
if (entries[i].indexOf(this.settings.cookieId + "::") == 0) {
var string = entries[i];
if (remove) {
entries.splice(i, 1); 
Wicket.Cookie.set(this.cookieKey, entries.join("|"), this.cookieExp);
}
return string;
}
}
return null;
},

savePosition: function() {
if (typeof(this.settings.cookieId) != "undefined" && this.settings.cookieId != null) {
this.findPositionString(true);
if (cookie == null || cookie.length == 0)
cookie = "";
else
cookie = cookie + "|";
var cookie = this.settings.cookieId;
cookie += "::";
cookie += this.window.style.left + ",";
cookie += this.window.style.top + ",";
cookie += this.window.style.width + ",";
cookie += this.content.style.height;
var rest = Wicket.Cookie.get(this.cookieKey);
if (rest != null) {
cookie += "|" + rest;
}
Wicket.Cookie.set(this.cookieKey, cookie, this.cookieExp);
};
},

loadPosition: function() {
if (typeof(this.settings.cookieId) != "undefined" && this.settings.cookieId != null) {
var string = this.findPositionString(false);
if (string != null) {
var array = string.split("::");
var positions = array[1].split(",");
if (positions.length == 4) { 
this.window.style.left = positions[0];
this.window.style.top = positions[1];
this.window.style.width = positions[2];
this.content.style.height = positions[3];
}
}
}
},

createMask: function() {
if (this.settings.mask == "transparent")
this.mask = new Wicket.Window.Mask(true);
else if (this.settings.mask == "semi-transparent")
this.mask = new Wicket.Window.Mask(false);
if (typeof(this.mask) != "undefined") {
this.mask.show();
} 
},

destroyMask: function() {
this.mask.hide();
this.mask = null;
},

load: function() {
if (this.settings.title == null)
this.update = window.setInterval(this.updateTitle.bind(this), 100);
try
{
this.content.contentWindow.location.replace(this.settings.src);
}
catch(ignore)
{
this.content.src = this.settings.src;
} 
 if (Wicket.Browser.isOpera()) {
this.content.onload = function() {
this.content.contentWindow.name = this.settings.iframeName;
}
} else {
this.content.contentWindow.name = this.settings.iframeName;
}
},

show: function() { 
 this.createDOM(); 
 this.classElement.className = this.settings.className; 
 if (this.isIframe()) {
 this.load(); 
} else {
 
 if (this.settings.element == null) {
throw "Either src or element must be set.";
} 
 this.oldParent = this.settings.element.parentNode;
this.settings.element.parentNode.removeChild(this.settings.element); 
this.content.appendChild(this.settings.element);
 this.content.style.overflow="auto";
} 
 this.bindInit(); 
 if (this.settings.title != null)
this.captionText.innerHTML = this.settings.title;
 this.window.style.width = this.settings.width + (this.settings.resizable ? "px" : this.settings.widthUnit);
if (this.settings.height != null) 
this.content.style.height = this.settings.height + (this.settings.resizable ? "px" : this.settings.heightUnit); 
 this.center(); 
 this.loadPosition();
var doShow = function() {
 if (this.oldWindow != null) {
 this.oldWindow.window.style.zIndex = Wicket.Window.Mask.zIndex - 1;
} 
this.window.style.visibility="visible";
}.bind(this);
 if (Wicket.Window.current != null) {
 this.oldWindow = Wicket.Window.current;
}
 Wicket.Window.current = this;
 if (Wicket.Browser.isGecko() && this.isIframe()) {
   window.setTimeout(function() { doShow(); }, 0);
} else {
doShow();
} 
  if (this.content.focus) {
this.content.focus();
this.content.blur();
} 
 this.old_onunload = window.onunload;
 window.onunload = function() { 
this.close(true);
if (this.old_onunload != null)
return this.old_onunload();
}.bind(this); 
 this.old_onbeforeunload = window.onbeforeunload;
if (Wicket.Window.unloadConfirmation == true) {
 window.onbeforeunload = function() { 
return "Reloading this page will cause the modal window to disappear.";
} 
}
 this.createMask();
},

canClose: function() {
return true;
},

canCloseInternal: function() { 
try {
if (this.isIframe() == true) { 
var current = this.content.contentWindow.Wicket.Window.current;
if (typeof(current) != "undefined" && current != null) {
alert('You can\'t close this modal window. Close the top-level modal window first.');
return false;
}
}
} catch (ignore) {
}
return true;
},

close: function(force) {
 if (force != true && (!this.canClose() || !this.canCloseInternal()))
return; 
 if (typeof(this.update) != "undefined")
window.clearInterval(this.update);
 this.bindClean();
 this.window.style.display = "none"; 
 if (typeof(this.oldParent) != "undefined") { 
try {
this.content.removeChild(this.settings.element);
this.oldParent.appendChild(this.settings.element);
this.oldParent = null;
} catch (ignore) {
}
}
 this.window.parentNode.removeChild(this.window);
 this.window = this.classElement = this.caption = this.bottomLeft = this.bottomRight = this.bottom =
this.left = this.right = this.topLeft = this.topRight = this.top = this.captionText = null;
 window.onunload = this.old_onunload;
this.old_onunload = null; 
 window.onbeforeunload = this.old_onbeforeunload;
this.old_onbeforeunload = null;
 this.destroyMask();
if (force != true) {
 this.settings.onClose();
}
 if (this.oldWindow != null) {
 Wicket.Window.current = this.oldWindow;
 Wicket.Window.current.window.style.zIndex = Wicket.Window.Mask.zIndex + 1;
this.oldWindow = null;
} else {
 Wicket.Window.current = null;
} 
if (Wicket.Browser.isIE()) {
  var e = document.createElement("input");
var x = Wicket.Window.getScrollX();
var y = Wicket.Window.getScrollY();
e.style.position = "absolute";
e.style.left = x + "px";
e.style.top = y + "px";
document.body.appendChild(e);
e.focus();
document.body.removeChild(e);
} 
},

destroy: function() {
this.settings = null;
},

updateTitle: function() { 
try { 
if (this.content.contentWindow.document.title != null) {
if (this.captionText.innerHTML != this.content.contentWindow.document.title) { 
this.captionText.innerHTML = this.content.contentWindow.document.title;
 if (Wicket.Browser.isKHTML()) {
this.captionText.style.display = 'none';
window.setTimeout(function() { this.captionText.style.display="block";}.bind(this), 0);
}
}
}
} catch (ignore) {
Wicket.Log.info(ignore);
}
},

onBegin: function(object) {
if (this.isIframe() && (Wicket.Browser.isGecko() || Wicket.Browser.isIE())) {
this.revertList = new Array(); 
Wicket.Iframe.documentFix(document, this.revertList);
} 
},

onEnd: function(object) {
if (typeof(this.revertList) != "undefined" && this.revertList != null) {
Wicket.Iframe.documentRevert(this.revertList);
this.revertList = null;
if (Wicket.Browser.isKHTML() || this.content.style.visibility=='hidden') { 
this.content.style.visibility='hidden';
window.setTimeout(function() { this.content.style.visibility='visible'; }.bind(this), 0 );
}
this.revertList = null;
}
this.savePosition();
},

onMove: function(object, deltaX, deltaY) {
var w = this.window;
var x = parseInt(w.style.left, 10) + deltaX;
var y = parseInt(w.style.top, 10) + deltaY;
if (x < 0)
x = 0;
if (y < 0)
y = 0; 
w.style.left = x + "px";
w.style.top = y + "px";
},

resizing: function() {
},

clipSize : function(swapX, swapY) {
this.res = [0, 0];
if (this.width < this.settings.minWidth) {
this.left -= this.settings.minWidth - this.width;
this.res[0] = this.settings.minWidth - this.width;
this.width = this.settings.minWidth;
}
if (this.height < this.settings.minHeight) {
this.top -= this.settings.minHeight - this.height;
this.res[1] = this.settings.minHeight - this.height;
this.height = this.settings.minHeight;
}
if (swapX == true)
this.res[0] = -this.res[0];
if (swapY == true)
this.res[1] = -this.res[1];
},
		
onResizeBottomRight: function(object, deltaX, deltaY) {
var w = this.window;
var f = this.content;
this.width = parseInt(w.style.width, 10) + deltaX;
this.height = parseInt(f.style.height, 10) + deltaY;
this.clipSize(); 
w.style.width = this.width + "px";
f.style.height = this.height + "px";
this.resizing();
return this.res;
},
onResizeBottomLeft: function(object, deltaX, deltaY) {
var w = this.window;
var f = this.content;
this.width = parseInt(w.style.width, 10) - deltaX;
this.height = parseInt(f.style.height, 10) + deltaY;
this. left = parseInt(w.style.left, 10) + deltaX;
this.clipSize(true);
w.style.width = this.width + "px";
w.style.left = this.left + "px";
f.style.height = this.height + "px";
return this.res;
},
onResizeBottom: function(object, deltaX, deltaY) {
var f = this.content; 
this.height = parseInt(f.style.height, 10) + deltaY;
this.clipSize();
f.style.height = this.height + "px";
this.resizing();
return this.res; 
},
onResizeLeft: function(object, deltaX, deltaY) {
var w = this.window;
this.width = parseInt(w.style.width, 10) - deltaX;
this.left = parseInt(w.style.left, 10) + deltaX;
this.clipSize(true);
w.style.width = this.width + "px";
w.style.left = this.left + "px";
this.resizing();
return this.res;
},
onResizeRight: function(object, deltaX, deltaY) {
var w = this.window;
this.width = parseInt(w.style.width, 10) + deltaX;
this.clipSize();
w.style.width = this.width + "px";
this.resizing();
return this.res;
},
onResizeTopLeft: function(object, deltaX, deltaY) {
var w = this.window;
var f = this.content;
this.width = parseInt(w.style.width, 10) - deltaX;
this.height = parseInt(f.style.height, 10) - deltaY;
this.left = parseInt(w.style.left, 10) + deltaX;
this.top = parseInt(w.style.top, 10) + deltaY;
this.clipSize(true, true);
w.style.width = this.width + "px";
w.style.left = this.left + "px";
f.style.height = this.height + "px";
w.style.top = this.top + "px";
this.resizing();
return this.res;
},
onResizeTopRight: function(object, deltaX, deltaY) {
var w = this.window;
var f = this.content;
this.width = parseInt(w.style.width, 10) + deltaX;
this.height = parseInt(f.style.height, 10) - deltaY;
this.top = parseInt(w.style.top, 10) + deltaY;
this.clipSize(false, true);
w.style.width = this.width + "px";
f.style.height = this.height + "px";
w.style.top = this.top + "px";
this.resizing();
return this.res;
},
onResizeTop: function(object, deltaX, deltaY) {
var f = this.content;
var w = this.window;
this.height = parseInt(f.style.height, 10) - deltaY;
this.top = parseInt(w.style.top, 10) + deltaY;
this.clipSize(false, true);
f.style.height = this.height + "px";
w.style.top = this.top + "px";
this.resizing();
return this.res;
}
}

Wicket.Window.idCounter = 0;

Wicket.Window.getMarkup = function(idWindow, idClassElement, idCaption, idContent, idTop, idTopLeft, idTopRight, idLeft, idRight, idBottomLeft, idBottomRight, idBottom, idCaptionText, isFrame) {
var s =
"<div class=\"wicket-modal\" id=\""+idWindow+"\" style=\"top: 10px; left: 10px; width: 100px;\"><form style='background-color:transparent;padding:0px;margin:0px;border-width:0px;position:static'>"+
"<div id=\""+idClassElement+"\">"+
"<div class=\"w_top_1\">"+
"<div class=\"w_topLeft\" id=\""+idTopLeft+"\">"+
"</div>"+ 
"<div class=\"w_topRight\" id=\""+idTopRight+"\">"+
"</div>"+
"<div class=\"w_top\" id='"+idTop+"'>"+ 
"</div>"+
"</div>"+
"<div class=\"w_left\" id='"+idLeft+"'>"+
"<div class=\"w_right_1\">"+
"<div class=\"w_right\" id='"+idRight+"'>"+
"<div class=\"w_content_1\" onmousedown=\"if (Wicket.Browser.isSafari()) { event.ignore = true; }  else { Wicket.stopEvent(event); } \">"+ 
"<div class=\"w_caption\"  id=\""+idCaption+"\">"+
"<a class=\"w_close\" href=\"#\"></a>"+ 
"<span id=\""+idCaptionText+"\" class=\"w_captionText\"></span>"+
"</div>"+
"<div class=\"w_content_2\">"+
"<div class=\"w_content_3\">"+
"<div class=\"w_content\">";
if (isFrame) {
if (Wicket.Browser.isIELessThan7() || !Wicket.Browser.isIE()) { 
s+= "<iframe src='\/\/:' frameborder=\"0\" id='"+idContent+"' allowtransparency=\"false\" style=\"height: 200px\">"+
"</iframe>";
} else {
s+= "<iframe src='about:blank' frameborder=\"0\" id='"+idContent+"' allowtransparency=\"false\" style=\"height: 200px\">"+
"</iframe>";
}
} else {
s+=
"<div id='"+idContent+"'></div>";
}
s+= 
"</div>"+
"</div>"+
"</div>"+
"</div>"+
"</div>"+
"</div>"+
"</div>"+
"<div class=\"w_bottom_1\" id=\""+idBottom+"\">"+ 
"<div class=\"w_bottomRight\"  id=\""+idBottomRight+"\">"+
"</div>"+
"<div class=\"w_bottomLeft\" id=\""+idBottomLeft+"\">"+
"</div>"+
"<div class=\"w_bottom\" id=\""+idBottom+"\">"+ 
"</div>"+ 
"</div>"+ 
"</div>"+
"</form></div>";
return s;
}

Wicket.Window.Mask = Wicket.Class.create();
Wicket.Window.Mask.zIndex = 20000;
Wicket.Window.Mask.prototype = {

initialize: function(transparent) {
this.transparent = transparent; 
},

show: function() { 
 if (typeof(Wicket.Window.Mask.element) == "undefined" ||
Wicket.Window.Mask.element == null) { 
 var e = document.createElement("div");
document.body.appendChild(e); 
 if (this.transparent) {
e.className = "wicket-mask-transparent";
} else {
e.className = "wicket-mask-dark";
} 
e.style.zIndex = Wicket.Window.Mask.zIndex;
    if (this.transparent == false) {
if (Wicket.Browser.isKHTML() == false) { 
e.style.backgroundImage = "none";
} else {
e.style.backgroundColor = "transparent";
}
}
   if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
e.style.position = "absolute";
}
 this.element = e;
 this.old_onscroll = window.onscroll;
this.old_onresize = window.onresize;
 window.onscroll = this.onScrollResize.bind(this);
window.onresize = this.onScrollResize.bind(this);
 this.onScrollResize(true);
 Wicket.Window.Mask.element = e; 
} else {
 this.dontHide = true; 
}
var doc = document;
var old = Wicket.Window.current.oldWindow;
if (typeof(old) != "undefined" && old != null) {
doc = old.getContentDocument();
}
this.document = doc;
 setTimeout(function() {this.hideSelectBoxes()}.bind(this), 300);
setTimeout(function() {this.disableTabs()}.bind(this), 400);
setTimeout(function() {this.disableFocus()}.bind(this), 1000); 
},

hide: function() { 
 if (typeof(Wicket.Window.Mask.element) != "undefined" && typeof(this.dontHide) == "undefined") {
 document.body.removeChild(this.element);
this.element = null; 
 window.onscroll = this.old_onscroll;
window.onresize = this.old_onresize;
Wicket.Window.Mask.element = null; 
}
 this.showSelectBoxes();
 this.restoreTabs();
 this.enableFocus();
this.document = null;
},

onScrollResize: function(dontChangePosition) { 
 if (this.element.style.position == "absolute") {
var w = Wicket.Window.getViewportWidth();
var h = Wicket.Window.getViewportHeight();
var scTop = 0;
var scLeft = 0; 
scLeft = Wicket.Window.getScrollX();
scTop = Wicket.Window.getScrollY();
this.element.style.top = scTop + "px";
this.element.style.left = scLeft + "px";
if (document.all) {  this.element.style.width = w;
}
this.element.style.height = h; 
} 
},

isParent: function(element, parent) { 
if (element.parentNode == parent)
return true;
if (typeof(element.parentNode) == "undefined" ||
element.parentNode == document.body)
return false;
return this.isParent(element.parentNode, parent); 
},

hideSelectBoxes : function() { 
if (Wicket.Browser.isIE() && Wicket.Browser.isIE7() == false) {
var win = Wicket.Window.current; 
this.boxes = new Array();
var selects = this.document.getElementsByTagName("select");
for (var i = 0; i < selects.length; i++) { 
var element = selects[i];
  if (win.isIframe() == false && this.isParent(element, win.content)) {
continue;
} 
if (element.style.visibility != "hidden") {
element.style.visibility = "hidden";
this.boxes.push(element);
} 
}
}
},

showSelectBoxes: function() {
if (typeof (this.boxes) != "undefined") {
for (var i = 0; i < this.boxes.length; ++i) {
var element = this.boxes[i];
element.style.visibility="visible";
}
this.boxes = null;
} 
},

disableFocusElement: function(element, revertList) {
if (typeof(Wicket.Window.current) != "undefined" &&
Wicket.Window.current != null &&
Wicket.Window.current.window != element) { 
revertList.push([element, element.onfocus]);
element.onfocus = function() { element.blur(); } 
for (var i = 0; i < element.childNodes.length; ++i) {
this.disableFocusElement(element.childNodes[i], revertList);
}
}
},

disableFocus: function() {
  if (Wicket.Browser.isIE() == false) { 
this.focusRevertList = new Array(); 
var body = this.document.getElementsByTagName("body")[0]; 
for (var i = 0; i < body.childNodes.length; ++i) { 
this.disableFocusElement(body.childNodes[i], this.focusRevertList);
}
}
},

enableFocus: function() {
if (typeof(this.focusRevertList) != "undefined") { 
for (var i = 0; i < this.focusRevertList.length; ++i) {
var item = this.focusRevertList[i];
item[0].onfocus = item[1];
}
}
this.focusRevertList = null;
},

disableTabs: function () { 
this.tabbableTags = new Array("A","BUTTON","TEXTAREA","INPUT","IFRAME", "SELECT");
if (Wicket.Browser.isIE()) {
var win = Wicket.Window.current; 
this.tabsAreDisabled = 'true';
for (var j = 0; j < this.tabbableTags.length; j++) {
var tagElements = this.document.getElementsByTagName(this.tabbableTags[j]);
for (var k = 0 ; k < tagElements.length; k++) {
  if (win.isIframe() == true || this.isParent(tagElements[k], win.content) == false) {
var element = tagElements[k];
element.hiddenTabIndex = element.tabIndex;
element.tabIndex="-1";
}
}
}
}
},

restoreTabs: function() {
if (typeof(this.tabsAreDisabled) != 'undefined') {
for (var j = 0; j < this.tabbableTags.length; j++) {
var tagElements = this.document.getElementsByTagName(this.tabbableTags[j]);
for (var k = 0 ; k < tagElements.length; k++) {
var element = tagElements[k];
if (typeof(element.hiddenTabIndex) != 'undefined') {
element.tabIndex = element.hiddenTabIndex;
element.hiddenTabIndex = null;
}
element.tabEnabled = true;
}
}
this.tabsAreDisabled = null;
}
}
}

Wicket.Window.getViewportHeight = function() {
if (window.innerHeight != window.undefined)
return window.innerHeight;
if (document.compatMode == 'CSS1Compat')
return document.documentElement.clientHeight;
if (document.body)
return document.body.clientHeight;
return window.undefined;
}

Wicket.Window.getViewportWidth = function() {
if (window.innerWidth != window.undefined)
return window.innerWidth;
if (document.compatMode == 'CSS1Compat')
return document.documentElement.clientWidth;
if (document.body)
return document.body.clientWidth;
return window.undefined;
}

Wicket.Window.getScrollX = function() {
var iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body
return document.all? iebody.scrollLeft : pageXOffset
}

Wicket.Window.getScrollY = function() {
var iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body
return document.all? iebody.scrollTop : pageYOffset
}

Wicket.Cookie = {

get: function(name) {
if (document.cookie.length > 0) {
var start = document.cookie.indexOf (name + "=");
if (start != -1) {
start = start + name.length + 1;
end = document.cookie.indexOf(";", start);
if (end == -1) {
end = document.cookie.length;
}
return unescape(document.cookie.substring(start,end))
}
} else {
return null
}
},

set: function(name, value, expiredays) {
var exdate = new Date();
exdate.setDate(exdate.getDate() + expiredays);
document.cookie = name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate);
}
};
