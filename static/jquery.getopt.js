( function( $ ) {
	'use strict';

	/**
	 * Parse an array to get the options
	 * @param {Array.<string>} argv
	 * @param {string} optstring
	 * @return {Array.<Array.<string>|Object.<string, *>>}
	 */
	$.getopt = function( argv, optstring ) {
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

			var opt = argv[i].substr( 1 );
			var index = optstring.indexOf( opt );

			if ( index === -1 ) {
				return "Unknown option -" + opt;
			} else if ( optstring[index + 1] === ':' ) {
				if ( argv[i + 1][0] !== '-' ) {
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

		return [opts, args];
	};
} )( jQuery );
