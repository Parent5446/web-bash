<?php

namespace WebBash\Controllers;

use \WebBash\DI;
use \WebBash\HttpException;

class CommandHistoryController
{
	private $deps;

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( array $params ) {
		$user = $this->deps->userCache->get( 'name', $params['name'] );

		if ( !$user->exists() ) {
			throw new HttpException( 404, 'User not found' );
		} elseif ( $user->getId() !== $this->deps->currentUser->getId() ) {
			throw new HttpException( 403 );
		}

		return $user->getHistory();
	}

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
