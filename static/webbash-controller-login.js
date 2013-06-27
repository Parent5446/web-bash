/**
 * Controller class to handle execution of commands
 * @constructor
 */
function WebBashLogin() {
	'use strict';

	/**
	 * API Object
	 * @private
	 * @type {WebBashApi}
	 */
	this.api = new WebBashApi();

	/**
	 * Stored username
	 * @private
	 * @type {string}
	 */
	this.username = '';

	/**
	 * Reset the prompt for the login
	 * @param {Terminal} terminal
	 */
	this.startup = function( terminal ) {
		terminal.prompt = 'Username: ';
	};

	/**
	 * Execute a command given an array of arguments
	 * @param {string} argv Arguments typed
	 * @param {Object} jQuery node to output to
	 */
	this.execute = function( text, terminal ) {
		var deferred = $.Deferred();
		setTimeout( $.proxy( function() { this.executeCommand( text, terminal, deferred ); }, this ), 0 );
		return deferred.promise();
	};

	/**
	 * Actually execute the command (this should be called asynchronously)
	 * @param {string} text The command
	 * @param {Terminal} terminal
	 * @param {jQuery.Deferred} deferred
	 */
	this.executeCommand = function( text, terminal, deferred ) {
		if ( this.username === '' ) {
			this.username = text;
			if ( text !== '' ) {
				terminal.prompt = 'Password: ';
			}
			deferred.resolve();
		} else {
			this.api.login( this.username, text ).done( function() {
				terminal.bind( new WebBash() );
			} ).fail( function( e ) {
				deferred.notify( e.responseText );
				this.username = null;
				terminal.prompt = 'Username: ';
				deferred.resolve();
			} );
		}
	}
}

window['WebBashLogin'] = WebBashLogin;