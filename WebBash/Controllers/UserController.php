<?php

namespace WebBash\Controllers;

use \WebBash\DI;

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

		$expected_keys = array( 'email', 'name', 'password', 'home_directory' );
		foreach ( $expected_keys as $key ) {
			if ( !isset( $data[$key] ) ) {
				throw new HttpException( 400, 'Expecting entry for ' . $key );
			}
		}

		$user = $this->deps->userCache->get( 'name', $params['name'] );
		$homedir = $this->deps->fileCache->get( 'path', $data['home_directory'] );

		$user->setEmail( $data['email'] );
		$user->setPassword( $data['password'] );
		$user->setHomeDirectory( $homedir );
		$user->save();

		return $this->get( $params );
	}

	public function delete( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );
		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User does not exist' );
		}
		$user->delete();
	}
}
