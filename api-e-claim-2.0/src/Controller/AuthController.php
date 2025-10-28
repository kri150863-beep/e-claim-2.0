<?php
// src/Controller/AuthController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class AuthController extends AbstractController
{
    public function login(): JsonResponse
    {
        return new JsonResponse('teset');
        // Le traitement est géré par json_login
        return $this->json([
            'message' => 'Utilisez /api/auth/login pour obtenir un token JWT'
        ]);
    }

    public function loginCheck(): void
    {
        // Cette méthode ne sera jamais exécutée
        // Le firewall intercepte la requête avant
    }

    public function me(): JsonResponse
    {
        $user = $this->getUser();

        return $this->json([
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
        ]);
    }
}