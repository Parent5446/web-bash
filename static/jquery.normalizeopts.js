( function( $ ) {
	'use strict';

	/** 
	 * normalize options removing dashes and one character per element
	 * @param opts {Array.<string>} opts
	 * @return {Array.<string>}
	 */
	 $.realoptions = function( opts ) {
	 	var newOpts = [];
	 	
	 	for ( var option in opts ) {
	 		for( var j = 1; j < option.length; ++j ) {
	 			newOpts[newOpts.length] = option[j];
	 		}
	 	}

	 	return newOpts;
	};
} )( jQuery );