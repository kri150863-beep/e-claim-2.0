<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\AffectionClaimController;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Assignment
 *
 * @ORM\Table(name="assignment", indexes={@ORM\Index(name="fk_assignment_claims1_idx", columns={"claims_id"}), @ORM\Index(name="fk_assignment_status1_idx", columns={"status_id"}), @ORM\Index(name="fk_assignment_users1", columns={"users_id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/api/affectation/claim',
            controller: AffectionClaimController::class . '::__invoke'
        ),
        new Get(
            uriTemplate: '/api/filter/assignements',
            controller: AffectionClaimController::class . '::getAssignementFilter',
            parameters: [ 'p_claims_number' => new QueryParameter()]
        ), 
        new Patch(
            uriTemplate: 'api/update/affectation',
            controller: AffectionClaimController::class . '::updateAssignmentClaim',
             parameters: [   
                'p_users_id'            => new QueryParameter(),
                'p_assignment_date'     => new QueryParameter(),
                'p_assignement_note'    => new QueryParameter(),
                'p_status_id'           => new QueryParameter(),
                'p_claims_number'       => new QueryParameter(),
            ]
        )     
    ],
)]   
class Assignment
{
    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="assignment_date", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $assignmentDate = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="assignement_note", type="text", length=65535, nullable=true)
     */
    private $assignementNote;

    /**
     * @var \Claims
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Claims")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="claims_id", referencedColumnName="id")
     * })
     */
    private $claims;

    /**
     * @var \Status
     *
     * @ORM\ManyToOne(targetEntity="Status")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="status_id", referencedColumnName="id")
     * })
     */
    private $status;

    /**
     * @var \Users
     *
     * @ORM\ManyToOne(targetEntity="Users")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="users_id", referencedColumnName="id")
     * })
     */
    private $users;

    public function getAssignmentDate(): ?\DateTime
    {
        return $this->assignmentDate;
    }

    public function setAssignmentDate(?\DateTime $assignmentDate): static
    {
        $this->assignmentDate = $assignmentDate;

        return $this;
    }

    public function getAssignementNote(): ?string
    {
        return $this->assignementNote;
    }

    public function setAssignementNote(?string $assignementNote): static
    {
        $this->assignementNote = $assignementNote;

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

    public function getStatus(): ?Status
    {
        return $this->status;
    }

    public function setStatus(?Status $status): static
    {
        $this->status = $status;

        return $this;
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


}
