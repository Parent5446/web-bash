<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;
use \WebBash\Response;
use \WebBash\Models\FileInfo;

/**
 * Controller for changing information about files in the virtual file system
 */
class FileController
{
	/**
	 * Dependency injection container
	 * @private \WebBash\DI
	 */
	private $deps;

	private static $fileTypes = array(
		'file' => 'f',
		'directory' => 'd',
		'link' => 'l',
		'f' => 'f',
		'd' => 'd',
		'l' => 'l'
	);

	/**
	 * Construct the controller
	 *
	 * @param \WebBash\DI $deps Dependency injection container
	 */
	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	/**
	 * Get information and the contents for a file
	 *
	 * @param array $params Request parameters
	 * @return array|Response Response information
	 */
	public function get( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );

		// Check if the file exists and the user is allowed to access it
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

		// Generate response info about the file
		if ( $file->isDir() ) {
			// Add entries for . and ..
			$childrenArray = array(
				$this->getFileInfoArray( $file, '.' ),
				$this->getFileInfoArray( $file->getParent(), '..' )
			);

			// Add entries for the children
			foreach ( $file->getChildren() as $child ) {
				$childrenArray[] = $this->getFileInfoArray( $child );
			}

			$response = new Response( $childrenArray );
		} elseif ( $file->isLink() ) {
			$target = $file->getLinkTarget();
			$response = new Response( (string)$target->getContents() );
			$response->addHeader( 'Content-Location', '/files' . $file->getLinkPath() );
		} else {
			$contents = (string)$file->getContents();
			$response = new Response( $contents );
		}

		// Update the access time
		$file->updateATime();
		$file->save();

		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getMTime() )
			->addHeader( 'Last-Accessed', $file->getATime() )
			->addHeader( 'Creation-Time', $file->getCTime() )
			->addHeader( 'File-Owner', $file->getOwner()->getName() )
			->addHeader( 'File-Group', $file->getGroup()->getName() )
			->addHeader( 'File-Type', array_search( $file->getFiletype(), self::$fileTypes ) );
	}

	/**
	 * Get an array of primitive information about a file for use by the client
	 *
	 * @param \WebBash\Models\FileInfo $file File to get info about
	 * @return array
	 */
	private function getFileInfoArray( \WebBash\Models\FileInfo $file, $name = null ) {
		return array(
			$file->getFiletype(),
			$file->getPermissions(),
			$file->getOwner()->getName(),
			$file->getGroup()->getName(),
			$file->getSize(),
			$file->getMTime(),
			$name ?: $file->getFilename()
		);
	}

	/**
	 * Retrieve only metadata (not contents) for a file
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
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
			->addHeader( 'File-Group', $file->getGroup()->getName() )
			->addHeader( 'File-Type', array_search( $file->getFiletype(), self::$fileTypes ) );
	}

	/**
	 * Update a file's metadata, and create it if it doesn't exist
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function post( array $params ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );
		if ( !$file->exists() ) {
			// Create file if it doesn't exist
			$this->put( $params, '' );
		} elseif ( !$file->getParent()->isAllowed( $this->deps->currentUser, FileInfo::ACTION_EXECUTE ) ) {
			throw new HttpException( 403 );
		}

		$file->updateATime();
		$file->updateMTime();
		$file->save();

		$response = new Response( null );
		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getMTime() )
			->addHeader( 'Last-Accessed', $file->getATime() )
			->addHeader( 'Creation-Time', $file->getCTime() )
			->addHeader( 'File-Owner', $file->getOwner()->getName() )
			->addHeader( 'File-Group', $file->getGroup()->getName() )
			->addHeader( 'File-Type', array_search( $file->getFiletype(), self::$fileTypes ) );
	}

	/**
	 * Upload a new file resource (or replace an existing one
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
	public function put( array $params, $data ) {
		$file = $this->deps->fileCache->get( 'path', "/{$params['path']}" );

		// Fetch a user object for the intended owner
		if ( isset( $params['owner'] ) ) {
			$owner = $this->deps->userCache->get( 'name', $params['owner'] );
		} else {
			$owner = $this->deps->currentUser;
		}

		// Fetch a group object for the intended group
		if ( isset( $params['group'] ) ) {
			$group = $this->deps->groupCache->get( 'name', $params['group'] );
		} else {
			$groups = $this->deps->currentUser->getGroups();
			$group = $this->deps->groupCache->get( 'name', $groups[0] );
		}

		// Get the file type
		if ( !isset( $params['type'] ) ) {
			$params['type'] = 'file';
		}

		if ( !isset( $params['perms'] ) ) {
			$params['perms'] = $params['type'] === 'directory' ? '0755' : '0644';
		}
		$perms = (int)octdec( $params['perms'] );

		// Validate the input and the user's access privileges
		if ( !isset( self::$fileTypes[$params['type']] ) ) {
			throw new HttpException( 400, 'Invalid file type' );
		} elseif ( !$file->exists() && !$file->getParent()->exists() ) {
			throw new HttpException( 404, 'Cannot find file or directory' );
		} elseif ( !$file->getParent()->isDir() ) {
			throw new HttpException( 400, 'Not a directory' );
		} elseif ( $file->exists() && !$file->isAllowed( $this->deps->currentUser, FileInfo::ACTION_WRITE ) ) {
			throw new HttpException( 403, 'Cannot write to file' );
		} elseif ( !$file->exists() && !$file->getParent()->isAllowed( $this->deps->currentUser, FileInfo::ACTION_WRITE ) ) {
			throw new HttpException( 403, 'Cannot create file since dont have write access to parent directory' );
		} elseif ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
			throw new HttpException( 403, 'Only the owner can change permissions' );
		} elseif ( !$owner->exists() ) {
			throw new HttpException( 400, 'Invalid owner' );
		} elseif ( !$group->exists() ) {
			throw new HttpException( 400, 'Invalid group' );
		}

		// Set all the file info
		$file->setFiletype( self::$fileTypes[$params['type']] );
		$file->setOwner( $owner );
		$file->setGroup( $group );
		$file->setPermissionsRaw( $perms );

		$file->updateATime();
		$file->updateMTime();
		$file->save();
		$file->setContents( $data );
	}

	/**
	 * Change only certain metadata about a file
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
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
			} elseif ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setOwner( $owner );
		}

		if ( isset( $params['group'] ) ) {
			$group = $this->deps->groupCache->get( 'name', $params['group'] );
			if ( !$group->exists() ) {
				throw new HttpException( 400, 'Invalid group' );
			} elseif ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setGroup( $group );
		}

		if ( isset( $params['perms'] ) ) {
			if ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setPermissionsRaw( octdec( $params['perms'] ) );
		}

		if ( isset( $params['type'] ) ) {
			$file->setFiletype( self::$fileTypes[$params['type']] );
		}

		if ( $data ) {
			$file->setContents( $data );
		}

		$file->save();
	}

	/**
	 * Delete a file
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
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
