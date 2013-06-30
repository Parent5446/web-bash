<?php

namespace WebBash\Models;

use \WebBash\Util;
use \WebBash\DI;

class User implements Model
{
	public $id = null;
	public $name = null;
	public $homedir = null;
	public $email = null;
	public $email_confirmed = null;
	public $password = '$2y$12$MTIzNDU2Nzg5MGFiY2RlZeZZskHZ2KTCr4MHqdn0WMEb4Iag4YEhq';
	public $token = null;
	public $exists = null;
	private $groups = null;
	private $history = null;

	public static function newFromName( DI $deps, $name ) {
		$obj = new self( $deps );
		$obj->name = $name;
		return $obj;
	}

	public static function newFromId( DI $deps, $id ) {
		$obj = new self( $deps );
		$obj->id = $id;
		return $obj;
	}

	private function __construct( DI $deps ) {
		$this->deps = $deps;
	}

	function load() {
		if ( $this->exists !== null ) {
			return;
		}

		if ( $this->name !== null ) {
			$this->exists = $this->loadFromField( 'name' );
		} elseif ( $this->id !== null ) {
			$this->exists = $this->loadFromField( 'id' );
		} else {
			throw new \RuntimeException( 'Cannot fetch info for unknown user.' );
		}

		$this->deps->userCache->update( $this, array( 'id' => $this->id, 'name' => $this->name ) );
	}

	function save() {
		$this->load();

		if ( !$this->exists ) {
			/** @TODO Add a ON DUPLICATE KEY UPDATE clause here. */ 
			$stmt = $this->deps->stmtCache->prepare(
				'INSERT into user (name, email, email_confirmed, password, token, homedir) ' .
				'VALUES (:name, :email, :email_confirmed, :password, :token, :homedir)'
			);
			$stmt->bindParam( ':name', $this->name );
		} else {
			$stmt = $this->deps->stmtCache->prepare(
				'UPDATE user SET email = :email, email_confirmed = :email_confirmed, ' .
				' password = :password, token = :token, homedir = :homedir WHERE id = :id'
			);
			$stmt->bindParam( ':id', $this->id );
		}

		$stmt->bindParam( ':homedir', $this->homedir );
		$stmt->bindParam( ':email', $this->email );
		$stmt->bindValue( ':email_confirmed', (bool)$this->email_confirmed );
		$stmt->bindParam( ':password', $this->password );
		$stmt->bindParam( ':token', $this->token );

		if ( $stmt->execute() ) {
			if ( !$this->exists() ) {
				$this->exists = true;
				$this->id = $this->deps->db->lastInsertId();
				$this->deps->userCache->update(
					$this,
					array( 'id' => $this->id, 'name' => $this->name )
				);
			}
		} else {
			$this->exists = null;
			$this->load();
		}
	}

	function merge( Model $other ) {
		if ( !$other instanceof self ) {
			throw new \RuntimeException( 'Invalid object passed.' );
		}

		if ( $other->id !== null ) {
			$this->id = $other->id;
		}
		if ( $other->name !== null ) {
			$this->name = $other->name;
		}
		if ( $other->homedir !== null ) {
			$this->homedir = $other->homedir;
		}
		if ( $other->email !== null ) {
			$this->email = $other->name;
		}
		if ( $other->email_confirmed !== null ) {
			$this->email_confirmed = $other->email_confirmed;
		}
		if ( $other->password !== null ) {
			$this->password = $other->password;
		}
		if ( $other->token !== null ) {
			$this->token = $other->token;
		}
	}

	private function loadFromField( $field ) {
		$stmt = $this->deps->stmtCache->prepare(
			"SELECT * FROM user WHERE $field = :$field"
		);

		$stmt->bindParam( ":$field", $this->$field );
		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();

		return (bool)$stmt->fetch();
	}

	public function getName() {
		if ( $this->name === null ) {
			$this->load();
		}
		return $this->name;
	}

	public function getId() {
		if ( $this->id === null ) {
			$this->load();
		}
		return (int)$this->id;
	}

