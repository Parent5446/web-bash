<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;

class UserController
{
	private $deps;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

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

		$user = $this->deps->userCache->get( 'name', $params['name'] );

		$admins = $this->deps->groupCache->get( 'name', 'admin' );
		if (
			!$admins->isMember( $this->deps->currentUser ) &&
			$user->getName() !== $this->deps->currentUser->getName()
		) {
			throw new HttpException( 403, "user not allowed to create groups" );
		}


		$homedir = $this->deps->fileCache->get( 'path', $data['home_directory'] );
		if ( !$homedir->exists() || !$homedir->isDir() ) {
			throw new HttpException( 400, 'Home directory is not a directory' );
		}

		$user->setEmail( $data['email'] );
		$user->setPassword( $data['password'] );
		$user->setHomeDirectory( $homedir );
		$user->save();

		$homedir->setOwner( $user );
		$homedir->save();

		return $this->get( $params );
	}

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

		$user->save();

		if ( $homedir ) {
			$homedir->setOwner( $user );
			$homedir->save();
		}

		return $this->get( $params );
	}

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
