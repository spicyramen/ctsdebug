

jQuery.ui
|| (function(a) {
a.ui = {
version : "1.8",
plugin : {
add : function(c, d, f) {
var e = a.ui[c].prototype;
for ( var b in f) {
e.plugins[b] = e.plugins[b] || [];
e.plugins[b].push( [ d, f[b] ])
}
},
call : function(b, d, c) {
var f = b.plugins[d];
if (!f || !b.element[0].parentNode) {
return
}
for ( var e = 0; e < f.length; e++) {
if (b.options[f[e][0]]) {
f[e][1].apply(b.element, c)
}
}
}
},
contains : function(d, c) {
return document.compareDocumentPosition ? d
.compareDocumentPosition(c) & 16 : d !== c
&& d.contains(c)
},
hasScroll : function(e, c) {
if (a(e).css("overflow") == "hidden") {
return false
}
var b = (c && c == "left") ? "scrollLeft" : "scrollTop", d = false;
if (e[b] > 0) {
return true
}
e[b] = 1;
d = (e[b] > 0);
e[b] = 0;
return d
},
isOverAxis : function(c, b, d) {
return (c > b) && (c < (b + d))
},
isOver : function(g, c, f, e, b, d) {
return a.ui.isOverAxis(g, f, b) && a.ui.isOverAxis(c, e, d)
},
keyCode : {
BACKSPACE : 8,
CAPS_LOCK : 20,
COMMA : 188,
CONTROL : 17,
DELETE : 46,
DOWN : 40,
END : 35,
ENTER : 13,
ESCAPE : 27,
HOME : 36,
INSERT : 45,
LEFT : 37,
NUMPAD_ADD : 107,
NUMPAD_DECIMAL : 110,
NUMPAD_DIVIDE : 111,
NUMPAD_ENTER : 108,
NUMPAD_MULTIPLY : 106,
NUMPAD_SUBTRACT : 109,
PAGE_DOWN : 34,
PAGE_UP : 33,
PERIOD : 190,
RIGHT : 39,
SHIFT : 16,
SPACE : 32,
TAB : 9,
UP : 38
}
};
a.fn
.extend( {
_focus : a.fn.focus,
focus : function(b, c) {
return typeof b === "number" ? this
.each(function() {
var d = this;
setTimeout(function() {
a(d).focus();
(c && c.call(d))
}, b)
}) : this._focus.apply(this, arguments)
},
enableSelection : function() {
return this.attr("unselectable", "off").css(
"MozUserSelect", "").unbind(
"selectstart.ui")
},
disableSelection : function() {
return this.attr("unselectable", "on").css(
"MozUserSelect", "none").bind(
"selectstart.ui", function() {
return false
})
},
scrollParent : function() {
var b;
if ((a.browser.msie && (/(static|relative)/)
.test(this.css("position")))
|| (/absolute/).test(this.css("position"))) {
b = this
.parents()
.filter(
function() {
return (/(relative|absolute|fixed)/)
.test(a.curCSS(
this,
"position",
1))
&& (/(auto|scroll)/)
.test(a
.curCSS(
this,
"overflow",
1)
+ a
.curCSS(
this,
"overflow-y",
1)
+ a
.curCSS(
this,
"overflow-x",
1))
}).eq(0)
} else {
b = this
.parents()
.filter(
function() {
return (/(auto|scroll)/)
.test(a.curCSS(
this,
"overflow",
1)
+ a
.curCSS(
this,
"overflow-y",
1)
+ a
.curCSS(
this,
"overflow-x",
1))
}).eq(0)
}
return (/fixed/).test(this.css("position"))
|| !b.length ? a(document) : b
},
zIndex : function(e) {
if (e !== undefined) {
return this.css("zIndex", e)
}
if (this.length) {
var c = a(this[0]), b, d;
while (c.length && c[0] !== document) {
b = c.css("position");
if (b == "absolute" || b == "relative"
|| b == "fixed") {
d = parseInt(c.css("zIndex"));
if (!isNaN(d) && d != 0) {
return d
}
}
c = c.parent()
}
}
return 0
}
});
a.extend(a.expr[":"],
{
data : function(d, c, b) {
return !!a.data(d, b[3])
},
focusable : function(c) {
var d = c.nodeName.toLowerCase(), b = a.attr(c,
"tabindex");
return (/input|select|textarea|button|object/
.test(d) ? !c.disabled : "a" == d
|| "area" == d ? c.href || !isNaN(b)
: !isNaN(b))
&& !a(c)["area" == d ? "parents"
: "closest"](":hidden").length
},
tabbable : function(c) {
var b = a.attr(c, "tabindex");
return (isNaN(b) || b >= 0)
&& a(c).is(":focusable")
}
})
})(jQuery);;

