<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\DriverAssignedNotification;
use Illuminate\Support\Facades\Log;

class DriverController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers',
            'password' => 'required|string|min:8',
        ]);

        $data['password'] = bcrypt($data['password']); // Hash password

        $driver = Driver::create($data);

        return response()->json(['message' => 'Registration successful', 'driver' => $driver], 201);
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
    
            // Attempt to authenticate the driver using the 'driver' guard
            if (Auth::guard('driver')->attempt($credentials)) {
                $user = Auth::guard('driver')->user();

                       /** @var \App\Models\User $user **/
                $token = $user->createToken('DriverToken')->plainTextToken;

                $user->is_available = true;
                $user->save();
    
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => $user,
                ], 200);
            }
    
            // Log invalid credentials
            Log::warning('Invalid login attempt', ['email' => $request->email]);
    
            return response()->json(['message' => 'Invalid credentials'], 401);
    
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error during login', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }
    

    public function logout()
    {
        $driver = Auth::guard('driver')->user();

        if ($driver) {
            // Set the driver status to unavailable
            $driver->is_available = false;
            $driver->save();
        }

        Auth::guard('driver')->logout();

        return response()->json(['message' => 'Logout successful']);
    }


    public function getAvailableDrivers()
    {
        $user = Auth::guard('sanctum')->user();
    
        if (!$user) {
            Log::error('Unauthorized access to getAvailableDrivers');
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        Log::info('Authenticated user:', ['user' => $user]);
    
        return response()->json(Driver::where('is_available', true)->get());
    }
    
    

    public function assignDriver(Request $request, $id)
    {
        $validatedData = $request->validate([
            'driverId' => 'required|exists:drivers,id',
        ]);

        $order = Order::findOrFail($id);
        $driver = Driver::findOrFail($validatedData['driverId']);

        // Assign the driver to the order
        $order->driver_id = $driver->id;
        $order->status = 'assigned';
        $order->save();

        // Notify the driver (optional)
        Notification::send($driver, new DriverAssignedNotification($order));

        return response()->json(['message' => 'Driver assigned successfully!', 'order' => $order]);
    }


    public function getDriverOrders($driverId)
{
    $user = Auth::guard('sanctum')->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    if ($user->id !== (int) $driverId) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $orders = Order::with('items')
        ->where('driver_id', $driverId)
        ->whereIn('status', ['assigned', 'on the way'])
        ->get();

    return response()->json($orders);
}


    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully!']);
    }

    public function getAllDrivers()
{
    return response()->json(Driver::all());
}


}
