<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'address' => 'required|string',
            'contact' => 'required|string',
        ]);

        // Save address logic (e.g., save to the database)
        // Example:
        // Address::create($validated);

        return response()->json(['message' => 'Address saved successfully'], 201);
    }
}
