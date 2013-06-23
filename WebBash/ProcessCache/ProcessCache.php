<?php

namespace WebBash\ProcessCache;

use \WebBash\DI;

abstract class ProcessCache
{
	protected $cache = array();

	abstract protected function getFactoryClass();

	abstract protected function getFactoryFunctions();

	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	public function get( $field, $value ) {
		if ( !isset( $cache[$field][$value] ) ) {
			$cache[$field][$value] = $this->create( $field, $value );
		}
		return $cache[$field][$value];
	}

	public function update( $obj, $info ) {
		foreach ( $info as $field => $value ) {
			if ( isset( $this->cache[$field][$value] ) ) {
				$obj->merge( $this->cache[$field][$value] );
			}
			$this->cache[$field][$value] = $obj;
		}
	}

	protected function create( $field, $value ) {
		$class = $this->getFactoryClass();
		$factories = $this->getFactoryFunctions();

		if ( !isset( $factories[$field] ) ) {
			throw new RuntimeException( 'Invalid factory field.' );
		}
		$function = $factories[$field];

		return call_user_func( array( $class, $function ), $this->deps, $value );
	}
}
