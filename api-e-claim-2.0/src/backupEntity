<?php

namespace App\Entity\Surveyor;

use Doctrine\ORM\Mapping as ORM;

/**
 * AdditionalLabourDetail
 *
 * @ORM\Table(name="additional_labour_detail", indexes={@ORM\Index(name="fk_additional_labour_detail_estimate_of_repair1_idx", columns={"estimate_of_repair_id"})})
 * @ORM\Entity
 */
class AdditionalLabourDetail
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
     * @var float
     *
     * @ORM\Column(name="painting_cost", type="float", precision=10, scale=0, nullable=false)
     */
    private $paintingCost;

    /**
     * @var float
     *
     * @ORM\Column(name="painting_materiels", type="float", precision=10, scale=0, nullable=false)
     */
    private $paintingMateriels;

    /**
     * @var float
     *
     * @ORM\Column(name="sundries", type="float", precision=10, scale=0, nullable=false)
     */
    private $sundries;

    /**
     * @var int
     *
     * @ORM\Column(name="num_of_repaire_days", type="integer", nullable=false)
     */
    private $numOfRepaireDays;

    /**
     * @var float
     *
     * @ORM\Column(name="discount_add_labour", type="float", precision=10, scale=0, nullable=false)
     */
    private $discountAddLabour;

    /**
     * @var string
     *
     * @ORM\Column(name="vat", type="string", length=0, nullable=false)
     */
    private $vat;

    /**
     * @var float|null
     *
     * @ORM\Column(name="add_labour_total", type="float", precision=10, scale=0, nullable=true)
     */
    private $addLabourTotal;

    /**
     * @var string|null
     *
     * @ORM\Column(name="eor_or_surveyor", type="string", length=0, nullable=true)
     */
    private $eorOrSurveyor;

    /**
     * @var \EstimateOfRepair
     *
     * @ORM\ManyToOne(targetEntity="EstimateOfRepair")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="estimate_of_repair_id", referencedColumnName="id")
     * })
     */
    private $estimateOfRepair;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPaintingCost(): ?float
    {
        return $this->paintingCost;
    }

    public function setPaintingCost(float $paintingCost): static
    {
        $this->paintingCost = $paintingCost;

        return $this;
    }

    public function getPaintingMateriels(): ?float
    {
        return $this->paintingMateriels;
    }

    public function setPaintingMateriels(float $paintingMateriels): static
    {
        $this->paintingMateriels = $paintingMateriels;

        return $this;
    }

    public function getSundries(): ?float
    {
        return $this->sundries;
    }

    public function setSundries(float $sundries): static
    {
        $this->sundries = $sundries;

        return $this;
    }

    public function getNumOfRepaireDays(): ?int
    {
        return $this->numOfRepaireDays;
    }

    public function setNumOfRepaireDays(int $numOfRepaireDays): static
    {
        $this->numOfRepaireDays = $numOfRepaireDays;

        return $this;
    }

    public function getDiscountAddLabour(): ?float
    {
        return $this->discountAddLabour;
    }

    public function setDiscountAddLabour(float $discountAddLabour): static
    {
        $this->discountAddLabour = $discountAddLabour;

        return $this;
    }

    public function getVat(): ?string
    {
        return $this->vat;
    }

    public function setVat(string $vat): static
    {
        $this->vat = $vat;

        return $this;
    }

    public function getAddLabourTotal(): ?float
    {
        return $this->addLabourTotal;
    }

    public function setAddLabourTotal(?float $addLabourTotal): static
    {
        $this->addLabourTotal = $addLabourTotal;

        return $this;
    }

    public function getEorOrSurveyor(): ?string
    {
        return $this->eorOrSurveyor;
    }

    public function setEorOrSurveyor(?string $eorOrSurveyor): static
    {
        $this->eorOrSurveyor = $eorOrSurveyor;

        return $this;
    }

    public function getEstimateOfRepair(): ?EstimateOfRepair
    {
        return $this->estimateOfRepair;
    }

    public function setEstimateOfRepair(?EstimateOfRepair $estimateOfRepair): static
    {
        $this->estimateOfRepair = $estimateOfRepair;

        return $this;
    }


}
