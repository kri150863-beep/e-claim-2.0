<?php

namespace App\Service;

use App\Entity\ClaimUser\Notification;
use App\Service\MercureTokenGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
// use Twilio\Rest\Client;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class NotificationService
{
    private EntityManagerInterface $entityManager;
    private MailerInterface $mailer;
    // private Client $twilio;
    private HubInterface $mercureHub;
    private MercureTokenGenerator $mercureTokenGenerator;

    public function __construct(
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        // Client $twilio,
        HubInterface $mercureHub,
        ManagerRegistry $doctrine,
        MercureTokenGenerator $mercureTokenGenerator
    ) {
        $this->entityManager            = $doctrine->getManager('claim_user_db');
        $this->mailer                   = $mailer;
        // $this->twilio           = $twilio;
        $this->mercureHub               = $mercureHub;
        $this->mercureTokenGenerator    = $mercureTokenGenerator;
    }

    public function sendNotification(Notification $notification): void
    {
        $notification->setStatus('pending');
        $notification->setCreatedAt(new \DateTime());
        $this->entityManager->persist($notification);

        try {
            // switch ($notification->getChannel()) {
            //     case 'email':
            //         $this->sendEmail($notification);
            //         break;
            //     case 'sms':
            //         $this->sendSms($notification);
            //         break;
            //     case 'portal':
            //         $this->sendPortalNotification($notification);
            //         break;
            // }

            $notification->setStatus('sent');
            $notification->setSentAt(new \DateTime());
        } catch (\Throwable $e) {
            // si la publication Mercure tombe en erreur -> status failed mais on ne casse pas tout
            $notification->setStatus('failed');
        }

        $this->entityManager->flush();
    }

    private function sendEmail(Notification $notification): void
    {
        $email = (new Email())
            ->from('no-reply@yourapp.com')
            ->to($notification->getUser()->getEmail())
            ->subject($this->getEmailSubject($notification->getType()))
            ->text($notification->getContent());

        $this->mailer->send($email);
    }

    private function sendSms(Notification $notification): void
    {
        // $this->twilio->messages->create(
        //     $notification->getUser()->getPhone(),
        //     [
        //         'from' => '+1234567890', // Remplace par ton numéro Twilio
        //         'body' => $notification->getContent()
        //     ]
        // );
    }

    /**
     * Publishes a notification update to the Mercure hub.
     *
     * @param Notification $notification
     */
    private function sendPortalNotification(Notification $notification): void
    {
        $topic = sprintf('notifications/%d', $notification->getUsers()->getId());
        
        $payload = [
            'id'          => $notification->getUsers()->getId(),
            'type'        => $notification->getType(),
            'content'     => $notification->getContent(),
            'claimNumber' => $notification->getClaimNumber(),
            'createdAt'   => $notification->getCreatedAt() ? $notification->getCreatedAt()->format('c') : null,
        ];

        // Publication via HTTP client + JWT signé
        $this->mercureTokenGenerator->publishToMercure($payload, $topic, $notification);
    }

    private function getEmailSubject(string $type): string
    {
        $subjects = [
            'confirmation_action' => 'Action Confirmation',
            'new_claim' => 'New Claim Added',
            'pending_reminder' => 'Pending Claim Reminder',
            'claim_returned' => 'Claim Returned with Remarks',
            'ageing_red' => 'Urgent: Claim in Draft Status',
            'invoice_paid' => 'Payment Status Update'
        ];

        return $subjects[$type] ?? 'Notification';
    }
} 