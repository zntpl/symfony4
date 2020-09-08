<?php

use Illuminate\Container\Container;
use ZnCore\Base\Libs\Env\DotEnvHelper;
use ZnLib\Rest\Helpers\RestApiControllerHelper;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouteCollection;

require_once __DIR__ . '/../../src/Bootstrap/autoload.php';
DotEnvHelper::init(__DIR__ . '/../..');

$container = Container::getInstance();
$routeCollection = new RouteCollection;

require_once __DIR__ . '/bootstrap.php';

$response = RestApiControllerHelper::run($routeCollection, $container, '/', Request::createFromGlobals());
$response->send();
