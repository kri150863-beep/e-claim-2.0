<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\POST;
use App\Controller\Auth\LogOutController;
use App\Repository\ClaimUser\BlacklistedTokensRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ClaimUser\BlacklistedTokensRepository")
 * @ORM\Table(name="blacklisted_token")
 */
#[ApiResource(
    operations: [
        new POST(
            uriTemplate: '/api/logout',
            controller: LogOutController::class
        )
    ]
)]
class BlacklistedTokens
{
   /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string|null
     *
     * @ORM\Column(name="token", type="text", length=65535, nullable=true)
     */
    private $token;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="expires_at", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $expiresAt = 'CURRENT_TIMESTAMP';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getExpiresAt(): ?\DateTime
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(\DateTime $expiresAt): static
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }
}
