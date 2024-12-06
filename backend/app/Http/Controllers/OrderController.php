<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        try {
            $validatedData = $request->validate([
                'address.fullName' => 'required|string|max:255',
                'address.locationAddress' => 'required|string|max:255',
                'address.contact' => 'required|string|max:15',
                'paymentMethod' => 'required|string',
                'cartItems' => 'required|array',
                'total' => 'required|numeric',
                'recipient.name' => 'nullable|string|max:255',
                'recipient.phone' => 'nullable|string|max:15',
            ]);
    
            // Create the order
            $order = Order::create([
                'full_name' => $validatedData['address']['fullName'],
                'location_address' => $validatedData['address']['locationAddress'], // Add location address
                'payment_method' => $validatedData['paymentMethod'],
                'contact' => $validatedData['address']['contact'],
                'recipient' => json_encode($validatedData['recipient'] ?? null),
                'total_price' => $validatedData['total'],
            
            ]);
    
            // Save cart items
            foreach ($validatedData['cartItems'] as $item) {
                $order->items()->create($item);
            }
    
            return response()->json(['message' => 'Order confirmed successfully!', 'order' => $order], 201);
        } catch (\Exception $e) {
            Log::error('Error confirming order:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error confirming order', 'error' => $e->getMessage()], 500);
        }
    }
    


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'fullName' => 'required|string|max:255',
            'locationAddress' => 'required|string|max:255',
            'contact' => 'required|string|max:15',
        ]);

        // Optionally save the address to the database
        // Address::create($validatedData);

        return response()->json([
            'message' => 'Address saved successfully!',
            'data' => $validatedData,
        ]);
    }

    public function savePayment(Request $request)
    {
        $validatedData = $request->validate([
            'method' => 'required|string',
            'accountNumber' => 'nullable|string',
            'amount' => 'nullable|numeric',
        ]);

        // Save payment logic or processing
        return response()->json([
            'message' => 'Payment saved successfully!',
            'data' => $validatedData,
        ]);
    }

}
