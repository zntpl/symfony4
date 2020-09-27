<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

use Illuminate\Container\Container;
use ZnCore\Base\Libs\DotEnv\DotEnv;
use ZnLib\Rest\Symfony4\Helpers\RestApiControllerHelper;
use Symfony\Component\Routing\RouteCollection;

require_once __DIR__ . '/../src/Bootstrap/autoload.php';
DotEnv::init(__DIR__ . '/..');

$container = Container::getInstance();
$routeCollection = new RouteCollection;

require_once __DIR__ . '/../../../../vendor/zncrypt/tunnel/src/Symfony/config/bootstrap.php';

$response = RestApiControllerHelper::run($routeCollection, $container);
$response->send();
