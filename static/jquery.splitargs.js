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
 * Split a command into an argument array
 * @private
 * @param {string} txt
 * @return {Array.<string>}
 */
jQuery.fn.splitArgs = function( txt ) {
	'use strict';

	var cmd = "",
		split_text = [],
		inQuote = false,
		inDoubleQuote = false,
		backslash = false;

	for ( var i = 0; i < txt.length; i++ ) {
		if ( txt[i] === ' ' && ( inQuote || inDoubleQuote ) ) {
			cmd += txt[i];
		} else if ( txt[i] === ' ' && !( inQuote || inDoubleQuote ) ) {
			if ( cmd.length > 0 ) {
				split_text.push(cmd);
				cmd = "";
			}
			continue;
		} else if ( txt[i] === '\\' ) {
			if ( backslash || inQuote ) {
				cmd += '\\';
				backslash = false;
			} else {
				backslash = true;
			}
		} else if ( txt[i] === '\'' ) {
			if ( backslash ) {
				cmd += '\'';
				backslash = false;
			} else if ( inDoubleQuote ) {
				cmd += '\'';
			} else {
				inQuote = !inQuote;
			}
		} else if ( txt[i] === '\"' ) {
			if ( backslash ) {
				cmd += '\"';
				backslash = false;
			} else if ( inQuote ) {
				cmd += '\"';
			} else {
				inDoubleQuote = !inDoubleQuote;
			}
		} else if ( txt[i] === '$' && inQuote ) {
			cmd += '\\$';
		} else {
			cmd += txt[i];
			backslash = false;
		}
	}

	cmd = $.trim( cmd );
	if ( cmd !== '' ) {
		split_text.push( cmd );
	}

	return split_text;
};
