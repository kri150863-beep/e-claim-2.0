<?php

namespace App\Controller;

use App\Entity\ClaimUser\AccountInformations;
use App\Service\ClaimUserDbService;
use App\Service\EmailService;
use App\Service\EmailValidatorService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

#[AsController]
class GetUserProfileController extends AbstractController
{
    
    public function __construct(
        private ClaimUserDbService $claimUserDbService,
        private EmailService $emailService,
        private UserPasswordHasherInterface $passwordHashe,
        private JWTTokenManagerInterface $jwtManager,
        private JWTEncoderInterface $jwtDecoder,
        private EmailValidatorService $emailValidator
    ) {}

    /**
     * Get user profile information by email address.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function __invoke(Request $request): JsonResponse
    {
        $formatResult   = [];
        $params         = $request->query->all();

        if (empty($params['email'])) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email parameter is required.',
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $data = $this->claimUserDbService->callForgotPassword([
                'p_email_address' => $params['email']
            ]);

            // Email n'existe pas
            if (empty($data) || empty($data[0]['email_address'])) {
                return new JsonResponse(
                    [
                        'status'    => 'error',
                        'code'       => JsonResponse::HTTP_NOT_FOUND,
                        'message'   => 'Email not found.'
                    ], JsonResponse::HTTP_NOT_FOUND);
            }

            $results = $this->claimUserDbService->callGetUserProfile([
                'p_email_address' => $params['email']
            ]);

            foreach ($results as $res) {
                $formatResult = [
                    'account_information'  => [
                        'business_name'                 => $res['business_name'],
                        'business_registration_number'  => $res['business_registration_number'],
                        'business_address'              => $res['business_address'],
                        'city'                          => $res['city'],
                        'postal_code'                   => $res['postal_code'],
                        'phone_number'                  => $res['phone_number'],
                        'email_address'                 => $res['email_address'],
                        'website'                       => $res['website']
                    ],
                    'financial_information' => [
                        'vat_number'                    => $res['vat_number'],
                        'tax_identification_number'     => $res['tax_identification_number'],
                        'bank_name'                     => $res['bank_name'],
                        'bank_account_number'           => $res['bank_account_number'],
                        'swift_code'                    => $res['swift_code']
                    ],
                    'administrative_settings' => [
                        'primary_contact_name'      => $res['primary_contact_name'],
                        'primary_contact_post'      => $res['primary_contact_post'],
                        'notification'              => $res['notification'],
                        'communication_methods'     => $res['communication_methods']
                    ],
                    'security_settings' => [
                        'password'      => $res['password'],
                        'backup_email'  => $res['backup_email']
                    ],
                ];
            }

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful user information.',
                'data'      => $formatResult
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
     * Utilisateur par role
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserByRole(Request $request) : JsonResponse {
        $params   = $request->query->all();

        if (empty($params['role_id'])) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Role parameter is required.',
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
            $results = $this->claimUserDbService->callGetUserByRole([
                'role_id' => $params['role_id']
            ]);

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => '',
                'data'      => $results
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
     * Mise à jour du site web de l'utilisateur
     * 
     *  @param Request $request
     *  @return JsonResponse
     */
    public function updateAdminSetting(Request $request) : JsonResponse {
        // $params = $request->query->all();
        $params = (array)json_decode($request->getContent(), true);

        if (empty($params['email'])) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email parameter is required.',
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        try {
                $results = $this->claimUserDbService->callUpdateAdminSetting([
                    'p_email_address'         => $params['email'],
                    'p_primary_contact_name'  => $params['primaryContactName'],
                    'p_primary_contact_post'  => $params['primaryContactPost'],
                    'p_notification'          => $params['notification'],
                    'p_method_names'          => $params['methodNames'],
                ]);

                return new JsonResponse([
                    'status'    => 'success',
                    'code'      => JsonResponse::HTTP_OK,
                    'message'   => 'Successful Administrative settings modification.',
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

    /**
     * Mise à jour du password de l'utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateUserPassword(Request $request) : JsonResponse {
        // $params = $request->query->all();
        $params = (array)json_decode($request->getContent(), true);

        if (empty($params['email'])) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email parameter is required'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

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
        $hashedPassword = $this->passwordHashe->hashPassword($user, $plainPassword);

        try {
            $results = $this->claimUserDbService->callUpdateUserPassword([
                'p_email_address' => $params['email'],
                'p_new_password'  => $hashedPassword
            ]);

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Successful password change.',
                'data'      => $results
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
     * Test existance mail pour la réinitialisation du mot de passe oublié
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forgotPassword(Request $request) : JsonResponse {
        $params = (array)json_decode($request->getContent(), true);
        $email = $params['email'] ?? null;
        
        if (empty($email)) {
            return new JsonResponse(
                [
                    'status'    => 'error',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Email parameter is required'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
        
        try {
            $data = $this->claimUserDbService->callForgotPassword([
                'p_email_address' => $email
            ]);

            // Email n'existe pas
            if (empty($data) || empty($data[0]['email_address'])) {
                return new JsonResponse(
                    [
                        'status'    => 'error',
                        'code'       => JsonResponse::HTTP_NOT_FOUND,
                        'message'   => 'Email not found.'
                    ], JsonResponse::HTTP_NOT_FOUND);
            }
            
            // Génére le token  avec expiration 72 heure
            $expiration = (new \DateTime('+5 minutes'))->getTimestamp();

            $payload = [
                'email' => $email,
                'exp' => $expiration,
            ];

            $secret = '7a9ffaf424858910c32400b722263573';

            $data = base64_encode(json_encode($payload));
            $signature = hash_hmac('sha256', $data, $secret);

            $token = $data . '.' . $signature;

            $url = $request->headers->get('Origin');

            $resetLink = sprintf('%s/auth/reset-password?email=%s&token=%s', $url, $email, $token);

            // Envoyer email de réinitialisation de mot de passe
            $this->emailService->sendResetPasswordEmail($email, $resetLink);
            

            return new JsonResponse([
                'status'    => 'success',
                'code'      => JsonResponse::HTTP_OK,
                'message'   => 'Reset email sent.'
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
     * Authentification de l'utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function authentification(Request $request) : JsonResponse {
        $params = (array)json_decode($request->getContent(), true);
        
        if (empty($params['p_email_address']) && empty($params['p_password'])) {
            return new JsonResponse(
                ['error' => 'p_email_address et p_password parameter is required'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
        
        try {
            $results = $this->claimUserDbService->callAuthentification([
                'p_email_address'   => $params['p_email_address'],
                'p_password'        => $params['p_password'],
            ]);

            return new JsonResponse([
                'status'    => 'success',
                'data'      => $results
            ], JsonResponse::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Verifier expiratoin token avant reset password
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyResetPassword(Request $request) : JsonResponse {
        
        $query = (array)json_decode($request->getContent(), true);

        $token =  $query['token'];

        if (!$token) {
            return new JsonResponse(
            [
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'error' => 'Missing token.'
            ],  JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!str_contains($token, '.')) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'message' => 'Invalid token format.'

            ],  JsonResponse::HTTP_BAD_REQUEST);
        }

        // Séparer le token en deux parties
        [$encodedData, $signature] = explode('.', $token);

        // Décoder le payload
        $payload = json_decode(base64_decode($encodedData), true);

        if (!$payload) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'message' => 'Payload invalide.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  403,
                'error' => 'Expired token.'
            ], 403);
        }

        try {
            // Vérification expiration manuelle (facultatif, déjà gérée en interne)
            if (isset($payload['exp']) && time() > $payload['exp']) {
                return new JsonResponse([
                     'status'   => 'error',
                    'code'      =>  403,
                    'message'   => 'Expired token.'
                ], 403);
            }

            return new JsonResponse([
                'status'    => 'success', 
                'code'      => 200,
                'message'   => '',
                'token'     => $token
            ]);

        } catch (JWTDecodeFailureException $e) {
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
     * Envoyer lien first login
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function inserUser(Request $request) : JsonResponse {
        $params         = (array)json_decode($request->getContent(), true);
        $email          = $params['accountInformation']['emailAddress'];
        $plainPassword  = $params['accountInformation']['password'];

        if (empty($email) || !$this->emailValidator->isValid($email)) {
            return new JsonResponse(
                [
                    'status'    => 'erreur',
                    'code'      => JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'emailAddress parameters are required or invalide'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
           
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
        
        try {
            $results = $this->claimUserDbService->callInsertFullUserFromJSON([
                'p_json_data'   => json_encode($params)
            ]);
            
            if ($results && isset($results[0]['user_id'])) {
                $userId = $results[0]['user_id'];
            } else {
                return new JsonResponse([
                    'status'    => 'success',
                    'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                    'message'   => 'Errer Insertion.'
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Génére le token  avec expiration 72 heure
            // $expiration = (new \DateTime('+72 hours'))->getTimestamp();
            $expiration = (new \DateTime('+72 hours'))->getTimestamp();

            $payload = [
                'user_id'   => $userId,
                'email'     => $email,
                'exp'       => $expiration,
            ];

            $secret = '7a9ffaf424858910c32400b722263573';

            $data = base64_encode(json_encode($payload));
            $signature = hash_hmac('sha256', $data, $secret);

            $token = $data . '.' . $signature;

            $url = "http://localhost:4200";

            $resetLink = sprintf('%s/auth/first-login?email=%s&token=%s', $url, urlencode($email), $token);

            // Envoie mail first login 
            $this->emailService->sendFirstLogin($email, $resetLink, $plainPassword);

            return new JsonResponse([
                'status'    => 'success',
                'code'      =>  JsonResponse::HTTP_OK,
                'message'   => 'Insertion successful, a link to the first login is sent.'
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
     * Envoyer un lien pour un first login
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sendInvite(Request $request) : JsonResponse {
        $params = (array)json_decode($request->getContent(), true);
        $email  = $params['email'];

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
        
        // Générer un mdp aléatoire
        // $plainPassword = bin2hex(random_bytes(5));
        $plainPassword = $this->generateSecurePassword();

        
        // Hasher le mot de passe
        $hashedPassword = $this->passwordHashe->hashPassword(
            new AccountInformations(),
            $plainPassword
        );

        // JE VAIS MODIFIER LE MDP DANS LA BASE POUR SIMULER LE FIRST LOGIN
        $this->claimUserDbService->callUpdateUserPassword([
            'p_email_address' => $email,
            'p_new_password'  => $hashedPassword
        ]);

        try {
            $expiration = (new \DateTime('+72 hours'))->getTimestamp();

            $payload = [
                'email'     => $email,
                'exp'       => $expiration,
            ];

            $secret = '7a9ffaf424858910c32400b722263573';

            $data = base64_encode(json_encode($payload));
            $signature = hash_hmac('sha256', $data, $secret);

            $token = $data . '.' . $signature;

            $url = "http://localhost:4200";

            $resetLink = sprintf('%s/auth/first-login?email=%s&token=%s', $url, urlencode($email), $token);

            // Envoie mail first login 
            $this->emailService->sendFirstLogin($email, $resetLink, $plainPassword);

            return new JsonResponse([
                'status'    => 'success',
                'code'      =>  JsonResponse::HTTP_OK,
                'message'   => 'A link to the first login is sent.'
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
     * Verifier expiratoin token avant first login
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyLinkFirstLogin(Request $request) : JsonResponse {

        $query = (array)json_decode($request->getContent(), true);

        $token =  $query['token'];

        if (!$token) {
            return new JsonResponse(
            [
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'error' => 'Missing token.'
            ],  JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!str_contains($token, '.')) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'message' => 'Invalid token format.'

            ],  JsonResponse::HTTP_BAD_REQUEST);
        }

        // Séparer le token en deux parties
        [$encodedData, $signature] = explode('.', $token);

        // Décoder le payload
        $payload = json_decode(base64_decode($encodedData), true);

        if (!$payload) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  JsonResponse::HTTP_BAD_REQUEST,
                'message' => 'Payload invalide.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            return new JsonResponse([
                'status'    => 'error',
                'code'      =>  403,
                'error' => 'Expired token.'
            ], 403);
        }

        try {
            // Vérification expiration manuelle (facultatif, déjà gérée en interne)
            if (isset($payload['exp']) && time() > $payload['exp']) {
                return new JsonResponse([
                     'status'   => 'error',
                    'code'      =>  403,
                    'message'   => 'Expired token.'
                ], 403);
            }

            return new JsonResponse([
                'status'    => 'success', 
                'code'      => 200,
                'message'   => '',
                'token'     => $token
            ]);

        } catch (JWTDecodeFailureException $e) {
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


    private function generateSecurePassword(int $length = 10): string
    {
        $uppercase    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase    = 'abcdefghijklmnopqrstuvwxyz';
        $numbers      = '0123456789';
        $specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

        // Assurez au moins 1 caractère de chaque catégorie
        $password = '';
        $password .= $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $numbers[random_int(0, strlen($numbers) - 1)];
        $password .= $specialChars[random_int(0, strlen($specialChars) - 1)];

        // Complétez le reste du mot de passe
        $allChars = $uppercase . $lowercase . $numbers . $specialChars;
        for ($i = strlen($password); $i < $length; $i++) {
            $password .= $allChars[random_int(0, strlen($allChars) - 1)];
        }

        // Mélangez le mot de passe pour ne pas avoir un ordre fixe
        return str_shuffle($password);
    }

}