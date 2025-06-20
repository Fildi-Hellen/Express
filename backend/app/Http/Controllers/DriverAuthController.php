<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DriverAuthController extends Controller
{
    public function register(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:drivers',
        'password' => 'required|string|min:8',
        'phone' => 'required|string',
        'vehicle_type' => 'required|string',
        'vehicle_number' => 'required|string'
    ]);


    $data['password'] = bcrypt($data['password']);

    $driver = Driver::create($data);

    return response()->json([
        'message' => 'Registration successful',
        'driver' => $driver
    ], 201);
}


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('driver')->attempt($credentials)) {
            $driver = Auth::guard('driver')->user();
                /** @var \App\Models\Driver $driver **/
            $token = $driver->createToken('DriverToken')->plainTextToken;

            $driver->is_available = true;
           $driver->save();

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                 'driver' => $driver,
            ], 200);
        }

        Log::warning('Invalid login attempt', ['email' => $request->email]);

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout()
    {
        $driver = Auth::guard('driver')->user();
        if ($driver) $driver->is_available = false;

        Auth::guard('driver')->logout();

        return response()->json(['message' => 'Logout successful']);
    }

}

