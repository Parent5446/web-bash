<?php

namespace WebBash\ProcessCache;

use \WebBash\DI;

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

	public function prepare( $sql ) {
		return $this->get( 'sql', $sql );
	}

	public static function doPrepare( DI $deps, $sql ) {
		return $deps->db->prepare( $sql );
	}
}
