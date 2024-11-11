<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function registerAdmin(Request $request)
{
    $validator = Validator::make($request->all(), [
        'fullName' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:admins',
        'password' => 'required|string|min:8|confirmed',
        'adminNumber' => 'required|string', // Ensure admin number is provided
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $admin = User::create([
        'fullName' => $request->fullName,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'adminNumber' => $request->adminNumber,
        'role' => 'admin' // Set default role
    ]);

    return response()->json(['message' => 'Admin registered successfully'], 201);
}
}