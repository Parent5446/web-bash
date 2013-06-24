<?php

namespace WebBash\Models;

use WebBash\DI;

class FileInfo implements Model
{
	const ACTION_EXECUTE = 1;
	const ACTION_WRITE = 2;
	const ACTION_READ = 4;

	const SOURCE_OWNER = 8;
	const SOURCE_GROUP = 4;
	const SOURCE_OTHER = 0;

	public $id = null;
	public $path = null;
	public $parent = null;
	public $name = null;
	public $size = null;
	public $owner = null;
	public $grp = null;
	public $perms = null;
	public $atime = null;
	public $mtime = null;
	public $ctime = null;

	public static function newFromId( DI $deps, $id ) {
		$obj = new self( $deps );
		$obj->id = $id;
		return $obj;
	}

	public static function newFromPath( DI $deps, $path ) {
		$obj = new self( $deps );
		$obj->path = $path;
		return $obj;
	}

	private function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	function load() {
		/** @TODO Load owner/group info simultaneously if request. */
		if ( $this->size !== null ) {
			return;
		}

		$this->size = false;
		if ( $this->id !== null ) {
			$this->loadFromId();
		} elseif ( $this->path !== null ) {
			$this->loadFromPath();
		} else {
			throw new RuntimeException( 'Nothing to load from.' );
		}

		$this->deps->fileCache->update( $this, array( 'id' => $this->id, 'path' => $this->path ) );
	}

	function save() {
		$this->load();

		$stmt = $this->deps->stmtCache->prepare(
			'UPDATE file SET parent = :parent, name = :name, size = :size, owner = :owner, ' .
			'grp = :group, perms = :perms, mtime = :mtime, ctime = :ctime WHERE id = :id'
		);

		$stmt->bindParam( 'parent', $this->parent );
		$stmt->bindParam( 'name', $this->name );
		$stmt->bindParam( 'size', $this->size );
		$stmt->bindParam( 'owner', $this->owner );
		$stmt->bindParam( 'group', $this->group );
		$stmt->bindParam( 'perms', $this->perms );
		$stmt->bindParam( 'mtime', $this->mtime );
		$stmt->bindParam( 'ctime', $this->ctime );
		$stmt->bindParam( 'id', $this->id );
		$stmt->execute();
	}

	function merge( Model $other ) {
		if ( !$other instanceof self ) {
			throw new RuntimeException( 'Invalid object passed.' );
		}

		if ( $other->id !== null ) {
			$this->id = $other->id;
		}
		if ( $other->path !== null ) {
			$this->path = $other->path;
		}
		if ( $other->name !== null ) {
			$this->name = $other->name;
		}
		if ( $other->parent !== null ) {
			$this->parent = $other->parent;
		}
		if ( $other->size !== null ) {
			$this->size = $other->size;
		}
		if ( $other->owner !== null ) {
			$this->owner = $other->owner;
		}
		if ( $other->group !== null ) {
			$this->group = $other->group;
		}
		if ( $other->perms !== null ) {
			$this->perms = $other->perms;
		}
		if ( $other->mtime !== null ) {
			$this->mtime = $other->mtime;
		}
		if ( $other->ctime !== null ) {
			$this->ctime = $other->ctime;
		}
		if ( $other->atime !== null ) {
			$this->atime = $other->atime;
		}
	}

	private function loadFromPath() {
		$parts = explode( '/', $this->path );

		$joinConds = array();
		$whereConds = array();
		for ( $key = 1; $key < count( $parts ); $key++ ) {
			$curAlias = "file$key";
			$lastAlias = 'file' . ( $key - 1 );
			$joinConds[] = "INNER JOIN file AS {$curAlias} ON {$curAlias}.parent = {$lastAlias}.id";
			$whereConds[] = "{$curAlias}.name = :{$curAlias}";
		}
		$joinConds = implode( ' ', $joinConds );
		$whereConds = implode( ' AND ', $whereConds );
		$finalAlias = "file" . count( $parts );

		$stmt = $this->deps->stmtCache->prepare( "SELECT $finalAlias.* FROM file AS file0 $joinConds $whereConds" );

		foreach ( $parts as $key => $name ) {
			$stmt->bindValue( ":file$key", $name );
		}

		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();
		$stmt->fetch();
	}

	private function loadFromId() {
		$stmt = $this->deps->stmtCache->prepare( 'SELECT * FROM file WHERE id = :id' );
		$stmt->bindParam( ':id', $this->id );
		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();
		$stmt->fetch();
	}

	public function getPathname() {
		if ( $this->path === null ) {
			$this->load();
		}
		return $this->path;
	}

	public function getParent() {
		if ( $this->parent !== null ) {
			return $this->deps->fileCache->get( 'id', $this->parent );
		} elseif ( $this->path !== null ) {
			return $this->deps->fileCache->get( 'id', dirname( $this->path ) );
		} else {
			$this->load();
			return $this->deps->fileCache->get( 'id', $this->parent );
		}
	}

	public function getFilename() {
		if ( $this->name !== null ) {
			// Do nothing
		} elseif ( $this->path !== null ) {
			$this->name = basename( $this->path );
		} else {
			$this->load();
		}

		return $this->name;
	}

	public function getSize() {
		$this->load();
		return (int)$this->size;
	}

	public function getOwner() {
		$this->load();
		return $this->deps->userCache->get( 'id', $this->owner );
	}

	public function setOwner( WebBash\Models\User $user ) {
		$this->load();
		$this->owner = $user->getId();
	}

	public function getGroup() {
		$this->load();
		return $this->deps->groupCache->get( 'id', $this->group );
	}

	public function setGroup( WebBash\Models\Group $group ) {
		$this->load();
		$this->group = $group->getId();
	}

	public function isAllowed( WebBash\Models\User $user, $action ) {
		$this->load();
		if ( $user->getId() === $this->owner ) {
			return ( $this->perms >> self::SOURCE_OWNER ) & $action;
		} elseif ( $this->getGroup()->isMember( $user ) ) {
			return ( $this->perms >> self::SOURCE_GROUP ) & $action;
		} else {
			return ( $this->params >> self::SOURCE_OTHER ) & $action;
		}
	}

	public function setPermissions( $source, $action, $allowed ) {
		$this->load();
		if ( $this->allowed ) {
			$this->perms |= ( $action << $source );
		} else {
			$this->perms &= ~ ( $action << $source );
		}
	}

	public function getATime() {
		$this->load();
		return new DateTime( $this->atime );
	}

	public function getMTime() {
		$this->load();
		return new DateTime( $this->mtime );
	}

	public function getCTime() {
		$this->load();
		return new DateTime( $this->ctime );
	}
}
