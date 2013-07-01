<?php

namespace WebBash\Util;

/**
 * Securely compare two strings in a time-constant method
 *
 * @param string $internal The internal value of the string
 * @param string $external The user-supplied value
 * @return bool True if match, false if not
 */
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

/**
 * Hash a password using bcrypt and the given parameters
 *
 * @param string $password The plaintext to hash
 * @param string|bool $salt Bcrypt-formatted salt value, or false to generate one
 * @param int $rounds Number of bcrypt rounds to use
 *
 * @return string The hashed password
 * @throws RuntimeException if bcrypt isn't installed
 */
function bcrypt( $password, $salt = false, $rounds = 12 ) {
	if ( !defined( 'CRYPT_BLOWFISH' ) ) {
		throw new RuntimeException( 'Bcrypt is not supported.' );
	}

	// Generate a salt if necessary
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

/**
 * Generate random data from a secure source
 *
 * @param int $len The amount of data to generate in bytes
 * @return string Random data
 * @throws RuntimeException if there isn't enough entropy
 */
function urandom( $len ) {
	static $buffer = '';

	$remaining = $len - strlen( $buffer );

	// Try mcrypt_create_iv
	if ( $remaining > 0 && function_exists( 'mcrypt_create_iv' ) ) {
		$iv = \mcrypt_create_iv( $remaining, MCRYPT_DEV_URANDOM );
		if ( $iv !== false ) {
			$buffer .= $iv;
			$remaining -= strlen( $iv );
		}
	}

	// Try openssl_random_psuedo_bytes
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

	// Try /dev/urandom
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

/**
 * Return the parent directory name of a path (platform-independent)
 *
 * @param string $path Path to separate
 * @return string
 * @see dirname
 */
function dirname( $path ) {
	if ( strlen( $path ) > 1 && substr( $path, -1 ) === '/' ) {
		$path = substr( $path, 0, -1 );
	}
	$pos = strrpos( $path, '/' );
	if ( $pos === false ) {
		return '.';
	} elseif ( $pos === 0 ) {
		return '/';
	} else {
		return substr( $path, 0, $pos );
	}
}

/**
 * Return the file name name of a path (platform-independent)
 *
 * @param string $path Path to separate
 * @return string
 * @see basename
 */
function basename( $path ) {
	if ( strlen( $path ) > 1 && substr( $path, -1 ) === '/' ) {
		$path = substr( $path, 0, -1 );
	}
	$pos = strrpos( $path, '/' );
	if ( $pos === false ) {
		return $path;
	} else {
		return substr( $path, $pos + 1 );
	}
}