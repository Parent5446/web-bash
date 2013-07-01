<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;

/**
 * Controller for retrieving a user's command history
 */
class CommandHistoryController
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
	 * Get the command history for a user
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function get( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );

		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User not found' );
		} elseif ( $user->getId() !== $this->deps->currentUser->getId() ) {
			throw new HttpException( 403 );
		}

		return $user->getHistory();
	}

	/**
	 * Add more command history for the user
	 *
	 * @param array $params Request parameters
	 * @param mixed $data Request body data
	 * @return mixed|Response Response information
	 */
	public function patch( array $params, $data ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );

		if ( !is_array( $data ) ) {
			throw new HttpException( 400, 'Expecting an array as input' );
		} elseif ( !$user->exists() ) {
			throw new HttpException( 404, 'User not found' );
		} elseif ( $user->getId() !== $this->deps->currentUser->getId() ) {
			throw new HttpException( 403 );
		}

		if ( isset( $data['history'] ) ) {
			$data = $data['history'];
		}
		$data = array_map( 'strval', $data );
		$user->addHistory( $data );
	}

	/**
	 * Delete a user's command history
	 *
	 * @param array $params Request parameters
	 * @return mixed|Response Response information
	 */
	public function delete( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );
		$admins = $this->deps->groupCache->get( 'name', 'admin' );

		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User does not exist' );
		} elseif ( $user->getId() !== $this->deps->currentUser->getId() ) {
			throw new HttpException( 403 );
		}

		$user->deleteHistory();
	}
}
