<?php

error_reporting( E_ALL | E_STRICT );

define( 'WEBBASH', 1.0 );

// Parse configuration and load database
$config = parse_ini_file( 'config.ini', true );
$config['webbash'] += array(
	'hostname' => 'localhost',
	'root' => __DIR__,
	'bcryptrounds' => 5,
	'historylimit' => 50,
);

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
	)
);

// Run the request
$router->executeMain();