	public function getEmail() {
		$this->load();
		return $this->email;
	}

	public function setEmail( $email ) {
		$this->email = $email;
	}

	public function isEmailConfirmed() {
		$this->load();
		return (bool)$this->email_confirmed;
	}

	public function setEmailConfirmed( $val ) {
		$this->email_confirmed = (bool)$val;
	}

	public function getToken( $salt = 'default' ) {
		$this->load();
		return hash_hmac( 'sha512', $this->token, implode( '|', (array)$salt ) );
	}

	public function setToken() {
		$this->token = Util\urandom( 64 );
	}

	public function matchToken( $token, $salt = 'default' ) {
		return Util\secureCompare( $token, $this->getToken( $salt ) );
	}

	public function checkPassword( $plaintext ) {
		$this->load();

		return Util\secureCompare(
			$this->password,
			Util\bcrypt( $plaintext, $this->password )
		);
	}

	public function setPassword( $plaintext ) {
		$this->password = Util\bcrypt(
			$plaintext,
			false,
			$this->deps->config['webbash']['bcryptrounds']
		);
	}

	public function getHomeDirectory() {
		$this->load();
		return $this->deps->fileCache->get( 'id', (int)$this->homedir );
	}

	public function setHomeDirectory( FileInfo $file ) {
		$this->load();
		$this->homedir = $file->exists() ? $file->getId() : null;
	}

	public function getGroups() {
		if ( $this->groups !== null ) {
			return $this->groups;
		}

		$this->load();
		if ( $this->id === null ) {
			throw new \RuntimeException( 'Cannot fetch groups for unknown user.' );
		}

		$stmt = $this->deps->stmtCache->prepare(
			"SELECT grp.name FROM usergroup " .
			"INNER JOIN grp ON grp.id = usergroup.grp " .
			"WHERE usergroup.user = :id"
		);

		$this->groups = array();
		$stmt->bindParam( ':id', $this->id );
		$stmt->execute();
		while ( $grp = $stmt->fetchColumn() ) {
			$this->groups[] = $grp;
			$this->deps->groupCache->cacheMember( $this, 'name', $grp );
		}

		return $this->groups;
	}

	public function getHistory() {
		if ( $this->history !== null ) {
			return $this->history;
		}

		$this->load();
		if ( !$this->exists ) {
			throw new \RuntimeException( 'Cannot fetch history for unknown user.' );
		}

		$this->history = array();
		$historyLimit = $this->deps->config['webbash']['historylimit'];
		$stmt = $this->deps->stmtCache->prepare(
			"SELECT command FROM history WHERE user = :id ORDER BY id DESC LIMIT $historyLimit"
		);
		$stmt->bindParam( ':id', $this->id );
		$stmt->execute();

		while ( $cmd = $stmt->fetchColumn() ) {
			$this->history[] = $cmd;
		}

		$this->history = array_reverse( $this->history );

		return $this->history;
	}
	
	public function addHistory( array $cmds ) {
		if ( !$cmds ) {
			return true;
		}

		if ( $this->history !== null ) {
			$this->history = array_merge( $this->history, $cmds );
		}

		$rowIds = array();
		foreach ( $cmds as $key => $cmd ) {
			$rowIds[] = "(:user, :command$key)";
		}

		$stmt = $this->deps->stmtCache->prepare(
			'INSERT INTO history (user, command) VALUES ' . implode( ', ', $rowIds )
		);

		$stmt->bindParam( ':user', $this->id );
		foreach ( $cmds as $key => &$cmd ) {
			$stmt->bindParam( ":command$key", $cmd );
		}

		$stmt->execute();
	}

	public function clearHistory() {
		$stmt = $this->deps->stmtCache->prepare(
			'DELETE FROM history WHERE user = :user'
		);
		$stmt->bindParam( ':user', $this->id );
		$stmt->execute();

		$this->history = array();
	}

	public function exists() {
		$this->load();
		return $this->exists;
	}
}
