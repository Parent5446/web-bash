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

	public function executeMain() {
		try {
			list( $method, $url, $headers, $data ) = $this->getRequestInfo();
			$this->startSession();
			$this->performRequest( $method, $url, $headers, $data );
		} catch ( HttpException $e ) {
			$code = $e->getHttpCode();

			header( "HTTP/1.0 {$e->getHttpCode()} {$e->getHttpMsg()}" );
			foreach ( $e->getHeaders() as $header => $value ) {
				header( "$header: $value" );
			}
			echo json_encode( $e->getMessage() );

			return false;
		}
	}

	private function startSession() {
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
		session_start();

		if ( isset( $_SESSION['userId'] ) ) {
			$user = $this->deps->userCache->get( 'id', $_SESSION['userId'] );
			if ( $user->exists() ) {
				$this->deps->currentUser = $user;
			}
		}
	}

	private function getRequestInfo() {
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

		$rawData = file_get_contents( 'php://input' );

		return array( $method, $url, $headers, $rawData );
	}

	public function performRequest( $method, $url, $headers, $rawData ) {
		// Check the MD5 hash if available
		if ( isset( $headers['CONTENT-MD5'] ) ) {
			$hash = base64_decode( $headers['CONTENT-MD5'] );
			if ( md5( $rawData ) !== $hash ) {
				throw new HttpException( 400 );
			}
		}

		// Use the method and Content-Type headers to extract the final representation
		// of the request body
		if ( isset( $headers['CONTENT-TYPE'] ) ) {
			$contentType = substr( $headers['CONTENT-TYPE'], 0, strpos( $headers['CONTENT-TYPE'], ';' ) );

			switch ( $method ) {
				case 'get':
				case 'head':
				case 'delete':
					$data = array();
					break;

				case 'post':
					if ( $contentType === 'application/x-www-form-urlencoded' ) {
						$data = $_POST;
						break;
					}

				case 'put':
					if ( $contentType === 'application/json' ) {
						$data = json_decode( $rawData, true );
					} elseif ( $contentType === 'application/x-www-form-urlencoded' ) {
						parse_str( $rawData, $data );
					} elseif ( $contentType === 'text/plain' ) {
						$data = $rawData;
					} else {
						throw new HttpException( 415 );
					}
					break;

				default:
					throw new HttpException( 405 );
			}
		} else {
			$data = null;
		}

		// Execute the request
		$response = $this->runController( $method, $url, $data );
		if ( !( $response instanceof Response ) ) {
			$response = new Response( $response );
		}
		$response->addHeader( 'X-Frame-Options', 'deny' );

		// Encode the response appropriately for the client
		if ( !isset( $_SERVER['HTTP_ACCEPT'] ) ) {
			$_SERVER['HTTP_ACCEPT'] = 'application/json';
		}
		foreach ( array_map( 'trim', explode( ',', $_SERVER['HTTP_ACCEPT'] ) ) as $accept ) {
			switch ( $accept ) {
				case 'text/html':
				case 'application/json':
					$responseData = json_encode( $response->getContents() );
					break 2;

				case 'application/x-www-form-urlencoded':
					$responseData = http_build_query( $response->getContents() );
					break 2;

				case '':
				case null:
				case 'undefined':
					$responseData = $response->getContents();
					break;

				default:
					throw new HttpException( 406 );
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
							$responseData = \bzcompress( $responseData );
							$response->addHeader( 'Content-Encoding', 'bzip2' );
							break 2;
						}
				}
			}
		}

		foreach ( $response->getHeaders() as $key => $val ) {
			header( "$key: $val" );
		}
		echo $responseData;

		return true;
	}

	private function runController( $method, $url, $data ) {
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
}
