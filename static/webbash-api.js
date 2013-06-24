/**
 * Wrapper for the API
 * @constructor
 */
function WebBashApi() {
	'use strict';

	/**
	 * Login to the API
	 * @param {string} username Username to log in with
	 * @param {string} password Password to log in with
	 * @return {jQuery.jqXHR} jQuery AJAX object
	 */
	this.login = function( username, password ) {
		return this.request( 'POST', '/login', {
			username: username,
			password: password
		} );
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
			accepts: 'application/json',
			data: data,
			dataType: 'json',
			type: method,
			url: url
		} );
	};
}
