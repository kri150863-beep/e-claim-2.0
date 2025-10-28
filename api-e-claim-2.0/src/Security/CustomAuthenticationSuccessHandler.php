<?php

namespace App\Security;

use App\Entity\ClaimUser\Users;
use App\Service\MercureTokenGenerator;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Component\Uid\Uuid;

class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private RefreshTokenManagerInterface $refreshTokenManager;
    private MercureTokenGenerator $mercureTokenGenerator;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        RefreshTokenManagerInterface $refreshTokenManager,
        MercureTokenGenerator $mercureTokenGenerator
    )
    {
        $this->jwtManager           = $jwtManager;
        $this->refreshTokenManager  = $refreshTokenManager;
        $this->mercureTokenGenerator  = $mercureTokenGenerator;
    } 

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        /** @var \App\Entity\ClaimUser\AccountInformations $user */
        $user = $token->getUser();

        // Génére manuellement le JWT
        $jwt = $this->jwtManager->create($user);
        
        $refreshToken = $this->refreshTokenManager->create();
        $refreshToken->setRefreshToken(Uuid::v4()); // ou tout autre générateur unique
        $refreshToken->setUsername($user->getEmailAddress());
        $refreshToken->setValid((new \DateTime())->modify('+1 month'));

        $this->refreshTokenManager->save($refreshToken);

        // Token JWT pour Mercure
        $mercureToken = $this->mercureTokenGenerator->generateToken(
            subscribe: ["notifications/5"],   // ou "https://example.com/user/{$user->getId()}"
            publish: []
        );

        return new JsonResponse([
            'status' => 'success',
            'code' => 200,  
            'message' => 'Authentication successful.',
            'data' => [
                'accessToken' => $jwt,
                'refreshToken' => $refreshToken->getRefreshToken(),
                'mercureToken' => $mercureToken,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmailAddress(),
                    'roles' => $user->getRoles(),
                    'business_name' => $user->getBusinessName(),
                ]
            ]
        ]);
    }


}