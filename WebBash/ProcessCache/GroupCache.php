<?php

namespace WebBash\ProcessCache;

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

	public function cacheMember( WebBash\Models\User $user, $field, $value ) {
		$grp = $this->get( $field, $value );
		$grp->cacheMember( $user );
	}
}