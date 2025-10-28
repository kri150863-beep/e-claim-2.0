<?php
namespace App\Service;

use App\Entity\ClaimUser\Notification;
use Lcobucci\JWT\Configuration;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MercureTokenGenerator
{
    private string $mercureSecret;
    private HttpClientInterface $httpClient;
    private string $mercureUrl;
    private Configuration $jwtConfig;

    public function __construct(string $mercureSecret, HttpClientInterface $httpClient, string $mercureUrl)
    {
        $this->mercureSecret = $mercureSecret;
        $this->httpClient    = $httpClient;
        $this->mercureUrl    = $mercureUrl;

        $this->jwtConfig = Configuration::forSymmetricSigner(
            new \Lcobucci\JWT\Signer\Hmac\Sha256(),
            \Lcobucci\JWT\Signer\Key\InMemory::plainText($this->mercureSecret)
        );
    }

    public function generateToken(array $subscribe = [], array $publish = []): string
    {
        $now   = new \DateTimeImmutable();
        $claim = ['mercure' => ['subscribe' => $subscribe, 'publish' => $publish]];

        $token = $this->jwtConfig->builder()
            ->issuedAt($now)
            ->expiresAt($now->modify('+1 hour'))
            ->withClaim('mercure', $claim['mercure'])
            ->getToken($this->jwtConfig->signer(), $this->jwtConfig->signingKey());

        return $token->toString();
    }

    public function publishToMercure(array $data, string $topic, Notification $notification): void
    {

        // IMPORTANT : on publie avec un JWT signé (pas le secret brut)
        $jwt = $this->generateToken([], [$topic]); // droit de publier sur ce topic
        // return $jwt;  j'ai bien la génération du token
        // dd($topic, $data, $jwt);

         // Publication de la mise à jour
         // https://mercure.rocks/docs/hub/publish
         // https://symfony.com/doc/current/mercure.html#publishing-updates
         //
        try {
            $response = $this->httpClient->request('POST', $this->mercureUrl, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $jwt,
                ],
                'body' => [
                    'topic' => $topic,
                    'data'  => json_encode($data),
                ],
                'timeout' => 5,
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new \Exception('Mercure hub returned status ' . $response->getStatusCode() . ': ' . $response->getContent(false));
            }
        } catch (\Exception $e) {
            $notification->setStatus('failed');
            // logger->error($e->getMessage());
        }
    }
}