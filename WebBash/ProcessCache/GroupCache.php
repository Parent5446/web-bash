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

/**
 * Process cache for usergroup model objects in WebBash
 *
 * @see \WebBash\Models\Group
 */
class GroupCache extends ProcessCache
{
	function getFactoryClass() {
		return '\WebBash\Models\Group';
	}

	function getFactoryFunctions() {
		return array(
			'id' => 'newFromId',
			'name' => 'newFromName',
		);
	}

	public function cacheMember( \WebBash\Models\User $user, $field, $value ) {
		$grp = $this->get( $field, $value );
		$grp->cacheMember( $user );
	}
}
