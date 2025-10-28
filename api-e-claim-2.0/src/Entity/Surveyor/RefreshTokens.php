<?php

namespace App\Entity\Surveyor;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\Auth\TokenRefreshController;
use App\Repository\RefreshTokensRepository;
use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Model\AbstractRefreshToken;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RefreshTokensRepository")
 * @ORM\Table(name="refresh_tokens")
 */
#[ApiResource(
    operations: [
        // Refresh token
        new Post(
            uriTemplate: '/api/auth/refresh-token',
            controller: TokenRefreshController::class,
            parameters: [ 
                'refresh_tokens'   => new QueryParameter()
            ],
            status: 200
        )
    ]
)]
class RefreshTokens extends AbstractRefreshToken
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=128)
     */
    protected $refreshToken;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $username;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $valid;
}
