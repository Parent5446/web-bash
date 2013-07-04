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

namespace WebBash\Models;

use \WebBash\Util;
use \WebBash\DI;

class Group implements Model
{
	private $id = null;
	private $name = null;
	private $members = array();

	private $exists = null;
	private $membersToAdd = array();
	private $membersToRemove = array();
	private $fullyLoaded = false;

	public static function newFromId( DI $deps, $id ) {
		$obj = new self( $deps );
		$obj->id = $id;
		return $obj;
	}

	public static function newFromName( DI $deps, $name ) {
		$obj = new self( $deps );
		$obj->name = $name;
		return $obj;
	}

	private function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	function load() {
		if ( $this->fullyLoaded || $this->exists !== null ) {
			return;
		}

		$this->fullyLoaded = true;
		if ( $this->id !== null ) {
			$this->exists = $this->loadFromField( 'id' );
		} elseif ( $this->name !== null ) {
			$this->exists = $this->loadFromField( 'name' );
		} else {
			throw new \RuntimeException( 'Cannot fetch info for unknown group.' );
		}

		$this->deps->groupCache->update( $this, array( 'id' => $this->id, 'name' => $this->name ) );
	}

	function save() {
		$this->load();

		$stmt = $this->deps->stmtCache->prepare(
			'INSERT INTO usergroup (user, grp) VALUES (:user, :grp)'
		);
		$stmt->bindValue( $this->id );

		foreach ( $this->membersToAdd as $name ) {
			$user = $this->deps->userCache->get( 'name', $name );
			$stmt->bindValue( $user->getId() );
			$stmt->execute();
		}

		$stmt = $this->deps->stmtCache->prepare(
			'DELETE FROM usergroup WHERE user = :user AND grp = :grp'
		);
		$stmt->bindValue( $this->id );

		foreach ( $this->membersToRemove as $name ) {
			$user = $this->deps->userCache->get( 'name', $name );
			$stmt->bindValue( $user->getId() );
			$stmt->execute();
		}
	}

	function merge( Model $other ) {
		if ( !$other instanceof self ) {
			throw new RuntimeException( 'Invalid object passed.' );
		}

		if ( $other->id !== null ) {
			$this->id = $other->id;
		}
		if ( $other->name !== null ) {
			$this->name = $other->name;
		}

		$this->members += $other->members;
		$this->fullyLoaded |= $other->fullyLoaded;
	}

	private function loadFromField( $field ) {
		$stmt = $this->deps->stmtCache->prepare(
			'SELECT grp.id AS grpid, grp.name AS grpname, user.name AS username FROM usergroup ' .
			'INNER JOIN user ON user.id = usergroup.user ' .
			'INNER JOIN grp ON grp.id = usergroup.grp ' .
			"WHERE grp.$field = :$field"
		);

		$stmt->setFetchMode( \PDO::FETCH_ASSOC );
		$stmt->bindParam( ":$field", $this->$field );
		$exists = $stmt->execute();

		for ( $row = $stmt->fetch(), $first = true; $row; $row = $stmt->fetch() ) {
			if ( $first ) {
				$this->id = $row['grpid'];
				$this->name = $row['grpname'];
				$first = false;
			}
			$this->members[] = $row['username'];
		}

		return $exists;
	}

	public function getId() {
		if ( $this->id === null ) {
			$this->load();
		}
		return $this->id;
	}

	public function getName() {
		if ( $this->name === null ) {
			$this->load();
		}
		return $this->name;
	}

	public function isMember( User $user ) {
		if ( in_array( $user->getName(), $this->members ) ) {
			return true;
		} else {
			$this->load();
			return in_array( $user->getName(), $this->members );
		}
	}

	public function cacheMember( User $user ) {
		if ( $this->fullyLoaded ) {
			return;
		}
		$this->members[] = $user->getName();
	}

	public function getMembers() {
		$objs = array();
		foreach ( $this->members as $member ) {
			$objs[] = $this->userCache->get( 'name', $member );
		}
		return $objs;
	}

	public function addMember( User $user ) {
		$name = $user->getName();
		if ( !in_array( $name, $this->members ) ) {
			$this->members[] = $name;
		}
		$this->membersToAdd[] = $name;
	}

	public function removeMember( User $user ) {
		$index = array_search( $user->getName(), $this->members );
		if ( $index !== false ) {
			unset( $this->members[$index] );
			$this->membersToRemove[] = $user->getName();
		}
	}

	public function exists() {
		$this->load();
		return $this->exists;
	}
}
