<?php

namespace App\Services;

use Aws\SecretsManager\SecretsManagerClient;
use Aws\Exception\AwsException;

class AwsSecretsManagerService
{
    protected $client;

    public function __construct()
    {
        // Configure the AWS SecretsManagerClient with your region and credentials
        $this->client = new SecretsManagerClient([
            'version' => 'latest',
            'region' => 'af-south-1',  // Set this to your desired AWS region
            'credentials' => [
                'key' => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);
    }

    /**
     * Retrieve and parse the secret from AWS Secrets Manager
     *
     * @param string $secretName
     * @return array|null  JSON-decoded secret data or null if an error occurs
     */
    public function getSecret($secretName)
    {
        try {
            $result = $this->client->getSecretValue([
                'SecretId' => $secretName,
                'VersionStage' => 'AWSCURRENT', // optional, defaults to AWSCURRENT
            ]);

            if (isset($result['SecretString'])) {
                // Return JSON-decoded data
                return json_decode($result['SecretString'], true);
            }

            return null;

        } catch (AwsException $e) {
            // Handle exceptions (e.g., log the error)
            \Log::error("AWS Secrets Manager error: " . $e->getMessage());
            return null;
        }
    }
}
