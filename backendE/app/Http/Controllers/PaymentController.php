<?php

namespace App\Http\Controllers;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Initialize Stripe Secret Key (use .env for security)
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    // Handle payment via Stripe (Visa/MasterCard)
    public function processStripePayment(Request $request)
    {
        try {
            // Create PaymentIntent with amount and currency
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount, // Amount in cents
                'currency' => 'ssp',
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Handle MOMO Payment (Placeholder - Implement actual API integration)
    public function processMomoPayment(Request $request)
    {
        // Implement integration with MOMO's API here
        $accountNumber = $request->input('account_number');
        
        // Assume success response from MOMO API
        return response()->json([
            'status' => 'success',
            'message' => 'MOMO payment processed for account: ' . $accountNumber
        ]);
    }

    // Handle Mpase Payment (Placeholder - Implement actual API integration)
    public function processMpasePayment(Request $request)
    {
        // Implement integration with Mpase's API here
        $accountNumber = $request->input('account_number');
        
        // Assume success response from Mpase API
        return response()->json([
            'status' => 'success',
            'message' => 'Mpase payment processed for account: ' . $accountNumber
        ]);
    }
}
