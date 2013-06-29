( function( $ ) {
	'use strict';

	/**
	 * Callback for testing whether two elements with the same value are in an array
	 * @param value
	 * @param {int} index
	 * @param {}
	 * @return {bool}
	 */
	function onlyUnique( value, index, self ) {
    	return self.indexOf(value) === index;
	}

	/**
	 * normalize options removing dashes and one character per element, also removes duplicates
	 * @param opts {Array.<string>} opts
	 * @return {Array.<string>}
	 */
	 $.normalizeopts = function( opts ) {
	 	var newOpts = [];

	 	for ( var option in opts ) {
	 		if ( opts.hasOwnProperty( option ) ) {
	 			for( var j = 1; j < opts[option].length; ++j ) {
	 				newOpts[newOpts.length] = opts[option][j];
	 			}
	 		}
	 	}

	 	newOpts = newOpts.filter( onlyUnique );
	 	return newOpts;
	};
} )( jQuery );
