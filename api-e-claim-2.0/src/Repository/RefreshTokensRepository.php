<?php

namespace App\Repository;

use App\Entity\Surveyor\RefreshTokens;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Gesdinet\JWTRefreshTokenBundle\Doctrine\RefreshTokenRepositoryInterface;

class RefreshTokensRepository extends ServiceEntityRepository implements RefreshTokenRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshTokens::class);
    }

    public function findInvalid($datetime = null)
    {
        if (null === $datetime) {
            $datetime = new \DateTime();
        }

        return $this->createQueryBuilder('t')
            ->where('t.valid < :now')
            ->setParameter('now', $datetime)
            ->getQuery()
            ->getResult();
    }

}
