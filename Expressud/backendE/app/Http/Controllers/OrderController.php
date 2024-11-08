<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function placeOrder(Request $request)
    {
        try {
            $request->validate([
                'totalAmount' => 'required|numeric',
                'deliveryAddress' => 'required|string',
                'phoneNumber' => 'required|string',
                'cartItems' => 'required|array',
                'paymentMethod' => 'required|string',
            ]);

            $order = new Order();
            $order->user_id = auth()->check() ? auth()->id() : null;
            $order->total_amount = $request->totalAmount;
            $order->delivery_address = $request->deliveryAddress;
            $order->phone_number = $request->phoneNumber;
            $order->payment_method = $request->paymentMethod;
            $order->status = 'Pending';
            $order->save();

            foreach ($request->cartItems as $item) {
                $order->items()->create([
                    'product_name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            Notification::create([
                'message' => 'New order placed with ID: ' . $order->id,
            ]);
        

            return response()->json(['result' => true, 'message' => 'Order Placed Successfully']);
        } catch (\Exception $e) {
            Log::error('Error placing order: ' . $e->getMessage());
            return response()->json(['result' => false, 'message' => 'Failed to place order. Please try again later.'], 500);
        }
    }

    public function getOrders()
    {
        $orders = Order::with('items')->get();
        return response()->json($orders);
    }

    public function getOrderDetails($id)
    {
        $order = Order::with('items')->find($id);
        if ($order) {
            return response()->json($order);
        } else {
            return response()->json(['result' => false, 'message' => 'Order not found'], 404);
        }
    }

    public function updateOrderStatus(Request $request, $id)
    {
        try {
            $order = Order::find($id);
            if ($order) {
                $order->status = $request->status;
                $order->save();

                return response()->json(['result' => true, 'message' => 'Order status updated successfully']);
            } else {
                return response()->json(['result' => false, 'message' => 'Order not found'], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            return response()->json(['result' => false, 'message' => 'Failed to update order status. Please try again later.'], 500);
        }
    }
}