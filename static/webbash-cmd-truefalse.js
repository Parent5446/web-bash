( function( $, WebBash ) {
	'use strict';

	/**
	 * Do nothing, unsuccessfully
	 * @return {number} Always returns 1
	 */
	WebBash.commands.false = function() {
		return 1;
	};

	/**
	 * Do nothing, successfully
	 * @return {number} Always return 0
	 */
	WebBash.commands.true = function() {
		return 0;
	};
} )( jQuery, WebBash );
