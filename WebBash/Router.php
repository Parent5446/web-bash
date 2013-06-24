<?php

namespace WebBash;

class Router
{
	private $routes;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function register( $pattern, $controller ) {
		// Replace variables with regex capture patterns
		$pattern = preg_replace( '/:(\w+)/', '(?P<$1>[^/]+)', $pattern );
		$this->routes[$pattern] = $controller;
	}

	public function execute( $method, $url, $data ) {
		$controller = null;
		$matches = array();

		foreach ( $this->routes as $pattern => $class ) {
			if ( preg_match( "!^{$pattern}$!", $url, $matches ) ) {
				$controller = new $class( $this->deps );
				break;
			}
		}

		if ( $controller === null ) {
			throw new HttpException( 404 );
		}

		if ( !method_exists( $controller, $method ) ) {
			$allowedMethods = array_map( 'strtoupper', get_class_methods( $controllerClass ) );
			$allowedMethods = array_intersect(
				$allowedMethods,
				array( 'GET', 'HEAD', 'POST', 'PUT', 'DELETE' )
			);

			throw new HttpException(
				405, '',
				array( 'Allow' => implode( ', ', $allowedMethods ) )
			);
		}

		return $controller->$method( $matches, $data );
	}

	public function executeMain() {
		// Fix the session ID if it's not cryptographically secure
		if ( !isset( $_COOKIE[session_name()] ) && session_id() ) {
			if (
				strncmp( php_uname(), 'Windows', 7 ) === 0 &&
				version_compare( PHP_VERSION, '5.3.3', '>=' ) &&
				!\ini_get( 'session.entropy_file' ) ||
				(int)\ini_get( 'session.entropy_length' ) < 32
			) {
				session_id( bin2hex( Util\urandom( 32 ) ) );
			}
		}

		// Start the session and gather global info
		session_set_cookie_params( 0, '/', '', false, true );
		session_cache_limiter( 'public' );
		session_start();

		$url = $_SERVER['PATH_INFO'];
		$method = strtolower( $_SERVER['REQUEST_METHOD'] );

		// Get a standard list of request headers
		$headers = array();
		if ( function_exists( 'apache_request_headers' ) ) {
			foreach ( apache_request_headers() as $name => $value ) {
				$headers[strtoupper( $name )] = $value;
			}
		} else {
			foreach ( $_SERVER as $name => $value ) {
				if ( strncmp( $name, 'HTTP_', 5 ) === 0 ) {
					$name = str_replace( '_', '-', substr( $name, 5 ) );
					$headers[$name] = $value;
				} elseif ( strncmp( $name, 'CONTENT_', 8 ) === 0 ) {
					$name = strtr( '_', '-', $name );
					$headers[$name] = $value;
				}
			}
		}

		if ( isset( $_SESSION['userId'] ) ) {
			$user = $this->deps->userCache->get( 'id', $_SESSION['userId'] );
			if ( $user->exists() ) {
				$this->deps->currentUser = $user;
			}
		}

		// Try and get the raw data from the request body
		$rawData = file_get_contents( 'php://input' );
		// Check the MD5 hash if available
		if ( isset( $headers['CONTENT-MD5'] ) ) {
			$hash = base64_decode( $headers['CONTENT-MD5'] );
			if ( md5( $rawData ) !== $hash ) {
				header( 'HTTP/1.0 400 Bad Request' );
				return false;
			}
		}

		// Use the method and Content-Type headers to extract the final representation
		// of the request body
		switch ( $method ) {
			case 'get':
			case 'head':
			case 'delete':
				$data = array();
				break;

			case 'post':
				if ( $headers['CONTENT-TYPE'] === 'application/x-www-urlencoded' ) {
					$data = $_POST;
					break;
				}

			case 'put':
				;
				if ( $headers['CONTENT-TYPE'] === 'application/json' ) {
					$rawData = json_decode( $data, true );
				} elseif ( $headers['CONTENT-TYPE'] === 'application/x-www-urlencoded' ) {
					parse_str( $rawData, $data );
				} elseif ( $headers['CONTENT-TYPE'] === 'text/plain' ) {
					$data = $rawData;
				} else {
					header( 'HTTP/1.0 415 Unsupported Media Type' );
					return false;
				}
				break;

			default:
				header( 'HTTP/1.0 405 Method Not Allowed' );
				return false;
		}

		// Just in case ;)
		header( 'X-Frame-Options: deny' );

		// Execute the request
		try {
			$response = $this->execute( $method, $url, $data );
		} catch ( HttpException $e ) {
			$code = $e->getHttpCode();

			header( "HTTP/1.0 {$e->getHttpCode()} {$e->getHttpMsg()}" );
			foreach ( $e->getHeaders() as $header => $value ) {
				header( "$header: $value" );
			}
			echo json_encode( $e->getMessage() );

			return false;
		}

		// Encode the response appropriately for the client
		if ( !isset( $_SERVER['HTTP_ACCEPT'] ) ) {
			$_SERVER['HTTP_ACCEPT'] = 'application/json';
		}
		foreach ( array_map( 'trim', explode( ',', $_SERVER['HTTP_ACCEPT'] ) ) as $accept ) {
			switch ( $accept ) {
				case 'application/json':
					$data = json_encode( $response );
					break 2;

				case 'application/x-www-urlencoded':
					$data = http_build_query( $response );
					break 2;

				default:
					header( 'HTTP/1.0 406 Not Acceptable' );
					return false;
					break 2;
			}
		}

		// If output compression isn't enabled in the PHP config, try doing it
		// manually if the client wants it
		if ( !in_array(
			strtolower( \ini_get( 'zlib.output_compression' ) ),
			array( 'on', 'true', 'yes' )
		) ) {
			$encodings = explode( ',', $_SERVER['HTTP_ACCEPT'] );
			foreach ( $encodings as $encoding ) {
				switch ( trim( $encoding ) ) {
					case 'deflate':
					case 'gzip':
						if ( \extension_loaded( 'zlib' ) ) {
							\ob_start( 'ob_gzhandler' );
							break 2;
						}

					case 'bzip2':
						if ( \function_exists( 'bzcompress' ) ) {
							$data = \bzcompress( $data );
							header( 'Content-Encoding: bzip2' );
							break 2;
						}
				}
			}
		}

		echo $data;
		return true;
	}
}
