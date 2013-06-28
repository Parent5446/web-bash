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

		if ( $file->isDir() ) {
			$response = new Response( $file->getChildren() );
		} elseif ( $file->isLink() ) {
			$target = $file->getLinkTarget();
			$response = new Response( $target->getContents() );
			$response->addHeader( 'Content-Location', '/files' . $file->getLinkPath() );
		} else {
			$response = new Response( $file->getContents() );
		}

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

		$file->setOwner( $params['owner'] );
		$file->setGroup( $params['group'] );
		$file->setPermissions( $params['perms'] );
	}

	public function delete( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if ( !$file->exists() ) {
			throw new HttpException( 404, 'File does not exist' );
		}
		$file->delete();
	}
}
