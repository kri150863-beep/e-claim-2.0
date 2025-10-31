<?php
namespace App\Security;

use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
// use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTDecoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ClaimUser\BlacklistedTokens;
use Doctrine\Persistence\ManagerRegistry;

class JWTTokenAuthenticator extends AbstractAuthenticator
{
    private JWTEncoderInterface $jwtDecoder;
    private UserProviderInterface $userProvider;
    private EntityManagerInterface $em;

    public function __construct(
        JWTEncoderInterface $jwtDecoder,
        UserProviderInterface $userProvider,
        ManagerRegistry $registry
    ) {
        $this->jwtDecoder   = $jwtDecoder;
        $this->userProvider = $userProvider;
        $this->em           = $registry->getManager('claim_user_db');
    }

    public function supports(Request $request): ?bool
    {
        // var_dump($request->headers->all());
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
    {
        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new AuthenticationException('Token manquant ou invalide');
        }

        $token = substr($authHeader, 7);

        // Vérifie si le token est dans la table blacklist
        $blacklisted = $this->em->getRepository(BlacklistedTokens::class)->findOneBy(['token' => $token]);

        if ($blacklisted) {
            throw new AuthenticationException('Token invalide (blacklisté)');
        }

        $payload = $this->jwtDecoder->decode($token);

        if (!$payload) {
            throw new AuthenticationException('Token invalide');
        }

        return new SelfValidatingPassport(new UserBadge($payload['username'] ?? $payload['email']));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        return null; // Laisse la requête continuer normalement
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?JsonResponse
    {
        return new JsonResponse([
            'status'    => 'error',
            'code'      => 401,
            'message'   => 'You must reconnect, you are already disconnected.',
        ], 401);
    }
}