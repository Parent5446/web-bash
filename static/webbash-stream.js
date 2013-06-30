/**
 * Stream object for reading/writing to a virtual pipe
 * @constructor
 */
function IoStream() {
	'use strict';

	/**
	 * Indicator of where in the buffer to read from
	 * @private
	 * @type {number}
	 */
	this.inptr = 0;

	/**
	 * Buffer for the stream
	 * @private
	 * @type {string}
	 */
	this.buffer = '';

	/**
	 * Write to the buffer
	 * @param {string} str What to write
	 */
	this.write = function( str ) {
		this.buffer += str;
		this.flush.call( this, this.buffer );
	};

	/**
	 * Read a certain amount from the buffer
	 * @param {number=} limit Amount to read (optional)
	 * @return {string}
	 */
	this.read = function( limit ) {
		if ( this.inptr >= this.buffer.length ) {
			return false;
		} else if ( limit === undefined ) {
			this.inptr = this.buffer.length;
			return this.inbuffer;
		} else {
			var text = this.buffer.substr( this.inptr, limit );
			this.inptr += limit;
			return text;
		}
	};

	/**
	 * Clears the buffer
	 */
	this.clear = function() {
		this.buffer = '';
	};

	/**
	 * Function to flush the buffer to its final destination. Should be
	 * overridden to control functionality
	 * @param {str} text Text to flush
	 */
	this.flush = function( text ) {
		this.buffer = '';
	};
}
