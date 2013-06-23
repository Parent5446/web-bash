<?php

namespace WebBash\Models;

use \WebBash\Util;
use \WebBash\DI;

class User implements Model
{
	private $id = null;
	private $name = null;
	private $homedir = null;
	private $email = null;
	private $email_confirmed = null;
	private $password = null;
	private $token = null;

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
		if ( $this->homedir !== null ) {
			return;
		}
		
		$this->homedir = false;
		if ( $this->name !== null ) {
			$this->loadFromField( 'name' );
		} elseif ( $this->id !== null ) {
			$this->loadFromField( 'id' );
		} else {
			throw new RuntimeException( 'Cannot fetch info for unknown user.' );
		}

		$this->deps->userCache->update( $this, array( 'id' => $this->id, 'name' => $this->name ) );
	}

	function save() {
		$this->load();

		$stmt = $this->deps->stmtCache->prepare(
			'UPDATE user SET email = :email, email_confirmed = :email_confirmed, ' . 
			' password = :password, token = :token, homedir = :homedir WHERE id = :id'
		);

		$stmt->bindParam( ':homedir', $this->homedir );
		$stmt->bindParam( ':email', $this->email );
		$stmt->bindParam( ':email_confirmed', $this->email_confirmed );
		$stmt->bindParam( ':password', $this->password );
		$stmt->bindParam( ':token', $this->token );
		$stmt->bindParam( ':id', $this->id );
		$stmt->execute();
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
		if ( $other->homedir !== null ) {
			$this->homedir = $other->homedir;
		}
		if ( $other->email !== null ) {
			$this->email = $other->name;
		}
		if ( $other->email_confirmed !== null ) {
			$this->email_confirmed = false;
		}
		if ( $other->password !== null ) {
			$this->password = null;
		}
		if ( $other->token !== null ) {
			$this->token = null;
		}
	}

	private function loadFromField( $field ) {
		$stmt = $this->deps->stmtCache->prepare(
			"SELECT * FROM user WHERE user.$field = :$field"
		);

		$stmt->bindParam( ":$field", $this->$field );
		$stmt->setFetchMode( \PDO::FETCH_INTO, $this );
		$stmt->execute();
		$stmt->fetch();
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
		return $this->id;
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
		return Util\secureCompare(
			$this->password,
			Util\bcrypt( $plaintext, $this->password )
		);
	}

	public function setPassword( $plaintext ) {
		$this->password = Util\bcrypt( $plaintext );
	}

	public function getHomeDirectory() {
		$this->load();
		return $this->deps->fileCache->get( 'id', $this->homedir );
	}

	public function setHomeDirectory( FileInfo $file ) {
		$this->load();
		$this->homedir = $file->getId();
	}

	public function getGroups() {
		if ( $this->groups !== null ) {
			return $this->groups;
		}

		if ( $this->name === null ) {
			throw new RuntimeException( 'Cannot fetch groups for unknown user.' );
		}

		$stmt = $this->deps->stmtCache->prepare(
			"SELECT grp.name FROM usergroupinfo WHERE user.name = :name"
		);

		$this->groups = array();
		$stmt->bindParam( ':name', $this->name );
		$stmt->execute();
		while ( $grp = $stmt->fetchColumn() ) {
			$this->groups[] = $grp;
			$this->deps->groupCache->cacheMember( $this, $grp );
		}

		return $this->groups;
	}
}
