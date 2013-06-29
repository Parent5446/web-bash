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

		if( $user->exists() )
			throw new HttpException( 403, "user already exists" );

		$homedir = $this->deps->fileCache->get( 'path', $data['home_directory'] );

		$admins = $this->deps->groupCache->get( 'name', 'admin' );
		if (
			!$admins->isMember( $this->deps->currentUser ) &&
			$user->getName() !== $this->deps->currentUser->getName()
		) {
			throw new HttpException( 403, "user not allowed to create groups" );
		}

		$user->setEmail( $data['email'] );
		$user->setPassword( $data['password'] );
		$user->setHomeDirectory( $homedir );
		$user->save();


		$homedir->setFileType( 'd' );
		$homedir->setOwner( $user );
		//$groups = $user->getGroups();
		//$group = $this->deps->groupCache->get( 'name', $groups[0] );
		//$homedir->setGroup( $group );
		$homedir->perms = octdec( '0755' );
		$homedir->save();

		// cant create directory without user already existing. cant save homedir if it doesn't already exist
		// as such, create/save the user, create/save the homedir, and then update the user
		$user->setHomeDirectory( $homedir );
		$user->save();

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
