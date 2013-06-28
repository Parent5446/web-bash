<?php

namespace WebBash;

class DI
{
	public function __construct( \PDO $db, array $config ) {
		$this->config = $config;
		$this->db = $db;
		$this->stmtCache = new ProcessCache\StatementCache( $this );
		$this->userCache = new ProcessCache\UserCache( $this );
		$this->groupCache = new ProcessCache\GroupCache( $this );
		$this->fileCache = new ProcessCache\FileInfoCache( $this );
		$this->currentUser = $this->userCache->get( 'id', 0 );
	}

	public $config;
	public $db;
	public $stmtCache;
	public $userCache;
	public $groupCache;
	public $fileCache;
	public $currentUser;
}
