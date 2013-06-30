<?php

namespace WebBash\Controllers;

use \WebBash\DI;

class ServerController
{
	private $deps;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

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