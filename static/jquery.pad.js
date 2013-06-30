( function( $ ) {
	'use strict';

	/*
	 *  Javascript string pad
	 *  http://www.webtoolkit.info/
	 */

	/**
	 * Pad a string to a certain length
	 * @param {string} str String to pad
	 * @param {numeric=} len Length to pad to
	 * @param {string=} pad Padding character, default is space
	 * @param {numeric=} dir Constant for what side to pad on
	 * @return {string}
	 */
	$.pad = function( str, len, pad, dir ) {
		if ( typeof( len ) === "undefined" ) {
			len = 0;
		}
		if ( typeof( pad ) === "undefined" ) {
			pad = ' ';
		}
		if ( typeof( dir ) === "undefined" ) {
			dir = $.pad.STR_PAD_RIGHT;
		}
	 
		if ( len + 1 >= str.length ) {
			switch ( dir ){
				case $.pad.STR_PAD_LEFT:
					str = new Array( len + 1 - str.length ).join( pad ) + str;
					break;

				case $.pad.STR_PAD_BOTH:
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

	/**
	 * Pad on the left
	 * @const
	 * @type {numeric}
	 */
	$.pad.STR_PAD_LEFT = 1;
	
	/**
	 * Pad on the right
	 * @const
	 * @type {numeric}
	 */
	$.pad.STR_PAD_RIGHT = 2;
	
	/**
	 * Pad on both sides
	 * @const
	 * @type {numeric}
	 */
	$.pad.STR_PAD_BOTH = 3;
} )( jQuery );