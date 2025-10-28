<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\GetCommunicationMethodsController;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * CommunicationMethods
 *
 * @ORM\Table(name="communication_methods", uniqueConstraints={@ORM\UniqueConstraint(name="method_code_UNIQUE", columns={"method_code"}), @ORM\UniqueConstraint(name="method_name_UNIQUE", columns={"method_name"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Liste methode de communication
        new GetCollection(
            uriTemplate: '/api/methode-communications',
            controller: GetCommunicationMethodsController::class
        )
    ]
)]
class CommunicationMethods
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
     * @var string
     *
     * @ORM\Column(name="method_code", type="string", length=45, nullable=false)
     */
    private $methodCode;

    /**
     * @var string
     *
     * @ORM\Column(name="method_name", type="string", length=45, nullable=false)
     */
    private $methodName;

    /**
     * @var string|null
     *
     * @ORM\Column(name="description", type="text", length=65535, nullable=true)
     */
    private $description;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $updatedAt = 'CURRENT_TIMESTAMP';

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="AdministrativeSettings", mappedBy="method")
     */
    private $adminSetting = array();

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->adminSetting = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMethodCode(): ?string
    {
        return $this->methodCode;
    }

    public function setMethodCode(string $methodCode): static
    {
        $this->methodCode = $methodCode;

        return $this;
    }

    public function getMethodName(): ?string
    {
        return $this->methodName;
    }

    public function setMethodName(string $methodName): static
    {
        $this->methodName = $methodName;

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

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, AdministrativeSettings>
     */
    public function getAdminSetting(): Collection
    {
        return $this->adminSetting;
    }

    public function addAdminSetting(AdministrativeSettings $adminSetting): static
    {
        if (!$this->adminSetting->contains($adminSetting)) {
            $this->adminSetting->add($adminSetting);
            $adminSetting->addMethod($this);
        }

        return $this;
    }

    public function removeAdminSetting(AdministrativeSettings $adminSetting): static
    {
        if ($this->adminSetting->removeElement($adminSetting)) {
            $adminSetting->removeMethod($this);
        }

        return $this;
    }

}
