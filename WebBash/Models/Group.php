<?php

namespace WebBash\Models;

use \WebBash\Util;
use \WebBash\DI;
use \WebBash\Models\User;

class Group implements Model
{
	private $id = null;
	private $name = null;
	private $members = array();

	private $membersToAdd = array();
	private $membersToRemove = array();
	private $fullyLoaded = false;
	
	public function newFromId( DI $deps, $id ) {
		$obj = new self( $deps );
		$obj->id = $id;
		return $obj;
	}
	
	public function newFromName( DI $deps, $name ) {
		$obj = new self( $deps );
		$obj->name = $name;
		return $obj;
	}

	private function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	function load() {
		if ( $this->fullyLoaded ) {
			return;
		}

		$this->fullyLoaded = true;
		if ( $this->id !== null ) {
			$this->loadFromField( 'id' );
		} elseif ( $this->name !== null ) {
			$this->loadFromField( 'name' );
		} else {
			throw new RuntimeException( 'Cannot fetch info for unknown group.' );
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
			"SELECT grp.id, grp.name, user.name FROM usergroupinfo WHERE grp.$field = :$field"
		);

		$stmt->bindParam( ":$field", $this->$field );
		$stmt->execute();

		$row = $stmt->fetch();
		$first = true;
		while ( $row = $stmt->fetch() ) {
			if ( $first ) {
				$this->id = $row['grp.id'];
				$this->name = $row['grp.name'];
				$first = false;
			}
			$this->members[] = $row['user.name'];
		}
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
}
