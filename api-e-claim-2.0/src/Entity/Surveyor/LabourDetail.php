<?php

namespace App\Entity\Surveyor;

use Doctrine\ORM\Mapping as ORM;

/**
 * LabourDetail
 *
 * @ORM\Table(name="labour_detail", indexes={@ORM\Index(name="fk_labour_detail_part_detail1_idx", columns={"part_detail_id"})})
 * @ORM\Entity
 */
class LabourDetail
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
     * @ORM\Column(name="eor_or_surveyor", type="string", length=0, nullable=false)
     */
    private $eorOrSurveyor;

    /**
     * @var string
     *
     * @ORM\Column(name="activity", type="string", length=45, nullable=false)
     */
    private $activity;

    /**
     * @var int
     *
     * @ORM\Column(name="number_of_hours", type="integer", nullable=false)
     */
    private $numberOfHours;

    /**
     * @var float
     *
     * @ORM\Column(name="hourly_const_labour", type="float", precision=10, scale=0, nullable=false)
     */
    private $hourlyConstLabour;

    /**
     * @var float
     *
     * @ORM\Column(name="discount_labour", type="float", precision=10, scale=0, nullable=false)
     */
    private $discountLabour;

    /**
     * @var string
     *
     * @ORM\Column(name="vat_labour", type="string", length=0, nullable=false)
     */
    private $vatLabour;

    /**
     * @var float|null
     *
     * @ORM\Column(name="labour_total", type="float", precision=10, scale=0, nullable=true)
     */
    private $labourTotal;

    /**
     * @var \PartDetail
     *
     * @ORM\ManyToOne(targetEntity="PartDetail")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="part_detail_id", referencedColumnName="id")
     * })
     */
    private $partDetail;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEorOrSurveyor(): ?string
    {
        return $this->eorOrSurveyor;
    }

    public function setEorOrSurveyor(string $eorOrSurveyor): static
    {
        $this->eorOrSurveyor = $eorOrSurveyor;

        return $this;
    }

    public function getActivity(): ?string
    {
        return $this->activity;
    }

    public function setActivity(string $activity): static
    {
        $this->activity = $activity;

        return $this;
    }

    public function getNumberOfHours(): ?int
    {
        return $this->numberOfHours;
    }

    public function setNumberOfHours(int $numberOfHours): static
    {
        $this->numberOfHours = $numberOfHours;

        return $this;
    }

    public function getHourlyConstLabour(): ?float
    {
        return $this->hourlyConstLabour;
    }

    public function setHourlyConstLabour(float $hourlyConstLabour): static
    {
        $this->hourlyConstLabour = $hourlyConstLabour;

        return $this;
    }

    public function getDiscountLabour(): ?float
    {
        return $this->discountLabour;
    }

    public function setDiscountLabour(float $discountLabour): static
    {
        $this->discountLabour = $discountLabour;

        return $this;
    }

    public function getVatLabour(): ?string
    {
        return $this->vatLabour;
    }

    public function setVatLabour(string $vatLabour): static
    {
        $this->vatLabour = $vatLabour;

        return $this;
    }

    public function getLabourTotal(): ?float
    {
        return $this->labourTotal;
    }

    public function setLabourTotal(?float $labourTotal): static
    {
        $this->labourTotal = $labourTotal;

        return $this;
    }

    public function getPartDetail(): ?PartDetail
    {
        return $this->partDetail;
    }

    public function setPartDetail(?PartDetail $partDetail): static
    {
        $this->partDetail = $partDetail;

        return $this;
    }


}
