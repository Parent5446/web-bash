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

namespace WebBash\Controllers;

use \WebBash\DI;

/**
 * Controller to receive basic information about the server
 */
class ServerController
{
	/**
	 * Dependency injection container
	 * @private \WebBash\DI
	 */
	private $deps;

	/**
	 * Construct the controller
	 *
	 * @param \WebBash\DI $deps Dependency injection container
	 */
	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	/**
	 * Get information about the server
	 *
	 * @param array $params Request parameters
	 * @return array|Response Response information
	 */
	public function get() {
		$hostnameFile = $this->deps->fileCache->get( 'path', '/etc/hostname' );
		if ( $hostnameFile->exists() ) {
			$hostname = trim( $hostnameFile->getContents() );
		} else {
			$hostname = $this->deps->config['webbash']['hostname'];
		}

		return array(
			'kernel' => 'WebBash',
			'version' => number_format( WEBBASH, 1 ),
			'hostname' => $this->deps->config['webbash']['hostname']
		);
	}
}
