<?php

namespace WebBash\Models;

use \WebBash\DI;
use \WebBash\Util;

class FileInfo implements Model
{
	const ACTION_EXECUTE = 1;
	const ACTION_WRITE = 2;
	const ACTION_READ = 4;

	const SOURCE_OWNER = 6;
	const SOURCE_GROUP = 3;
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
	public $linkid = null;
	public $linkpath = null;
	public $filetype = null;

	private $exists = null;
	private $fp = null;
	private $children = null;

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

	public function __destruct() {
		if ( $this->fp ) {
			fclose( $this->fp );
		}
	}

	function load() {
		/** @TODO Load owner/group info simultaneously if request. */
		if ( $this->exists !== null ) {
			return;
		}

		if ( $this->id !== null ) {
			$this->exists = (bool)$this->loadFromId();
		} elseif ( $this->path !== null ) {
			$this->exists = (bool)$this->loadFromPath();
		} else {
			throw new \RuntimeException( 'Nothing to load from.' );
		}

		// If we failed to load, at least set some defaults
		if ( !$this->exists ) {
			$this->perms = $this->isDir() ? octdec( '0755' ) : octdec( '0644' );
		}

		$this->deps->fileCache->update( $this, array( 'id' => $this->id, 'path' => $this->path ) );
	}

	function save() {
		$this->load();

		if ( !$this->exists ) {
			$stmt = $this->deps->stmtCache->prepare(
				'INSERT INTO file SET parent = :parent, name = :name, size = :size, owner = :owner, ' .
				'grp = :group, perms = :perms, mtime = :mtime, ctime = :ctime, filetype = :filetype, ' .
				'linkpath = :linkpath, linkid = :linkid'
			);
		} else {
			$stmt = $this->deps->stmtCache->prepare(
				'UPDATE file SET parent = :parent, name = :name, size = :size, owner = :owner, ' .
				'grp = :group, perms = :perms, mtime = :mtime, ctime = :ctime, filetype = :filetype, ' .
				'linkpath = :linkpath, linkid = :linkid WHERE id = :id'
			);
			$stmt->bindParam( 'id', $this->id );
		}

		$stmt->bindValue( 'parent', $this->getParent()->getId() );
		$stmt->bindValue( 'name', $this->getFilename() );
		$stmt->bindParam( 'size', $this->size );
		$stmt->bindParam( 'owner', $this->owner );
		$stmt->bindParam( 'group', $this->grp );
		$stmt->bindParam( 'perms', $this->perms );
		$stmt->bindParam( 'mtime', $this->mtime );
		$stmt->bindParam( 'ctime', $this->ctime );
		$stmt->bindParam( 'linkpath', $this->linkpath );
		$stmt->bindParam( 'linkid', $this->linkid );
		$stmt->bindParam( 'filetype', $this->filetype );

		if ( $stmt->execute() ) {
			if ( !$this->exists() ) {
				$this->exists = true;
				$this->id = $this->deps->db->lastInsertId();
				$this->deps->fileCache->update(
					$this,
					array( 'id' => $this->id, 'path' => $this->path )
				);
			}
		} else {
			$this->exists = null;
			$this->load();
		}
	}

	function delete() {
		$this->load();

		$webRoot = $this->deps->config['webbash']['fileroot'];
		$finalPath = realpath( $webRoot . $this->path );

		if (
			strpos( $finalPath, $webRoot ) === 0 ||
			file_exists( $finalPath )
		) {
			if ( $this->isDir() ) {
				rmdir( $finalPath );
			} elseif ( $this->isFile() ) {
				unlink( $finalPath );
			}
		}

		$stmt = $this->deps->stmtCache->prepare( 'DELETE FROM file WHERE id = :id' );
		$stmt->bindParam( ':id', $this->id );
		if ( $stmt->execute() ) {
			$this->exists = false;
		} else {
			throw new RuntimeException( 'Could not delete file' );
		}
	}

