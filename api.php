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

error_reporting( E_ALL | E_STRICT );

define( 'WEBBASH', 1.0 );

if ( file_exists( 'vendor/autoload.php' ) ) {
	include 'vendor/autoload.php';
}

// Parse configuration and load database
$config = parse_ini_file( 'config.ini', true );
$config['webbash'] += array(
	'hostname' => 'localhost',
	'root' => __DIR__,
	'bcryptrounds' => 5,
	'historylimit' => 50,
);
if ( !isset( $config['webbash']['fileroot'] ) ) {
	$config['webbash']['fileroot'] = "{$config['webbash']['root']}/filesystem";
}

$db = new PDO(
	"{$config['db']['type']}:dbname={$config['db']['name']};host={$config['db']['host']}",
	$config['db']['user'],
	$config['db']['password']
);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

// Set up autoloader
require 'WebBash/Autoloader.php';
require 'WebBash/Util.php';
$autoloader = new WebBash\Autoloader( $config['webbash']['root'] );
spl_autoload_register( array( $autoloader, 'autoload' ) );

// Make a DI container and setup the router
$di = new WebBash\DI( $db, $config );
$router = new WebBash\Router( $di );
$router->register( '/', '\WebBash\Controllers\ServerController' );
$router->register( '/login', '\WebBash\Controllers\LoginController' );
$router->register( '/users/:name', '\WebBash\Controllers\UserController' );
$router->register( '/users/:name/history', '\WebBash\Controllers\CommandHistoryController' );
$router->register(
	'/files/:path+',
	'\WebBash\Controllers\FileController',
	array(),
	array(
		'FILE-OWNER' => 'owner',
		'FILE-GROUP' => 'group',
		'FILE-TYPE' => 'type',
		'FILE-PERMISSIONS' => 'perms',
		'SORT-BY' => 'sortby',
	)
);

// Run the request
$router->executeMain();
