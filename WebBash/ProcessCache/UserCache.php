<?php

class UserCache extends ProcessCache
{
	function getFactoryClass() {
		return 'WebBash\Models\User';
	}

	function getFactoryFunctions() {
		return array(
			'id' => 'newFromId',
			'name' => 'newFromName',
		);
	}
}