<?php

/**
 * Send a webhook using PHP cURL
 * @param string $webhookUrl The webhook endpoint URL
 * @param string $apiKey Your API key
 * @param array $data The webhook payload
 * @return array The webhook response
 * @throws Exception If the request fails
 */
function sendWebhook($webhookUrl, $apiKey, $data) {
    $ch = curl_init($webhookUrl);
    
    $headers = [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ];
    
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers
    ]);
    
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($statusCode >= 400) {
        throw new Exception('HTTP error! status: ' . $statusCode);
    }
    
    return json_decode($response, true);
}

// Usage example
$webhookData = [
    'activity' => 'user.created',
    'datestamp' => date('c'),
    'customer' => 'customer123',
    'source' => 'https://trusted-source.com'
];

try {
    $response = sendWebhook(
        'https://your-site.netlify.app/api/webhook',
        'your-api-key',
        $webhookData
    );
    echo "Webhook sent successfully:\n";
    print_r($response);
} catch (Exception $e) {
    echo "Error sending webhook: " . $e->getMessage() . "\n";
}