<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Status
 *
 * @ORM\Table(name="status")
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        new GetCollection(),    
    ],
)]
class Status
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
     * @ORM\Column(name="status_code", type="string", length=45, nullable=true)
     */
    private $statusCode;

    /**
     * @var string|null
     *
     * @ORM\Column(name="status_name", type="string", length=45, nullable=true)
     */
    private $statusName;

    /**
     * @var string|null
     *
     * @ORM\Column(name="description", type="string", length=255, nullable=true)
     */
    private $description;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatusCode(): ?string
    {
        return $this->statusCode;
    }

    public function setStatusCode(?string $statusCode): static
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    public function getStatusName(): ?string
    {
        return $this->statusName;
    }

    public function setStatusName(?string $statusName): static
    {
        $this->statusName = $statusName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }


}
