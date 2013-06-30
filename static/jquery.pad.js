/*
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 */

/**
 * Pad a string to a certain length
 * @param {string} str String to pad
 * @param {numeric=} len Length to pad to
 * @param {string=} pad Padding character, default is space
 * @param {string=} dir Constant for what side to pad on
 * @return {string}
 */
jQuery.fn.pad = function( str, len, pad, dir ) {
	'use strict';

	if ( typeof( len ) === "undefined" ) {
		len = 0;
	}
	if ( typeof( pad ) === "undefined" ) {
		pad = ' ';
	}
	if ( typeof( dir ) === "undefined" ) {
		dir = 'left';
	}
 
	if ( len + 1 >= str.length ) {
		switch ( dir ){
			case 'left':
				str = new Array( len + 1 - str.length ).join( pad ) + str;
				break;

			case 'both':
				var padlen = len - str.length;
				var right = Math.ceil( ( padlen ) / 2 );
				var left = padlen - right;
				str = new Array( left + 1 ).join( pad ) + str + new Array( right + 1 ).join( pad );
				break;

			default:
				str = str + new Array( len + 1 - str.length ).join( pad );
				break;
		}
	}

	return str;
};