( function( $, WebBash ) {
	'use strict';

	/**
	 * API object to use for calls
	 * @type {WebBashApi}
	 */
	var api = null;

	/**
	 * List the elements of a directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.ls = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Make a symbolic link
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.ln = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Touch a file and update its access time
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.touch = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Make a new directory
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.mkdir = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Copy one or more files to another location
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.cp = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Move one or more files to another location
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.mv = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Delete one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.rm = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the permissions on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.chmod = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the group on one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.chgrp = function( fds, argc, argv, env ) {
		return 0;
	};

	/**
	 * Change the ownership of one or more files
	 * @param {Array.<IoStream>} fds Input/output streams
	 * @param {number} argc Number of arguments
	 * @param {Array.<string>} Arguments passed to command
	 * @param {Array.<string>} Environment variables
	 * @return {number} Retcode, 0 for success
	 */
	WebBash.commands.chown = function( fds, argc, argv, env ) {
		return 0;
	};
} )( jQuery, WebBash );