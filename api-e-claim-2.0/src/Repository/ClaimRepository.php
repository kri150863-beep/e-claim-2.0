<?php

namespace App\Repository;

use App\Entity\ClaimUser\Claims;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 *
 * @method Claims|null find($id, $lockMode = null, $lockVersion = null)
 * @method Claims|null findOneBy(array $criteria, array $orderBy = null)
 * @method Claims[]    findAll()
 * @method Claims[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClaimRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Claims::class);
    }
}