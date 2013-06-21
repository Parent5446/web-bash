( function( $, WebBash ) {
	'use strict';

	WebBash.commands.false = function() {
		return 1;
	};

	WebBash.commands.true = function() {
		return 0;
	}
} )( jQuery, WebBash );
