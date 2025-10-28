<?php

namespace App\Entity\ClaimUser;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiResource as MetadataApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\NotificationManageController;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity
 * 
 */
#[ApiResource(
    operations: [
        // Liste claim d'un utilisateur
        new GetCollection(
            uriTemplate: '/api/notifications',
            controller: NotificationManageController::class . '::__invoke',
            parameters: [ 
                'id' => new QueryParameter()
            ],
        ), 
        // Détail d'un claim 
        new Get(
            uriTemplate: '/api/notification',
            controller: NotificationManageController::class . '::getAllNotifications',
            parameters: [ 
                'id' => new QueryParameter()
            ]
        )
    ]
)]
#[ApiResource(mercure:true)]
class Notification
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
     * @var \Users
     *
     * @ORM\ManyToOne(targetEntity="Users")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $users;

    /**
     * @var \Claims
     *
     * @ORM\ManyToOne(targetEntity="Claims")
     * @ORM\JoinColumn(name="claim_id", referencedColumnName="id")
     */
    private $claims;

    /**
     * @var string
     * 
     * @ORM\Column(name="channel", type="string", length=0, nullable=true)
     */
    private $channel;

    /**
     * @var string
     * 
     * @ORM\Column(name="type_action", type="string", length=0, nullable=true)
     */
    private $type;

     /**
     * @var string|null
     *
     * @ORM\Column(name="content", type="text", length=65535, nullable=true)
     */
    private $content;

    /**
     * @var string
     * 
     * @ORM\Column(name="claim_number", type="string", length=250, nullable=true)
     */
    private $claimNumber;

    /**
     * @var string
     * 
     * @ORM\Column(name="status", type="string", length=0, nullable=true, options={"default"="pending"})
     */
    private $status = 'pending';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $createdAt = null;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="sent_at", type="datetime", nullable=true)
     */
    private $sentAt = null;

    // public function __construct()
    // {
    //     $this->createdAt = new \DateTime();
    // }

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsers(): ?Users
    {
        return $this->users;
    }

    public function setUsers(?Users $users): static
    {
        $this->users = $users;

        return $this;
    }

    public function getClaims(): ?Claims
    {
        return $this->claims;
    }

    public function setClaims(?Claims $claims): static
    {
        $this->claims = $claims;

        return $this;
    }

    public function getChannel(): ?string
    {
        return $this->channel;
    }

    public function setChannel(string $channel): self
    {
        $this->channel = $channel;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getClaimNumber(): ?string
    {
        return $this->claimNumber;
    }

    public function setClaimNumber(?string $claimNumber): self
    {
        $this->claimNumber = $claimNumber;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getSentAt(): ?\DateTime
    {
        return $this->sentAt;
    }

    public function setSentAt(?\DateTime $sentAt): self
    {
        $this->sentAt = $sentAt;
        return $this;
    }
}