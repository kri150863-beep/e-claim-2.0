<?php

namespace App\Entity\ClaimUser;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\GetClaimPartialInfoByNumberController;
use Doctrine\ORM\Mapping as ORM;

/**
 * Claims
 *
 * @ORM\Table(name="claim_general_info", uniqueConstraints={@ORM\UniqueConstraint(name="id_UNIQUE", columns={"id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Détail d'un claim 
        new Get(
            uriTemplate: '/api/claim/report',
            controller: GetClaimPartialInfoByNumberController::class,
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email '    => new QueryParameter()
            ]
        )
    ]
)]
class ClaimPartialInfo
{
     /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @var string
     *
     * @ORM\Column(name="claim_number", type="string", length=100, nullable=false)
     */
    private $claimNumber;

    /**
     * @var string|null
     *
     * @ORM\Column(name="make", type="string", length=90, nullable=true)
     */
    private $make;

    /**
     * @var string|null
     *
     * @ORM\Column(name="model", type="string", length=90, nullable=true)
     */
    private $model;

    /**
     * @var int|null
     *
     * @ORM\Column(name="cc", type="integer", nullable=true)
     */
    private $cc;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fuel_type", type="string", length=45, nullable=true)
     */
    private $fuelType;

    /**
     * @var string|null
     *
     * @ORM\Column(name="transmission", type="string", length=45, nullable=true)
     */
    private $transmission;

    /**
     * @var string|null
     *
     * @ORM\Column(name="engime_no", type="string", length=90, nullable=true)
     */
    private $engimeNo;

    /**
     * @var string|null
     *
     * @ORM\Column(name="chasisi_no", type="string", length=100, nullable=true)
     */
    private $chasisiNo;

    /**
     * @var string|null
     *
     * @ORM\Column(name="vehicle_no", type="string", length=45, nullable=true)
     */
    private $vehicleNo;

    /**
     * @var string
     *
     * @ORM\Column(name="garage", type="string", length=45, nullable=false)
     */
    private $garage;

    /**
     * @var string
     *
     * @ORM\Column(name="garage_address", type="string", length=255, nullable=false)
     */
    private $garageAddress;

    /**
     * @var string
     *
     * @ORM\Column(name="garage_contact_number", type="string", length=100, nullable=false)
     */
    private $garageContactNumber;

    /**
     * @var float
     *
     * @ORM\Column(name="eor_value", type="float", precision=10, scale=0, nullable=false)
     */
    private $eorValue;

    public function getClaimNumber(): ?string
    {
        return $this->claimNumber;
    }

    public function setClaimNumber(?string $claimNumber): static
    {
        $this->claimNumber = $claimNumber;

        return $this;
    }

        public function getMake(): ?string
    {
        return $this->make;
    }

    public function setMake(?string $make): static
    {
        $this->make = $make;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getCc(): ?int
    {
        return $this->cc;
    }

    public function setCc(?int $cc): static
    {
        $this->cc = $cc;

        return $this;
    }

    public function getFuelType(): ?string
    {
        return $this->fuelType;
    }

    public function setFuelType(?string $fuelType): static
    {
        $this->fuelType = $fuelType;

        return $this;
    }

    public function getTransmission(): ?string
    {
        return $this->transmission;
    }

    public function setTransmission(?string $transmission): static
    {
        $this->transmission = $transmission;

        return $this;
    }

    public function getEngimeNo(): ?string
    {
        return $this->engimeNo;
    }

    public function setEngimeNo(?string $engimeNo): static
    {
        $this->engimeNo = $engimeNo;

        return $this;
    }

    public function getChasisiNo(): ?string
    {
        return $this->chasisiNo;
    }

    public function setChasisiNo(?string $chasisiNo): static
    {
        $this->chasisiNo = $chasisiNo;

        return $this;
    }

    public function getVehicleNo(): ?string
    {
        return $this->vehicleNo;
    }

    public function setVehicleNo(?string $vehicleNo): static
    {
        $this->vehicleNo = $vehicleNo;

        return $this;
    }

        public function getGarage(): ?string
    {
        return $this->garage;
    }

    public function setGarage(string $garage): static
    {
        $this->garage = $garage;

        return $this;
    }

    public function getGarageAddress(): ?string
    {
        return $this->garageAddress;
    }

    public function setGarageAddress(string $garageAddress): static
    {
        $this->garageAddress = $garageAddress;

        return $this;
    }

    public function getGarageContactNumber(): ?string
    {
        return $this->garageContactNumber;
    }

    public function setGarageContactNumber(string $garageContactNumber): static
    {
        $this->garageContactNumber = $garageContactNumber;

        return $this;
    }

    public function getEorValue(): ?float
    {
        return $this->eorValue;
    }

    public function setEorValue(float $eorValue): static
    {
        $this->eorValue = $eorValue;

        return $this;
    }

}