<?php

namespace App\Controller;

use App\Entity\ClaimUser\CommunicationMethods;
use App\Service\ClaimUserDbService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class GetCommunicationMethodsController extends AbstractController
{
    
    public function __construct(private ClaimUserDbService $claimUserDbService) {}

    /**
     * Get user profile information by email address.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $results = $this->claimUserDbService->callGetMethodCommunication();

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful communication methods',
                'data'      => $results
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}