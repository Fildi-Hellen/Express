<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Auth::guard('vendor')->user()->menus;
        return view('vendor.menus.index', compact('menus'));
    }

    public function create()
    {
        $establishmentType = Auth::guard('vendor')->user()->establishment_type;
        return view('vendor.menus.create', compact('establishmentType'));
    }

    public function store(Request $request)
    {
        $vendor = Auth::guard('vendor')->user();
        $establishmentType = $vendor->establishment_type;

        // Validation rules based on establishment type
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image',
            'category' => 'nullable|string|max:255',
        ];

        // Additional validation for specific establishment types
        if ($establishmentType == 'realEstate') {
            $rules['price'] = 'nullable|numeric';
            $rules['location'] = 'required|string|max:255';
            // Add more rules as needed
        } elseif ($establishmentType == 'pharmacy') {
            $rules['expiration_date'] = 'required|date';
            // Add more rules as needed
        }
        // Add conditions for other types

        $validatedData = $request->validate($rules);

        $menu = new Menu();
        $menu->vendor_id = $vendor->id;
        $menu->establishment_type = $establishmentType;
        $menu->name = $validatedData['name'];
        $menu->description = $validatedData['description'] ?? null;
        $menu->price = $validatedData['price'] ?? null;
        $menu->category = $validatedData['category'] ?? null;

        // Handle additional attributes
        $additionalAttributes = [];

        if ($establishmentType == 'realEstate') {
            $additionalAttributes['location'] = $request->input('location');
            $additionalAttributes['size'] = $request->input('size');
            // Add more attributes as needed
        } elseif ($establishmentType == 'pharmacy') {
            $additionalAttributes['expiration_date'] = $request->input('expiration_date');
            // Add more attributes as needed
        }
        // Add conditions for other types

        $menu->additional_attributes = $additionalAttributes;

        if ($request->hasFile('image')) {
            $menu->image = $request->file('image')->store('menus', 'public');
        }

        $menu->save();

        return redirect()->route('vendor.menus.index')->with('message', 'Item added successfully.');
    }
}