	function merge( Model $other ) {
		if ( !$other instanceof self ) {
			throw new \RuntimeException( 'Invalid object passed.' );
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
		if ( $other->linkid !== null ) {
			$this->linkid = $other->linkid;
		}
		if ( $other->linkpath !== null ) {
			$this->linkpath = $other->linkpath;
		}
		if ( $other->filetype !== null ) {
			$this->filetype = $other->filetype;
		}
	}

	private function loadFromPath() {
		// Root always exists, but is not in the database
		if ( $this->path === '/' ) {
			$this->name = '';
			$this->filetype = 'd';
			$this->owner = $this->grp = 1;
			$this->perms = octdec( '0755' );
			return true;
		}

		$parts = explode( '/', substr( $this->path, 1 ) );

		$joinConds = array();
		$whereConds = array();
		foreach ( $parts as $key => $val ) {
			$curAlias = "file$key";
			$lastAlias = 'file' . ( $key - 1 );

			if ( $key > 0 ) {
				$joinConds[] = "INNER JOIN file AS {$curAlias} ON {$curAlias}.parent = {$lastAlias}.id";
				$whereConds[] = "{$curAlias}.name = :{$curAlias}";
			} else {
				$whereConds[] = "{$curAlias}.name = :{$curAlias} AND {$curAlias}.parent IS NULL";
			}
		}
		$joinConds = implode( ' ', $joinConds );
		$whereConds = implode( ' AND ', $whereConds );
		$finalAlias = "file" . ( count( $parts ) - 1 );
		$stmt = $this->deps->stmtCache->prepare( "SELECT $finalAlias.* FROM file AS file0 $joinConds WHERE $whereConds" );

		foreach ( $parts as $key => $name ) {
			$stmt->bindValue( ":file$key", $name );
		}

		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();
		return $stmt->fetch();
	}

	private function loadFromId() {
		$stmt = $this->deps->stmtCache->prepare( 'SELECT * FROM file WHERE id = :id' );
		$stmt->bindParam( ':id', $this->id );
		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();
		$exists = $stmt->fetch();

		if ( !$exists ) {
			return false;
		}

		$joinConds = array();
		$selectFields = array( 'file0.name AS file0name' );
		for ( $i = 0; $i < 10; $i++ ) {
			$curAlias = "file$i";
			$lastAlias = 'file' . ( $i - 1 );

			if ( $i > 0 ) {
				$joinConds[] = "LEFT JOIN file AS {$curAlias} ON {$curAlias}.id = {$lastAlias}.parent";
				$selectFields[] = "{$curAlias}.name AS {$curAlias}name";
			}
		}
		$selectFields = implode( ', ', $selectFields );
		$joinConds = implode( ' ', $joinConds );
		$finalAlias = "file9";

		$stmt = $this->deps->stmtCache->prepare( "SELECT $selectFields FROM file AS file0 $joinConds WHERE file0.id = :id" );
		$stmt->bindParam( ':id', $this->id );
		$stmt->execute();

		$this->path = '/' . implode( '/',
			array_filter( array_reverse( $stmt->fetch( \PDO::FETCH_NUM ) ) ) );
	}

	public function getPathname() {
		if ( $this->path === null ) {
			$this->load();
		}
		return $this->path;
	}

	public function getId() {
		if ( $this->id === null ) {
			$this->load();
		}
		return $this->id;
	}

	public function getParent() {
		if ( $this->parent ) {
			return $this->deps->fileCache->get( 'id', $this->parent );
		} elseif ( $this->path !== null ) {
			return $this->deps->fileCache->get( 'path', Util\dirname( $this->path ) );
		} else {
			$this->load();
			if ( $this->parent === null ) {
				return $this->deps->fileCache->get( 'path', '/' );
			} elseif ( $this->exists() ) {
				return $this->deps->fileCache->get( 'id', $this->parent );
			} else {
				return $this->deps->fileCache->get( 'path', Util\dirname( $this->path ) );
			}
		}
	}

	public function getFilename() {
		if ( $this->name !== null ) {
			// Do nothing
		} elseif ( $this->path !== null ) {
			$this->name = Util\basename( $this->path );
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
		return $this->deps->userCache->get( 'id', (int)$this->owner );
	}

	public function setOwner( User $user ) {
		$this->load();
		$this->owner = $user->getId();
	}

	public function getGroup() {
		$this->load();
		return $this->deps->groupCache->get( 'id', (int)$this->grp );
	}

	public function setGroup( Group $group ) {
		$this->load();
		$this->grp = $group->getId();
	}

	public function isAllowed( User $user, $action ) {
		$this->load();
		if ( $this->exists() ) {
			if ( $user->getId() === (int)$this->owner ) {
				return ( $this->perms >> self::SOURCE_OWNER ) & $action;
			} elseif ( $this->getGroup()->isMember( $user ) ) {
				return ( $this->perms >> self::SOURCE_GROUP ) & $action;
			} else {
				return ( $this->perms >> self::SOURCE_OTHER ) & $action;
			}
		} else {
			$parent = $this->getParent();
			if ( !$parent->exists() || $action === self::ACTION_READ || $action === self::ACTION_EXECUTE ) {
				return false;
			} elseif ( $user->getId() === $parent->owner ) {
				return ( $this->perms >> self::SOURCE_OWNER ) & $action;
			} elseif ( $parent->getGroup()->isMember( $user ) ) {
				return ( $this->perms >> self::SOURCE_GROUP ) & $action;
			} else {
				return ( $this->perms >> self::SOURCE_OTHER ) & $action;
			}
		}
	}

	public function setPermissions( $source, $action, $allowed ) {
		$this->load();
		if ( $allowed ) {
			$this->perms |= ( $action << $source );
		} else {
			$this->perms &= ~ ( $action << $source );
		}
	}

	public function getPermissions() {
		return $this->perms;
	}

	public function getATime() {
		$this->load();
		date_default_timezone_set( 'UTC' );
		return new \DateTime( $this->atime );
	}

	public function getMTime() {
		$this->load();
		date_default_timezone_set( 'UTC' );
		return new \DateTime( $this->mtime );
	}

	public function getCTime() {
		$this->load();
		date_default_timezone_set( 'UTC' );
		return new \DateTime( $this->ctime );
	}

	public function updateMTime() {
		$this->load();
		date_default_timezone_set( 'UTC' );
		$this->mtime = date_format( new \DateTime(), 'Y-m-d H:i:s' );
	}

	public function updateATime() {
		$this->load();
		date_default_timezone_set( 'UTC' );
		$this->atime = date_format( new \DateTime(), 'Y-m-d H:i:s' );
	}

	public function exists() {
		$this->load();
		return $this->exists;
	}

	public function getFiletype() {
		$this->load();
		return $this->filetype;
	}

	public function isDir() {
		$this->load();
		return $this->filetype === 'd';
	}

	public function isFile() {
		$this->load();
		return $this->filetype === 'f';
	}

	public function isLink() {
		$this->load();
		return $this->filetype === 'l';
	}

	public function getLinkTarget() {
		$this->load();
		return $this->deps->fileCache->get( 'id', $this->linkid );
	}

	public function getLinkPath() {
		$this->load();
		return $this->linkpath;
	}

	public function setFiletype( $type ) {
		$this->filetype = $type;
	}

	public function setLinkTarget( FileInfo $target ) {
		$this->linkpath = $target->getPathname();
		$this->linkid = $target->getId();
	}

	public function getChildren() {
		if ( $this->children !== null ) {
			return $this->children;
		}

		$this->load();
		$this->children = array();

		if ( $this->path !== '/' ) {
			$stmt = $this->deps->stmtCache->prepare(
				'SELECT * FROM file WHERE parent = :id'
			);
			$stmt->bindParam( ':id', $this->id );
		} else {
			$stmt = $this->deps->stmtCache->prepare(
				'SELECT * FROM file WHERE parent IS NULL'
			);
		}
		$stmt->execute();

		for ( $row = $stmt->fetch(); $row; $row = $stmt->fetch() ) {
			$this->children[] = $this->deps->fileCache->get( 'id', $row['id'] );
		}
		return $this->children;
	}

	public function getContents( $offset = 0, $length = -1 ) {
		$webRoot = $this->deps->config['webbash']['fileroot'];
		$finalPath = realpath( $webRoot . $this->path );

		if ( strpos( $finalPath, $webRoot ) !== 0 ) {
			$contents = null;
		} elseif ( !is_file( $finalPath ) || !is_readable( $finalPath ) ) {
			throw new RuntimeException( "Error while accessing contents of $finalPath" );
		} elseif ( $length === -1 ) {
			$contents = file_get_contents( $finalPath );
		} else {
			if ( $this->fp === null ) {
				$fp = fopen( $finalPath, 'rb' );
			}

			fseek( $this->fp, $offset );
			$contents = fread( $this->fp, $length );
			fclose( $fp );
		}

		return $contents;
	}

	public function setContents( $data = null ) {
		$webRoot = $this->deps->config['webbash']['fileroot'];
		$finalPath = realpath( $webRoot . $this->path );

		if ( strpos( $finalPath, $webRoot ) !== 0 ) {
			return false;
		} elseif ( file_exists( $finalPath ) && !is_writeable( $finalPath ) ) {
			throw new RuntimeException( "Error while overwriting contents of $finalPath" );
		} elseif ( $this->isDir() && !is_dir( $finalPath ) ) {
			unlink( $finalPath );
			return mkdir( $finalPath, $this->perms );
		} elseif ( $this->isFile() && !is_file( $finalPath ) ) {
			unlink( $finalPath );
			return file_put_contents( $finalPath, $data );
		} else {
			return file_put_contents( $finalPath, $data );
		}
	}
}
