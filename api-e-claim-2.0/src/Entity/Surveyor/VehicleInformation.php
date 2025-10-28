<?php

namespace App\Entity\Surveyor;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * VehicleInformation
 *
 * @ORM\Table(name="vehicle_information", indexes={@ORM\Index(name="fk_vehicle_information_verification1_idx", columns={"verification_id"})})
 * @ORM\Entity
 */
class VehicleInformation
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
     * @var string|null
     *
     * @ORM\Column(name="color", type="string", length=45, nullable=true)
     */
    private $color;

    /**
     * @var int|null
     *
     * @ORM\Column(name="odometer_reading", type="integer", nullable=true)
     */
    private $odometerReading;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="is_the_vehicle_total_loss", type="boolean", nullable=true)
     */
    private $isTheVehicleTotalLoss;

    /**
     * @var string|null
     *
     * @ORM\Column(name="condition_of_vehicle", type="string", length=0, nullable=true)
     */
    private $conditionOfVehicle;

    /**
     * @var string|null
     *
     * @ORM\Column(name="place_of_survey", type="string", length=150, nullable=true)
     */
    private $placeOfSurvey;

    /**
     * @var string|null
     *
     * @ORM\Column(name="point_of_impact", type="text", length=65535, nullable=true)
     */
    private $pointOfImpact;

    /**
     * @var \Survey
     *
     * @ORM\ManyToOne(targetEntity="Survey")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="verification_id", referencedColumnName="id")
     * })
     */
    private $verification;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;

        return $this;
    }

    public function getOdometerReading(): ?int
    {
        return $this->odometerReading;
    }

    public function setOdometerReading(?int $odometerReading): static
    {
        $this->odometerReading = $odometerReading;

        return $this;
    }

    public function isTheVehicleTotalLoss(): ?bool
    {
        return $this->isTheVehicleTotalLoss;
    }

    public function setIsTheVehicleTotalLoss(?bool $isTheVehicleTotalLoss): static
    {
        $this->isTheVehicleTotalLoss = $isTheVehicleTotalLoss;

        return $this;
    }

    public function getConditionOfVehicle(): ?string
    {
        return $this->conditionOfVehicle;
    }

    public function setConditionOfVehicle(?string $conditionOfVehicle): static
    {
        $this->conditionOfVehicle = $conditionOfVehicle;

        return $this;
    }

    public function getPlaceOfSurvey(): ?string
    {
        return $this->placeOfSurvey;
    }

    public function setPlaceOfSurvey(?string $placeOfSurvey): static
    {
        $this->placeOfSurvey = $placeOfSurvey;

        return $this;
    }

    public function getPointOfImpact(): ?string
    {
        return $this->pointOfImpact;
    }

    public function setPointOfImpact(?string $pointOfImpact): static
    {
        $this->pointOfImpact = $pointOfImpact;

        return $this;
    }

    public function getVerification(): ?Survey
    {
        return $this->verification;
    }

    public function setVerification(?Survey $verification): static
    {
        $this->verification = $verification;

        return $this;
    }


}
