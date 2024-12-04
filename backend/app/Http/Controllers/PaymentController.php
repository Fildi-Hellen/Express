<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function process(Request $request)
    {
        $validated = $request->validate([
            'method' => 'required|string',
            'accountNumber' => 'nullable|string',
            'amount' => 'nullable|numeric',
        ]);

        $method = $validated['method'];

        switch ($method) {
            case 'stripe':
                return $this->processStripePayment($validated);
            case 'momo':
                return $this->processMomoPayment($validated);
            case 'mpesa':
                return $this->processMpesaPayment($validated);
            case 'cod':
                return response()->json(['message' => 'Cash on Delivery selected'], 200);
            default:
                return response()->json(['error' => 'Invalid payment method'], 400);
        }
    }

    private function processStripePayment($data)
    {
        // Simulate Stripe Payment Processing
        return response()->json(['message' => 'Stripe payment processed successfully'], 200);
    }

    private function processMomoPayment($data)
    {
        // Simulate MOMO Payment Processing
        return response()->json(['message' => 'MOMO payment processed successfully'], 200);
    }

    private function processMpesaPayment($data)
    {
        // Simulate Mpesa Payment Processing
        return response()->json(['message' => 'Mpesa payment processed successfully'], 200);
    }

    
}
