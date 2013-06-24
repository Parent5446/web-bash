<?php

namespace WebBash\Controllers;

use \WebBash\Util;
use \WebBash\DI;
/*
class HttpException extends Exception {
	public function __construct( $httpCode, $message ) {}
}
*/
// /users/:name
class UserController
{
	private $deps = null;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		if ( !is_array($data) ) {
			throw new HttpException(400, "Expecting an array as input");
		} else if ( !isset ( $data["name"] ) {
			throw new HttpException(400, "Expecting entry for name");
		}

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
		} else {
			$created = $user->create($params["name"], $params["email"], false, $params["password"], "", $params["home_directory"]);

			if( !$created ) {
				// user already exists
				throw new HttpException(400, "User already exists");
			} else {
				return $user;
			}
		}
	}

	public function delete( array $params ) {
		if ( !is_array($data) ) {
			throw new HttpException(400, "Expecting an array as input");
		}

		$expected_keys = array("name");

		if ( !isset ( $data["name"] ) {
			throw new HttpException(400, "Expecting entry for name");
		}

		$user = this->deps->userCache->get("name", $params["name"]);
		if ( !$user->exists() ) {
			throw new HttpException(400, "User does not exist");
		} else {
			$user->delete();

			return $user;
		}
	}
}
