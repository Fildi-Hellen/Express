<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Payout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;


class DriverController extends Controller
{
    

    // Get Earnings Overview (Daily, Weekly, Monthly)
    public function earnings()
    {
        $driverId = Auth::guard('driver')->id();

        $daily = Payout::where('driver_id', $driverId)
            ->whereDate('created_at', today())
            ->where('status', 'successful')
            ->sum('amount');

        $weekly = Payout::where('driver_id', $driverId)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->where('status', 'successful')
            ->sum('amount');

        $monthly = Payout::where('driver_id', $driverId)
            ->whereMonth('created_at', now()->month)
            ->where('status', 'successful')
            ->sum('amount');

        return response()->json([
            'daily' => $daily,
            'weekly' => $weekly,
            'monthly' => $monthly,
        ]);
    }

    public function history()
    {
        $driverId = Auth::guard('driver')->id();

        $payouts = Payout::where('driver_id', $driverId)
            ->latest()
            ->select('amount', 'status', 'created_at', 'reference')
            ->get();

        return response()->json($payouts);
    }

    public function settings()
    {
        $driverId = Auth::guard('driver')->id();
        $driver = Driver::find($driverId);

        if (!$driver) {
            return response()->json(['error' => 'Driver not found'], 404);
        }

        return response()->json([
            'method' => $driver->payout_method,
            'accountName' => $driver->account_name,
            'accountNumber' => $driver->account_number,
            'bankName' => $driver->bank_name,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'payout_method' => 'required|string',
            'account_name' => 'required|string',
            'account_number' => 'required|string',
            'bank_name' => 'required|string',
        ]);

        $driverId = Auth::guard('driver')->id();
        $driver = Driver::find($driverId);

        if (!$driver) {
            return response()->json(['error' => 'Driver not found'], 404);
        }

        $driver->update($validated);

        return response()->json(['success' => true, 'message' => 'Settings updated successfully']);
    }

    public function initiate(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10',
        ]);

        $driverId = Auth::guard('driver')->id();
        $driver = Driver::find($driverId);

        if (!$driver || !$driver->account_number || !$driver->bank_name) {
            return response()->json(['success' => false, 'message' => 'Incomplete bank details.']);
        }

        
        $payload = [
            'account_bank' => $driver->bank_name,
            'account_number' => $driver->account_number,
            'amount' => $request->amount,
            'narration' => 'Driver payout',
            'currency' => 'RWF',
            'reference' => 'payout-' . time(),
            'callback_url' => env('APP_URL') . '/api/payout/callback',
            'debit_currency' => 'RWF',
        ];

        $response = Http::withToken(config('flutterwave.secret_key'))
            ->withOptions(['verify' => false])
            ->post(config('flutterwave.base_url') . '/transfers', $payload);

        $result = $response->json();

        if (isset($result['status']) && $result['status'] == 'success') {
            Payout::create([
                'driver_id' => $driverId,
                'amount' => $request->amount,
                'status' => 'pending',
                'reference' => $payload['reference'],
            ]);

            return response()->json(['success' => true, 'message' => 'Payout initiated']);
        }

        return response()->json(['success' => false, 'message' => 'Payout failed', 'error' => $result]);
    }

    /**
     * Get driver profile
     */
    public function getProfile($driverId)
    {
        try {
            $driver = Driver::findOrFail($driverId);
            
            // Remove sensitive information
            $driver->makeHidden(['password', 'remember_token']);
            
            return response()->json([
                'success' => true,
                'data' => $driver
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }
    }

    /**
     * Update driver profile
     */
    public function updateProfile(Request $request, $driverId)
    {
        try {
            $driver = Driver::findOrFail($driverId);
            
            // Validate the request
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:drivers,email,' . $driverId,
                'phone' => 'sometimes|string|max:20',
                'vehicle_type' => 'sometimes|string|max:50',
                'vehicle_number' => 'sometimes|string|max:20',
                'vehicle_model' => 'sometimes|nullable|string|max:100',
                'license_plate' => 'sometimes|nullable|string|max:20',
                'account_name' => 'sometimes|nullable|string|max:255',
                'account_number' => 'sometimes|nullable|string|max:50',
                'bank_name' => 'sometimes|nullable|string|max:100'
            ]);
            
            $driver->update($validated);
            
            // Remove sensitive information
            $driver->makeHidden(['password', 'remember_token']);
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $driver
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload driver profile picture
     */
    public function uploadProfilePicture(Request $request, $driverId)
    {
        try {
            $driver = Driver::findOrFail($driverId);
            
            $request->validate([
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120' // 5MB max
            ]);
            
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                
                // Generate unique filename
                $fileName = 'driver_' . $driverId . '_' . time() . '.' . $file->getClientOriginalExtension();
                
                // Store in public/storage/profile_pictures directory
                $path = $file->storeAs('profile_pictures', $fileName, 'public');
                
                // Delete old profile picture if exists
                if ($driver->profile_picture) {
                    \Storage::disk('public')->delete($driver->profile_picture);
                }
                
                // Update driver profile picture path
                $driver->update(['profile_picture' => $path]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Profile picture uploaded successfully',
                    'profile_picture_url' => asset('storage/' . $path)
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'No file uploaded'
            ], 400);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove driver profile picture
     */
    public function removeProfilePicture($driverId)
    {
        try {
            $driver = Driver::findOrFail($driverId);
            
            if ($driver->profile_picture) {
                // Delete the file from storage
                \Storage::disk('public')->delete($driver->profile_picture);
                
                // Update driver record
                $driver->update(['profile_picture' => null]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Profile picture removed successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}