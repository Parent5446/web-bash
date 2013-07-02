<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;
use \WebBash\Response;
use \WebBash\Models\FileInfo;

/**
 * Controller for changing information about files in the virtual file system
 */
class ChmodController 
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
	 * Update a file's permissions
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function post( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if ( !$file->exists() ) {
			throw new HttpException( 404 );
		}

		if ( $file->getOwner() != $deps->currentUser ) {
			throw new HttpException( 403, 'only file owner can change file' );
		}

		if ( !isset( $params['settings'] ) {
			throw new HttpException( 403, 'missing settings param' );
		}
		
		// not sure what settings sent to server should be/how to parse them yet. 
		// will look into this tomorrow

		$file->save();
		$response = new Response( 'file settings changes' );
		return $response;
	}
}


