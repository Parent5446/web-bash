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
 * Process cache for PDO prepared statements
 *
 * @see \PDOStatement
 */
class StatementCache extends ProcessCache
{
	function getFactoryClass() {
		return $this;
	}

	function getFactoryFunctions() {
		return array(
			'sql' => 'doPrepare',
		);
	}

	/**
	 * Shortcut function to prepare a SQL statement
	 *
	 * @param string $sql SQL query to prepare
	 * @return \PDOStatement Prepared statement
	 */
	public function prepare( $sql ) {
		return $this->get( 'sql', $sql );
	}

	/**
	 * Creates the actual prepared statement from the DB
	 *
	 * @param \WebBash\DI $deps Dependency injection container
	 * @param string $sql SQL text to prepare
	 *
	 * @return \PDOStatement Prepared statement
	 */
	public static function doPrepare( DI $deps, $sql ) {
		return $deps->db->prepare( $sql );
	}
}
