<?php

namespace App\Bundle\Dashboard\Web\Controllers;

use ZnCore\Domain\Libs\Query;
use ZnBundle\Article\Domain\Interfaces\PostServiceInterface;
use ZnBundle\Notify\Domain\Entities\EmailEntity;
use ZnBundle\Notify\Domain\Entities\SmsEntity;
use ZnBundle\Notify\Domain\Interfaces\Services\EmailServiceInterface;
use ZnBundle\Queue\Domain\Interfaces\Services\JobServiceInterface;
use phpseclib\Crypt\AES;
use phpseclib\Crypt\Base;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MainController extends AbstractController
{

    private $postService;
    private $emailService;
    private $jobService;

    public function __construct(PostServiceInterface $postService, EmailServiceInterface $emailService, JobServiceInterface $jobService)
    {
        $this->postService = $postService;
        $this->emailService = $emailService;
        $this->jobService = $jobService;
    }

    public function test(Request $request)
    {
        $text = $request->request->get('text');
        $body = [
            'text' => $text . '123'
        ];
        return new JsonResponse($body);
    }

    public function index()
    {

        /*$originalValue = ["We do encrypt an array", "123", ['nested']]; // this could be any value
        $password = "123456";
        $encrypted = CryptoJsAes::encrypt($originalValue, $password);

        // decrypt
        $encrypted = '{"ct":"g9uYq0DJypTfiyQAspfUCkf+\/tpoW4DrZrpw0Tngrv10r+\/yeJMeseBwDtJ5gTnx","iv":"c8fdc314b9d9acad7bea9a865671ea51","s":"7e61a4cd341279af"}';
        $password = "123456";
        $decrypted = CryptoJsAes::decrypt($encrypted, $password);*/

        //dd($decrypted);

        //echo "Encrypted: " . $encrypted . "\n";
        //echo "Decrypted: " . print_r($decrypted, true) . "\n";

        $query = new Query;
        $query->with('category');
        $query->perPage(5);
        $postCollection = $this->postService->all($query);
        return $this->render('dashboard/web/index.html.twig', [
            'postCollection' => $postCollection,
            'links' => [
                [
                    'title' => 'API - auth',
                    'url' => '/api/v1/auth',
                ],
                [
                    'title' => 'API - rbac',
                    'url' => '/api/v1/rbac',
                ],
                [
                    'title' => 'API - article-post',
                    'url' => '/api/v1/article-post',
                ],
                [
                    'title' => 'Web - messenger-chat',
                    'url' => '/chat',
                ],
                [
                    'title' => 'API - messenger-chat',
                    'url' => '/api/v1/messenger-chat',
                ],
                [
                    'title' => 'API - article-post (PHP)',
                    'url' => '/php/v1/article-post',
                ],

                [
                    'title' => 'rails',
                    'url' => '/rails',
                ],
            ],
        ]);
    }

    public function index2222()
    {
        //$user = $this->container->get('security.token_storage')->getToken()->getUser();
        //dd($user);

        $email = new EmailEntity;
        $email->setFrom('from@mail.ru');
        $email->setTo('theyamshikov@yandex.ru');
        $email->setSubject('Subject text');
        $email->setBody('Body text');
        $this->emailService->push($email);

        $this->jobService->runAll('email');

        $query = new Query;
        $query->with('category');
        $query->perPage(5);
        $postCollection = $this->postService->all($query);
        return $this->render('dashboard/web/index.html.twig', [
            'postCollection' => $postCollection,
            'links' => [
                [
                    'title' => 'API - auth',
                    'url' => '/api/v1/auth',
                ],
                [
                    'title' => 'API - rbac',
                    'url' => '/api/v1/rbac',
                ],
                [
                    'title' => 'API - article-post',
                    'url' => '/api/v1/article-post',
                ],
                [
                    'title' => 'Web - messenger-chat',
                    'url' => '/chat',
                ],
                [
                    'title' => 'API - messenger-chat',
                    'url' => '/api/v1/messenger-chat',
                ],
                [
                    'title' => 'API - article-post (PHP)',
                    'url' => '/php/v1/article-post',
                ],

                [
                    'title' => 'rails',
                    'url' => '/rails',
                ],
            ],
        ]);
    }

}
