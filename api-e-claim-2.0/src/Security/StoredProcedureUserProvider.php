<?php

// src/Security/StoredProcedureUserProvider.php

namespace App\Security;

use App\Entity\AccountInformations;
use Doctrine\DBAL\Connection;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class StoredProcedureUserProvider implements UserProviderInterface
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $stmt = $this->connection->prepare('EXEC AuthenticateUser :email, :password');
        $stmt->bindValue('email', $identifier);
        $stmt->bindValue('password', ''); // Mot de passe vide pour la recherche
        
        $result = $stmt->executeQuery()->fetchAssociative();
        
        if (!$result) {
            throw new UserNotFoundException('User not found');
        }

        $user = new AccountInformations();
        $user->setId($result['user_id']);
        $user->setEmailAddress($result['email_address']);
        $user->setBusinessName($result['business_name']);
        $user->setBusinessRegistrationNumber($result['business_registration_number']);
        
        return $user;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return AccountInformations::class === $class;
    }
}