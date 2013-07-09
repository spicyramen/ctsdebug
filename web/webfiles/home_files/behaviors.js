function fixAccordionActiveElementScrollOnIE7()
{
	if ($.browser.msie && $.browser.version.substr(0,1) == "7")
	{		
		$(document).ready(function() {
			$('div.ui-accordion-content-active').css('overflow', 'visible');
		});
	}
}

function formFocusFirstField()
{
	$(document).ready(function() {
		$("form :text:gt(1)").first().focus();
	});
}

function fixChildContentHeight()
{
	$(document).ready(function() {
		// Make sure the child container is smaller than the navigation panel as that affects
		// the outerHeight calculations.  Set it small, calculate, then reset child container height.
		$("div#child").css('min-height', 200);
		$('div#child').css('height', 'auto');
		var heightWithoutToolbar = $('#navigation').innerHeight() - $('#toolbar').outerHeight() - 40;
		var toolbarBuffer = 6;
		var adjustedHeight = heightWithoutToolbar;
		if ($("div#toolbar")[0] == null)
		{	
			adjustedHeight = heightWithoutToolbar + toolbarBuffer;
		}
		$("div#child").css('min-height', adjustedHeight);
		$('div#child').css('height', 'auto');
	});
}

function convertButtons()
{
	$(document).ready(function() {
		attachKubrickButtonStyle('input[type=submit], input[type=button], button');
	});
}

function attachKubrickButtonStyle(selector)
{
	var buttons = $(selector);
	if (buttons)
	{
		buttons.addClass('kubrickButton');
		buttons.hover(
			function() {
				$(this).addClass('kubrickButtonHover');
			},
			function() {
				$(this).removeClass('kubrickButtonHover');
			});
		buttons.mousedown(
			function() {
				$(this).addClass('kubrickButtonClick');
			});
		buttons.mouseup(
				function() {
					$(this).removeClass('kubrickButtonClick');
				});
		buttons.mouseout(
				function() {
					$(this).removeClass('kubrickButtonClick');
					$(this).removeClass('kubrickButtonHover');
				});
	}
}

function attachCheckAllBehavior(selector)
{
	$(document).ready(function() {
		var masterCheck = $(selector);
		masterCheck.click(function() {
		    var newState = masterCheck.attr('checked');
		    masterCheck.closest('form').find('input[type=checkbox]').each(function(){
		        $(this).attr('checked', newState);
		    });
		    if (newState) {
		    	$('#actionBar').fadeIn();
		    }
		    else {
		    	$('#actionBar').fadeOut();
		    }
		});
	});
}

function attachCheckAnyBehavior(selector, animate)
{
	$(document).ready(function() {
		var actionBar = $('#actionBar');
	    $(selector).click(function(){
	        // traverse the form and find clicked checkboxes
	        var foundChecked = false;
	        $(this).closest('form').find('input[type=checkbox]').each(function(){
	            if (foundChecked != true) {
	                foundChecked = $(this).attr('checked');
	            }
	        });
	        if (foundChecked) {
	            if (animate) actionBar.fadeIn(); else actionBar.show();
	        }
	        else {
	            if (animate) actionBar.fadeOut(); else actionBar.hide();
	        }
	   });
	});
}

function setupWarnIfBrowserUnsupported(unsupportedText) {
	$(document).ready(function() {
		var ie6 = jQuery.browser.msie && (jQuery.browser.version.substr(0,1)=="6");
		if (ie6) {
			alert(unsupportedText);
		}
		var ie7 = jQuery.browser.msie && (jQuery.browser.version.substr(0,1)=="7");
		var ie8 = jQuery.browser.msie && (jQuery.browser.version.substr(0,1)=="8");
		var firefox3plus = jQuery.browser.mozilla && (jQuery.browser.version.substr(0,3)=="1.9");
		
		if (! (ie7 || ie8 || firefox3plus)) {
			$('#browserWarning').css('display', 'block');
		}
	});
}