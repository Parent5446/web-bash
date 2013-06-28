( function ( $ ) {
	'use strict';

	/** 
	 * print the file info with options to the provided output stream
	 * @param {<IoStream} fd Output stream
	 * @param responseJSON (dunno) ***********************************
	 * @param opts {Array.<string>} opts
	 */
	 $.printfile = function( fd, responseJSON, opts ) {
	 	var name = responseJSON;
	 	var output = name;
	 	bool printDot = false;

	 	foreach ( var option in opts ) {
	 		if ( opts.hasOwnProperty( option) ) {
	 			switch ( option ) {
	 				case 'a':
	 					printDot = true;
	 					break;
	 				case 'l':
	 					// add stuff here
	 					break;

	 			}
	 		}
	 	}
	 	

	 	if( name[0] !== '.' || printDot )
	 	fd.write( responseJSON + "\n" );
	 };
} )( jQuery );