<?php

namespace App\Service;

use App\Entity\Surveyor\Survey;
use Doctrine\DBAL\Connection;

/**
 * Class DeletedService
 * @package App\Service
 */
class DeletedService
{
    private Connection $connection;
    
    public function __construct(Connection $claimDetailsConnection)
    {
        $this->connection = $claimDetailsConnection;
    }

    /**
     * Suppression des pièces 
     * 
     * @param array $params
     * @return array
     */
    public function callDeletePartById(array $params) : array
    {
        $sql = "CALL DeletePartById(?)";

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue(1, $params['p_part_id']);

        return $stmt->executeQuery()->fetchAllAssociative();
    }

    /**
     * Suppression des images de dommage 
     * 
     * @param array $params
     * @return array
     */
    public function callDeleteImageOfDomage(array $params) : array
    {
        $sql = "CALL DeletedImageOfDamage(?)";

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue(1, $params['p_image_id']);

        return $stmt->executeQuery()->fetchAllAssociative();
    }
}