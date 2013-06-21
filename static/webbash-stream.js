function IoStream() {
	'use strict';

	this.inptr = 0;
	this.buffer = '';

	this.write = function( str ) {
		this.buffer += str;
		this.flush( this.buffer );
	};

	this.read = function( str, limit ) {
		if ( this.inptr >= this.buffer.length ) {
			return false;
		} else if ( limit === null ) {
			this.inptr = this.buffer.length;
			return this.inbuffer;
		} else {
			var text = this.buffer.substr( this.inptr, limit );
			this.inptr += limit;
			return text;
		}
	};

	this.flush = function( text ) {}
}