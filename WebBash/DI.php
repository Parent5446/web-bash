<?php

class DI
{
	public function __construct( PDO $db ) {
		$this->db = $db;
		$this->deps->stmtCache = new ProcessCache\StatementCache( $this );
		$this->deps->userCache = new ProcessCache\UserCache( $this );
		$this->deps->groupCache = new ProcessCache\GroupCache( $this );
		$this->deps->fileCache = new ProcessCache\FileInfoCache( $this );
	}

	public $db;
	public $stmtCache;
	public $userCache;
	public $groupCache;
	public $fileCache;
}