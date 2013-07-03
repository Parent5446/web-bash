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
	 * A deferred that is waiting on this stream
	 * @private
	 * @type {object}
	 */
	this.deferred = $.Deferred();

	/**
	 * Write to the buffer
	 * @param {string} str What to write
	 */
	this.write = function( str ) {
		this.buffer += str;
		if ( this.deferred !== null ) {
			this.deferred.notify( this );
		}
	};

	/**
	 * Read a certain amount from the buffer
	 * @param {number=} limit Amount to read (optional)
	 * @return {string}
	 */
	this.read = function( limit ) {
		var text = '';

		if ( this.inptr >= this.buffer.length ) {
			text = '';
		} else if ( limit === undefined ) {
			text = this.buffer.substr( this.inptr );
			this.inptr = this.buffer.length;
		} else {
			text = this.buffer.substr( this.inptr, limit );
			this.inptr += limit;
		}

		return text;
	};

	/**
	 * Get a deferred that will be notified when there is something to read
	 * @return {object}
	 */
	this.getPromise = function() {
		return this.deferred.promise();
	};

	/**
	 * Closes the stream and flushes the buffer
	 */
	this.close = function() {
		this.deferred.resolve( this );
	};
}
