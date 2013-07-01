<?php

namespace WebBash;

/**
 * Wrapper for an HTTP response body and headers
 */
class Response
{
	/**
	 * Headers to send to the browser
	 * @private array
	 */
	private $headers = array();

	/**
	 * Content to send to the browser in the response body
	 * @private mixed
	 */
	private $content;

	/**
	 * Consruct the response object
	 *
	 * @param mixed $data Data to send to client
	 */
	public function __construct( $data ) {
		$this->content = $data;
	}

	/**
	 * Add an HTTP header to the response
	 *
	 * @param string $key Header name
	 * @param string $value Header value
	 * @return $this for method chaining
	 */
	public function addHeader( $key, $value ) {
		if ( $value instanceof \DateTime ) {
			$value = $value->format( 'r' );
		}
		$this->headers[$key] = $value;
		return $this;
	}

	/**
	 * Get the list of headers
	 *
	 * @return array Mapping of header names to values
	 */
	public function getHeaders() {
		return $this->headers;
	}

	/**
	 * Get the contents of the response body
	 *
	 * @return mixed
	 */
	public function getContents() {
		return $this->content;
	}
}
