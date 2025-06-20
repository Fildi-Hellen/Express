<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Order;
use App\Notifications\DriverAssignedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class DriverRideController extends Controller
{
    public function getAvailableDrivers()
    {
        return response()->json(Driver::where('is_available', true)->get());
    }

    public function assignDriver(Request $request, $id)
    {
        $validatedData = $request->validate([
            'driverId' => 'required|exists:drivers,id',
        ]);

        $order = Order::findOrFail($id);
        $driver = Driver::findOrFail($validatedData['driverId']);

        $order->driver_id = $driver->id;
        $order->status = 'assigned';
        $order->save();

        Notification::send($driver, new DriverAssignedNotification($order));

        return response()->json(['message' => 'Driver assigned successfully!', 'order' => $order]);
    }
    

    public function getDriverOrders($driverId)
    {
        $orders = Order::with('items')
            ->where('driver_id', $driverId)
            ->whereIn('status', ['assigned', 'on the way'])
            ->get();

        if ($orders->isEmpty()) {
            return response()->json(['message' => 'No orders found for this driver.'], 404);
        }

        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully!']);
    }
}
