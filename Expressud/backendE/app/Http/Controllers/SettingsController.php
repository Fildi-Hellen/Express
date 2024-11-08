<?php

namespace App\Http\Controllers;

use App\Models\settings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getSettings()
    {
        $settings = settings::first();
        return response()->json($settings);
    }

    public function updateSettings(Request $request)
    {
        $validatedData = $request->validate([
            'storeName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contactEmail' => 'required|email|max:255',
            'contactPhone' => 'required|string|max:20',
            'businessHours' => 'required|string|max:255',
            'holidaySchedule' => 'required|string|max:255',
            'paymentOptions' => 'required|string|max:255',
            'shippingOptions' => 'required|string|max:255',
        ]);

        $settings = Settings::first();
        if (!$settings) {
            $settings = new Settings();
        }

        $settings->update($validatedData);

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
