<?php

namespace App\Entity\Surveyor;

use Doctrine\DBAL\Types\Types;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * SurveyInformation
 *
 * @ORM\Table(name="survey_information", indexes={@ORM\Index(name="fk_survey_information_verification1_idx", columns={"verification_id"})})
 * @ORM\Entity
 */
class SurveyInformation
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

    /**
     * @var string
     *
     * @ORM\Column(name="invoice_number", type="string", length=45, nullable=false)
     */
    private $invoiceNumber;

    /**
     * @var string
     *
     * @ORM\Column(name="survey_type", type="string", length=45, nullable=false)
     */
    private $surveyType;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_of_survey", type="date", nullable=false)
     */
    private $dateOfSurvey;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time_of_survey", type="time", nullable=false)
     */
    private $timeOfSurvey;

    /**
     * @var float
     *
     * @ORM\Column(name="pre_accident_valeur", type="float", precision=10, scale=0, nullable=false)
     */
    private $preAccidentValeur;

    /**
     * @var float
     *
     * @ORM\Column(name="showroom_price", type="float", precision=10, scale=0, nullable=false)
     */
    private $showroomPrice;

    /**
     * @var float
     *
     * @ORM\Column(name="wrech_value", type="float", precision=10, scale=0, nullable=false)
     */
    private $wrechValue;

    /**
     * @var float
     *
     * @ORM\Column(name="excess_applicable", type="float", precision=10, scale=0, nullable=false)
     */
    private $excessApplicable;

    /**
     * @var \Survey
     *
     * @ORM\ManyToOne(targetEntity="Survey")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="verification_id", referencedColumnName="id")
     * })
     */
    private $verification;

    private ?UploadedFile $imageFile = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getInvoiceNumber(): ?string
    {
        return $this->invoiceNumber;
    }

    public function setInvoiceNumber(string $invoiceNumber): static
    {
        $this->invoiceNumber = $invoiceNumber;

        return $this;
    }

    public function getSurveyType(): ?string
    {
        return $this->surveyType;
    }

    public function setSurveyType(string $surveyType): static
    {
        $this->surveyType = $surveyType;

        return $this;
    }

    public function getDateOfSurvey(): ?\DateTime
    {
        return $this->dateOfSurvey;
    }

    public function setDateOfSurvey(\DateTime $dateOfSurvey): static
    {
        $this->dateOfSurvey = $dateOfSurvey;

        return $this;
    }

    public function getTimeOfSurvey(): ?\DateTime
    {
        return $this->timeOfSurvey;
    }

    public function setTimeOfSurvey(\DateTime $timeOfSurvey): static
    {
        $this->timeOfSurvey = $timeOfSurvey;

        return $this;
    }

    public function getPreAccidentValeur(): ?float
    {
        return $this->preAccidentValeur;
    }

    public function setPreAccidentValeur(float $preAccidentValeur): static
    {
        $this->preAccidentValeur = $preAccidentValeur;

        return $this;
    }

    public function getShowroomPrice(): ?float
    {
        return $this->showroomPrice;
    }

    public function setShowroomPrice(float $showroomPrice): static
    {
        $this->showroomPrice = $showroomPrice;

        return $this;
    }

    public function getWrechValue(): ?float
    {
        return $this->wrechValue;
    }

    public function setWrechValue(float $wrechValue): static
    {
        $this->wrechValue = $wrechValue;

        return $this;
    }

    public function getExcessApplicable(): ?float
    {
        return $this->excessApplicable;
    }

    public function setExcessApplicable(float $excessApplicable): static
    {
        $this->excessApplicable = $excessApplicable;

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

    /**
     * @Assert\File(maxSize="5M")
     * @Groups({"survey:write"})
     */
    public function getImageFile(): ?UploadedFile
    {
        return $this->imageFile;
    }

    public function setImageFile(?UploadedFile $file): static
    {
        $this->imageFile = $file;
        return $this;
    }


}
