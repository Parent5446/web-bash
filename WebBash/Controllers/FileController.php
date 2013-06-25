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

		return array(
			'name'      => $file->getFilename(),
			'size'      => $file->getSize(),
			'owner'     => $file->getParent(),
			'grp'       => $file->getGroup(),
			'atime'     => $file->getATime(),
			'mtime'     => $file->getMTime(),
			'ctime'     => $file->getCtime()
		);
	}

	public function put( array $params, $data ) {
		if ( !is_array( $ data ) ) {
			throw new HttpException( 400, 'Expecting an array as input' );
		}

		$expected_keys = array( 'name', 'owner', 'grp', 'perms BIT' );
		foreach ( $expected_keys as $key ) {
			if ( !isset( $data[$key] ) ) {
				throw new HttpException( 400, 'Expecting etry for ' . $key );
			}
		}

		$file = $this->deps->fileCache->get( 'name', $params['name'] );

		$file->setName( $data['name'] );
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

?>