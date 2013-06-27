<?php

namespace WebBash;

class Response
{
	private $headers = array();

	private $content = '';

	public function __construct( $data ) {
		$this->content = $data;
	}

	public function addHeader( $key, $value ) {
		if ( $value instanceof \DateTime ) {
			$value = $value->format( 'r' );
		}
		$this->headers[$key] = $value;
		return $this;
	}

	public function getHeaders() {
		return $this->headers;
	}
	
	public function getContents() {
		return $this->content;
	}
}
