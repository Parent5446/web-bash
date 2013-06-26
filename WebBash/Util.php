<?php

namespace WebBash\Util;

function secureCompare( $internal, $external ) {
	$internal .= chr( 0 );
	$external .= chr( 0 );
	$intLen = strlen( $internal );
	$extLen = strlen( $external );

	$match = $intLen - $extLen;

	for ( $i = 0; $i < $extLen; $i++ ) {
		$match |= ( ord( $internal[$i % $intLen] ) ^ ord( $external[$i] ) );
	}

	return $match === 0;
}

function bcrypt( $password, $salt = false, $rounds = 12 ) {
	if ( !defined( 'CRYPT_BLOWFISH' ) ) {
		throw new RuntimeException( 'Bcrypt is not supported.' );
	}

	if ( $salt === false ) {
		$salt = sprintf( '$2y$%02d$', $rounds );
		$salt .= substr( strtr( base64_encode( urandom( 16 ) ), '+', '.' ), 0, 22 );
	}

	$hash = crypt( $password, $salt );
	if ( strlen( $hash ) < 13 ) {
		throw new RuntimeException( 'Error when hashing password.' );
	}

	return $hash;
}

function urandom( $len ) {
	static $buffer = '';

	$remaining = $len - strlen( $buffer );

	if ( $remaining > 0 && function_exists( 'mcrypt_create_iv' ) ) {
		$iv = \mcrypt_create_iv( $remaining, MCRYPT_DEV_URANDOM );
		if ( $iv !== false ) {
			$buffer .= $iv;
			$remaining -= strlen( $iv );
		}
	}

	if (
		$remaining > 0 &&
		function_exists( 'openssl_random_pseudo_bytes' ) &&
		strncasecmp( PHP_OS, 'WIN', 3 ) !== 0
	) {
		$openssl = openssl_random_pseudo_bytes( $remaining );
		if ( $openssl !== false ) {
			$buffer .= $openssl;
			$remaining -= strlen( $openssl );
		}
	}

	if (
		$remaining > 0 &&
		is_readable( '/dev/urandom' ) &&
		( $rand = fopen( '/dev/urandom', 'rb' ) )
	) {
		$chunkSize = 1024 * 8;
		if ( function_exists( 'stream_set_read_buffer' ) ) {
			stream_set_read_buffer( $rand, $remaining );
			$chunkSize = $remaining;
		}

		$buffer .= fread( $rand, $chunkSize );
		fclose( $rand );
	}

	if ( $remaining < 0 ) {
		throw new RuntimeException( 'Not enough entropy.' );
	}

	$retval = substr( $buffer, 0, $len );
	$buffer = substr( $buffer, $len );
	return $retval;
}
