<?php

namespace App\Controller;

use App\Entity\Surveyor\PartDetail;
use App\Service\DeletedService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class DeletedActionController extends AbstractController
{
    public function __construct(
        private DeletedService $deletedService
    ) {}

    /**
     * Suppression d'une pièce
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function detelePart(Request $request): JsonResponse
    {
        $params = (array)json_decode($request->getContent(), true);

        if (empty($params['partId'])) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'partId parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

         try {
            
            $this->deletedService->callDeletePartById([
                'p_part_id'    => $params['partId']
            ]);

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful deleted part.',
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => 'Claim retrieval failed.'
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Suppression d'une image de dommage
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function deteleImageOfDamage(Request $request): JsonResponse
    {   
        $params = (array)json_decode($request->getContent(), true);

        if (empty($params['imageOfDamageId'])) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'imageOfDamageId parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $this->deletedService->callDeleteImageOfDomage([
                'p_image_id' => $params['imageOfDamageId']
            ]);

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful deleted image of dommage.',
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                    'message'   => 'Claim retrieval failed.'
                ],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}