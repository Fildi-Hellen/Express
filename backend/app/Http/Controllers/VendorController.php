<?php

namespace App\Http\Controllers;
use App\Mail\VendorRegistered;
use App\Models\vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class VendorController extends Controller
{
    public function register(Request $request)

    {
        
        try {
            
            $validatedData = $request->validate([
                'establishmentName' => 'required|string|max:255',
                'establishmentType' => 'required|string|max:255',
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|unique:vendors,email',
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required|string|min:8', // Ensure confirmed rule is applied
                'numberOfStores' => 'required|integer',
                'location' => 'required|string|max:255',
                'promocode' => 'boolean',
                'acceptUpdates' => 'boolean',
                'acceptPrivacyPolicy' => 'accepted', // Must be explicitly true
            ]);
    
            // Create Vendor
            $vendor = Vendor::create([
                'establishment_name' => $validatedData['establishmentName'],
                'establishment_type' => $validatedData['establishmentType'],
                'first_name' => $validatedData['firstName'],
                'last_name' => $validatedData['lastName'],
                'phone' => $validatedData['phone'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'number_of_stores' => $validatedData['numberOfStores'],
                'location' => $validatedData['location'],
                'promocode' => $validatedData['promocode'] ?? false,
                'accept_updates' => $validatedData['acceptUpdates'] ?? false,
                'accept_privacy_policy' => $validatedData['acceptPrivacyPolicy'],
            ]);
    
         
    
            return response()->json([
                'message' => 'You have successfully registered your business with Expressud. Check your email for updates.',
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }

    // Send confirmation email
    Mail::to($vendor->email)->send(new VendorRegistered($vendor));

    return response()->json([
        'message' => 'You have successfully registered your business with Expressud. We will review it within 2-5 working business days. Please check your email for updates.',
    ], 201);
}


    // app/Http/Controllers/VendorController.php

public function profile()
{
    $vendor = Auth::guard('vendor')->user();

    return response()->json([
        'establishmentType' => $vendor->establishment_type,
        // Include other vendor details as needed
    ]);
}

}
