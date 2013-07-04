<?php

/**
 * Copyright (C) 2013 Tyler Romeo, Krzysztof Jordan, Nicholas Bevaqua
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 */

namespace WebBash\ProcessCache;

use \WebBash\DI;

/**
 * Represents a process-local object cache that dynamically generates models
 * and other objects based on an identifier
 *
 * Each child class represents a cache for a specific object. All of the caching
 * logic is handled in this base class. Child classes override the two abstract
 * functions in this class.
 */
abstract class ProcessCache
{
	/**
	 * The actual object cache
	 * @var array
	 */
	protected $cache = array();

	/**
	 * Returns the fully qualified name of the class that generates the objects
	 *
	 * @return string Fully qualified class name
	 */
	abstract protected function getFactoryClass();

	/**
	 * Returns a mapping of identifier names to the name of the function that generates
	 * objects for that identifier in the factory class
	 *
	 * For example, if an object can be identified by id or by name, then this function
	 * might return:
	 *
	 * @code
	 * array(
	 *     'id' => 'newFromId',
	 *     'name' => 'newFromName'
	 * )
	 * @endcode
	 *
	 * @return array
	 */
	abstract protected function getFactoryFunctions();

	/**
	 * Construct the cache
	 *
	 * @param \WebBash\DI $deps Dependency injection container
	 */
	public function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	/**
	 * Get an object from the cache, or make one if it's not cached
	 *
	 * @param string $field Name of the identifier field
	 * @param string $value Value of the identifier field
	 *
	 * @return mixed& A reference to the object
	 */
	public function &get( $field, $value ) {
		if ( !isset( $this->cache[$field][$value] ) ) {
			$this->cache[$field][$value] = $this->create( $field, $value );
		}
		return $this->cache[$field][$value];
	}

	/**
	 * Update items in the object cache
	 *
	 * This function will be called internally by the objects whenever they
	 * load data. The purpose is that if there are two or more identifiers
	 * for an object, once one of them loads, that object will be the single
	 * cached object for all identifiers.
	 *
	 * @param mixed &$obj Current updated object
	 * @param array $info Mapping of identifier names to values
	 */
	public function update( &$obj, array $info ) {
		foreach ( $info as $field => $value ) {
			if ( isset( $this->cache[$field][$value] ) ) {
				$obj->merge( $this->cache[$field][$value] );
			}
			$this->cache[$field][$value] = &$obj;
		}
	}

	/**
	 * Makes a new object from the factory class and functions
	 *
	 * @param string $field Identifier field name
	 * @param string $value Identifier field value
	 *
	 * @return mixed The new object
	 */
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