(function(b) {
var a = b.fn.remove;
b.fn.remove = function(c, d) {
return this.each(function() {
if (!d) {
if (!c || b.filter(c, [ this ]).length) {
b("*", this).add(this).each(function() {
b(this).triggerHandler("remove")
})
}
}
return a.call(b(this), c, d)
})
};
b.widget = function(d, f, c) {
var e = d.split(".")[0], h;
d = d.split(".")[1];
h = e + "-" + d;
if (!c) {
c = f;
f = b.Widget
}
b.expr[":"][h] = function(i) {
return !!b.data(i, d)
};
b[e] = b[e] || {};
b[e][d] = function(i, j) {
if (arguments.length) {
this._createWidget(i, j)
}
};
var g = new f();
g.options = b.extend( {}, g.options);
b[e][d].prototype = b.extend(true, g, {
namespace : e,
widgetName : d,
widgetEventPrefix : b[e][d].prototype.widgetEventPrefix || d,
widgetBaseClass : h
}, c);
b.widget.bridge(d, b[e][d])
};
b.widget.bridge = function(d, c) {
b.fn[d] = function(g) {
var e = typeof g === "string", f = Array.prototype.slice.call(
arguments, 1), h = this;
g = !e && f.length ? b.extend.apply(null, [ true, g ].concat(f))
: g;
if (e && g.substring(0, 1) === "_") {
return h
}
if (e) {
this.each(function() {
var i = b.data(this, d), j = i && b.isFunction(i[g]) ? i[g]
.apply(i, f) : i;
if (j !== i && j !== undefined) {
h = j;
return false
}
})
} else {
this.each(function() {
var i = b.data(this, d);
if (i) {
if (g) {
i.option(g)
}
i._init()
} else {
b.data(this, d, new c(g, this))
}
})
}
return h
}
};
b.Widget = function(c, d) {
if (arguments.length) {
this._createWidget(c, d)
}
};
b.Widget.prototype = {
widgetName : "widget",
widgetEventPrefix : "",
options : {
disabled : false
},
_createWidget : function(d, e) {
this.element = b(e).data(this.widgetName, this);
this.options = b.extend(true, {}, this.options, b.metadata
&& b.metadata.get(e)[this.widgetName], d);
var c = this;
this.element.bind("remove." + this.widgetName, function() {
c.destroy()
});
this._create();
this._init()
},
_create : function() {
},
_init : function() {
},
destroy : function() {
this.element.unbind("." + this.widgetName).removeData(
this.widgetName);
this.widget().unbind("." + this.widgetName).removeAttr(
"aria-disabled").removeClass(
this.widgetBaseClass + "-disabled " + this.namespace
+ "-state-disabled")
},
widget : function() {
return this.element
},
option : function(e, f) {
var d = e, c = this;
if (arguments.length === 0) {
return b.extend( {}, c.options)
}
if (typeof e === "string") {
if (f === undefined) {
return this.options[e]
}
d = {};
d[e] = f
}
b.each(d, function(g, h) {
c._setOption(g, h)
});
return c
},
_setOption : function(c, d) {
this.options[c] = d;
if (c === "disabled") {
this.widget()[d ? "addClass" : "removeClass"](
this.widgetBaseClass + "-disabled " + this.namespace
+ "-state-disabled").attr("aria-disabled", d)
}
return this
},
enable : function() {
return this._setOption("disabled", false)
},
disable : function() {
return this._setOption("disabled", true)
},
_trigger : function(d, e, f) {
var h = this.options[d];
e = b.Event(e);
e.type = (d === this.widgetEventPrefix ? d : this.widgetEventPrefix
+ d).toLowerCase();
f = f || {};
if (e.originalEvent) {
for ( var c = b.event.props.length, g; c;) {
g = b.event.props[--c];
e[g] = e.originalEvent[g]
}
}
this.element.trigger(e, f);
return !(b.isFunction(h) && h.call(this.element[0], e, f) === false || e
.isDefaultPrevented())
}
}
})(jQuery);;
(function(a) {
a
.widget(
"ui.accordion",
{
options : {
active : 0,
animated : "slide",
autoHeight : true,
clearStyle : false,
collapsible : false,
event : "click",
fillSpace : false,
header : "> li > :first-child,> :not(li):even",
icons : {
header : "ui-icon-triangle-1-e",
headerSelected : "ui-icon-triangle-1-s"
},
navigation : false,
navigationFilter : function() {
return this.href.toLowerCase() == location.href
.toLowerCase()
}
},
_create : function() {
var d = this.options, b = this;
this.running = 0;
this.element
.addClass("ui-accordion ui-widget ui-helper-reset");
if (this.element[0].nodeName == "UL") {
this.element.children("li").addClass(
"ui-accordion-li-fix")
}
this.headers = this.element
.find(d.header)
.addClass(
"ui-accordion-header ui-helper-reset ui-state-default ui-corner-all")
.bind("mouseenter.accordion", function() {
a(this).addClass("ui-state-hover")
}).bind("mouseleave.accordion", function() {
a(this).removeClass("ui-state-hover")
}).bind("focus.accordion", function() {
a(this).addClass("ui-state-focus")
}).bind("blur.accordion", function() {
a(this).removeClass("ui-state-focus")
});
this.headers
.next()
.addClass(
"ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
if (d.navigation) {
var c = this.element.find("a").filter(
d.navigationFilter);
if (c.length) {
var e = c.closest(".ui-accordion-header");
if (e.length) {
this.active = e
} else {
this.active = c.closest(
".ui-accordion-content").prev()
}
}
}
this.active = this._findActive(
this.active || d.active).toggleClass(
"ui-state-default").toggleClass(
"ui-state-active").toggleClass(
"ui-corner-all").toggleClass(
"ui-corner-top");
this.active.next().addClass(
"ui-accordion-content-active");
this._createIcons();
if (a.browser.msie) {
this.element.find("a").css("zoom", "1")
}
this.resize();
this.element.attr("role", "tablist");
this.headers.attr("role", "tab").bind("keydown",
function(f) {
return b._keydown(f)
}).next().attr("role", "tabpanel");
this.headers.not(this.active || "").attr(
"aria-expanded", "false").attr("tabIndex",
"-1").next().hide();
if (!this.active.length) {
this.headers.eq(0).attr("tabIndex", "0")
} else {
this.active.attr("aria-expanded", "true").attr(
"tabIndex", "0")
}
if (!a.browser.safari) {
this.headers.find("a").attr("tabIndex", "-1")
}
if (d.event) {
this.headers.bind((d.event) + ".accordion",
function(f) {
b._clickHandler.call(b, f, this);
f.preventDefault()
})
}
},
_createIcons : function() {
var b = this.options;
if (b.icons) {
a("<span/>").addClass(
"ui-icon " + b.icons.header).prependTo(
this.headers);
this.active.find(".ui-icon").toggleClass(
b.icons.header).toggleClass(
b.icons.headerSelected);
this.element.addClass("ui-accordion-icons")
}
},
_destroyIcons : function() {
this.headers.children(".ui-icon").remove();
this.element.removeClass("ui-accordion-icons")
},
destroy : function() {
var c = this.options;
this.element.removeClass(
"ui-accordion ui-widget ui-helper-reset")
.removeAttr("role").unbind(".accordion")
.removeData("accordion");
this.headers
.unbind(".accordion")
.removeClass(
"ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top")
.removeAttr("role").removeAttr(
"aria-expanded").removeAttr(
"tabindex");
this.headers.find("a").removeAttr("tabindex");
this._destroyIcons();
var b = this.headers
.next()
.css("display", "")
.removeAttr("role")
.removeClass(
"ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active");
if (c.autoHeight || c.fillHeight) {
b.css("height", "")
}
return this
},
_setOption : function(b, c) {
a.Widget.prototype._setOption
.apply(this, arguments);
if (b == "active") {
this.activate(c)
}
if (b == "icons") {
this._destroyIcons();
if (c) {
this._createIcons()
}
}
},
_keydown : function(e) {
var g = this.options, f = a.ui.keyCode;
if (g.disabled || e.altKey || e.ctrlKey) {
return
}
var d = this.headers.length;
var b = this.headers.index(e.target);
var c = false;
switch (e.keyCode) {
case f.RIGHT:
case f.DOWN:
c = this.headers[(b + 1) % d];
break;
case f.LEFT:
case f.UP:
c = this.headers[(b - 1 + d) % d];
break;
case f.SPACE:
case f.ENTER:
this._clickHandler( {
target : e.target
}, e.target);
e.preventDefault()
}
if (c) {
a(e.target).attr("tabIndex", "-1");
a(c).attr("tabIndex", "0");
c.focus();
return false
}
return true
},
resize : function() {
var d = this.options, c;
if (d.fillSpace) {
if (a.browser.msie) {
var b = this.element.parent().css(
"overflow");
this.element.parent().css("overflow",
"hidden")
}
c = this.element.parent().height();
if (a.browser.msie) {
this.element.parent().css("overflow", b)
}
this.headers.each(function() {
c -= a(this).outerHeight(true)
});
this.headers
.next()
.each(
function() {
a(this)
.height(
Math
.max(
0,
c
- a(
this)
.innerHeight()
+ a(
this)
.height()))
}).css("overflow", "auto")
} else {
if (d.autoHeight) {
c = 0;
this.headers.next().each(function() {
c = Math.max(c, a(this).height())
}).height(c)
}
}
return this
},
activate : function(b) {
this.options.active = b;
var c = this._findActive(b)[0];
this._clickHandler( {
target : c
}, c);
return this
},
_findActive : function(b) {
return b ? typeof b == "number" ? this.headers
.filter(":eq(" + b + ")") : this.headers
.not(this.headers.not(b))
: b === false ? a( []) : this.headers
.filter(":eq(0)")
},
_clickHandler : function(b, f) {
var d = this.options;
if (d.disabled) {
return
}
if (!b.target) {
if (!d.collapsible) {
return
}
this.active
.removeClass(
"ui-state-active ui-corner-top")
.addClass(
"ui-state-default ui-corner-all")
.find(".ui-icon").removeClass(
d.icons.headerSelected)
.addClass(d.icons.header);
this.active.next().addClass(
"ui-accordion-content-active");
var h = this.active.next(), e = {
options : d,
newHeader : a( []),
oldHeader : d.active,
newContent : a( []),
oldContent : h
}, c = (this.active = a( []));
this._toggle(c, h, e);
return
}
var g = a(b.currentTarget || f);
var i = g[0] == this.active[0];
d.active = d.collapsible && i ? false : a(
".ui-accordion-header", this.element)
.index(g);
if (this.running || (!d.collapsible && i)) {
return
}
this.active.removeClass(
"ui-state-active ui-corner-top").addClass(
"ui-state-default ui-corner-all").find(
".ui-icon").removeClass(
d.icons.headerSelected).addClass(
d.icons.header);
if (!i) {
g
.removeClass(
"ui-state-default ui-corner-all")
.addClass(
"ui-state-active ui-corner-top")
.find(".ui-icon").removeClass(
d.icons.header).addClass(
d.icons.headerSelected);
g
.next()
.addClass("ui-accordion-content-active")
}
var c = g.next(), h = this.active.next(), e = {
options : d,
newHeader : i && d.collapsible ? a( []) : g,
oldHeader : this.active,
newContent : i && d.collapsible ? a( []) : c,
oldContent : h
}, j = this.headers.index(this.active[0]) > this.headers
.index(g[0]);
this.active = i ? a( []) : g;
this._toggle(c, h, e, i, j);
return
},
_toggle : function(b, i, g, j, k) {
var d = this.options, m = this;
this.toShow = b;
this.toHide = i;
this.data = g;
var c = function() {
if (!m) {
return
}
return m._completed.apply(m, arguments)
};
this._trigger("changestart", null, this.data);
this.running = i.size() === 0 ? b.size() : i.size();
if (d.animated) {
var f = {};
if (d.collapsible && j) {
f = {
toShow : a( []),
toHide : i,
complete : c,
down : k,
autoHeight : d.autoHeight
|| d.fillSpace
}
} else {
f = {
toShow : b,
toHide : i,
complete : c,
down : k,
autoHeight : d.autoHeight
|| d.fillSpace
}
}
if (!d.proxied) {
d.proxied = d.animated
}
if (!d.proxiedDuration) {
d.proxiedDuration = d.duration
}
d.animated = a.isFunction(d.proxied) ? d
.proxied(f) : d.proxied;
d.duration = a.isFunction(d.proxiedDuration) ? d
.proxiedDuration(f)
: d.proxiedDuration;
var l = a.ui.accordion.animations, e = d.duration, h = d.animated;
if (h && !l[h] && !a.easing[h]) {
h = "slide"
}
if (!l[h]) {
l[h] = function(n) {
this.slide(n, {
easing : h,
duration : e || 700
})
}
}
l[h](f)
} else {
if (d.collapsible && j) {
b.toggle()
} else {
i.hide();
b.show()
}
c(true)
}
i.prev().attr("aria-expanded", "false").attr(
"tabIndex", "-1").blur();
b.prev().attr("aria-expanded", "true").attr(
"tabIndex", "0").focus()
},
_completed : function(b) {
var c = this.options;
this.running = b ? 0 : --this.running;
if (this.running) {
return
}
if (c.clearStyle) {
this.toShow.add(this.toHide).css( {
height : "",
overflow : ""
})
}
this.toHide
.removeClass("ui-accordion-content-active");
this._trigger("change", null, this.data)
}
});
a
.extend(
a.ui.accordion,
{
version : "1.8",
animations : {
slide : function(j, h) {
j = a.extend( {
easing : "swing",
duration : 300
}, j, h);
if (!j.toHide.size()) {
j.toShow.animate( {
height : "show"
}, j);
return
}
if (!j.toShow.size()) {
j.toHide.animate( {
height : "hide"
}, j);
return
}
var c = j.toShow.css("overflow"), g = 0, d = {}, f = {}, e = [
"height", "paddingTop", "paddingBottom" ], b;
var i = j.toShow;
b = i[0].style.width;
i.width(parseInt(i.parent().width(), 10)
- parseInt(i.css("paddingLeft"), 10)
- parseInt(i.css("paddingRight"), 10)
- (parseInt(i.css("borderLeftWidth"),
10) || 0)
- (parseInt(i.css("borderRightWidth"),
10) || 0));
a.each(e, function(k, m) {
f[m] = "hide";
var l = ("" + a.css(j.toShow[0], m))
.match(/^([\d+-.]+)(.*)$/);
d[m] = {
value : l[1],
unit : l[2] || "px"
}
});
j.toShow.css( {
height : 0,
overflow : "hidden"
}).show();
j.toHide
.filter(":hidden")
.each(j.complete)
.end()
.filter(":visible")
.animate(
f,
{
step : function(k, l) {
if (l.prop == "height") {
g = (l.end
- l.start === 0) ? 0
: (l.now - l.start)
/ (l.end - l.start)
}
j.toShow[0].style[l.prop] = (g * d[l.prop].value)
+ d[l.prop].unit
},
duration : j.duration,
easing : j.easing,
complete : function() {
if (!j.autoHeight) {
j.toShow.css(
"height",
"")
}
j.toShow
.css("width", b);
j.toShow.css( {
overflow : c
});
j.complete()
}
})
},
bounceslide : function(b) {
this.slide(b,
{
easing : b.down ? "easeOutBounce"
: "swing",
duration : b.down ? 1000 : 200
})
}
}
})
})(jQuery);;