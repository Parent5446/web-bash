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
 * Normalize the key code in keydown events into an ASCII value proper
 * @this {jQuery.Event}
 * @return {string} The character
 */
jQuery.Event.prototype.getChar = function() {
	'use strict';

	var specials = [ 16, 37, 38, 39, 40, 20, 17, 18, 91 ],
		shiftChars = {
			1: '!',
			2: '@',
			3: '#',
			4: '$',
			5: '%',
			6: '^',
			7: '&',
			8: '*',
			9: '(',
			0: ')',
			',': '<',
			'.': '>',
			'/': '?',
			';': ':',
			"'": '"',
			'[': '{',
			']': '}',
			'\\': '|',
			'`': '~',
			'-': '_',
			'=': '+'
		},
		exceptions = {
			96: 48, // Numpad 0
			97: 49, // Numpad 1
			98: 50, // Numpad 2
			99: 51, // Numpad 3
			100: 52, // Numpad 4
			101: 53, // Numpad 5
			102: 54, // Numpad 6
			103: 55, // Numpad 7
			104: 56, // Numpad 8
			105: 57, // Numpad 9
			106: 42, // Numpad *
			107: 43, // Numpad
			109: 45, // Numpad -
			110: 46, // Numpad .
			111: 47, // Numpad /
			173: 45, // -
			186: 59, // ;
			187: 61, // =
			188: 44, // ,
			189: 45, // -
			190: 46, // .
			191: 47, // /
			192: 96, // `
			219: 91, // [
			220: 92, // \
			221: 93, // ]
			222: 39  // '
		};

	var code = this.which;

	if ( specials.indexOf( code ) >= 0 ) {
		return false;
	}

	// Translate exceptions to their canonical code
	if ( typeof exceptions[code] !== 'undefined' ) {
		code = exceptions[code];
	}

	var ch = String.fromCharCode( code );

	if ( this.shiftKey ) {
		// Translate shifted special chars
		if ( typeof shiftChars[ch] !== 'undefined' ) {
			ch = shiftChars[ch];
		}
	} else {
		ch = ch.toLowerCase();
	}

	return ch;
};
