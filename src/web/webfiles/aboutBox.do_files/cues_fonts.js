function cuesAdjustFonts()
{
  var fontScale = 1;
  // default browser font size is 16px in Firefox and 12pt in IE
  var baseSize = 16;
  // .65 = 10px
  // .70 = 11px default for 5.4
  // .75 = 12px default for 6.0
  // .80 = 13px
  // .85 = 14px
  var ratio = .75;
  var mybaseSize = Math.round(baseSize * ratio);

  var isIE = navigator.userAgent.indexOf("MSIE")!=-1;
  if(isIE)
  try
  {
    var baseFont = document.documentElement.currentStyle.fontSize; // only valid in IE
    baseSize = parseInt(baseFont);
    var baseType = baseFont.replace(baseSize+"","");
    if(baseType!="pt") return; // if someone else has set font size, bail out
    fontScale = baseSize/12;
    //cuesLog("baseFont="+baseFont+" baseSize="+baseSize+" fontScale="+fontScale+" switch="+Math.floor(fontScale*100));
    switch(Math.floor(fontScale*100))
    {
      case 75:
        document.documentElement.className += " IESmallestText";
        break;
      case 83:
        document.documentElement.className += " IESmallerText";
        break;
      case 100:
        document.documentElement.className += " IENormalText";
        break;
      case 116:
        document.documentElement.className += " IELargerText";
        break;
      case 133:
        document.documentElement.className += " IELargestText";
        break;
    }
  }catch(e){}  
  document.documentElement.style.fontSize = Math.round(fontScale*mybaseSize)+"px";
}
cuesAdjustFonts();
