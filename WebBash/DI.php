<?php

namespace WebBash;

class DI
{
	public function __construct( \PDO $db ) {
		$this->db = $db;
		$this->stmtCache = new ProcessCache\StatementCache( $this );
		$this->userCache = new ProcessCache\UserCache( $this );
		$this->groupCache = new ProcessCache\GroupCache( $this );
		$this->fileCache = new ProcessCache\FileInfoCache( $this );
	}

	public $db;
	public $stmtCache;
	public $userCache;
	public $groupCache;
	public $fileCache;
}
