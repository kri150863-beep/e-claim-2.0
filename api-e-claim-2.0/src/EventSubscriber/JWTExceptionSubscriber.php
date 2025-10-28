<?php
namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;

class JWTExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        // priorité 512 pour passer avant API Platform et Security
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 512],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof JWTDecodeFailureException) {
            $message = 'Jeton invalide.';
            if ($exception->getReason() === JWTDecodeFailureException::EXPIRED_TOKEN) {
                $message = 'Your session has expired. Please log in again.';
            }

            $event->setResponse(new JsonResponse([
                'status'  => 'error',
                'code'    => 401,
                'message' => $message,
            ], 401));
        }
    }
}