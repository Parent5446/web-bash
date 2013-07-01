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
		if ( req.getResponseHeader( 'File-Type' ) !== 'directory' ) {
			fds[2].write( 'cd: ' + newDir + ': Not a directory' );
			return 1;
		} else if ( req['status'] === 404 ) {
			fds[2].write( 'cd: ' + newDir + ': No such file or directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'cd: ' + newDir + ': Permission denied' );
			return 1;
		} else if ( req['status'] !== 200 ) {
			fds[2].write( 'cd: ' + newDir + ': An internal error occurred' );
			return 1;
		} else {
			env['PWD'] = newDir;
			return 0;
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

				if ( option === 'l' ) {
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

						if ( option === 'la' ) {
							printdot = true;
						}
					}

					output += ( ' ' + $.pad( responseJSON[2], 10 ) ); // owner
					output += ( ' ' + $.pad( responseJSON[3], 6 ) ); // group
					output += ( ' ' + $.pad( responseJSON[4].toString(), 6 ) ); // size
					output += ( ' ' + responseJSON[5]['date'] ); //date
					output += ( ' ' + responseJSON[6] ); //file name

					useCounter = false;
				}
				if ( option === 'a' ) {
					printDot = true;
				}
			}
		}

		if ( ( responseJSON[6] !== '.' && responseJSON[6] !== '..' ) || printDot ) {
			if ( useCounter ) {
				output += "\n   ";
				if ( counter % 4 === 0 ) {
					fd.write( output );
					output = "";
				}
			} else {
				output += "\n";
				fd.write( output );
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
			} else if ( req['responseJSON'] === null || req['responseJSON'] === undefined ) {
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
				} else if ( req['responseText'] != '""' ) {
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

			var req = api.request( 'GET', '/files' + path, '', {}, false );
			if ( req['status'] !== 404 ) {
				fds[2].write( 'mkdir: cannot create directory ' + path + ': File exists' );
			}

			req = api.request( 'PUT', '/files' + path, '', {
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
		var info = $.getopt( argv, 'd:g:G:mM' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		if ( argc < 2 ) {
			fds[2].write( 'error in usage: useradd [OPTIONS] LOGIN [EMAIL]' );
			return 1;
		} else if ( argc !== 3 ) {
			argv.push( argv[1] + '@localhost' );
			++argc;
		}

		var req = api.request( 'GET', '/users/' + argv[1], '', {}, false );
		if ( req['status'] !== 404 ) {
			fds[2].write( 'useradd: User ' + argv[1] + ' already exists' );
			return 1;
		}

		var homedir = '/home/' + argv[1];
		if ( 'd' in opts ) {
			homedir = opts['d'];
		}
		homedir = $.realpath( homedir, env['PWD'], env['HOME'] );

		if ( 'm' in opts && !( 'M' in opts ) ) {
			req = api.request( 'PUT', '/files' + homedir, '', {
				'File-Type': 'directory'
			}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'useradd: cannot create directory ' + path + ': No such file or directory' );
				return 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'useradd: cannot create directory ' + path + ': Permission denied' );
				return 1;
			} else if ( req['status'] >= 400 ) {
				fds[2].write( 'useradd: cannot create directory ' + path + ': An internal error occurred' );
				return 1;
			}
		}

		var groups = [];
		if ( 'g' in opts ) {
			groups.push( opts['g'] );
		}
		if ( 'G' in opts ) {
			groups = $.merge( groups, opts['G'].split( ',' ) );
		}

		req = api.request( 'PUT', '/users/' + argv[1], {
				'password': '!',
				'email': argv[2],
				'home_directory': homedir,
				'groups': groups
			}, {}, false );

		if ( req['status'] === 400 || req['status'] === 404 && req['responseJSON'] === 'Cannot find file or directory' ) {
			fds[2].write( 'useradd: invalid home directory' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'useradd: cannot create user: Permission denied' );
			return 1;
		} else if ( req['status'] == 500 ) {
			fds[2].write( 'count not create user: server timed out' );
			return 1;
		}

		req = api.request( 'PATCH', '/files' + homedir, '', {
			'File-Owner': argv[1]
		}, false );

		return 0;
	}

	/**
	 * Change the current user's password
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['passwd'] = function( fds, argc, argv, env ) {
		if ( argc < 2 ) {
			argv.push( env['USER'] );
			++argc;
		}

		var deferred = $.Deferred();

		fds[0].readBlocking().progress( function( stream ) {
			var password = stream.read();

			var req = api.request( 'PATCH', '/users/' + argv[1], {
					'password': password
				}, {}, false );
				
			if ( req['status'] === 400 ) {
				fds[2].write( 'useradd: invalid home directory' );
				deferred.resolve( 1 );
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'useradd: cannot create user: Permission denied' );
				deferred.resolve( 1 );
			} else if ( req['status'] == 500 ) {
				fds[2].write( 'count not create user: server timed out' );
				deferred.resolve( 1 );
			} else {
				deferred.resolve( 0 );
			}
		} );

		fds[1].write( 'Password: ' );

		return deferred;
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
		var info = $.getopt( argv, 'r' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		var removedir = false;

		for ( var option in opts ) {
			if ( opts.hasOwnProperty( option ) ) { 
				if ( option === 'r' ) {
					removedir = true;
				}
			}
		}

		for ( var i = 1; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );

			var req = api.request( 'GET', '/files' + path, {}, {}, false );

			if ( req.getResponseHeader( 'File-Type' ) === 'directory' && !removedir ) {
				fds[2].write( 'rm: cannot remove ' + path + ': File is a directory' );
			} else {
				console.log( 'hey' );
				req = api.request( 'DELETE', '/files' + path, '', {}, false );

				if ( req['status'] === 404 ) {
					fds[2].write( 'rm: cannot remove ' + path + ': No such file or directory' );
				} else if ( req['status'] === 403 ) {
					fds[2].write( 'rm: cannot remove ' + path + ': Permission denied' );
				}
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

	/**
	 * Change the ownership of one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['uname'] = function( fds, argc, argv ) {
		var info = $.getopt( argv, 'asnr' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		var req = api.request( 'GET', '/', '', {}, false );
		if ( req['status'] !== 200 ) {
			fds[2].write( 'uname: cannot access server' );
			return 1;
		}

		var output = '';
		if ( 's' in opts || 'a' in opts ) {
			output += req['responseJSON']['kernel'] + ' ';
		}
		if ( 'n' in opts || 'a' in opts ) {
			output += req['responseJSON']['hostname'] + ' ';
		}
		if ( 'r' in opts || 'a' in opts ) {
			output += req['responseJSON']['version'] + ' ';
		}

		fds[1].write( output );
		return 0;
	};
} )( jQuery, WebBash );
