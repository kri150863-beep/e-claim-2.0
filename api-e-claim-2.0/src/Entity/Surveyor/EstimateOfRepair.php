<?php

namespace App\Entity\Surveyor;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * EstimateOfRepair
 *
 * @ORM\Table(name="estimate_of_repair", indexes={@ORM\Index(name="fk_estimate_of_repair_verification1_idx", columns={"verification_id"})})
 * @ORM\Entity
 */
class EstimateOfRepair
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
     * @ORM\Column(name="current_editor", type="string", length=0, nullable=true)
     */
    private $currentEditor;

    /**
     * @var string|null
     *
     * @ORM\Column(name="remarks", type="text", length=65535, nullable=true)
     */
    private $remarks;

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

    public function getCurrentEditor(): ?string
    {
        return $this->currentEditor;
    }

    public function setCurrentEditor(?string $currentEditor): static
    {
        $this->currentEditor = $currentEditor;

        return $this;
    }

    public function getRemarks(): ?string
    {
        return $this->remarks;
    }

    public function setRemarks(?string $remarks): static
    {
        $this->remarks = $remarks;

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
