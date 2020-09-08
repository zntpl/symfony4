<?php

use Illuminate\Container\Container;
use ZnBundle\Article\Symfony\Api\ArticleModule;
use Symfony\Component\Routing\RouteCollection;

/**
 * @var Container $container
 * @var RouteCollection $routeCollection
 */

$articleModule = new ArticleModule;
$articleModule->bindContainer($container);
$articleModule->getRouteCollection($routeCollection);
