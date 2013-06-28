( function( $, WebBash ) {
	'use strict';

	/**
	 * API object to use for calls
	 * @type {WebBashApi}
	 */
	var api = new WebBashApi();

	/**
	 * Change the current working directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['cd'] = function( fds, argc, argv, env ) {
		var newDir = '';
		if ( argc <= 1 ) {
			newDir = env['HOME'];
		} else if ( argv[1][0] === '/' ) {
			newDir = $.realpath( argv[1] );
		} else {
			newDir = $.realpath( env['PWD'] + '/' + argv[1] );
		}

		var req = api.request( 'GET', '/files' + newDir, {}, false );
		if ( req.status === 200 ) {
			env['PWD'] = newDir;
			return 0;
		} else {
			fds[2].write( 'cd: ' + newDir + ': No such file or directory' );
			return 1;
		}
	};

	/**
	 * List the elements of a directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['ls'] = function( fds, argc, argv, env ) {
		var opts = [];
		var newArgv = [];

		if ( argc === 1 ) {
			argv[argc] = env['PWD'];
			argc++;
		}
		else {
			var optPattern = /-[\w]+/;

			for ( var index in argv ) {
				if ( optPattern.test( argv[index] ) ) {
					opts[opts.length] = argv[index];
				}
				else {
					newArgv[newArgv.length] = argv[index];
				}
			}
			argc = newArgv.length;		
		}

		opts = $.normalizeopts( opts );
		console.log( opts );

		for ( var i = 1; i < argc; i++ ) {
			var req = api.request( 'GET', '/files' + argv[1], {}, false );
			for ( var j = 0; j < req['responseJSON'].length; j++ ) {
				fds[1].write( req['responseJSON'][j] + "\n");
				//$.printFile( fds[1], req['responseJSON'][j], opts);
			}
		}
		return 0;
	};

	/**
	 * Make a symbolic link
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['ln'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Touch a file and update its access time
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['touch'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Make a new directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['mkdir'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Copy one or more files to another location
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['cp'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Move one or more files to another location
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['mv'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Delete one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['rm'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the permissions on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['chmod'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the group on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['chgrp'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the ownership of one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['chown'] = function( fds, argc, argv, env ) {
		return 0;
	};
} )( jQuery, WebBash );
