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
 * Parse an array to get the options
 * @param {Array.<string>} argv
 * @param {string} optstring
 * @return {Array.<Array.<string>|Object.<string, *>>}
 */
$.getopt = function( argv, optstring ) {
	'use strict';

	var opts = {};
	var args = [argv[0]];

	for ( var i = 1; i < argv.length; i++ ) {
		if ( argv[i][0] !== '-' ) {
			if ( optstring[0] === '+' ) {
				args = $.merge( args, argv.slice( i ) );
				break;
			} else {
				args.push( argv[i] );
				continue;
			}
		} else if ( argv[i] === '--' ) {
			args = $.merge( args, argv.slice( i ) );
			break;
		}

		for ( var j = 1; j < argv[i].length; j++ ) {
			var opt = argv[i][j];
			var index = optstring.indexOf( opt );

			if ( index === -1 ) {
				return [ "Unknown option -" + opt, argv ];
			} else if ( optstring[index + 1] === ':' ) {
				if ( j === argv[i].length - 1 && argv[i + 1][0] !== '-' ) {
					opts[opt] = argv[++i];
				} else if ( optstring[index + 2] !== ':' ) {
					return "Option -" + opt + " requires an argument";
				} else {
					opts[opt] = true;
				}
			} else {
				opts[opt] = true;
			}
		}
	}

	return [opts, args];
};
