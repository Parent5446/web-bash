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
			var argv = this.replaceVariables( $.splitArgs( text ) );
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
		var retval;

		if ( argv[0] in this.aliasCommands ) {
			argv = $.merge( $.splitArgs( this.aliasCommands[argv[0]] ), argv.slice( 1 ) );
		}

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
			var fds = [ deferred.stdin, new IoStream(), new IoStream() ];
			fds[1].flush = function( stream ) {
				var text = stream.read();
				deferred.notify( [text] );
			};
			fds[2].flush = function( stream ) {
				var text = stream.read();
				deferred.notify( [text] );
			};

			var argc = argv.length;
			retval = WebBash['commands'][argv[0]]( fds, argc, argv, this.environment );
		} else if ( argv[0] ) {
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
}

/**
 * List of commands
 * @expose
 * @dict
 * @type {Object.<string, function(Array.<IoStream>, number, Array.<string>, Array.<string>): number>}
 */
WebBash['commands'] = {};

window['WebBash'] = WebBash;
