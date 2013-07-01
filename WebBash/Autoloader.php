<?php

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

		require $filename;
	}
}
