<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\GetClaimDetailsController;
use App\Controller\GetClaimsByUserController;
use Doctrine\ORM\Mapping as ORM;

/**
 * Claims
 *
 * @ORM\Table(name="claims", uniqueConstraints={@ORM\UniqueConstraint(name="id_UNIQUE", columns={"id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Liste claim d'un utilisateur
        new GetCollection(
            uriTemplate: '/api/claims',
            controller: GetClaimsByUserController::class . '::__invoke',
            parameters: [ 
                'email'         => new QueryParameter(),
                'status'        => new QueryParameter(),
                'searchName'    => new QueryParameter(),
                'sortBy'        => new QueryParameter(),
                'searchNum'     => new QueryParameter(),
                'searchRegNum'  => new QueryParameter(),
                'searchPhone'   => new QueryParameter(),
                'page'          => new QueryParameter(),
                'pageSize'      => new QueryParameter(),
            ],
        ), 
        // Détail d'un claim 
        new Get(
            uriTemplate: '/api/claim',
            controller: GetClaimDetailsController::class . '::__invoke',
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email'     => new QueryParameter()
            ]
        ),
        new Get(
            uriTemplate: '/api/claim/card-stats',
            controller: GetClaimsByUserController::class. '::getCardStats',
            parameters: [ 
                'email'=> new QueryParameter()
            ],
        )
    ]
)]
class Claims
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
     * @var \DateTime
     *
     * @ORM\Column(name="received_date", type="date", nullable=false, options={"default"="curdate()"})
     */
    private $receivedDate = 'curdate()';

    /**
     * @var string
     *
     * @ORM\Column(name="number", type="string", length=255, nullable=false)
     */
    private $number;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=45, nullable=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="registration_number", type="string", length=45, nullable=false)
     */
    private $registrationNumber;

    /**
     * @var int
     *
     * @ORM\Column(name="ageing", type="integer", nullable=false)
     */
    private $ageing;

    /**
     * @var string
     *
     * @ORM\Column(name="phone", type="string", length=255, nullable=false)
     */
    private $phone;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="affected", type="boolean", nullable=true)
     */
    private $affected;

    /**
     * @var \Status
     *
     * @ORM\ManyToOne(targetEntity="Status")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="status_id", referencedColumnName="id")
     * })
     */
    private $status;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReceivedDate(): ?\DateTime
    {
        return $this->receivedDate;
    }

    public function setReceivedDate(\DateTime $receivedDate): static
    {
        $this->receivedDate = $receivedDate;

        return $this;
    }

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function setNumber(string $number): static
    {
        $this->number = $number;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getRegistrationNumber(): ?string
    {
        return $this->registrationNumber;
    }

    public function setRegistrationNumber(string $registrationNumber): static
    {
        $this->registrationNumber = $registrationNumber;

        return $this;
    }

    public function getAgeing(): ?int
    {
        return $this->ageing;
    }

    public function setAgeing(int $ageing): static
    {
        $this->ageing = $ageing;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function isAffected(): ?bool
    {
        return $this->affected;
    }

    public function setAffected(?bool $affected): static
    {
        $this->affected = $affected;

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


}
