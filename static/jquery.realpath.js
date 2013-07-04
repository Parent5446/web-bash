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
