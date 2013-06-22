function WebBashApi() {
	'use strict';

	this.username = null;
	this.password = null;

	this.initializeSalt = function() {
		this.salt = sjcl.random.randomWords( 4 );
		var hmac = new sjcl.misc.hmac( this.salt );
		this.password = hmac.encrypt( this.password );
	};

	this.modifyHeaders = function( jqXHR, settings ) {
		var reqSalt = sjcl.random.randomWords( 4 );
		var bodySalt = sjcl.misc.cachedPbkdf2( this.password, { iter: 5000, salt: reqSalt } );
		var hmac = new sjcl.misc.hmac( bodySalt );
		
		var toSign = settings.type.toUpper() + "\n";
		for ( var key in settings.headers ) {
			if ( settings.headers.hasOwnProperty( key ) ) {
				toSign += key.toLower() + ":" + settings.headers[key].toLower() + "\n";
			}
		}
		toSign += typeof settings.data === 'string' ? settings.data : $.param( settings.data );

		var signature = hmac.encrypt( toSign );

		settings.headers.Authorization =
			'WebBash username={0} passwordsalt={0} requestsalt={1} signature={3}'.format(
				this.username,
				scjl.codec.base64.fromBits( this.salt ),
				scjl.codec.base64.fromBits( reqSalt ),
				scjl.codec.base64.fromBits( signature.key )
			);

		if ( settings.type === 'GET' ) {
			settings.ifModified = true;
		}

		return true;
	};

	this.request = function( method, url, data ) {
		return $.ajax( {
			accepts: 'application/json',
			beforeSend: $.proxy( this.modifyHeaders, this ),
			data: data,
			dataType: 'json',
			type: method,
			url: url
		} );
	};

	sjcl.startCollectors();
	sjcl.random.addEventListener( 'seeded', $.proxy( this.initializeSalts, this ) );
}