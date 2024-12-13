<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Str;  // Import the Str facade

class MoMoService
{
    protected $client;
    protected $apiKey;
    protected $apiUser;
    protected $apiSecret;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => env('MOMO_API_BASE_URL'),
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]
        ]);
        $this->apiKey = env('MOMO_API_KEY');
        $this->apiUser = env('MOMO_API_USER');
        $this->apiSecret = env('MOMO_API_SECRET');
    }

    public function createPaymentRequest($amount, $currency, $externalId, $payer)
    {
        $uuid = Str::uuid()->toString();  // Generate a new UUID for each request

        try {
            $response = $this->client->post('/collection/v1_0/requesttopay', [
                'headers' => [
                    'X-Reference-Id' => $uuid,
                    'Ocp-Apim-Subscription-Key' => $this->apiKey
                ],
                'json' => [
                    'amount' => $amount,
                    'currency' => $currency,
                    'externalId' => $externalId,
                    'payer' => [
                        'partyIdType' => 'MSISDN',
                        'partyId' => $payer
                    ],
                    'payerMessage' => 'Your payment message',
                    'payeeNote' => 'Your receipt message'
                ]
            ]);

            return ['response' => json_decode((string) $response->getBody(), true), 'uuid' => $uuid];
        } catch (\Exception $e) {
            return ['error' => 'Failed to create payment request: ' . $e->getMessage()];
        }
    }
}
