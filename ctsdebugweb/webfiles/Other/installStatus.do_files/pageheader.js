function launchSearch() {
	var webapp = window.location.pathname.split('/')[1];
	window.open('/' + webapp + '/searchDoc.do', 'SearchDoc', 'width=670,height=670,toolbar=no,resizable=yes,scrollbars=yes');
} 