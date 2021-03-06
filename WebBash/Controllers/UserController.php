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

/**
 * Controller for manipulating users of the application
 */
class UserController
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
	 * Get information about the user
	 *
	 * @param array $params Request parameters
	 * @return array|Response Response information
	 */
	public function get( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );
		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User not found' );
		}

		return array(
			'name' => $user->getName(),
			'email' => $user->getEmail(),
			'homedir' => $user->getHomeDirectory()->getPathname()
		);
	}

	/**
	 * Create a new user, or replace an existing one
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
	public function put( array $params, $data ) {
		if ( !is_array( $data ) ) {
			throw new HttpException( 400, 'Expecting an array as input' );
		}

		$expected_keys = array( 'email', 'password', 'home_directory' );
		foreach ( $expected_keys as $key ) {
			if ( !isset( $data[$key] ) ) {
				throw new HttpException( 400, 'Expecting entry for ' . $key );
			}
		}

		// Get an array of groups to add
		$groups = array();
		if ( isset( $data['groups'] ) ) {
			foreach ( $data['groups'] as $group ) {
				$groupObj = $this->deps->groupCache->get( 'name', $group );
				if ( !$groupObj->exists() ) {
					throw new HttpException( 400, 'Invalid group name ' . $group );
				}
				$groups[] = $groupObj;
			}
		}

		$user = $this->deps->userCache->get( 'name', $params['name'] );

		// Make sure the user is only changing their own info, or is an admin
		$admins = $this->deps->groupCache->get( 'name', 'admin' );
		if (
			!$admins->isMember( $this->deps->currentUser ) &&
			$user->getName() !== $this->deps->currentUser->getName()
		) {
			throw new HttpException( 403, "user not allowed to create groups" );
		}

		// Get the intended home directory
		$homedir = $this->deps->fileCache->get( 'path', $data['home_directory'] );
		if ( !$homedir->exists() || !$homedir->isDir() ) {
			throw new HttpException( 400, 'Home directory is not a directory' );
		}

		$user->setEmail( $data['email'] );
		$user->setPassword( $data['password'] );
		$user->setHomeDirectory( $homedir );

		$this->deps->db->beginTransaction();
		$user->save();

		// Remove all existing groups and add only the given groups
		foreach ( $user->getGroups() as $group ) {
			if ( !in_array( $group, $groups ) ) {
				$group->removeMember( $user );
				$group->save();
			}
		}
		foreach ( $groups as $group ) {
			$group->addMember( $user );
			$group->save();
		}

		// Set ownership of the home directory
		$homedir->setOwner( $user );
		$homedir->save();

		$this->deps->db->commit();

		// Give a response as if a GET request was made
		return $this->get( $params );
	}

	/**
	 * Update only certain information about a user
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
	public function patch( array $params, $data ) {
		if ( !is_array( $data ) ) {
			throw new HttpException( 400, 'Expecting an array as input' );
		}

		$user = $this->deps->userCache->get( 'name', $params['name'] );

		$admins = $this->deps->groupCache->get( 'name', 'admin' );
		if (
			!$admins->isMember( $this->deps->currentUser ) &&
			$user->getName() !== $this->deps->currentUser->getName()
		) {
			throw new HttpException( 403, "user not allowed to create groups" );
		}

		$homedir = null;
		if ( isset( $data['home_directory'] ) ) {
			$homedir = $this->deps->fileCache->get( 'path', $data['home_directory'] );
			if ( $homedir->exists() && !$homedir->isDir() ) {
				throw new HttpException( 400, 'Home directory is not a directory' );
			} elseif ( !$homedir->exists() ) {
				$fileController = new FileController( $this->deps );
				$fileController->put( array(
					'path' => $data['home_directory'],
					'type' => 'directory'
				) );
			}

			$user->setHomeDirectory( $homedir );
		}
		if ( isset( $data['email'] ) ) {
			$user->setEmail( $data['email'] );
		}
		if ( isset( $data['password'] ) ) {
			$user->setPassword( $data['password'] );
		}

		$this->deps->db->beginTransaction();

		if ( isset( $data['groups'] ) ) {
			foreach ( $data['groups'] as $group ) {
				$groupObj = $this->deps->groupCache->get( 'name', $group );
				if ( !$groupObj->exists() ) {
					throw new HttpException( 400, 'Invalid group name ' . $group );
				}
				$groupObj->addMember( $user );
				$groupObj->save();
			}
		}

		$user->save();

		if ( $homedir ) {
			$homedir->setOwner( $user );
			$homedir->save();
		}

		$this->deps->db->commit();

		return $this->get( $params );
	}

	/**
	 * Delete an existing user
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function delete( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );
		$admins = $this->deps->groupCache->get( 'name', 'admin' );

		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User does not exist' );
		} elseif ( !$admins->isMember( $this->deps->currentUser ) ) {
			throw new HttpException( 403 );
		}

		$user->delete();
	}
}
