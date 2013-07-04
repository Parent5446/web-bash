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
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['date'] = function( fds, argc ) {
		if ( argc > 1 ) {
			fds[2].write( "error: date takes no args" );
			return 1;
		}

		var temp = new Date();

		var weekday = new Array(7);
		weekday[0] = "Sun";
		weekday[1] = "Mon";
		weekday[2] = "Tue";
		weekday[3] = "Wed";
		weekday[4] = "Thu";
		weekday[5] = "Fri";
		weekday[6] = "Sat";

		var month = new Array(12);
		month[0] = "Jan";
		month[1] = "Feb";
		month[2] = "Mar";
		month[3] = "Apr";
		month[4] = "May";
		month[5] = "Jun";
		month[6] = "Jul";
		month[7] = "Aug";
		month[8] = "Sep";
		month[9] = "Oct";
		month[10] = "Nov";
		month[11] = "Dec";

		//Extremely rudimentary timezone detection
		//TODO: make this actually work for zones other than EDT
		var tzoffset = temp.getTimezoneOffset() / 60;
		var tz = "UTC";
		if ( tzoffset === 4 ) {
			tz = "EDT";
		}

		var dateStr = weekday[temp.getDay()].toString() + " " +
			month[temp.getMonth()].toString() + " " +
			temp.getDate().toString() + " ";
		var hours = temp.getHours();
		var hourStr = hours.toString();

		//prepended zeroes for prettiness
		if ( hours < 10 ) {
			hourStr = "0" + hours.toString();
		}

		var mins = temp.getMinutes();
		var minString = mins.toString();

		if( mins < 10 ) {
			minString = "0" + mins.toString();
		}

		var sec = temp.getSeconds();
		var secStr = sec.toString();

		if( sec < 10) {
			secStr = "0" + sec.toString();
		}

		dateStr += hourStr + ":" +
			minString +  ":" + secStr + " " + tz + " " +
			temp.getFullYear().toString() + " ";

		fds[1].write( dateStr );
		return 0;
	};
} )( jQuery, WebBash );
