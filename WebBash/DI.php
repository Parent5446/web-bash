<?php

/**
 * Copyright (C) 2013 Tyler Romeo, Krzysztof Jordan, Nicholas Bevaqua
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 */

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
