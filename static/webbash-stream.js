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
