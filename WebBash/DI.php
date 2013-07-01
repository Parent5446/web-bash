<?php

namespace WebBash;

/**
 * Dependency injection container for the application
 */
class DI
{
	/**
	 * Construct the container
	 *
	 * @param \PDO $db Database object
	 * @param array $config WebBash configuration options
	 */
	public function __construct( \PDO $db, array $config ) {
		$this->config = $config;
		$this->db = $db;
		$this->stmtCache = new ProcessCache\StatementCache( $this );
		$this->userCache = new ProcessCache\UserCache( $this );
		$this->groupCache = new ProcessCache\GroupCache( $this );
		$this->fileCache = new ProcessCache\FileInfoCache( $this );
		$this->currentUser = $this->userCache->get( 'id', 0 );
	}

	/**
	 * WebBash configuration options
	 * @var array
	 */
	public $config;

	/**
	 * Database object
	 * @var \PDO
	 */
	public $db;

	/**
	 * Cache for prepared DB statements
	 * @var \WebBash\ProcessCache\StatementCache
	 */
	public $stmtCache;
	
	/**
	 * Cache for user objects
	 * @var \WebBash\ProcessCache\UserCache
	 */
	public $userCache;
	
	/**
	 * Cache for group objects
	 * @var \WebBash\ProcessCache\GroupCache
	 */
	public $groupCache;
	
	/**
	 * Cache for file objects
	 * @var \WebBash\ProcessCache\FileInfoCache
	 */
	public $fileCache;
	
	/**
	 * The current logged in user
	 * @var \WebBash\Models\User
	 */
	public $currentUser;
}
