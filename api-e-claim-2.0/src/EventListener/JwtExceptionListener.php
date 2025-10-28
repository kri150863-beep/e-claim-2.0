<?php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Exception\ExpiredTokenException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Http\HttpKernelInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class JwtExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        // Il entre bien dans 
        if ($exception instanceof ExpiredTokenException || $exception instanceof AuthenticationException) {
            $response = new JsonResponse([
                '@type' => 'AuthenticationError',
                'title' => 'Token expiré',
                'detail' => 'Le token JWT a expiré, veuillez vous reconnecter.',
                'status' => 401,
                'type' => '/errors/token-expired'
            ], 401);

            $event->setResponse($response);
        }
    }
}