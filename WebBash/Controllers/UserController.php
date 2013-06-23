<?php

namespace WebBash\Controllers;

use \WebBash\Util;
use \WebBash\DI;
/*
class HttpException extends Exception {
	public function __construct( $httpCode, $message ) {}
}
*/
// /users
// /users/:name
class UserController
{
	private $deps = null;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		$user = this->deps->userCache->get("name", $params["name"]);
		if ( !$user->exists() ) {
			throw new HttpException(404, "User not found");
		}
		return $user;
	}

	public function put( array $params, $data ) {
		if ( !is_array($data) ) {
			throw new HttpException(400, "Expecting an array as input");
		}

		$expected_keys = array("email", "name", "password", "home_directory");
		foreach( $expected_keys as $key ) {
			if ( !isset ( $data[$key] ) {
				throw new HttpException(400, "Expecting entry for ".$key);
			}
		}

		$user = this->deps->userCache->get("name", $params["name"]);
		if ( $user->exists() ) {
			throw new HttpException(400, "User already exists");
		}
		else {
			$user->setEmail( $data["email"] );
			$user->setPassword();
			$user->setHomeDirectory();
			$user->save();

			$group = this->deps->userCache->get( "name", $params["usersGroup"] );
			$group->addMember( $user );
			$group.save();

			return $user;
		}
	}

	public function delete( array $params ) {
		
	}
}
