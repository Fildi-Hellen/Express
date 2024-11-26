<?php

namespace App\Http\Controllers;

use App\Mail\VendorRegistered;
use App\Mail\VendorRequestMoreInfo;
use App\Mail\VendorVerified;
use App\Models\Menu;
use App\Models\vendor;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request;

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

public function unapprovedMenus()
{
    try {
        $menus = Menu::where('is_approved', false)->get();
        return response()->json($menus, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



public function approveMenu($id)
{
    try {
        $menu = Menu::findOrFail($id);
        $menu->is_approved = true;
        $menu->save();

        return response()->json(['message' => 'Menu item approved successfully.'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



}
