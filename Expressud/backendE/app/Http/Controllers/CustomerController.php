<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Register request received', $request->all());

        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', $validator->errors()->toArray());
            return response()->json($validator->errors(), 400);
        }

        $roleMap = [
            'admin' => 1,
            'customer' => 2,
            'vendor' => 3,
            'driver' => 4,
        ];

        $role_id = $roleMap[$request->role] ?? null;

        if (!$role_id) {
            Log::error('Invalid role provided');
            return response()->json(['error' => 'Invalid role'], 400);
        }

        try {
            $user = User::create([
                'name' => $request->fullName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role_id,
            ]);

            Log::info('User registered successfully', ['user_id' => $user->id]);
            return response()->json(['message' => 'User registered successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Error registering user', ['exception' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'An error occurred while registering the user'], 500);
        }
    }
}
