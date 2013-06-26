<?php

namespace WebBash;

class HeaderResponse
{
	private headerAttributes = array();

	public function __construct() { }

	public function addHeader( $key, $value ) {
		$this->headerAttributes[$key] = $value;
		return $this;
	}

	public function addHeadersToResponse() {
		foreach ( $headerAttributes as $key => $value ) {
			header( "$key: $value" );
		}
	}

}

	
