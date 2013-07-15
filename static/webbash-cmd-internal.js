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

( function( $, WebBash ) {
	'use strict';

	/**
	 * Do nothing, unsuccessfully
	 * @return {number} Always returns 1
	 */
	WebBash['commands']['false'] = function() {
		return 1;
	};

	/**
	 * Do nothing, successfully
	 * @return {number} Always return 0
	 */
	WebBash['commands']['true'] = function() {
		return 0;
	};

	/**
	 * Echo strings to the screen
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['echo'] = function( fds, argc, argv ) {
		argv.shift();
		fds[1].write( argv.join( ' ' ) );
		return 0;
	};

	/**
	 * Change an environment variable
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['export'] = function( fds, argc, argv, env ) {
		for ( var i = 1; i < argc; ++i ) {
			var splt = argv[i].split( '=', 2 );
			env[splt[0]] = splt[1];
		}
		return 0;
	};

	/**
	 * Unset an environment variable
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['unset'] = function( fds, argc, argv, env ) {
		for ( var i = 1; i < argc; ++i ) {
			env[argv[i]] = '';
		}
		return 0;
	};

	/**
	 * Print the current working directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['pwd'] = function( fds, argc, argv, env ) {
		fds[1].write( env['PWD'] );
		return 0;
	};

	/**
	 * Print a brief help message
	 * @param {Array.<IoStream>} fds Input/output streamss
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['help'] = function( fds ) {
		fds[2].write( "Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. " );
		fds[2].write( "To see a full list of commands, type 'commands' " );
		return 0;
	};

	/**
	 * Write out all available commands
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['commands'] = function( fds, argc, argv, env ) {
		var commands = [];
		for ( var cmd in WebBash['commands'] ) {
			if ( WebBash['commands'].hasOwnProperty( cmd ) ) {
				commands.push(cmd);
			}
		}

		fds[1].write( commands.join( "\n" ) );
		return 0;
	};

	/**
	 * Print the current user's username
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['whoami'] = function( fds, argc, argv, env ) {
		fds[1].write( env['USER'] );
		return 0;
	};
	
	/**
	 * Print the current user's username
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['sleep'] = function( fds, argc, argv, env ) {
		if ( argc < 2 ) {
			fds[2].write( 'sleep: missing operand' );
			return 1;
		}

		var unit = argv[1][argv[1].length - 1];
		var num = 0;
		if ( [ 's', 'm', 'h', 'd' ].indexOf( unit ) === -1 ) {
			num = parseInt( argv[1], 10 );
			unit = 's';
		} else {
			num = parseInt( argv[1].substr( 0, -1 ), 10 );
		}

		switch ( unit ) {
			case 'd':
				num *= 24;
			case 'h':
				num *= 60;
			case 'm':
				num *= 60;
			case 's':
				num *= 1000;
		}

		var deferred = $.Deferred();
		setTimeout( function() {
			deferred.resolve( 0 );
		}, num );

		return deferred.promise();
	};

	/**
	 * Format a date and output it to the command line
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv CLI arguments
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['date'] = function( fds, argc, argv ) {
		if ( argc <= 1 ) {
			argv.push( '%a %c' );
			++argc;
		}

		var time = new Date();

		var weekday = new Array( "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" );
		var longWeekday = new Array( "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" );
		var month = new Array( "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" );
		var longMonth = new Array( "January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December" );

		var format = argv[1].split( "" );
		for ( var i = format.indexOf( '%' ); i >= 0; i = format.indexOf( '%', i + 1 ) ) {
			var value = '';
			var padding = '0';
			var patLen = 1;
			var extras = [];

			if ( format[i + patLen] === '-' ) {
				++patLen;
				padding = '';
			} else if ( format[i + patLen] === '_' ) {
				++patLen;
				padding = ' ';
			}

			switch ( format[i + patLen++] ) {
				// Patterns that are aliases for other patterns
				case 'D':
					extras = "%m/%d/%y".split( "" );
					break;
				case 'e':
					extras = "%_d".split( "" );
					break;
				case 'F':
					extras = "%Y-%m-%d".split( "" );
					break;
				case 'k':
					extras = "%-H".split( "" );
					break;
				case 'l':
					extras = "%-I".split( "" );
					break;
				case 'R':
					extras = "%H:%M".split( "" );
					break;
				case 'T':
					extras = "%H:%M:%S".split( "" );
					break;
			
				// Normal patterns
				case '%':
					value = '%';
					break;
				case 'a':
					value = weekday[time.getDay()];
					break;
				case 'A':
					value = longWeekday[time.getDay()];
					break;
				case 'b':
				case 'h':
					value = month[time.getMonth()];
					break;
				case 'B':
					value = longMonth[time.getMonth()];
					break;
				case 'c':
					value = time.toLocaleString();
					break;
				case 'C':
					value = time.getFullYear().toString().substr( 0, 2 );
					break;
				case 'd':
					value = time.getDate();
					break;
				case 'H':
					value = time.getHours();
					break;
				case 'I':
					value = time.getHours() % 12;
					break;
				case 'm':
					value = time.getMonth();
					break;
				case 'M':
					value = time.getMinutes();
					break;
				case 'n':
					value = "\n";
					break;
				case 'N':
					value = time.getMilliseconds() * 1000;
					break;
				case 'p':
					value = time.getHours() >= 12 ? 'PM' : 'AM';
					break;
				case 'P':
					value = time.getHours() >= 12 ? 'pm' : 'am';
					break;
				case 's':
					value = time.getTime() / 1000;
					break;
				case 'S':
					value = time.getSeconds();
					break;
				case 't':
					value = "\t";
					break;
				case 'u':
					value = time.getDay() + 1;
					break;
				case 'w':
					value = time.getDay();
					break;
				case 'x':
					value = time.toLocaleDateString();
					break;
				case 'X':
				case 'r':
					value = time.toLocaleTimeString();
					break;
				case 'y':
					value = time.getFullYear() % 100;
					break;
				case 'Y':
					value = time.getFullYear();
					break;
				case 'z':
					var tzOffset = time.getTimezoneOffset();
					value = tzOffset >= 0 ? '+' : '-';
					value += tzOffset / 60 + '' + tzOffset % 60;
					break;
				case 'Z':
					// There are at least 100 timezones. Just hope you're in EDT
					value = 'EDT';
					break;
			}

			if ( $.type( value ) === 'number' ) {
				value = $.pad( value.toString(), 2, padding, "left" );
			}

			Array.prototype.splice.apply( format, [ i, patLen, value ].concat( extras ) );
		}

		fds[1].write( format.join( "" ) );
		return 0;
	};
	
	/**
	 * Format output for printing
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['printf'] = function( fds, argc, argv, env ) {
		if ( argc <= 1 ) {
			fds[2].write( 'error in usage: printf FORMAT [ARGS ...]' );
			return 1;
		}

		var nextArg = 1;
		var format = argv[1].split( "" );

		for ( var i = format.indexOf( '%' ); i >= 0; i = format.indexOf( '%', i + 1 ) ) {
			var value = '',
				patLen = 1,
				signVal = '',
				padding = ' ',
				align = 'right',
				width = '0',
				precision = null,
				argNum,
				tmpPos = format.indexOf( '$', i + patLen ),
				tmpArg = format.slice( i + patLen, tmpPos );

			if ( tmpPos !== -1 && !isNaN( tmpArg ) ) {
				++patLen;
				argNum = parseInt( tmpArg, 10 ) + 1;
			} else {
				argNum = nextArg++ + 1;
			}

			value = argNum < argc ? argv[argNum] : '';

			dance:
			while ( i + patLen < format.length ) {
				switch ( format[i + patLen] ) {
					case '+':
						++patLen;
						signVal = '+';
						break;
					case ' ':
						++patLen;
						signVal = ' ';
						break;
					case '-':
						++patLen;
						align = 'left';
						break;
					case '0':
						++patLen;
						padding = '0';
						align = 'left';
						break;
					default:
						break dance;
				}
			}

			while ( !isNaN( format[i + patLen] ) ) {
				width += format[i + patLen++];
			}
			width = parseInt( width, 10 );

			if ( format[i + patLen] === '.' ) {
				++patLen;
				precision = '0';
				while ( !isNaN( format[i + patLen] ) ) {
					precision += format[i + patLen++];
				}
				precision = parseInt( precision, 10 );
			}

			switch ( format[i + patLen++] ) {
				case 'd':
				case 'i':
					value = parseInt( argv[argNum], 10 );
					break;
				case 'u':
					value = Math.abs( parseInt( argv[argNum], 10 ) );
					break;
				case 'f':
				case 'F':
				case 'g':
				case 'G':
					value = parseFloat( argv[argNum], 10 );
					break;
				case 'x':
				case 'X':
					value = parseInt( argv[argNum], 10 ).toString( 16 );
					break;
				case 'o':
					value = parseInt( argv[argNum], 10 ).toString( 8 );
					break;
				case 's':
					value = argv[argNum];
					break;
				case 'c':
					value = argv[argNum].substr( 0, 1 );
					break;
				case 'n':
					value = '';
					break;
				case '%':
					width = 0;
					precision = null;
					value = '%';
					break;
			}

			if ( precision !== null ) {
				if ( $.type( value ) === 'number' ) {
					if ( value < 0 ) {
						signVal = '';
					}
					value = signVal + value.toFixed( precision ).toString();
				} else {
					value = value.substr( 0, precision );
				}
			} else if ( $.type( value ) === 'number' ) {
				if ( value < 0 ) {
					signVal = '';
				}
				value = signVal + value.toString();
			}

			value = $.pad( value, width, padding, align );
			format.splice( i, patLen, value );
		}

		fds[1].write( format.join( "" ) );
		return 0;
	};
} )( jQuery, WebBash );
