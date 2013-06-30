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
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['cd'] = function( fds, argc, argv, env ) {
		var newDir = '';
		if ( argc <= 1 ) {
			newDir = env['HOME'];
		} else if ( argv[1][0] === '/' ) {
			newDir = $.realpath( argv[1] );
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
	 * @param {IoStream} fd Output stream
	 * @param {object} responseJSON responseJSON AJAX response object
	 * @param {Object.<string, *>} opts CLI options
	 * @param {numeric} counter
	 * @param {string} lastOutput
	 */
	function printFile( fd, responseJSON, opts, counter, lastOutput ) {
		var output = lastOutput + responseJSON[6] + "\t\t";

		var useCounter = true;
		var printDot = false;

		for ( var option in opts ) {
			if ( opts.hasOwnProperty( option ) ) {
				switch ( option ) {
					case 'a':
						printDot = true;
						break;

					case 'l':
						if( responseJSON[0] === 'd' ) {
							output = 'd';
						} else {
							output = '-';
						}

						var mask = 1 << 8;
						for ( var i = 0; i < 3; i++ ) {
							if ( mask & responseJSON[1]  ) {
								output += 'r';
							} else {
								output += '-';
							}

							mask >>= 1;
							if ( mask & responseJSON[1] ) {
								output += 'w';
							} else {
								output += '-';
							}

							mask >>= 1;
							if ( mask & responseJSON[1] ) {
								output += 'x';
							} else {
								output += '-';
							}
						}

						output += ( ' ' + $.pad( responseJSON[2], 10, ' ', $.pad.STR_PAD_LEFT ) ); // owner
						output += ( ' ' + $.pad( responseJSON[3], 6, ' ', $.pad.STR_PAD_LEFT ) ); // group
						output += ( ' ' + $.pad( responseJSON[4].toString(), 6, ' ', $.pad.STR_PAD_LEFT ) ); // size
						output += ( ' ' + responseJSON[5]['date'] ); //date
						output += ( ' ' + responseJSON[6] ); //file name

						useCounter = false;
						break;
				}
			}
		}

		if ( ( responseJSON[6] !== '.' && responseJSON[6] !== '..' ) || printDot ) {
			if ( useCounter ) {
				output += "\n   ";
				if ( counter % 4 === 0 ) {
					fd.write( output );
					fd.clear();
					output = "";
				}
			} else {
				output += "\n";
				fd.write( output );
				fd.clear();
				output = "";
			}
		}

		return output;
	}

	/**
	 * List the elements of a directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['ls'] = function( fds, argc, argv, env ) {
		var info = $.getopt( argv, 'la' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		if ( argc === 1 ) {
			argv[argc++] = "";
		}

		for ( var i = 1; i < argv.length; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'GET', '/files' + path, {}, {}, false );

			if ( req === null || req['status'] !== 200 ) {
				fds[2].write( 'ls: cannot access ' + path + ': No such file or directory' );
				continue;
			} else if ( typeof req['responseJSON'] === 'string' ) {
				req['responseJSON'] = [req['responseJSON']];
			}

			if( req['responseJSON'] === null || req['responseJSON'] === undefined )
			{
				req['responseJSON'] = [];
			}

			var lastOutput = '';
			for ( var j = 0, counter = req['responseJSON'].length - 1; j < req['responseJSON'].length; j++, counter-- ) {
				lastOutput = printFile( fds[1], req['responseJSON'][j], opts, counter, lastOutput );
			}
		}

		return 0;
	};

	/**
	 * Make a symbolic link
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * Output a file to the terminal
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['cat'] = function( fds, argc, argv, env ) {
		var newDir = '';
		if ( argc <= 1 ) {
			fds[2].write( 'cat: invalid number of parameters' );
			return 1;
		}

		for ( var i = 1; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			req = api.request( 'GET', '/files' + path, '', {}, false );

			if ( req['status'] === 200 ) {
				if ( req.getResponseHeader( 'File-Type' ) === 'directory' ) {
					fds[2].write( 'cat: ' + path + ': Is a directory' );
				} else {
					fds[1].write( req['responseText'] );
				}
			} else if ( req['status'] === 404 ) {
				fds[2].write( 'cat: ' + path + ': No such file or directory' );
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'cat: ' + path + ': Permission denied' );
			}
		}

		return 0;
	};

	/**
	 * Make a new directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * Add a new user
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['useradd'] = function( fds, argc, argv, env ) {
		if ( argc !== 2 ) {
			fds[2].write( 'error in usage: useradd LOGIN [EMAIL]' );
			return 1;
		} else if ( argc !== 3 ) {
			argv.push( argv[1] + '@localhost' );
			++argc;
		}

		var req = api.request( 'PUT', '/users/' + argv[1], {
				'password': '!',
				'email': argv[2],
				'home_directory': "/" + argv[1]
			}, {}, false );

		if ( req['status'] === 400 ) {
			fds[2].write( 'useradd: invalid home directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'useradd: cannot create user: Permission denied' );
			return 1;
		} else if ( req['status'] == 500 ) {
			fds[2].write( 'count not create user: server timed out' );
			return 1;
		}

		return 0;
	}

	/**
	 * Copy one or more files to another location
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['rm'] = function( fds, argc, argv, env ) {
		for ( var i = 1; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			req = api.request( 'DELETE', '/files' + path, '', {}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'mv: cannot remove ' + src + ': No such file or directory' );
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'mv: cannot remove ' + src + ': Permission denied' );
			}
		}

		return 0;
	};

	/**
	 * Change the permissions on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['chmod'] = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the group on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
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
