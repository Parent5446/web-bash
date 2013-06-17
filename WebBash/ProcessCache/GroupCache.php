<?php

class GroupCache extends ProcessCache
{
	function getFactoryClass() {
		return 'WebBash\Models\Group';
	}

	function getFactoryFunctions() {
		return array(
			'id' => 'newFromId',
			'name' => 'newFromName',
		);
	}
}