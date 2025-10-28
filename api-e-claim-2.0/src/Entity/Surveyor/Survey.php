<?php

namespace App\Entity\Surveyor;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\QueryParameter;
use App\Controller\GetClaimDetailsController;
use Doctrine\ORM\Mapping as ORM;

/**
 * Survey
 *
 * @ORM\Table(name="survey", indexes={@ORM\Index(name="fk_survey_status1_idx", columns={"status_id"})})
 * @ORM\Entity
 */
#[ApiResource(
    operations: [
        // Surveyor report
        new Post(
            uriTemplate: '/api/claim/report',
            controller: GetClaimDetailsController::class . '::surveyorReport',
            parameters: [ 
                'claimNo'     => new QueryParameter(),
                'surveyorId'  => new QueryParameter(),
                'status'      => new QueryParameter(),
                'currentStep' => new QueryParameter(),
                // 'imageFile'   => new QueryParameter(),
            ]
        ),
        // Résumé verification
        new Get(
            uriTemplate: '/api/report-summary',
            controller: GetClaimDetailsController::class . '::reportSummary',
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email'     => new QueryParameter()
            ]
        ),
         // export verification
        new Get(
            uriTemplate: '/api/claim/report/download',
            controller: GetClaimDetailsController::class . '::reportSummaryExportPdf',
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email'     => new QueryParameter()
                // 'typeExport'    => new QueryParameter()
            ]
        ), 
        new Post(
            uriTemplate: '/api/claim/report/send-mail',
            controller: GetClaimDetailsController::class . '::reportSummarySendMail',
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email'     => new QueryParameter()
            ]
        ),    
          new Post(
            uriTemplate: '/api/claim/report/total',
            controller: GetClaimDetailsController::class . '::getReportTotalPartOrLabour',
            parameters: [ 
                'claimNo'   => new QueryParameter(),
                'email'     => new QueryParameter(),
                'section'   => new QueryParameter()
            ]
        )    
    ]
)]
class Survey
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
     * @var int
     *
     * @ORM\Column(name="surveyor_id", type="integer", nullable=false)
     */
    private $surveyorId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="current_step", type="string", length=45, nullable=true)
     */
    private $currentStep;

    /**
     * @var int|null
     *
     * @ORM\Column(name="status_id", type="integer", nullable=true)
     */
    private $statusId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="claim_number", type="string", length=100, nullable=true)
     */
    private $claimNumber;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSurveyorId(): ?int
    {
        return $this->surveyorId;
    }

    public function setSurveyorId(int $surveyorId): static
    {
        $this->surveyorId = $surveyorId;

        return $this;
    }

    public function getCurrentStep(): ?string
    {
        return $this->currentStep;
    }

    public function setCurrentStep(?string $currentStep): static
    {
        $this->currentStep = $currentStep;

        return $this;
    }

    public function getStatusId(): ?int
    {
        return $this->statusId;
    }

    public function setStatusId(?int $statusId): static
    {
        $this->statusId = $statusId;

        return $this;
    }

    public function getClaimNumber(): ?string
    {
        return $this->claimNumber;
    }

    public function setClaimNumber(?string $claimNumber): static
    {
        $this->claimNumber = $claimNumber;

        return $this;
    }


}
