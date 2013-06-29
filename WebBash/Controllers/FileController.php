<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;
use \WebBash\Response;
use \WebBash\Models\FileInfo;

class FileController
{
	private $deps;
	
	private static $fileTypes = array(
		'file' => 'f',
		'directory' => 'd',
		'link' => 'l',
		'f' => 'f',
		'd' => 'd',
		'l' => 'l'
	);

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if( !$file->exists() ) {
			throw new HttpException( 404, 'File not found' );
		} elseif (
			( $file->isFile() || $file->isLink() ) &&
			!$file->isAllowed( $this->deps->currentUser, FileInfo::ACTION_READ ) ||

			$file->isDir() &&
			!$file->isAllowed( $this->deps->currentUser, FileInfo::ACTION_EXECUTE )
		) {
			throw new HttpException( 403 );
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

	public function head( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if( !$file->exists() ) {
			throw new HttpException( 404, 'File not found' );
		} elseif ( !$file->getParent()->isAllowed( $this->deps->currentUser, FileInfo::ACTION_EXECUTE ) ) {
			throw new HttpException( 403 );
		}

		$response = new Response( null );
		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getMTime() )
			->addHeader( 'Last-Accessed', $file->getATime() )
			->addHeader( 'Creation-Time', $file->getCTime() )
			->addHeader( 'File-Owner', $file->getOwner()->getName() )
			->addHeader( 'File-Group', $file->getGroup()->getName() );
	}
	
	public function post( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if( !$file->exists() ) {
			$this->put( $params, '' );
		} elseif ( !$file->getParent()->isAllowed( $this->deps->currentUser, FileInfo::ACTION_EXECUTE ) ) {
			throw new HttpException( 403 );
		}

		$file->save();
		$response = new Response( null );
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

		if ( isset( $params['owner'] ) ) {
			$owner = $this->deps->userCache->get( 'name', $params['owner'] );
		} else {
			$owner = $this->deps->currentUser;
		}
		
		if ( isset( $params['group'] ) ) {
			$group = $this->deps->groupCache->get( 'name', $params['group'] );
		} else {
			$groups = $this->deps->currentUser->getGroups();
			$group = $this->deps->groupCache->get( 'name', $groups[0] );
		}
		
		if ( !isset( $params['type'] ) ) {
			$params['type'] = 'file';
		}
		
		if ( !isset( self::$fileTypes[$params['type']] ) ) {
			throw new HttpException( 400, 'Invalid file type' );
		} elseif ( !$file->exists() && !$file->getParent()->exists() ) {
			throw new HttpException( 404 );
		} elseif ( !$file->isAllowed( $this->deps->currentUser, FileInfo::ACTION_WRITE ) ) {
			throw new HttpException( 403 );
		} elseif ( !$owner->exists() ) {
			throw new HttpException( 400, 'Invalid owner' );
		} elseif ( !$group->exists() ) {
			throw new HttpException( 400, 'Invalid group' );
		}

		$file->setFiletype( self::$fileTypes[$params['type']] );
		$file->setOwner( $owner );
		$file->setGroup( $group );
		$file->save();
		$file->setContents( $data );
	}
	
	public function patch( array $params, $data ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );

		if ( isset( $params['type'] ) && !isset( self::$fileTypes[$params['type']] ) ) {
			throw new HttpException( 400, "Invalid file type {$params['type']}" );
		} elseif ( !$file->exists() ) {
			throw new HttpException( 404 );
		} elseif ( !$file->isAllowed( $this->deps->currentUser, FileInfo::ACTION_WRITE ) ) {
			throw new HttpException( 403 );
		}
		
		if ( isset( $params['owner'] ) ) {
			$owner = $this->deps->userCache->get( 'name', $params['owner'] );
			if ( !$owner->exists() ) {
				throw new HttpException( 400, 'Invalid owner' );
			}
			$file->setOwner( $owner );
		}
		
		if ( isset( $params['group'] ) ) {
			$group = $this->deps->groupCache->get( 'name', $params['group'] );
			if ( !$group->exists() ) {
				throw new HttpException( 400, 'Invalid group' );
			}
			$file->setGroup( $group );
		}

		if ( isset( $params['type'] ) ) {
			$file->setFiletype( self::$fileTypes[$params['type']] );
		}

		if ( $data ) {
			$file->setContents( $data );
		}

		$file->save();
	}

	public function delete( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );

		if ( !$file->exists() ) {
			throw new HttpException( 404, 'File does not exist' );
		} elseif ( !$file->getParent()->isAllowed( $this->deps->currentUser, FileInfo::ACTION_WRITE ) ) {
			throw new HttpException( 403 );
		}

		$file->delete();
	}
}
