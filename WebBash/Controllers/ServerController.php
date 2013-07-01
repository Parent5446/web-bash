<?php

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
	public function get( array $params ) {
		$hostnameFile = $this->deps->fileCache->get( 'path', '/etc/hostname' );
		if ( $hostnameFile->exists() ) {
			$hostname = trim( $hostnameFile->getContents() );
		} else {
			$hostname = $this->deps->config['webbash']['hostname']
		}

		return array(
			'kernel' => 'WebBash',
			'version' => number_format( WEBBASH, 1 ),
			'hostname' => $this->deps->config['webbash']['hostname']
		);
	}
}
