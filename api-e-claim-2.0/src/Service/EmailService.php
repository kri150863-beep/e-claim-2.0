<?php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendResetPasswordEmail(string $toEmail, string $resetLink): void
    {
        $email = (new Email())
            ->from('no-reply@yourapp.com')
            ->to($toEmail)
            ->subject('Reset your password.')
            ->text("Click on this link to reset your password : $resetLink")
            ->html("<p>Click on this link to reset your password :</p><p><a href=\"$resetLink\">$resetLink</a></p>");

        $this->mailer->send($email);
    }

    public function sendFirstLogin(string $toEmail, string $resetLink, string $plainPassword): void
    {
        $email = (new Email())
            ->from('no-reply@yourapp.com')
            ->to($toEmail)
            ->subject('Your access to the platform')
            ->text("
                Here are your login details :
                Email : $toEmail
                Password : $plainPassword

                Click on this link to set a new password:
                $resetLink
            ")
            ->html("
                <p>Here are your login details :</p>
                <ul>
                    <li><strong>Email :</strong> $toEmail</li>
                    <li><strong>Password :</strong> $plainPassword</li>
                </ul>
                <p>Click on this link to set a new password:</p>
                <p><a href=\"$resetLink\">$resetLink</a></p>
            ");

        $this->mailer->send($email);
    }

    public function sendSummaryWithAttachment(string $toEmail, string $pdfPath): void
    {
        $email = (new Email())
            ->from('noreply@tonapp.com')
            ->to($toEmail)
            ->subject('Claim Summary Report')
            ->text('Please find enclosed a summary of your claim.')
            ->attachFromPath($pdfPath, 'claim_summary.pdf', 'application/pdf');

        $this->mailer->send($email);
    }

}
