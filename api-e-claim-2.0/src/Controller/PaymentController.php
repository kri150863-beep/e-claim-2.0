<?php

namespace App\Controller;

use App\Entity\ClaimUser\Payment;
use App\Service\ClaimUserDbService;
use App\Service\EmailValidatorService;
use App\Service\PayementService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class PaymentController extends AbstractController
{
    public function __construct(
        private ClaimUserDbService $claimUserDbService,
        private EntityManagerInterface $em,
        private EmailValidatorService $emailValidator,
        private PayementService $payementService
    ) {}

    /**
     * Liste des paiements utilisateurs
     * 
     * @param $request
     */
    public function __invoke(Request $request): JsonResponse
    {
        $params = $request->query->all();

        try {
            $payments = $this->claimUserDbService->callGetPaiementListByUser([
                'p_email'           => $params['email'],
                'p_status'          => $params['status'] ?? null,
                'p_invoice_no'      => $params['invoiceNo'] ?? null,
                'p_claim_number'    => $params['claimNo'] ?? null,
                'p_sort_by'         => $params['sortBy'] ?? 'received_date-asc',
                'p_page'            => (int)($params['page'] ?? 1),
                'p_page_size'       => (int)($params['pageSize'] ?? 10)
            ]);
            
            return new JsonResponse([
                'status' => 'success',
                'code'  => JsonResponse::HTTP_OK,
                'message' => 'Successful payment list.',
                'data' => $payments
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [   'error' => $e->getMessage(), 'message' => 'Roles retrieval failed.'],
                    JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Cards statistique
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getCardStatsPaiment(Request $request): JsonResponse
    {
        $params = $request->query->all();
        $email  = $params['email'] ?? null;

        if (empty($email) || !$this->emailValidator->isValid($email)) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $cardsStats = $this->claimUserDbService->callGetUserPaiementStats([
                'p_email'   => $email
            ]);
            
            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Cards stats payment.',
                'data'      => $cardsStats
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => $e->getMessage()
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }

    }

    /**
     * Export paiement filtrer pas date
     * 
     * @param $request
     */
    public function paymentExport(Request $request)
    {
        $params = $request->query->all();

        // les champs date début, date fin et format sont obligatoire
        $requiredFields = ['email', 'startDate', 'endDate', 'format'];
        
        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                return new JsonResponse(
                    [
                        'status'    => 'error',
                        'code'      => JsonResponse::HTTP_BAD_REQUEST,
                        'message'   => "'{$field}' parameters is required"
                    ],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
        }

        try {
            $payments = $this->claimUserDbService->callGetPaiementListByUser([
                'p_email'       => $params['email'],
                'p_start_date'  => $params['startDate'] ?? null,
                'p_end_date'    => $params['endDate'] ?? null
            ]);
            
            if ($params['format'] == 'pdf') {
                return $this->payementService->generatePdf($payments);
            }

            if ($params['format'] == 'xlsx') {
                return $this->payementService->generateExcel($payments);
            }

            if ($params['format'] === 'csv') {
                return $this->payementService->generateCsv($payments);
            }


            throw new \Exception('Type d\'export pas renseigné');

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => $e->getMessage()
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Détail d'un payement
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getDetailPaiement(Request $request): JsonResponse
    {
        $params = $request->query->all();
        // $email  = $params['email'] ?? null;

        
        if (empty($params['email']) || empty($params['invoiceNo'])) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email or invoiceNo parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $payementInvoice = $this->claimUserDbService->callGetPaymentDetailsByInvoice([
                'p_email'       => $params['email'],
                'p_invoice_no'  => $params['invoiceNo']
            ]);
            
            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Cards stats payment.',
                'data'      => $payementInvoice
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => $e->getMessage()
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }

    }

    /**
     * Téléchargement de la facture d'un paiement
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function downloadInvoice(Request $request)
    {
        $params = $request->query->all();
        
        if (empty($params['email']) || empty($params['invoiceNo'])) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email or invoiceNo parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $payementInvoice = $this->claimUserDbService->callGetPaymentDetailsByInvoice([
                'p_email'       => $params['email'],
                'p_invoice_no'  => $params['invoiceNo']
            ]);
            
            return $this->payementService->generatePdfDetailsInvoice($payementInvoice);

            throw new \Exception('Type d\'export pas renseigné');

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => $e->getMessage()
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }

    }
}