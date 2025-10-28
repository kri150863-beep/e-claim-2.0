<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTCreatedListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'lexik_jwt_authentication.on_jwt_created' => 'onJWTCreated',
        ];
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof \App\Entity\ClaimUser\AccountInformations) {
            return;
        }

        $payload = $event->getData();

        // Ajouter des champs personnalisés
        $payload['id'] = $user->getId();
        // $payload['username'] = $user->getEmail();
        $payload['business_name'] = $user->getBusinessName();
        $payload['roles'] = $user->getRoles();

        $event->setData($payload);
    }
}