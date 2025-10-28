<?php

namespace App\Entity\Surveyor;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\DeletedActionController;
use Doctrine\ORM\Mapping as ORM;

/**
 * PictureOfDamageCar
 *
 * @ORM\Table(name="picture_of_damage_car", indexes={@ORM\Index(name="fk_picture_of_domage_car_survey_information1_idx", columns={"survey_information_id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Suppression une image de dommage
        new Patch(
            uriTemplate: '/api/delete-image-of-damage',
            controller: DeletedActionController::class . '::deteleImageOfDamage',
            parameters: [ 
                'imageOfDamageId' => new QueryParameter(),
            ]
        ),
    ]
)]
class PictureOfDamageCar
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
     * @ORM\Column(name="path", type="string", length=255, nullable=false)
     */
    private $path;

    /**
     * @var \SurveyInformation
     *
     * @ORM\ManyToOne(targetEntity="SurveyInformation")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="survey_information_id", referencedColumnName="id")
     * })
     */
    private $surveyInformation;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="deleted_at", type="datetime", nullable=true, options={"default"="NULL"})
     */
    private $deletedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    public function getSurveyInformation(): ?SurveyInformation
    {
        return $this->surveyInformation;
    }

    public function setSurveyInformation(?SurveyInformation $surveyInformation): static
    {
        $this->surveyInformation = $surveyInformation;

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
