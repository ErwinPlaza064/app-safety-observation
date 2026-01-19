<?php

namespace App\Mail\Transport;

use App\Services\MicrosoftGraphMailer;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\MessageConverter;

class MicrosoftGraphTransport extends AbstractTransport
{
    protected $mailer;

    public function __construct(MicrosoftGraphMailer $mailer)
    {
        parent::__construct();
        $this->mailer = $mailer;
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        $to = collect($email->getTo())->map(fn($address) => $address->getAddress())->first();
        $subject = $email->getSubject();
        $html = $email->getHtmlBody();
        $text = $email->getTextBody();

        $this->mailer->send($to, $subject, $html ?: $text, (bool)$html);
    }

    public function __toString(): string
    {
        return 'microsoft_graph';
    }
}
