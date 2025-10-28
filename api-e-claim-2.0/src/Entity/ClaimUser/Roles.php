<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\GetRolesController;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Roles
 *
 * @ORM\Table(name="roles", uniqueConstraints={@ORM\UniqueConstraint(name="role_code_UNIQUE", columns={"role_code"}), @ORM\UniqueConstraint(name="role_name_UNIQUE", columns={"role_name"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Liste claim d'un utilisateur
        new GetCollection(
            uriTemplate: '/api/list/user_roles',
            controller: GetRolesController::class
        )
    ]
)]
class Roles
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
     * @ORM\Column(name="role_code", type="string", length=45, nullable=false)
     */
    private $roleCode;

    /**
     * @var string
     *
     * @ORM\Column(name="role_name", type="string", length=45, nullable=false)
     */
    private $roleName;

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
     * @ORM\ManyToMany(targetEntity="Users", mappedBy="roles")
     */
    private $users = array();

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRoleCode(): ?string
    {
        return $this->roleCode;
    }

    public function setRoleCode(string $roleCode): static
    {
        $this->roleCode = $roleCode;

        return $this;
    }

    public function getRoleName(): ?string
    {
        return $this->roleName;
    }

    public function setRoleName(string $roleName): static
    {
        $this->roleName = $roleName;

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
     * @return Collection<int, Users>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(Users $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addRole($this);
        }

        return $this;
    }

    public function removeUser(Users $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeRole($this);
        }

        return $this;
    }

}
