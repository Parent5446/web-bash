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
	 * ETag for the resource
	 * @private string
	 */
	private $etag = null;
	
	/**
	 * Modified time
	 * @private \DateTime
	 */
	private $modifiedTime = null;

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

	/**
	 * Add an ETag to this response
	 *
	 * @param string $etag
	 * @param bool $weak Whether it's a weak tag or not
	 */
	public function addETag( $etag, $weak = false ) {
		$fullTag = $weak ? "W/\"$etag\"" : "\"$etag\"";
		$this->addHeader( 'ETag', $fullTag );
		$this->etag = $fullTag;
	}

	/**
	 * Add a modified time to this response
	 *
	 * @param \DateTime $mtime Modified time
	 */
	public function addModifiedTime( \DateTime $mtime ) {
		$this->addHeader( 'Last-Modified', $mtime );
		$this->modifiedTime = $mtime;
	}

	/**
	 * See if an ETag matches against this resource
	 *
	 * @param string $etag ETag to check
	 * @param string $allowWeak Whether weak matching is allowed
	 * @return bool True if matches, false otherwise
	 */
	public function matchETag( $etag, $allowWeak ) {
		if ( $etag === '*' ) {
			return $this->etag !== null;
		} elseif ( !$allowWeak && ( $etag[0] === 'W' || $this->etag[0] === 'W' ) ) {
			return false;
		}

		if ( $this->etag[0] === 'W' ) {
			$serverTag = trim( substr( $this->etag, 1 ), '"' );
		} else {
			$serverTag = trim( $this->etag, '"' );
		}
		
		if ( $etag[0] === 'W' ) {
			$clientTag = trim( substr( $etag, 1 ), '"' );
		} else {
			$clientTag = trim( $etag, '"' );
		}
		
		return $serverTag === $clientTag;
	}
	
	/**
	 * See if an ETag matches against this resource
	 *
	 * @param string $mtime Modified time to check
	 * @param string $allowWeak Whether weak matching is allowed
	 * @return bool True if the resource has not been modified
	 */
	public function matchLastModified( \DateTime $mtime, $allowWeak ) {
		if ( !$allowWeak || $this->modifiedTime === null ) {
			return false;
		}

		$diff = $this->modifiedTime->diff( $mtime );
		return !$diff->invert;
	}
}
