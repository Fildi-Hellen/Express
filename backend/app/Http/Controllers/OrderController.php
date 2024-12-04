<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function saveRecipient(Request $request)
    {
        // Validate the recipient data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Save recipient data (optional, if needed for records)
        // Recipient::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Recipient information saved successfully!',
        ], 200);
    }

    public function confirmOrder(Request $request)
    {
        // Validate order details
        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:15',
            'recipient_address' => 'required|string',
            'payment_method' => 'required|string|in:stripe,momo,mpesa,cod',
            'amount' => 'required_if:payment_method,stripe,momo,mpesa|numeric|min:0.1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Email the order confirmation to the admin (or the user)
        Mail::send('emails.order_confirmation', $request->all(), function ($message) use ($request) {
            $message->to('intysilva1@gmail.com') // Replace with your admin email
                ->subject('New Order Confirmation')
                ->from($request->get('recipient_phone'), 'Order System');
        });

        // Save the order to the database (optional)
        // Order::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Order confirmed successfully!',
        ], 200);
    }
}
