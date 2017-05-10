
function winBRopen(theURL, Name, popW, popH, scroll, resize) { // V 1.0
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = 'width='+popW+',height='+popH+',left='+winleft+',top='+winUp+',scrollbars='+scroll+',resizable='+resize+'';
	Win = window.open(theURL, Name, winProp);
	Win.window.focus();
}


