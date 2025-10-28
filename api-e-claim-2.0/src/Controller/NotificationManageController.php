<?php

namespace App\Controller;

use App\Entity\ClaimUser\Claims;
use App\Repository\ClaimRepository;
use App\Service\ClaimUserDbService;
use App\Service\EmailValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class NotificationManageController extends AbstractController
{
    public function __construct(
        private ClaimUserDbService $claimUserDbService,
        private EntityManagerInterface $em,
        private ClaimRepository $claimRepository,
        private EmailValidatorService $emailValidator
    ) {}

    /**
     * Liste claim d'un utilisateur
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function __invoke(Request $request): JsonResponse
    {
        $params = $request->query->all();

        // Liste des claims par utilisateurs
        if (!empty($params['id'])) {
              try {
                $results = $this->claimUserDbService->callCountNotifications([
                    'p_user_id' => $params['id']
                ]);
                // return new JsonResponse($results);
                return new JsonResponse([
                    'status'    => 'success',
                    'code'      => JsonResponse::HTTP_OK,
                    'message'   => 'Successful count notifications.',
                    'data'      => $results
                ], JsonResponse::HTTP_OK);
    
            } catch (\Exception $e) {
                return new JsonResponse(
                    [
                        'status' =>  'error',
                        'code'  => JsonResponse::HTTP_INTERNAL_SERVER_ERROR,
                        'message' => $e->getMessage()
                    ],
                    JsonResponse::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        } else {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'User id parameters are required'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

    }

    /**
     * Cards statistique
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllNotifications(Request $request): JsonResponse
    {
        $params = $request->query->all();
        $idUser  = $params['id'] ?? '';

        if (empty($idUser)) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Id parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $cardsStats = $this->claimUserDbService->callGetListNotificationsById([
                'p_user_id'      => $idUser
            ]);
            
            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Cards stats claims.',
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
}