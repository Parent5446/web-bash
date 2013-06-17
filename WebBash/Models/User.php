<?php

namespace WebBash\Models\User;

use WebBash\Util;

class User {
	public $id = null;
	public $name = null;
	private $email = null;
	private $email_confirmed = false;
	private $password = null;
	private $token = null;
	private $registration = null;

	public function __construct( StatementCache $stmtCache, GroupCache $groupCache ) {
		$this->stmtCache = $stmtCache;
		$this->groupCache = $groupCache;
	}

	public function load() {
		if ( $this->homedir !== null ) {
			return;
		}

		if ( $this->name === null ) {
			throw new RuntimeException( 'Cannot fetch groups for unknown user.' );
		}

		$stmt = $this->stmtCache->prepare(
			"SELECT * FROM user WHERE user.name = :name"
		);

		$stmt->bindParam( ':name', $this->name );
		$stmt->setFetchMode( PDO::FETCH_INFO, $this );
		$stmt->execute();
		$stmt->fetch();
	}				

	public function getGroups() {
		if ( $this->groups !== null ) {
			return $this->groups;
		}

		if ( $this->name === null ) {
			throw new RuntimeException( 'Cannot fetch groups for unknown user.' );
		}

		$stmt = $this->stmtCache->prepare(
			"SELECT grp.name FROM usergroupinfo WHERE user.name = :name"
		);

		$this->groups = array();
		$stmt->bindParam( ':name', $this->name );
		$stmt->execute();
		while ( $grp = $stmt->fetchColumn() ) {
			$this->groups[] = $grp;
			$this->groupCache->cache( $this->name, $grp );
		}

		return $this->groups;
	}
	
	public function getEmail() {
		$this->load();
		return $this->email;
	}

	public function isEmailConfirmed() {
		$this->load();
		return (bool)$this->email_confirmed;
	}

	public function getToken( $salt = 'default' ) {
		$this->load();
		return hash_hmac( 'sha512', $this->token, implode( '|', (array)$salt ) );
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

	public function getRegistration() [
		$this->load();
		return new DateTime( $this->registration );
	}
}
