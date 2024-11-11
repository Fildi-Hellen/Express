<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'city' => 'required|string|max:255',
            'vehicle' => 'required|string|max:255',
            'driverPermitNo' => 'required|string|max:255',
            'numberPlate' => 'required|string|max:255',
            'hasHelmet' => 'boolean',
            'role' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Assign role_id based on the role string
        $role_id = 3; // Default to driver role_id
        if ($request->role === 'driver') {
            $role_id = 4;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role_id, // Use the determined role_id
            'city' => $request->city,
            'vehicle' => $request->vehicle,
            'driverPermitNo' => $request->driverPermitNo,
            'numberPlate' => $request->numberPlate,
            'hasHelmet' => $request->hasHelmet
        ]);

        return response()->json(['message' => 'Driver registered successfully'], 201);
    }
}
