<?php

namespace WebBash\Controllers;

use \WebBash\Util;
use \WebBash\DI;
use \WebBash\HttpException;

/**
 * Controller for logging in and out of the application. The login state is considered a
 * resource for the purposes of this application
 */
class LoginController
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
	 * Get the login token
	 *
	 * @param array $params Request parameters
	 * @return array|Response Response information
	 */
	public function get( array $params ) {
		if ( !isset( $_SESSION['loginToken'] ) ) {
			$_SESSION['loginToken'] = bin2hex( Util\urandom( 32 ) );
		}

		return array(
			'token' => $_SESSION['loginToken']
		);
	}

	/**
	 * Login to the application
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
	public function put( array $params, $data ) {
		if (
			!isset( $data['username'] ) ||
			!isset( $data['password'] ) ||
			!isset( $data['token'] )
		) {
			throw new HttpException( 400, 'Need username, password, and token.' );
		}

		// Reset the throttle if necessary
		if ( !isset( $_SESSION['loginCount'] ) || $_SESSION['loginExpiry'] < time() ) {
			$_SESSION['loginCount'] = 0;
			$_SESSION['loginExpiry'] = time() + 3600;
		}

		$user = $this->deps->userCache->get( 'name', $data['username'] );

		// Check token, then throttle, then password
		if ( !isset( $_SESSION['loginToken'] ) || $data['token'] !== $_SESSION['loginToken'] ) {
			throw new HttpException( 401, 'Bad login token' );
		} elseif ( $_SESSION['loginCount']++ > 10 ) {
			throw new HttpException( 429,
				'Too many login requests',
				array( 'Retry-After' => time() - $_SESSION['loginExpiry'] )
			);
		} elseif ( !$user->checkPassword( $data['password'] ) || !$user->exists() ) {
			throw new HttpException( 401, 'Username or password is incorrect' );
		}

		$_SESSION['userId'] = $user->getId();
		unset( $_SESSION['loginCount'] );

		$userController = new UserController( $this->deps );
		return $userController->get( array( 'name' => $user->getName() ) );
	}

	/**
	 * Logout of the application
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function delete( array $params, $data ) {
		session_unset();

		if ( init_get( 'session.use_cookies' ) ) {
			$params = session_get_cookie_params();
			setcookie(
				session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}

		session_destroy();
	}
}
