<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;
use \WebBash\Response;

class FileController
{
	private $deps;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if( !$file->exists() ) {
			throw new HttpException( 404, 'File not found' );
		}

		$response = new Response( $file->getContents() );
		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getMTime() )
			->addHeader( 'Last-Accessed', $file->getATime() )
			->addHeader( 'Creation-Time', $file->getCTime() )
			->addHeader( 'File-Owner', $file->getOwner()->getName() )
			->addHeader( 'File-Group', $file->getGroup()->getName() );
	}

	public function put( array $params, $data ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );

		$file->setOwner( $data['owner'] );
		$file->setGroup( $data['grp'] );
		$file->setPermissions( $data['perms BIT'] );
	}

	public function delete( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if ( !$file->exists() ) {
			throw new HttpException( 404, 'File does not exist' );
		}
		$file->delete();
	}
}
