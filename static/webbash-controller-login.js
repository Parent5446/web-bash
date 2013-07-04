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
				terminal.toggleTextVisibility();
			}
			deferred.resolve();
		} else {
			this.api.login( this.username, text ).done( $.proxy( function() {
				terminal.toggleTextVisibility();
				terminal.bind( new WebBash( this.username ) );
			}, this ) ).fail( $.proxy ( function( e ) {
				deferred.notify( "\n" + e.responseText );
				this.username = '';
				terminal.prompt = 'Username: ';
				terminal.toggleTextVisibility();
				deferred.resolve();
			}, this ) );
		}
	}
};

window['WebBashLogin'] = WebBashLogin;
