<?php

class FileInfoCache extends ProcessCache
{
	function getFactoryClass() {
		return 'WebBash\Models\FileInfo';
	}

	function getFactoryFunctions() {
		return array(
			'id' => 'newFromId',
			'path' => 'newFromPath',
		);
	}
}