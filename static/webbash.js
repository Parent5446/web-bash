( function() {
	'use strict';

	$( document ).ready( function() {
		var controller = new WebBashLogin();
		var terminal = new Terminal();
		terminal.bind( controller );
	} );
} )();
