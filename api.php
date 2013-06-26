<?php

error_reporting( E_ALL | E_STRICT );

require "WebBash/DI.php";
require "WebBash/Util.php";
require "WebBash/Router.php";
require "WebBash/HttpException.php";

require "WebBash/Models/Model.php";
require "WebBash/Models/User.php";
require "WebBash/Models/Group.php";
require "WebBash/Models/FileInfo.php";
require "WebBash/Controllers/UserController.php";
require "WebBash/Controllers/LoginController.php";

require "WebBash/ProcessCache/ProcessCache.php";
require "WebBash/ProcessCache/StatementCache.php";
require "WebBash/ProcessCache/UserCache.php";
require "WebBash/ProcessCache/GroupCache.php";
require "WebBash/ProcessCache/FileInfoCache.php";

$db = new PDO( 'mysql:dbname=webbash;host=127.0.0.1', 'root', 'vagrant' );
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
$di = new WebBash\DI( $db );

$router = new WebBash\Router( $di );
$router->register( '/users/:name', '\WebBash\Controllers\UserController' );
$router->register( '/login', '\WebBash\Controllers\LoginController' );
$router->executeMain();
