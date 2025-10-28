<?php

namespace App\Controller;

use App\Entity\ClaimUser\AccountInformations;
use App\Service\ClaimUserDbService;
use App\Service\EmailValidatorService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraints\Json;

#[AsController]
class UpdateUserSecurityController extends AbstractController
{
    public function __construct(
        private ClaimUserDbService $claimUserDbService,
        private UserPasswordHasherInterface $passwordHashe
    ) {}

    public function __invoke(Request $request, EmailValidatorService $emailValidator): JsonResponse
    {
        $resFormat = [];

        // $params = $request->query->all();
        $params = (array)json_decode($request->getContent(), true);
        $email  = $params['email'];

        if (empty($email) || !$emailValidator->isValid($email)) {
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
            $hashedPassword = '';

            if (!empty($params['newPassword'])) {
                $plainPassword = $params['newPassword'];
    
                // Validation simple (à remplacer par validator si besoin)
                if (strlen($plainPassword) < 8 || !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/', $plainPassword)) {
                    return new JsonResponse(
                        [
                            'status'    => 'error',
                            'code'      => JsonResponse::HTTP_BAD_REQUEST,
                            'message'   => 'Your password should: Have at least 1 uppercase letter, Have at least 1 number, Have at least 1 special character, Have minimum character.'
                        ],
                        JsonResponse::HTTP_BAD_REQUEST
                    );
                }

                // Crée un user temporaire (obligatoire pour le hashPassword)
                $user = new AccountInformations();
                $user->setPlainPassword($plainPassword);

                // Hashe le mot de passe
                $hashedPassword = $this->passwordHashe->hashPassword($user, $plainPassword) ;
            }

            $this->claimUserDbService->callUpdateUserSecurity([
                'p_email_address'       => $email,
                'p_new_password'        => $hashedPassword,
                'p_new_backup_email'    => $params['newBackupEmail'] ?? null,
            ]);
            
            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful security update'
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