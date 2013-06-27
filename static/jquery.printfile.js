( function ( $ ) {
	'use strict';

	/** 
	 * print the file info with options to the provided output stream
	 * @param {<IoStream} fd Output stream
	 * @param responseJSON (dunno) ***********************************
	 * @param opts {Array.<string>} opts
	 */

	 $.printfile = function( fd, responseJSON, opts ) {
	 	fd.write( responseJSON + "\n" );
	 };
} )( jQuery );