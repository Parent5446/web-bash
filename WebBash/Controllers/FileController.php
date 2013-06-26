<?php

namespace WebBash\Controllers;

use \WebBash\DI;

clas FileController
{
	private $deps;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		$file = $this->deps->fileCache->get( 'name', $params['name']);
		if( !$file->exist() ) {
			throw new HttpException( 404, 'File not found' );
		}

		return new Response( '' )
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getName()}" )
			->addHeader( 'Last-Modified', $file->getMTime() )
			->addHeader( 'Last-Accessed', $file->getATime() )
			->addHeader( 'Creation-Time', $file->getCTime() )
			->addHeader( 'File-Owner', $file->getOwner()->getName() )
			->addHeader( 'File-Group', $file->getGroup()->getName() );
	}

	public function put( array $params, $data ) {
		$file = $this->deps->fileCache->get( 'path', $params['path'] );

		$file->setOwner( $data['owner'] );
		$file->setGroup( $data['grp'] );
		$file->setPermissions( $data['perms BIT'] );
	}

	public function delete( array $params ) {
		$file = $this->deps->fileCache->get( 'name', $params['name'] );
		if ( !$file->exists() ) {
			throw new HttpException( 404, 'File does not exist' );
		}
		$file->delete();
	}
}
