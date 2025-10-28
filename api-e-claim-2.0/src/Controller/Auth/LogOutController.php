<?php

namespace App\Controller\Auth;

use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\ClaimUser\BlacklistedTokens;
use Doctrine\Persistence\ManagerRegistry;

class LogOutController
{
    private JWTTokenManagerInterface $jwtManager;
    private RefreshTokenManagerInterface $refreshTokenManager;
    private EntityManagerInterface $em;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        RefreshTokenManagerInterface $refreshTokenManager,
        ManagerRegistry $registry
    ) {
        $this->jwtManager = $jwtManager;
        $this->refreshTokenManager = $refreshTokenManager;
        $this->em = $registry->getManager('claim_user_db');
    }

    public function __invoke(Request $request): JsonResponse
    {
        $accessToken = $request->headers->get('Authorization');
        $accessToken = str_replace('Bearer ', '', $accessToken);

        if (!$accessToken) {
            return new JsonResponse(['error' => 'No access token provided'], 400);
        }

        // Décoder le token
        try {
            $payload = $this->jwtManager->parse($accessToken);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid token'], 400);
        }

        // Blacklister le token JWT
        $blacklistedTokens = new BlacklistedTokens();
        $blacklistedTokens->setToken($accessToken);
        $blacklistedTokens->setExpiresAt(
            (new \DateTime())->setTimestamp($payload['exp'])
        );

        $this->em->persist($blacklistedTokens);

        // Supprimer le refresh token s'il est envoyé
        $refreshToken = (array)json_decode($request->getContent(), true);

        // return new JsonResponse(['andrana' => $refreshToken]);

        if ($refreshToken) {
            $tokenEntity = $this->refreshTokenManager->get($refreshToken);
            if ($tokenEntity) {
                $this->refreshTokenManager->delete($tokenEntity);
            }
        }

        $this->em->flush();

        return new JsonResponse(['message' => 'Successfully logged out, token blacklisted']);
    }
}