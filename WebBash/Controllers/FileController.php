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

	private static $sortFields = array(
		'name',
		'size',
		'ctime',
		'mtime',
		'atime'
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

			if ( !isset( $params['sortby'] ) ) {
				$params['sortby'] = array( 'name' );
			} else {
				$params['sortby'] = array_map( 'trim', explode( ',', $params['sortby'] ) );
				if ( array_diff( $params['sortby'], self::$sortFields ) ) {
					throw new HttpException( 400, 'Invalid sort field' );
				}
			}

			// Add entries for the children
			foreach ( $file->getChildren( $params['sortby'] ) as $child ) {
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
			$response->addEtag( md5( $contents ) );
		}

		// Update the access time
		$response->addModifiedTime( $file->getModifiedTime() );
		$file->updateAccessTime();
		$file->save();

		return $response
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}\"" )
			->addHeader( 'Last-Accessed', $file->getAccessTime() )
			->addHeader( 'Creation-Time', $file->getChangedTime() )
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
			$file->getModifiedTime(),
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
		} elseif ( !$file->getParent()->isAllowed(
			$this->deps->currentUser,
			FileInfo::ACTION_EXECUTE
		) ) {
			throw new HttpException( 403 );
		}

		$response = new Response( null );
		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getModifiedTime() )
			->addHeader( 'Last-Accessed', $file->getAccessTime() )
			->addHeader( 'Creation-Time', $file->getChangedTime() )
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

		$file->updateAccessTime();
		$file->updateChangedTime();
		$file->save();

		$response = new Response( null );
		return $response
			->addHeader( 'Content-Length', $file->getSize() )
			->addHeader( 'Content-Disposition', "attachment; filename=\"{$file->getFilename()}" )
			->addHeader( 'Last-Modified', $file->getModifiedTime() )
			->addHeader( 'Last-Accessed', $file->getAccessTime() )
			->addHeader( 'Creation-Time', $file->getChangedTime() )
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

		$this->deps->db->beginTransaction();
		var_dump( $file );
		if ( !$file->exists() ) {
			$parent = $file->getParent();
			var_dump( $parent );
			$parent->updateModifiedTime();
			$parent->save();
		}

		// Set all the file info
		$file->setFiletype( self::$fileTypes[$params['type']] );
		$file->setOwner( $owner );
		$file->setGroup( $group );
		$file->setPermissionsRaw( $perms );

		$file->updateAccessTime();
		$file->updateModifiedTime();
		$file->updateChangedTime();
		$file->setContents( $data );
		$file->save();

		$this->deps->db->commit();
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

		$cTime = $mTime = false;

		if ( isset( $params['owner'] ) ) {
			$owner = $this->deps->userCache->get( 'name', $params['owner'] );
			if ( !$owner->exists() ) {
				throw new HttpException( 400, 'Invalid owner' );
			} elseif ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setOwner( $owner );
			$cTime = true;
		}

		if ( isset( $params['group'] ) ) {
			$group = $this->deps->groupCache->get( 'name', $params['group'] );
			if ( !$group->exists() ) {
				throw new HttpException( 400, 'Invalid group' );
			} elseif ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setGroup( $group );
			$cTime = true;
		}

		if ( isset( $params['perms'] ) ) {
			if ( $file->exists() && $file->getOwner()->getId() !== $this->deps->currentUser->getId() ) {
				throw new HttpException( 403, 'Only the owner can change permissions' );
			}
			$file->setPermissionsRaw( octdec( $params['perms'] ) );
			$cTime = true;
		}

		if ( isset( $params['type'] ) ) {
			$file->setFiletype( self::$fileTypes[$params['type']] );
		}
		if ( isset( $params['type'] ) || $data ) {
			$file->setContents( $data );
			$mTime = true;
		}

		if ( $cTime ) {
			$file->updateChangedTime();
		}
		if ( $mTime ) {
			$file->updateModifiedTime();
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

		$this->deps->db->beginTransaction();
		$parent = $file->getParent();
		$parent->updateModifiedTime();
		$parent->save();
		$file->delete();
		$this->deps->db->commit();
	}
}

