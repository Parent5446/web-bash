/**
 * Copyright (C) 2013 Tyler Romeo, Krzysztof Jordan, Nicholas Bevaqua
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 */

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
