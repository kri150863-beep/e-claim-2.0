<?php
// src/Service/EmailValidatorService.php

namespace App\Service;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;

class EmailValidatorService
{
    private ValidatorInterface $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    /**
     * Vérifie si l'email est valide.
     *
     * @param string|null $email
     * @return bool
     */
    public function isValid(?string $email): bool
    {
        $violations = $this->validator->validate($email, [
            new NotBlank(['message' => 'Email requis.']),
            new Email(['message' => 'Email invalide.']),
        ]);

        return count($violations) === 0;
    }

    /**
     * Retourne les messages d'erreur si l'email est invalide.
     */
    public function getErrors(?string $email): array
    {
        $violations = $this->validator->validate($email, [
            new NotBlank(['message' => 'Email requis.']),
            new Email(['message' => 'Email invalide.']),
        ]);

        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = $violation->getMessage();
        }

        return $errors;
    }
}