<?php

use App\Kernel;
use Illuminate\Support\Collection;
use ZnCrypt\Base\Domain\Enums\EncryptAlgorithmEnum;
use ZnCrypt\Base\Domain\Libs\Encoders\AesAdvancedEncoder;
use ZnCrypt\Base\Domain\Libs\Encoders\AesEncoder;
use ZnCrypt\Base\Domain\Libs\Encoders\Base64Encoder;
use ZnCrypt\Base\Domain\Libs\Encoders\CollectionEncoder;
use ZnCrypt\Base\Domain\Libs\Encoders\CryptoEncoder;
use ZnCrypt\Base\Domain\Libs\Encoders\GzEncoder;
use ZnCrypt\Base\Domain\Libs\Encoders\JsonEncoder;
use ZnCrypt\Base\Domain\Libs\Rsa\Rsa;
use ZnCrypt\Base\Domain\Libs\Tunnel\JsonFormatter;
use ZnCrypt\Base\Domain\Libs\Tunnel\StringFormatter;
use ZnLib\Rest\Helpers\CorsHelper;
use ZnSandbox\Sandbox\Proto\Libs\RestProto;
use Symfony\Component\HttpFoundation\Request;
use ZnLib\Rest\Helpers\SymfonyRequestHelper;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\Response;

require_once __DIR__ . '/../src/Bootstrap/autoload.php';
require_once dirname(__DIR__).'/config/bootstrap.php';

CorsHelper::autoload();

// todo: make hook
$uri = trim($_SERVER['REQUEST_URI'], '/');

//$isCrypt = strpos($uri, 'api/') === 0;
$cryptSessionId = $_SERVER['HTTP_X_CRYPT_SESSION'] ?: null;

if($cryptSessionId) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $cache = new FilesystemAdapter('cryptoSession', \ZnCore\Base\Enums\Measure\TimeEnum::SECOND_PER_DAY, __DIR__ . '/../var/cache');
    $session = new \ZnCrypt\Base\Domain\Libs\Rsa\Session($cache);
    $session->start($cryptSessionId);

    $cryptFormat = $_SERVER['HTTP_X_CRYPT_FORMAT'];

    /** @var StringFormatter[] $formatters */
    $cryptoEncoder = new CryptoEncoder;
    $formatterClass = $cryptoEncoder->formatterInstanceByName($cryptFormat);

    $secretKey = $session->get('secretKey');
    //dd($secretKey);
    if(empty($secretKey)) {
        $response = new Response('Empty secret key! Go to hand hake!', 401);
        $response->send();
        exit;
        //throw new Exception();
    }
    $encoderCollection = new Collection([
        new AesAdvancedEncoder($secretKey, new $formatterClass),
        //new $formatterClass,
        /*new JsonEncoder,
        new AesEncoder($_ENV['AES_ENCODER_KEY']),
        new GzEncoder,
        new Base64Encoder,*/
    ]);
    $encoder = new CollectionEncoder($encoderCollection);
    $restProto = new RestProto($encoder);
    $content = Request::createFromGlobals()->getContent();
    $requestEntity = $restProto->prepareRequest($content);
    $server = $restProto->forgeServer($requestEntity);
    $_SERVER = array_merge($_SERVER, $server);
    $_GET = $requestEntity->getQuery() ?? [];
    $_POST = $requestEntity->getBody() ?? [];

}

//$encrypted = $rsa->encode('qwer');
/*$out = $rsa->decode($encrypted);
dd($out);*/

// todo: end hook

SymfonyRequestHelper::prepareRequest();

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);

// todo: make hook
if($cryptSessionId) {
    $response = $restProto->encodeResponse($response);
}
// todo: end hook

$response->send();
$kernel->terminate($request, $response);
