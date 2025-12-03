<?php

namespace App\Services;

use Microsoft\Graph\GraphServiceClient;
use Microsoft\Kiota\Authentication\Oauth\ClientCredentialContext;
use Microsoft\Graph\Generated\Users\Item\SendMail\SendMailPostRequestBody;
use Microsoft\Graph\Generated\Models\Message;
use Microsoft\Graph\Generated\Models\Recipient;
use Microsoft\Graph\Generated\Models\EmailAddress;
use Microsoft\Graph\Generated\Models\ItemBody;
use Microsoft\Graph\Generated\Models\BodyType;

class MicrosoftGraphMailer
{
    protected $graphClient;
    protected $senderEmail;

    public function __construct()
    {
        $tenantId = config('services.microsoft.tenant_id');
        $clientId = config('services.microsoft.client_id');
        $clientSecret = config('services.microsoft.client_secret');
        $this->senderEmail = config('services.microsoft.sender_email');

        $tokenRequestContext = new ClientCredentialContext(
            $tenantId,
            $clientId,
            $clientSecret
        );

        $this->graphClient = new GraphServiceClient($tokenRequestContext);
    }

    /**
     * Enviar correo usando Microsoft Graph API
     */
    public function send($to, $subject, $body, $isHtml = true)
    {
        try {
            $message = new Message();
            $message->setSubject($subject);

            $messageBody = new ItemBody();
            $messageBody->setContentType(new BodyType($isHtml ? 'html' : 'text'));
            $messageBody->setContent($body);
            $message->setBody($messageBody);

            $toRecipient = new Recipient();
            $toEmailAddress = new EmailAddress();
            $toEmailAddress->setAddress($to);
            $toRecipient->setEmailAddress($toEmailAddress);
            $message->setToRecipients([$toRecipient]);

            $requestBody = new SendMailPostRequestBody();
            $requestBody->setMessage($message);
            $requestBody->setSaveToSentItems(true);

            $this->graphClient->users()
                ->byUserId($this->senderEmail)
                ->sendMail()
                ->post($requestBody)
                ->wait();

            return true;
        } catch (\Microsoft\Graph\Generated\Models\ODataErrors\ODataError $e) {
            $errorMessage = 'Microsoft Graph ODataError: ';
            if ($e->getError()) {
                $errorMessage .= $e->getError()->getMessage() ?? 'Unknown error';
                $errorMessage .= ' (Code: ' . ($e->getError()->getCode() ?? 'N/A') . ')';
            }
            \Log::error($errorMessage);
            throw new \Exception($errorMessage);
        } catch (\Exception $e) {
            \Log::error('Error enviando correo con Microsoft Graph: ' . $e->getMessage());
            throw $e;
        }
    }
}
