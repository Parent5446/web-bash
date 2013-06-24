<?php

namespace WebBash;

class HttpException extends \Exception
{
	private static $httpMsgs;

	private $httpCode;
	private $headers;

	public function __construct( $code, $msg, $headers = array() ) {
		parent::__construct( $msg, $code );
		$this->httpCode = $code;
		$this->headers = $headers;
	}

	public function getHttpCode() {
		return $this->httpCode;
	}

	public function getHttpMsg() {
		return self::$httpMsgs[$this->getHttpCode()];
	}

	public function getHeaders() {
		return $this->headers;
	}
}
