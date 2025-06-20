<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        Log::info('Payment payload:', $request->all());
    
        $response = Http::withOptions([
            'verify' => 'C:/xampp/php/extras/ssl/cacert.pem', // ✅ Use forward slashes
        ])
        ->withToken(env('FLW_SECRET_KEY'))
        ->post('https://api.flutterwave.com/v3/payments', [
            'tx_ref' => 'tx-' . time(),
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'RWF',
            'redirect_url' => 'http://localhost:4200/payment-success',
            'payment_options' => $request->channel ?? 'card',
            'customer' => [
                'email' => $request->email,
                'name' => $request->name,
                'phonenumber' => $request->phone_number,
            ],
            'customizations' => [
                'title' => 'Trip Payment',
                'description' => 'Booking payment via Flutterwave',
            ],
        ]);
    
        Log::info('Flutterwave Response:', $response->json());
    
        return $response->json();
    }
    
    public function handle(Request $request)
    {
        // ✅ Optional: verify webhook signature
        $flutterwaveSignature = $request->header('verif-hash');
        $localHash = env('FLW_SECRET_HASH');

        if (!$flutterwaveSignature || $flutterwaveSignature !== $localHash) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ✅ Process webhook data
        $data = $request->all();

        Log::info('Flutterwave Webhook Received:', $data);

        if (
            isset($data['event']) &&
            $data['event'] === 'charge.completed' &&
            isset($data['data']['status']) &&
            $data['data']['status'] === 'successful'
        ) {
            $transactionId = $data['data']['id'];
            $tx_ref = $data['data']['tx_ref'];
            $amount = $data['data']['amount'];
            $currency = $data['data']['currency'];
            $customer_email = $data['data']['customer']['email'];

            Log::info("Payment Successful for {$customer_email} - {$amount} {$currency} - Ref: {$tx_ref}");
        }

        return response()->json(['status' => 'ok'], 200);
    }
    
}
