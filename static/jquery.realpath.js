/**
 * Normalize a path by removing dot references
 * @param {string} path
 * @return {string}
 */
jQuery.fn.realpath = function( path, cwd, home ) {
	'use strict';

	var prefix = path[0];
	if ( prefix === '~' ) {
		path = home + '/' + path;
	} else if ( prefix !== '/' ) {
		path = cwd + '/' + path;
	}

	var parts = path.substr( 1 ) .split( '/' );
	var finalparts = [];

	for ( var i = 0; i < parts.length; i++ ) {
		if ( parts[i] === '.' || parts[i] === '' ) {
			continue;
		} else if ( parts[i] === '..' ) {
			finalparts.pop();
		} else {
			finalparts.push( parts[i] );
		}
	}

	return '/' + finalparts.join( '/' );
};
