<?php

namespace App\Controller;

use App\Entity\ClaimUser\Claims;
use App\Repository\ClaimRepository;
use App\Service\ClaimUserDbService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class GetRolesController extends AbstractController
{
    public function __construct(
        private ClaimUserDbService $claimUserDbService,
        private EntityManagerInterface $em,
        private ClaimRepository $claimRepository
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $params = $request->query->all();

        try {
            $claims = $this->claimUserDbService->callAllRoles([
                'page' => (int)($params['page'] ?? 1),
                'page_size' => (int)($params['page_size'] ?? 10),
            ]);
            
            return new JsonResponse([
                'status' => 'success',
                'data' => $claims
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [   'error' => $e->getMessage(), 'message' => 'Roles retrieval failed.'],
                    JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}