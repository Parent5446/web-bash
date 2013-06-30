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
		setTimeout( $.proxy( function() {
			var argv = this.replaceVariables( this.splitText( text ) );
			this.executeCommand( argv, terminal, deferred );
		}, this ), 0 );
		return deferred.promise();
	};

	/**
	 * Actually execute the command (this should be called asynchronously)
	 * @param {string} argv The command
	 * @param {Terminal} terminal
	 * @param {jQuery.Deferred} deferred
	 */
	this.executeCommand = function( argv, terminal, deferred ) {
		var retval;

		if ( argv[0] === 'exit' ) {
			this.shutdown( terminal );
			this.api.logout();
			// Hopefully something here will close the window
			window.open( '', '_self', '' );
			window.close();
			self.close();
		} else if ( argv[0] === "clear" ) {
			terminal.clear();
		} else if ( typeof WebBash['commands'][argv[0]] !== 'undefined' ) {
			var fds = [ new IoStream(), new IoStream(), new IoStream() ];
			fds[1].flush = function( text ) {
				deferred.notify( [text] );
				this.buffer = '';
			};
			fds[2].flush = function( text ) {
				deferred.notify( [text] );
				this.buffer = '';
			};

			var argc = argv.length;
			retval = WebBash['commands'][argv[0]]( fds, argc, argv, this.environment );
		} else if ( argv[0] !== undefined && argv[0] !== '' ) {
			deferred.notify( ["error: unknown command " + argv[0]] );
			retval = '127';
		}

		var updateFunc = $.proxy( function( retcode ) {
			this.environment['?'] = retcode.toString();
			terminal.prompt = this.username + '@ubuntu ' + this.environment['PWD'] + ' $ ';
			deferred.resolve();
		}, this );

		if ( $.type( retval ) === 'object' && retval.then !== undefined ) {
			retval.then( updateFunc );
		} else {
			updateFunc( retval );
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

	/**
	 * Split a command into an argument array
	 * @private
	 * @param {string} txt
	 * @return {Array.<string>}
	 */
	this.splitText = function( txt ) {
		var cmd = "",
			split_text = [],
			inQuote = false,
			inDoubleQuote = false,
			backslash = false;

		for ( var i = 0; i < txt.length; i++ ) {
			if ( txt[i] === ' ' && ( inQuote || inDoubleQuote ) ) {
				cmd += txt[i];
			} else if ( txt[i] === ' ' && !( inQuote || inDoubleQuote ) ) {
				if ( cmd.length > 0 ) {
					split_text.push(cmd);
					cmd = "";
				}
				continue;
			} else if ( txt[i] === '\\' ) {
				if ( backslash || inQuote ) {
					cmd += '\\';
					backslash = false;
				} else {
					backslash = true;
				}
			} else if ( txt[i] === '\'' ) {
				if ( backslash ) {
					cmd += '\'';
					backslash = false;
				} else if ( inDoubleQuote ) {
					cmd += '\'';
				} else {
					inQuote = !inQuote;
				}
			} else if ( txt[i] === '\"' ) {
				if ( backslash ) {
					cmd += '\"';
					backslash = false;
				} else if ( inQuote ) {
					cmd += '\"';
				} else {
					inDoubleQuote = !inDoubleQuote;
				}
			} else if ( txt[i] === '$' && inQuote ) {
				cmd += '\\$';
			} else {
				cmd += txt[i];
				backslash = false;
			}
		}

		cmd = $.trim( cmd );
		if ( cmd !== '' ) {
			split_text.push( cmd );
		}

		return split_text;
	};
}

/**
 * List of commands
 * @expose
 * @dict
 * @type {Object.<string, function(Array.<IoStream>, number, Array.<string>, Array.<string>): number>}
 */
WebBash['commands'] = {};

window['WebBash'] = WebBash;
