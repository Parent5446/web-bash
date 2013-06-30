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
	 * Shutdown function
	 * @param {Terminal} terminal
	 */
	this.shutdown = function( terminal ) {};

	/**
	 * Execute a command given an array of arguments
	 * @param {string} text Arguments typed
	 * @param {Terminal} terminal Terminal that command was typed on
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
			this.api.login( this.username, text ).done( $.proxy( function() {
				terminal.bind( new WebBash( this.username ) );
			}, this ) ).fail( $.proxy ( function( e ) {
				deferred.notify( e.responseText );
				this.username = '';
				terminal.prompt = 'Username: ';
				deferred.resolve();
			}, this ) );
		}
	}
};

window['WebBashLogin'] = WebBashLogin;
