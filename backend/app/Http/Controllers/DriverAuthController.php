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
    try {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:20',
            'vehicle_type' => 'required|string|max:50',
            'vehicle_number' => 'required|string|max:20'
        ]);

        $data['password'] = bcrypt($data['password']);
        
        // Set default values for new drivers
        $data['is_available'] = true;
        $data['is_available_for_ride'] = true;
        $data['rating'] = 5.0; // Default rating

        $driver = Driver::create($data);
        
        // Create token for immediate login
        $token = $driver->createToken('DriverToken')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'driver' => $driver,
            'token' => $token
        ], 201);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        Log::error('Driver registration failed: ' . $e->getMessage());
        return response()->json([
            'message' => 'Registration failed',
            'error' => 'Something went wrong. Please try again.'
        ], 500);
    }
}


    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Find the driver by email
            $driver = Driver::where('email', $credentials['email'])->first();

            // Check if driver exists and password is correct
            if (!$driver || !\Hash::check($credentials['password'], $driver->password)) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Create token for the driver
            $token = $driver->createToken('DriverToken')->plainTextToken;

            // Set driver as available
            $driver->is_available = true;
            $driver->save();

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'driver' => $driver,
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Driver login failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Login failed',
                'error' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Get the currently authenticated driver
            $driver = $request->user();
            
            if ($driver) {
                // Set driver as unavailable
                $driver->is_available = false;
                $driver->save();
                
                // Revoke all tokens for this driver
                $driver->tokens()->delete();
                
                return response()->json([
                    'message' => 'Logout successful'
                ], 200);
            }
            
            return response()->json([
                'message' => 'No authenticated user found'
            ], 401);
            
        } catch (\Exception $e) {
            Log::error('Driver logout failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout failed',
                'error' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

}

