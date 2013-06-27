/**
 * Wrapper for the API
 * @constructor
 */
function WebBashApi() {
	'use strict';

	/**
	 * Stored username
	 * @private
	 * @type {string}
	 */
	this.username = '';

	/**
	 * Stored password
	 * @private
	 * @type {string}
	 */
	this.password = '';

	/**
	 * Login to the API
	 * @param {string} username Username to log in with
	 * @param {string} password Password to log in with
	 * @return {jQuery.jqXHR} jQuery AJAX object
	 */
	this.login = function( username, password ) {
		this.username = username;
		this.password = password;

		return this.request( 'GET', '/login' ).then(
			$.proxy( function( data ) {
				return this.request( 'POST', '/login', {
					'username': this.username,
					'password': this.password,
					'token': data['token']
				} );
			}, this )
		);
	};

	/**
	 * Perform an API request
	 * @param {string} method HTTP method to use
	 * @param {string} url URL to perform request on
	 * @param {*} Data to pass to the server
	 * @return {jQuery.jqXHR} jQuery AJAX object
	 */
	this.request = function( method, url, data ) {
		return $.ajax( {
			data: data,
			dataType: 'json',
			type: method,
			url: 'api.php' + url
		} );
	};
}
