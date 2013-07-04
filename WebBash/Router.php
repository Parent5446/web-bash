<?php

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
 *
 * @file
 */

namespace WebBash;

/**
 * Class to hold and execute routes for API URLs
 */
class Router
{
	/**
	 * Routes that are registered
	 * @private array
	 */
	private $routes;

	/**
	 * Construct the router
	 *
	 * @param \WebBash\DI $deps Dependency injection container
	 */
	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	/**
	 * Register a route with the router.
	 *
	 * @param string $pattern Pseudo-regex pattern for the route
	 * @param string $controller Fully qualified class name for the controller
	 * @param array $queryParams Mapping of query parameter names
	 * @param array $headerParams Mapping of header names to parameters
	 */
	public function register( $pattern, $controller, array $queryParams = array(), array $headerParams = array() ) {
		// Replace variables with regex capture patterns
		$pattern = preg_replace( '/:(\w+)\+/', '(?P<$1>.*)', $pattern );
		$pattern = preg_replace( '/:(\w+)/', '(?P<$1>[^/]*)', $pattern );
		$this->routes[$pattern] = array( $controller, $queryParams, $headerParams );
	}

	/**
	 * Execute a route from the global state (i.e., $_SERVER and whatnot)
	 */
	public function executeMain() {
		try {
			list( $method, $url, $headers, $data ) = $this->getRequestInfo();
			$this->startSession();
			$this->performRequest( $method, $url, $headers, $data );
		} catch ( HttpException $e ) {
			$code = $e->getHttpCode();

			header( "HTTP/1.0 {$e->getHttpCode()} {$e->getHttpMsg()}" );
			header( 'Content-Type: application/json' );
			foreach ( $e->getHeaders() as $header => $value ) {
				header( "$header: $value" );
			}
			echo json_encode( $e->getMessage() );
		}
	}

	/**
	 * Securely start the browser session
	 */
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

	/**
	 * Get the URL, HTTP method, headers, and body from the global state
	 *
	 * @return array Array of (method, URL, headers, body)
	 */
	private function getRequestInfo() {
		$url = isset( $_SERVER['PATH_INFO'] ) ? $_SERVER['PATH_INFO'] : '/';
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

	/**
	 * Perform a request based on the given method, URL, headers, and body
	 *
	 * @param string $method HTTP method
	 * @param string $url URL
	 * @param array $headers HTTP headers
	 * @param string $rawData Raw data from the request body
	 *
	 * @return \WebBash\Response A response object
	 * @throws HttpException for various errors in input data
	 */
	public function performRequest( $method, $url, array $headers, $rawData ) {
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
			$pos = strpos( $headers['CONTENT-TYPE'], ';' );
			if ( $pos !== false ) {
				$contentType = substr( $headers['CONTENT-TYPE'], 0, $pos );
			} else {
				$contentType = $headers['CONTENT-TYPE'];
			}

			switch ( $method ) {
				case 'get':
				case 'head':
				case 'delete':
					$data = null;
					break;

				case 'post':
					if ( $contentType === 'application/x-www-form-urlencoded' ) {
						$data = $_POST;
						break;
					}

				case 'patch':
				case 'put':
					if ( $contentType === 'application/json' ) {
						$data = json_decode( $rawData, true );
					} elseif ( $contentType === 'application/x-www-form-urlencoded' ) {
						parse_str( $rawData, $data );
					} elseif ( $contentType === 'text/plain' ) {
						$data = $rawData;
					} elseif ( $contentType === 'application/vnd.webbash.filepath' ) {
						$file = $this->deps->fileCache->get( 'path', $rawData );
						if ( $file->exists() ) {
							$data = $file->getContents();
							$headers += array(
								'FILE-OWNER' => $file->getOwner()->getName(),
								'FILE-GROUP' => $file->getGroup()->getName(),
								'FILE-TYPE' => $file->getFiletype(),
							);
						} else {
							throw new HttpException( 400, 'Invalid file data source' );
						}
					} else {
						throw new HttpException( 415, "Invalid content type: $contentType" );
					}
					break;

				default:
					throw new HttpException( 405 );
			}
		} else {
			$data = null;
		}

		// Execute the request
		$response = $this->runController( $method, $url, $data, $headers );
		if ( !( $response instanceof Response ) ) {
			$response = new Response( $response );
		}
		$response->addHeader( 'X-Frame-Options', 'deny' );

		// Encode the response appropriately for the client
		if ( !isset( $headers['ACCEPT'] ) ) {
			$headers['ACCEPT'] = 'application/json';
		}
		foreach ( array_map( 'trim', explode( ',', $headers['ACCEPT'] ) ) as $accept ) {
			switch ( $accept ) {
				case '*/*':
				case 'text/*':
				case 'application/*':
				case 'text/html':
				case 'application/json':
					$response->addHeader( 'Content-Type', 'application/json' );
					$responseData = json_encode( $response->getContents() );
					break 2;

				case 'application/x-www-form-urlencoded':
					$response->addHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
					$responseData = http_build_query( $response->getContents() );
					break 2;

				case '':
				case null:
				case 'undefined':
					$response->addHeader( 'Content-Type', 'text/plain' );
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
			$encodings = explode( ',', $headers['ACCEPT'] );
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
		if ( $method !== 'HEAD' ) {
			echo $responseData;
		}

		return true;
	}

	/**
	 * Run a controller given request information using the internal routes
	 *
	 * @param string $method HTTP method
	 * @param string $url URL
	 * @param mixed $data Parsed data from the request body
	 * @param array $headers HTTP headers
	 *
	 * @return \WebBash\Response A response object
	 * @throws HttpException for various errors
	 */
	private function runController( $method, $url, $data, $headers ) {
		$controller = null;
		$matches = array();
		$queryParamsDef = array();
		$headerParamsDef = array();

		// Find a matching route
		foreach ( $this->routes as $pattern => $info ) {
			list( $class, $queryParamsDef, $headerParamsDef ) = $info;
			if ( preg_match( "!^{$pattern}$!", $url, $matches ) ) {
				$controller = new $class( $this->deps );
				break;
			}
		}

		if ( $controller === null ) {
			throw new HttpException( 404, 'Controller not found' );
		}

		// Check if the method is valid for this controller
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

		// Parse the query and generate a list of final parameters
		$query = parse_url( "http:$url", PHP_URL_QUERY );
		$rawParams = array();
		parse_str( (string)$query, $rawParams );
		foreach ( $rawParams as $key => $val ) {
			if ( isset( $queryParamsDef[$key] ) ) {
				$matches[$queryParamsDef[$key]] = $val;
			}
		}

		foreach ( $headers as $key => $val ) {
			if ( isset( $headerParamsDef[$key] ) ) {
				$matches[$headerParamsDef[$key]] = $val;
			}
		}

		// Run the controller
		return $controller->$method( $matches, $data );
	}
}
