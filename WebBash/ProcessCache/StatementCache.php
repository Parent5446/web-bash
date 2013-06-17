<?php

class StatementCache extends ProcessCache
{
	function getFactoryClass() {
		return 'PDO';
	}

	function getFactoryFunctions() {
		return array(
			'sql' => 'prepare',
		);
	}

	public function prepare( $sql ) {
		return $this->get( 'sql', $sql );
	}
}