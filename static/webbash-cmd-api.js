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
		} else {
			newDir = $.realpath( argv[1], env['PWD'], env['HOME'] );
		}

		var req = api.request( 'GET', '/files' + newDir, {}, {}, false );
		if ( req['status'] === 200 ) {
			env['PWD'] = newDir;
			return 0;
		} else if ( req['status'] === 404 ) {
			fds[2].write( 'cd: ' + newDir + ': No such file or directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'cd: ' + newDir + ': Permission denied' );
			return 1;
		} else {
			fds[2].write( 'cd: ' + newDir + ': An internal error occurred' );
			return 1;
		}
	};

	/** 
	 * print the file info with options to the provided output stream
	 * @param {<IoStream} fd Output stream
	 * @param responseJSON  {object} responseJSON AJAX response object
	 * @param opts {Array.<string>} opts
	 */
	 function printFile( fd, responseJSON, opts ) {
	 	var name = responseJSON;
	 	var output = name;
	 	var printDot = false;
/*
	 	foreach ( var option in opts ) {
	 		if ( opts.hasOwnProperty( option) ) {
	 			switch ( option ) {
	 				case 'a':
	 					printDot = true;
	 					break;
	 				case 'l':
	 					// add stuff here
	 					break;

	 			}
	 		}
	 	}
*/	 	

	 	//if( name[0] !== '.' || printDot )
		 	fd.write( responseJSON + "\n" );
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
		opts = $.normalizeopts( opts );

		if ( argc === 1 ) {
			newArgv[argc] = env['PWD'];
			argc++;
		}

		for ( var i = 1; i < argc; i++ ) {
			var req = api.request( 'GET', '/files' + newArgv[1], {}, {}, false );
			for ( var j = 0; j < req['responseJSON'].length; j++ ) {
				console.log( req['responseJSON'] );
				printFile( fds[1], req['responseJSON'][j], opts);
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
		if ( argc !== 3 ) {
			fds[2].write( 'ln: invalid number of parameters' );
		}

		var src = $.realpath( argv[1], env['PWD'], env['HOME'] );
		var dst = $.realpath( argv[2], env['PWD'], env['HOME'] );

		var req = api.request( 'PUT', '/files' + dst, '', {
			'File-Type': 'link',
			'Content-Location': src
		}, false );

		if ( req['status'] === 404 ) {
			fds[2].write( 'ln: failed to create symbolic link ' + dst + ': No such file or directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'ln: failed to create symbolic link ' + dst + ': Permission denied' );
			return 1;
		} else if ( req['status'] >= 400 ) {
			fds[2].write( 'ln: failed to create symbolic link ' + dst + ': An internal error occurred' );
			return 1;
		}

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
		for ( var i = 1; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'POST', '/files' + path, '', {}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'touch: cannot touch ' + path + ': No such file or directory' );
				return 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'touch: cannot touch ' + path + ': Permission denied' );
				return 1;
			} else if ( req['status'] >= 400 ) {
				fds[2].write( 'touch: cannot touch ' + path + ': An internal error occurred' );
				return 1;
			}
		}
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
		for ( var i = 1; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'PUT', '/files' + path, '', {
				'File-Type': 'directory'
			}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'mkdir: cannot create directory ' + path + ': No such file or directory' );
				return 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'mkdir: cannot create directory ' + path + ': Permission denied' );
				return 1;
			} else if ( req['status'] >= 400 ) {
				fds[2].write( 'mkdir: cannot create directory ' + path + ': An internal error occurred' );
				return 1;
			}
		}
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
		if ( argc !== 3 ) {
			fds[2].write( 'cp: invalid number of parameters' );
		}

		var src = $.realpath( argv[1], env['PWD'], env['HOME'] );
		var dst = $.realpath( argv[2], env['PWD'], env['HOME'] );

		var req = api.request( 'PUT', '/files' + dst, src, {
			'Content-Type': 'application/vnd.webbash.filepath'
		}, false );

		if ( req['status'] === 404 ) {
			fds[2].write( 'cp: cannot create regular file ' + dst + ': No such file or directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'cp: cannot create regular file ' + dst + ': Permission denied' );
			return 1;
		} else if ( req['status'] >= 400 && req['responseJSON'] === 'Invalid file data source' ) {
			fds[2].write( 'cp: cannot stat ' + src + ': No such file or directory' );
			return 1;
		}

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
		if ( argc !== 3 ) {
			fds[2].write( 'mv: invalid number of parameters' );
		}
		
		var src = $.realpath( argv[1], env['PWD'], env['HOME'] );
		var dst = $.realpath( argv[2], env['PWD'], env['HOME'] );

		var req = api.request( 'PUT', '/files' + dst, src, {
			'Content-Type': 'application/vnd.webbash.filepath'
		}, false );

		if ( req['status'] === 404 ) {
			fds[2].write( 'mv: cannot create regular file ' + dst + ': No such file or directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'mv: cannot create regular file ' + dst + ': Permission denied' );
			return 1;
		} else if ( req['status'] >= 400 && req['responseJSON'] === 'Invalid file data source' ) {
			fds[2].write( 'mv: cannot stat ' + src + ': No such file or directory' );
			return 1;
		}

		req = api.request( 'DELETE', '/files' + src, '', {}, false );
		
		if ( req['status'] === 403 ) {
			fds[2].write( 'mv: cannot remove ' + src + ': Permission denied' );
			return 1;
		}

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
		if ( argc < 3 ) {
			fds[2].write( 'chown: needs at least 2 parameters' );
			return 1;
		}

		var retcode = 0;
		for ( var i = 2; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'PATCH', '/files' + path, '', {
				'File-Group': argv[1]
			}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'chown: cannot access ' + path + ': No such file or directory' );
				retcode = 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'chown: changing ownership of ' + path + ': Permission denied' );
				retcode = 1;
			} else if ( req['status'] >= 400 && req['responseJSON'] === 'Invalid group' ) {
				fds[2].write( 'chown: invalid group: ' + argv[1] );
				return 1;
			}
		}

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
		if ( argc < 3 ) {
			fds[2].write( 'chown: needs at least 2 parameters' );
			return 1;
		}

		var retcode = 0;
		for ( var i = 2; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'PATCH', '/files' + path, '', {
				'File-Owner': argv[1]
			}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'chown: cannot access ' + path + ': No such file or directory' );
				retcode = 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'chown: changing ownership of ' + path + ': Permission denied' );
				retcode = 1;
			} else if ( req['status'] >= 400 && req['responseJSON'] === 'Invalid owner' ) {
				fds[2].write( 'chown: invalid user: ' + argv[1] );
				return 1;
			}
		}

		return 0;
	};
} )( jQuery, WebBash );
