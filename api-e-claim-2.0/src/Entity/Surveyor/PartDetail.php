<?php

namespace App\Entity\Surveyor;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\DeletedActionController;
use Doctrine\ORM\Mapping as ORM;

/**
 * PartDetail
 *
 * @ORM\Table(name="part_detail", indexes={@ORM\Index(name="fk_part_detail_estimate_of_repair1_idx", columns={"estimate_of_repair_id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Suppression 
        new Patch(
            uriTemplate: '/api/delete-part',
            controller: DeletedActionController::class . '::detelePart',
            parameters: [ 
                'partId' => new QueryParameter(),
            ]
        ),
    ]
)]
class PartDetail
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
     * @ORM\Column(name="part_name", type="string", length=150, nullable=false)
     */
    private $partName;

    /**
     * @var int
     *
     * @ORM\Column(name="quantity", type="integer", nullable=false)
     */
    private $quantity;

    /**
     * @var string
     *
     * @ORM\Column(name="supplier", type="string", length=255, nullable=false)
     */
    private $supplier;

    /**
     * @var string
     *
     * @ORM\Column(name="quality", type="string", length=45, nullable=false)
     */
    private $quality;

    /**
     * @var float
     *
     * @ORM\Column(name="cost_part", type="float", precision=10, scale=0, nullable=false)
     */
    private $costPart;

    /**
     * @var float
     *
     * @ORM\Column(name="discount_part", type="float", precision=10, scale=0, nullable=false)
     */
    private $discountPart;

    /**
     * @var string
     *
     * @ORM\Column(name="vat_part", type="string", length=0, nullable=false)
     */
    private $vatPart;

    /**
     * @var float|null
     *
     * @ORM\Column(name="part_total", type="float", precision=10, scale=0, nullable=true)
     */
    private $partTotal;

    /**
     * @var \EstimateOfRepair
     *
     * @ORM\ManyToOne(targetEntity="EstimateOfRepair")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="estimate_of_repair_id", referencedColumnName="id")
     * })
     */
    private $estimateOfRepair;

     /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="deleted_at", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $deletedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPartName(): ?string
    {
        return $this->partName;
    }

    public function setPartName(string $partName): static
    {
        $this->partName = $partName;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getSupplier(): ?string
    {
        return $this->supplier;
    }

    public function setSupplier(string $supplier): static
    {
        $this->supplier = $supplier;

        return $this;
    }

    public function getQuality(): ?string
    {
        return $this->quality;
    }

    public function setQuality(string $quality): static
    {
        $this->quality = $quality;

        return $this;
    }

    public function getCostPart(): ?float
    {
        return $this->costPart;
    }

    public function setCostPart(float $costPart): static
    {
        $this->costPart = $costPart;

        return $this;
    }

    public function getDiscountPart(): ?float
    {
        return $this->discountPart;
    }

    public function setDiscountPart(float $discountPart): static
    {
        $this->discountPart = $discountPart;

        return $this;
    }

    public function getVatPart(): ?string
    {
        return $this->vatPart;
    }

    public function setVatPart(string $vatPart): static
    {
        $this->vatPart = $vatPart;

        return $this;
    }

    public function getPartTotal(): ?float
    {
        return $this->partTotal;
    }

    public function setPartTotal(?float $partTotal): static
    {
        $this->partTotal = $partTotal;

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

    public function getDeletedAt(): ?\DateTime
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTime $deletedAt): static
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

}
