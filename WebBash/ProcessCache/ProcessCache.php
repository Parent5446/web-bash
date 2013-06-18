<?php

namespace WebBash\ProcessCache;

abstract class ProcessCache
{
	protected $cache = array();

	abstract protected function getFactoryClass();

	abstract protected function getFactoryFunctions();
	
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

		assert( "is_subclass_of( '$class', 'WebBash\Models\Model' )", 'Factory class must be a model.' );
		if ( !isset( $factories[$field] ) ) {
			throw new RuntimeException( 'Invalid factory field.' );
		}

		return $class::{$factories[$field]}( $value );
	}
}