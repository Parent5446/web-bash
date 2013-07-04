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
 * Exception representing some sort of request error that is associated
 * with an HTTP status code
 */
class HttpException extends \Exception
{
	/**
	 * Mapping of HTTP status values to their messages
	 * @private array
	 */
	private static $httpMsgs = array(
		100 => 'Continue',
		101 => 'Switching Protocols',
		200 => 'OK',
		201 => 'Created',
		202 => 'Accepted',
		203 => 'Non-Authoritative Information',
		204 => 'No Content',
		205 => 'Reset Content',
		206 => 'Partial Content',
		300 => 'Multiple Choices',
		301 => 'Moved Permanently',
		302 => 'Found',
		303 => 'See Other',
		304 => 'Not Modified',
		305 => 'Use Proxy',
		306 => 'Switch Proxy',
		307 => 'Temporary Redirect',
		308 => 'Permanent Redirect',
		400 => 'Bad Request',
		401 => 'Unauthorized',
		402 => 'Payment Required',
		403 => 'Forbidden',
		404 => 'Not Found',
		405 => 'Method Not Allowed',
		406 => 'Not Acceptable',
		407 => 'Proxy Authentication Required',
		408 => 'Request Timeout',
		409 => 'Conflict',
		410 => 'Gone',
		411 => 'Length Required',
		412 => 'Precondition Failed',
		413 => 'Request Entity Too Large',
		414 => 'Request-URI Too Long',
		415 => 'Unsupported Media Type',
		416 => 'Requested Range Not Satisfiable',
		417 => 'Expectation Failed',
		418 => 'I\'m a teapot',
		419 => 'Authentication Timeout',
		422 => 'Unprocessable Entity',
		423 => 'Locked',
		426 => 'Upgrade Required',
		428 => 'Precondition Required',
		429 => 'Too Many Requests',
		431 => 'Request Header Fields Too Large',
		500 => 'Internal Server Error',
		501 => 'Not Implemented',
		502 => 'Bad Gateway',
		503 => 'Service Unavailable',
		504 => 'Gateway Timeout',
		505 => 'HTTP Version Not Supported',
	);

	/**
	 * The HTTP error code for this error
	 * @private int
	 */
	private $httpCode;

	/**
	 * The headers for this error
	 * @private array
	 */
	private $headers;

	/**
	 * Construct the error
	 *
	 * @param int $code HTTP error code
	 * @param string $msg Message for the exception
	 * @param Response|array $headers Response headers to send
	 */
	public function __construct( $code, $msg = '', $headers = array() ) {
		parent::__construct( $msg, $code );
		$this->httpCode = $code;
		if ( $headers instanceof Response ) {
			$this->headers = $headers->getHeaders();
		} else {
			$this->headers = $headers;
		}
	}

	/**
	 * Get the HTTP error code for this error
	 *
	 * @return int
	 */
	public function getHttpCode() {
		return $this->httpCode;
	}

	/**
	 * Get the HTTP status message for this error (different from the exception message)
	 *
	 * @return string
	 */
	public function getHttpMsg() {
		return self::$httpMsgs[$this->getHttpCode()];
	}

	/**
	 * Get the response headers for this error
	 *
	 * @return array Mapping of header names to values
	 */
	public function getHeaders() {
		return $this->headers;
	}
}
