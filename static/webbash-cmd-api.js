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
	 *  used by ls for printing the last row
	 */
	var maxToPrint;
	/**
	 *  used by ls for keeping track of the items printed so far
	 */
	/** 
	 * print the file info with options to the provided output stream
	 * @param {IoStream} fd Output stream
	 * @param {object} responseJSON responseJSON AJAX response object
	 * @param {Object.<string, *>} opts CLI options
	 * @param {string} lastOutput
	 */
	function printFile( fd, responseJSON, opts, lastOutput ) {

		if ( ( responseJSON[6][0] === '.' ) && !( 'a' in opts ) ) {
			maxToPrint--;
			return lastOutput;
		}

		var output = lastOutput + responseJSON[6] + "\t\t";

		if ( 'l' in opts ) {
			if( responseJSON[0] === 'd' ) {
				output = 'd';
			} else {
				output = '-';
			}

			for ( var i = 0, mask = 1 << 8; i < 3; i++, mask >>= 1 ) {
				output += mask & responseJSON[1] ? 'r' : '-';
				mask >>= 1;
				output += mask & responseJSON[1] ? 'w' : '-';
				mask >>= 1;
				output += mask & responseJSON[1] ? 'x' : '-';
			}

			output += ( ' ' + $.pad( responseJSON[2], 10 ) ); // owner
			output += ( ' ' + $.pad( responseJSON[3], 6 ) ); // group
			output += ( ' ' + $.pad( responseJSON[4].toString(), 6 ) ); // size
			output += ( ' ' + responseJSON[5]['date'] ); //date
			output += ( ' ' + responseJSON[6] ); //file name

			output += "\n";
			fd.write( output );
			output = "";
		} else {
			counter++;
			if ( counter % 4 === 0 || counter === maxToPrint ) {
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
		var info = $.getopt( argv, 'latcurS' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		if ( argc === 1 ) {
			argv[argc++] = "";
		} else if ( $.type( opts ) === 'string' ) {
			fds[2].write( opts );
			return 1;
		}

		var sortBy = 'name';
		if ( 'l' in opts && 't' in opts  ) {
			if ( 'c' in opts ) {
				sortBy = 'ctime';
			} else if ( 'u' in opts ) {
				sortBy = 'atime';
			}
		} else if ( 't' in opts ) {
			sortBy = 'mtime';
		} else if ( 'S' in opts ) {
			sortBy = 'size';
		}

		for ( var i = 1; i < argv.length; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'GET', '/files' + path, {}, { 'Sort-By': sortBy }, false );

			if ( req === null || req['status'] !== 200 ) {
				fds[2].write( 'ls: cannot access ' + path + ': No such file or directory' );
				continue;
			} else if ( req.getResponseHeader( 'File-Type' ) !== 'directory' ) {
				console.log( path );
				req['responseJSON'] = [[
					'f',
					req.getResponseHeader( 'File-Perms' ),
					req.getResponseHeader( 'File-Owner' ),
					req.getResponseHeader( 'File-Group' ),
					req.getResponseHeader( 'Content-Length' ),
					req.getResponseHeader( 'Last-Modified' ),
					path
				]];
			} else if ( req['responseJSON'] === null || req['responseJSON'] === undefined ) {
				req['responseJSON'] = [];
			}

			if ( 'r' in opts ) {
				req['responseJSON'].reverse();
			}

			var lastOutput = '';
			maxToPrint = req['responseJSON'].length;
			counter = 0;
			for ( var j = 0; j < req['responseJSON'].length; j++ ) {
				lastOutput = printFile( fds[1], req['responseJSON'][j], opts, lastOutput );
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
	 * @return {number|Object} Retcode, 0 for success
	 */
	WebBash['commands']['cat'] = function( fds, argc, argv, env ) {
		var newDir = '';
		if ( argc <= 1 ) {
			argv.push( '-' );
			++argc;
		}

		var usingStdin = false;
		for ( var i = 1; i < argc; i++ ) {
			if ( argv[i] === '-' ) {
				usingStdin = true;
				fds[0].getPromise().progress( function( stream ) {
					fds[1].write( stream.read() );
				} );
				continue;
			}

			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			req = api.request( 'GET', '/files' + path, '', {}, false );

			if ( req['status'] === 200 ) {
				if ( req.getResponseHeader( 'File-Type' ) === 'directory' ) {
					fds[2].write( 'cat: ' + path + ': Is a directory' );
				} else if ( req.getResponseHeader( 'Content-Type' ) !== 'application/json' ) {
					fds[1].write( req['responseText'] );
				} else {
					fds[1].write( req['responseJSON'] );
				}
			} else if ( req['status'] === 404 ) {
				fds[2].write( 'cat: ' + path + ': No such file or directory' );
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'cat: ' + path + ': Permission denied' );
			}
		}

		return usingStdin ? fds[0].getPromise() : 0;
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

		if ( $.type( opts ) === 'string' ) {
			fds[2].write( opts );
			return 1;
		} else if ( argc < 2 ) {
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
		} else if ( req['status'] === 500 ) {
			fds[2].write( 'count not create user: server timed out' );
			return 1;
		}

		req = api.request( 'PATCH', '/files' + homedir, '', {
			'File-Owner': argv[1]
		}, false );

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
	WebBash['commands']['userdel'] = function( fds, argc, argv, env ) {
		var info = $.getopt( argv, 'r' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;

		if ( argc < 2 ) {
			fds[2].write( 'error in usage: userdel [OPTIONS] LOGIN' );
			return 1;
		} else if ( $.type( opts ) === 'string' ) {
			fds[2].write( opts );
			return 1;
		}

		var req;

		if ( 'r' in opts ) {
			req = api.request( 'GET', '/users/' + argv[1], '', {}, false );
			if ( req['status'] === 404 ) {
				fds[2].write( 'userdel: User ' + argv[1] + ' does not exist' );
				return 1;
			}
			
			var homedir = req['responseJSON']['homedir'];
			req = api.request( 'DELETE', '/files' + homedir, '', {}, false );
			if ( req['status'] === 403 ) {
				fds[2].write( 'userdel: Cannot delete home directory ' + homedir + ': Permission denied' );
				return 1;
			}
		}

		req = api.request( 'DELETE', '/users/' + argv[1], '', {}, false );

		if ( req['status'] === 404 ) {
			fds[2].write( 'userdel: User ' + argv[1] + ' does not exist' );
			return 1;
		} else if ( req['status'] === 403 ) {
			fds[2].write( 'userdel: cannot delete user: Permission denied' );
			return 1;
		}

		return 0;
	};

	/**
	 * Change the current user's password
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @param {Terminal} terminal Terminal the command was entered on
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['passwd'] = function( fds, argc, argv, env, terminal ) {
		if ( argc < 2 ) {
			argv.push( env['USER'] );
			++argc;
		}

		var deferred = $.Deferred();

		fds[0].getPromise().progress( function( stream ) {
			var password = stream.read();
			terminal.toggleTextVisibility();

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
		terminal.toggleTextVisibility();

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
			return 1;
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
	 * Delete one or more empty directories
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Array.<string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['rmdir'] = function( fds, argc, argv, env ) {
		for ( var i = 1; i < argc; i++ ) {
				var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
				var req = api.request( 'GET', '/files' + path, {}, {}, false );

				if ( req['status'] === 404 ) {
					fds[2].write( 'rmdir: cannot remove ' + path + ': No such directory' );
				} else if ( req['status'] === 403 ) {
					fds[2].write( 'rmdir: cannot remove ' + path + ': Permission denied' );
				} else if ( req.getResponseHeader( 'File-Type' ) === 'directory' && req['responseJSON'].length === 2 ) {
					req = api.request( 'DELETE', '/files' + path, '', {}, false );
				} else {
					fds[2].write( 'rmdir: cannot remove ' + path + ': Non-empty directory' );
				}
			}

			return 0;
	}

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

		if ( $.type( opts ) === 'string' ) {
			fds[2].write( opts );
			return 1;
		}

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
		if ( argc < 3 ) {
			fds[2].write( 'chown: needs at least 2 parameters' );
			return 1;
		}

		var retcode = 0;
		for ( var i = 2; i < argc; i++ ) {
			var path = $.realpath( argv[i], env['PWD'], env['HOME'] );
			var req = api.request( 'PATCH', '/files' + path, '', {
				'File-Permissions': argv[1]
			}, false );

			if ( req['status'] === 404 ) {
				fds[2].write( 'chown: cannot access ' + path + ': No such file or directory' );
				retcode = 1;
			} else if ( req['status'] === 403 ) {
				fds[2].write( 'chown: changing permissions of ' + path + ': Permission denied' );
				retcode = 1;
			}
		}

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
	 * Gets information about the server
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

		if ( $.type( opts ) === 'string' ) {
			fds[2].write( opts );
			return 1;
		}

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
	
	/**
	 * Manipulate the user's command history
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} argv Arguments passed to command
	 * @param {Object.<string, string>} env Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash['commands']['history'] = function( fds, argc, argv, env ) {
		var info = $.getopt( argv, 'c' );
		var opts = info[0];
		argv = info[1];
		argc = argv.length;
		
		var req;
		if ( 'c' in opts ) {
			req = api.request( 'DELETE', '/users/' + env['USER'] + '/history', '', {}, false );
			
			if ( req['status'] === 404 || req['status'] === 403 ) {
				fds[2].write( 'history: invalid user in environment' );
				return 2;
			}
		} else {
			var offset = parseInt( opts['d'], 10 );
			req = api.request( 'GET', '/users/' + env['USER'] + '/history', '', {}, false );

			if ( req['status'] === 404 || req['status'] === 403 ) {
				fds[2].write( 'history: invalid user in environment' );
				return 2;
			}
			
			var history = req['responseJSON'];
			for ( var i = 0; i < history.length; ++i ) {
				fds[1].write( "  " + i + "  " + history[i] + "\n" );
			}
		}
		
		return 0;
	};
} )( jQuery, WebBash );
