<?php
namespace App\Services;

use Aws\SecretsManager\SecretsManagerClient;
use Aws\Exception\AwsException;
use Illuminate\Support\Facades\Log;


class AwsSecretsManagerService
{
    protected $client;

    public function __construct()
    {
        // Initialize the SecretsManagerClient
        $this->client = new SecretsManagerClient([
            'version' => 'latest',
            'region' => 'af-south-1',
            'credentials' => [
                'key' => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);
    }

    /**
     * Retrieve and parse the secret from AWS Secrets Manager.
     *
     * @param string $secretName
     * @return array|null
     */
    public function getSecret($secretName)
    {
        try {
            $result = $this->client->getSecretValue([
                'SecretId' => $secretName,
                'VersionStage' => 'AWSCURRENT', // Optional
            ]);

            if (isset($result['SecretString'])) {
                return json_decode($result['SecretString'], true);
            }

            return null;

        } catch (AwsException $e) {
            Log::error("AWS Secrets Manager error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Helper method to get a specific key from the secret.
     *
     * @param string $key
     * @return string|null
     */
    public function getSecretKey(string $key): ?string
    {
        $secretName = env('AWS_SECRET_NAME'); // Secret name in .env
        $secret = $this->getSecret($secretName);

        return $secret[$key] ?? null;
    }
}
