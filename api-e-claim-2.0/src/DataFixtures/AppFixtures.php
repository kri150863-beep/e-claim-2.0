<?php

namespace App\DataFixtures;

use App\Entity\Claims;
use App\Entity\Payements;
use App\Entity\Status;
use App\Entity\Users;
use App\Entity\Vats;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $status     = $manager->find(Status::class, 1); // Récupère le Status avec ID 1

        // $payment    = new Payements();
        // $payment->setDateSubmitted(new \DateTime('2025-05-18'));
        // $payment->setInvoiceNum(335555);
        // $payment->setClaimNum('M0115924');
        // $payment->setClaimAmount(100.00);
        // $payment->setPayementDate(new \DateTime('2025-05-18'));
        // $payment->setStatus($status);
        // $manager->persist($payment);

        // $user = new Users();
        // $manager->persist($user);

        // $claim = new Claims();
        // $claim->setReceivedDate(new \DateTime());
        // $claim->setNumber('M0115926');
        // $claim->setName('Tinah');
        // $claim->setRegistrationNumber('9559 AG 23');
        // $claim->setAgeing(23);
        // $claim->setPhone('54347974');
        // $claim->setStatus($status);
        // $manager->persist($claim);

        $manager->flush();
    }
}
