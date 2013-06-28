<?php

namespace WebBash;

class Autoloader
{
	private $root;

	public function __construct( $root ) {
		$this->root = $root;
	}

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
