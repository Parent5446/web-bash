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
 * Controller class to handle execution of commands
 * @constructor
 */
function WebBash( username ) {
	'use strict';

	/**
	 * Terminal environment variables
	 * @private
	 * @type {Object.<string>}
	 */
	this.environment = { '?': '0' };

	/**
	 * Terminal alias commands
	 * @private
	 * @type {Object.<string, string>}
	 */
	this.aliasCommands = {};

	/**
	 * Regular expression for validating environment variable names
	 * @private
	 * @const
	 * @type {RegExp}
	 */
	this.varPatt = /[\w\?\-\!]+/i;

	/**
	 * The username of the current user
	 * @private
	 * @const
	 * @type {string}
	 */
	this.username = username;

	/**
	 * Marker for where the API loaded the history from
	 * @private
	 * @type {number}
	 */
	this.historyMarker = 0;

	/**
	 * API object for making API calls
	 * @type {WebBashApi}
	 * @private
	 * @cosnt
	 */
	this.api = new WebBashApi();

	/**
	 * Startup function
	 * @param {Terminal} terminal
	 */
	this.startup = function( terminal ) {
		// @TODO: Make this and the shutdown function asynchronous
		var info = this.api.request( 'GET', '/users/' + this.username, {}, {}, false );
		var history = this.api.request( 'GET', '/users/' + this.username + '/history', {}, {}, false );

		var homedir = info['responseJSON']['homedir'];
		if ( !homedir ) {
			homedir = '/';
		}

		this.environment['USER'] = this.username;
		this.environment['HOME'] = homedir;
		this.environment['PWD'] = homedir;
		terminal.prompt = this.username + '@ubuntu ' + homedir + ' $ ';

		if ( history['status'] === 200 ) {
			terminal.cmdHistory = history['responseJSON'];
			terminal.currHistoryPos = history['responseJSON'].length;
			this.historyMarker = history['responseJSON'].length;
		}
	};

	/**
	 * Shutdown function
	 * @param {Terminal} terminal
	 */
	this.shutdown = function( terminal ) {
		if ( this.historyMarker < terminal.cmdHistory.length ) {
			this.api.request( 'PATCH', '/users/' + this.username + '/history',
				{ 'history': terminal.cmdHistory.slice( this.historyMarker ) }
			);
			this.historyMarker = terminal.cmdHistory.length;
		}
	};

	/**
	 * Execute a command given an array of arguments
	 * @param {string} text Arguments typed
	 * @param {Terminal} terminal
	 */
	this.execute = function( text, terminal ) {
		var deferred = $.Deferred();
		deferred.stdin = new IoStream();

		setTimeout( $.proxy( function() {
			var argv = text;
			if ( typeof argv === 'string' ) {
				argv = this.replaceVariables( $.splitArgs( text ) );
			}
			this.executeCommand( argv, terminal, deferred );
		}, this ), 0 );

		var promise = deferred.promise();
		promise.stdin = deferred.stdin;
		return promise;
	};

	/**
	 * Actually execute the command (this should be called asynchronously)
	 * @param {string} argv The command
	 * @param {Terminal} terminal
	 * @param {jQuery.Deferred} deferred
	 */
	this.executeCommand = function( argv, terminal, deferred ) {
		// Check for aliases
		if ( argv[0] in this.aliasCommands ) {
			argv = $.merge( $.splitArgs( this.aliasCommands[argv[0]] ), argv.slice( 1 ) );
		}
		
		// Setup the file descriptors
		var retval = '0',
			fds = [ deferred.stdin, new IoStream(), new IoStream() ],
			foundStdout = false;
			foundStderr = false,
			nextCmd = null,
			pipeIndex = argv.indexOf( '|' );

		if ( pipeIndex !== -1 ) {
			foundStdout = true;
			var nextArgv = argv.splice( pipeIndex, argv.length - pipeIndex );
			nextArgv.shift();

			if ( nextArgv.length > 0 ) {
				nextCmd = this.execute( nextArgv, terminal );
				fds[1].getPromise().progress( function( stream ) {
					nextCmd.stdin.write( stream.read() );
				} );
				fds[1].getPromise().done( function( stream ) {
					nextCmd.stdin.write( stream.read() );
					nextCmd.stdin.close();
				} );

				nextCmd.progress( function( text ) {
					deferred.notify( text );
				} );
			}
		}

		// Look for file description redirection
		for ( var i = argv.indexOf( '>' ); i !== -1; i = argv.indexOf( '>', i + 1 ) ) {
			foundStdout = true;
			var path = $.realpath( argv[i + 1], this.environment['PWD'], this.environment['HOME'] );
			fds[1].getPromise().done( $.proxy( function( stream ) {
				var txt = stream.read();
				this.api.request( 'POST', '/files' + path, '', {} ).done( $.proxy( function () 
								{
									this.api.request( 'PATCH', '/files' + path, txt, { 'Content-Type': 'text/plain' } );
								}, 
								this ) );
			}, this ) );;
			argv.splice( i, 2 );
		}

		for ( var i = argv.indexOf( '2>' ); i !== -1; i = argv.indexOf( '2>', i + 1 ) ) {
			foundStderr = true;
			var path = $.realpath( argv[i + 1], this.environment['PWD'], this.environment['HOME'] );
			fds[2].getPromise().done( $.proxy( function( stream ) {
				var txt = stream.read();
				this.api.request( 'POST', '/files' + path, '', {} ).done( $.proxy( function () 
								{
									this.api.request( 'PATCH', '/files' + path, txt, { 'Content-Type': 'text/plain' } );
								}, 
								this ) );
			}, this ) );;
			argv.splice( i, 2 );
		}

		for ( var i = argv.indexOf( '<' ); i !== -1; i = argv.indexOf( '<', i + 1 ) ) {
			var path = $.realpath( argv[i + 1], this.environment['PWD'], this.environment['HOME'] );
			fds[0] = new IoStream();
			this.api.request( 'GET', '/files' + path ).done( function( txt ) {
				fds[0].write( txt );
				fds[0].close();
			} );
			argv.splice( i, 2 );
		}

		// If there was no redirection, output to the terminal
		if ( !foundStdout ) {
			fds[1].write = function( txt ) {
				deferred.notify( [txt] );
			};
		}
		if ( !foundStderr ) {
			fds[2].write = function( txt ) {
				deferred.notify( [txt] );
			};
		}

		// Try and execute the command
		if ( argv[0] === 'exit' ) {
			this.shutdown( terminal );
			this.api.logout();
			// Hopefully something here will close the window
			window.open( '', '_self', '' );
			window.close();
			self.close();
		} else if ( argv[0] === "clear" ) {
			terminal.clear();
		} else if ( argv[0] === "alias" ) {
			for ( var i = 1; i < argv.length; ++i ) {
				var splt = argv[i].split( '=', 2 );
				if( splt.length != 2 ) {
					continue;
				}
				this.aliasCommands[splt[0]] = splt[1];
			}
			retval = '0';
		} else if ( argv[0] in WebBash['commands'] ) {
			var argc = argv.length;
			retval = WebBash['commands'][argv[0]]( fds, argc, argv, this.environment, terminal );
		} else if ( argv[0] ) {
			deferred.notify( ["error: unknown command " + argv[0]] );
			retval = '127';
		}

		var updateFunc = $.proxy( function( retcode ) {
			this.environment['?'] = retcode.toString();
			terminal.prompt = this.username + '@ubuntu ' + this.environment['PWD'] + ' $ ';
			deferred.resolve( retcode );
		}, this );

		if ( $.type( retval ) === 'object' && retval.then !== undefined ) {
			retval.then( function() {
				fds[0].close();
				fds[1].close();
				fds[2].close();
			} );

			if ( nextCmd === null ) {
				retval.then( updateFunc );
			} else {
				retval.then( function() { nextCmd.then( updateFunc ); } );
			}
		} else {
			fds[0].close();
			fds[1].close();
			fds[2].close();

			if ( nextCmd === null ) {
				updateFunc( retval );
			} else {
				nextCmd.then( function() { updateFunc( retval ); } );
			}
		}
	};

	/**
	 * Replace variables in arguments using the environment
	 * @private
	 * @param {Array.<string>} argv Arguments to process
	 * @return {Array.<string>} Arguments with variables replaced
	 */
	this.replaceVariables = function( argv ) {
		for ( var i = 1; i < argv.length; ++i ) {
			for (
				var index = argv[i].indexOf( '$' );
				index >= 0;
				index = argv[i].indexOf( '$', index + 1 )
			) {
				if ( index !== 0 && argv[i][index - 1] === '\\' ) {
					argv[i] = argv[i].substr( 0, index - 1 ) + argv[i].substr( index );
					continue;
				}

				var envName = this.varPatt.exec( argv[i].substr( index + 1 ) )[0];
				if ( envName === null ) {
					continue;
				}

				if ( typeof this.environment[envName] === 'undefined' ) {
					this.environment[envName] = '';
				}

				argv[i] = argv[i].substr( 0, index ) +
					this.environment[envName] +
					argv[i].substr( index + envName.length + 1 );
			}
		}

		return argv;
	};
}

/**
 * List of commands
 * @expose
 * @dict
 * @type {Object.<string, function(Array.<IoStream>, number, Array.<string>, Array.<string>, Terminal): number>}
 */
WebBash['commands'] = {};

window['WebBash'] = WebBash;
