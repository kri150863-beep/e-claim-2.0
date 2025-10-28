<?php

namespace App\Controller;

use App\Service\ClaimUserDbService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class UpdateUserWebsiteController extends AbstractController
{
    public function __construct(private ClaimUserDbService $claimUserDbService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $resFormat = [];

        // $params = $request->query->all();
        $params = (array)json_decode($request->getContent(), true);

        if (empty($params['email']) && empty($params['newWebsite'])) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'email and newWebsite  parameters are required'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $results = $this->claimUserDbService->callUpdateUserWebsite([
                'p_email_address'   => $params['email'],
                'p_new_website'     => $params['newWebsite']
            ]);
            
            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful website update'
                // 'data'      => $results
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
}