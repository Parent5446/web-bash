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
				return this.request( 'PUT', '/login', {
					'username': this.username,
					'password': this.password,
					'token': data['token']
				} );
			}, this )
		);
	};

	/**
	 * Logout of the API
	 * @return {jQuery.jqXHR} jQuery AJAX object
	 */
	this.logout = function() {
		return this.request( 'DELETE', '/login' );
	}

	/**
	 * Perform an API request
	 * @param {string} method HTTP method to use
	 * @param {string} url URL to perform request on
	 * @param {*} data Data to pass to the server
	 * @param {Array.<string>} headers Request headers to send
	 * @param {boolean} async Whether to be asynchronous
	 * @return {jQuery.jqXHR} jQuery AJAX object
	 */
	this.request = function( method, url, data, headers, async ) {
		async = async === undefined ? true : async;
		var contentType = 'application/x-www-form-urlencoded';
		if ( headers !== undefined && 'Content-Type' in headers ) {
			var contentType = headers['Content-Type'];
		}

		return $.ajax( {
			'async': async,
			'contentType': contentType,
			'data': data,
			'headers': headers,
			'type': method,
			'url': 'api.php' + url
		} );
	};
}
