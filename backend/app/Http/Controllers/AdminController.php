<?php

namespace App\Http\Controllers;

use App\Mail\VendorRegistered;
use App\Mail\VendorRequestMoreInfo;
use App\Mail\VendorVerified;
use App\Models\Menu;
use App\Models\vendor;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;


class AdminController extends Controller
{
    // Retrieve all unverified vendors
    public function unverifiedVendors()
    {
        try {
            $vendors = Vendor::where('is_verified', false)->get();
            return response()->json($vendors, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Approve and verify a vendor
    public function verifyVendor($id)
    {
        try {
            $vendor = Vendor::findOrFail($id);
            $vendor->is_verified = true;
            $vendor->save();

            // Send verification email
            $link = url('/vendor/login');
            Mail::to($vendor->email)->send(new VendorVerified($vendor, $link));

            return response()->json(['message' => 'Vendor verified successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Reject a vendor
    public function rejectVendor($id)
    {
        try {
            $vendor = Vendor::findOrFail($id);
            $vendor->delete();

            return response()->json(['message' => 'Vendor rejected successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Request more information from the vendor
    public function requestMoreInfo(Request $request, $id)
    {
        try {
            $vendor = Vendor::findOrFail($id);
            $message = $request->input('message');

            // Send an email to request more information
            Mail::to($vendor->email)->send(new VendorRequestMoreInfo($vendor, $message));

            return response()->json(['message' => 'Request for more information sent to the vendor.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Send registration confirmation email
    public function sendRegistrationConfirmation(Vendor $vendor)
    {
        try {
            Mail::to($vendor->email)->send(new VendorRegistered ($vendor));

            return response()->json(['message' => 'Registration confirmation email sent.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Retrieve all pending menus
    public function getIncomingMenus()
    {
        try {
            $menus = Menu::where('status', 'pending')->get();
            return response()->json(['data' => $menus], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function approveMenu($id, Request $request)
{
    $menu = Menu::findOrFail($id);

    // Use $request to validate
    $validated = $request->validate([
        'additionalPrice' => 'nullable|numeric',
    ]);

    $menu->price += $validated['additionalPrice'] ?? 0;
    $menu->status = 'approved';
    $menu->save();

    return response()->json(['message' => 'Menu approved successfully.']);
}

public function disapproveMenu($id, Request $request)
{
    $menu = Menu::findOrFail($id);

    // Use $request to validate
    $validated = $request->validate([
        'reason' => 'required|string|max:255',
    ]);

    $menu->status = 'disapproved';
    $menu->save();

    return response()->json(['message' => 'Menu disapproved successfully.']);
}

    

    // Edit a menu
    public function editMenu($id, Request $request)
    {
        try {
            $menu = Menu::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric',
                'availability' => 'required|string|max:255',
            ]);

            $menu->update($validated);

            return response()->json(['message' => 'Menu updated successfully.', 'data' => $menu], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}
