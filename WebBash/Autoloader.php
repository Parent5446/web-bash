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

namespace WebBash;

/**
 * PSR-0 compliant autoloader
 */
class Autoloader
{
	/**
	 * The root directory for namespace searching
	 * @private string
	 */
	private $root;

	/**
	 * Construct the autoloader
	 *
	 * @param string $root Directory root for namespace searching
	 */
	public function __construct( $root ) {
		$this->root = $root;
	}

	/**
	 * Autoload a class based on its fully qualified name
	 *
	 * @param string $class Fully qualified name of the class
	 */
	public function autoload( $class ) {
		$class = ltrim( $class, '\\' );
		$filename = '';
		$namespace = $this->root . DIRECTORY_SEPARATOR;

		$pos = strrpos( $class, '\\' );
		if ( $pos > 0 ) {
			$namespace = substr( $class, 0, $pos );
			$class = substr( $class, $pos + 1 );
			$filename .= str_replace( '\\', DIRECTORY_SEPARATOR, $namespace ) .
				DIRECTORY_SEPARATOR;
		}

		$filename .= str_replace( '_', DIRECTORY_SEPARATOR, $class ) . '.php';

		include $filename;
	}
}
