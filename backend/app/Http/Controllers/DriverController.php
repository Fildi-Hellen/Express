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

  

}