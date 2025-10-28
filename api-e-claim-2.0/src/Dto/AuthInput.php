<?php 
namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AuthInput
{
    #[Assert\NotBlank]
    public ?string $login = null;  // Added ? and default null

    #[Assert\NotBlank]
    public ?string $password = null;
}