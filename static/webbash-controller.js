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
	 * Startup function (does nothing here)
	 * @param {Terminal} terminal
	 */
	this.startup = function( terminal ) {
		var api = new WebBashApi();
		var info = api.request( 'GET', '/users/' + this.username, {}, false );

		var homedir = info['responseJSON']['homedir'];
		this.environment['HOME'] = homedir;
		this.environment['PWD'] = homedir;
		terminal.prompt = this.username + '@ubuntu ' + homedir + ' $ ';
	};

	/**
	 * Execute a command given an array of arguments
	 * @param {string} argv Arguments typed
	 * @param {Object} jQuery node to output to
	 */
	this.execute = function( text, terminal ) {
		var deferred = $.Deferred();
		var argv = this.replaceVariables( this.splitText( text ) );
		setTimeout( $.proxy( function() { this.executeCommand( argv, terminal, deferred ); }, this ), 0 );
		return deferred.promise();
	};

	/**
	 * Actually execute the command (this should be called asynchronously)
	 * @param {string} text The command
	 * @param {Terminal} terminal
	 * @param {jQuery.Deferred} deferred
	 */
	this.executeCommand = function( argv, terminal, deferred ) {
		if ( typeof WebBash['commands'][argv[0]] !== 'undefined' ) {
			var fds = [ new IoStream(), new IoStream(), new IoStream() ];
			fds[1].flush = function( text ) {
				deferred.notify( [text] );
			};
			fds[2].flush = function( text ) {
				deferred.notify( [text] );
			};

			var argc = argv.length;
			this.environment['?'] = WebBash['commands'][argv[0]]( fds, argc, argv, this.environment ).toString();
		} else if ( argv[0] !== undefined && argv[0] !== '' ) {
			deferred.notify( ["error: unknown command " + argv[0]] );
			this.environment['?'] = '127';
		}

		this.environment._ = argv[argv.length - 1];
		terminal.prompt = this.username + '@ubuntu ' + this.environment['PWD'] + ' $ ';
		deferred.resolve();
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
			inString = false,
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
