<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class MenuController extends Controller
{
    public function addMenuItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'availability' => 'required|string|max:255', // Applies to all categories
            'category' => 'required|string|max:255',
            'establishmentName' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            // Fields for specific categories
            'cookTime' => 'required_if:category,restaurant|string|max:255',
            'expirationDate' => 'required_if:category,pharmacy|date',
            'manufacturingDate' => 'required_if:category,pharmacy|date',
            'location' => 'required_if:category,realEstate|string|max:255',
            'size' => 'required_if:category,realEstate|numeric',
            'acres' => 'required_if:category,realEstate|numeric',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $validated['image'] = asset('storage/' . $path); // Return the full URL
        }
        

        $menu = Menu::create($validated);

        return response()->json(['data' => $menu, 'message' => 'Menu item added successfully!'], 201);
    }


    // Delete a menu item
    public function deleteMenuItem($id)
    {
        $menu = Menu::findOrFail($id);

        // Delete associated image if exists
        if ($menu->image) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu item deleted successfully.'], 200);
    }

    // Submit all menus to admin for approval
    public function submitToAdmin(Request $request)
    {
        $menus = $request->input('menus');

        foreach ($menus as $menu) {
            Menu::create([
                'name' => $menu['name'],
                'description' => $menu['description'] ?? null,
                'price' => $menu['price'],
                'location' => $menu['location'] ?? null,
                'size' => $menu['size'] ?? null,
                'expirationDate' => $menu['expirationDate'] ?? null,
                'cookTime' => $menu['cookTime'] ?? null,
                'availability' => $menu['availability'] ?? null,
                'category' => $menu['category'],
                'establishmentName' => $menu['establishmentName'],
                'image' => $menu['image'] ?? null,
                'status' => 'pending', // Mark as pending for admin approval
            ]);
        }

        return response()->json(['message' => 'Menus submitted to admin successfully!'], 200);
    }
  

    public function getCategories()
    {
        $categories = Menu::select('category')
            ->distinct()
            ->get();

        return response()->json(['data' => $categories], 200);
    }

    public function getEstablishmentsByCategory(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
        ]);
    
        $establishments = Menu::where('category', $validated['category'])
            ->select('establishmentName', 'availability', 'image')
            ->distinct()
            ->get();
    
        // Log the query results for debugging
        Log::info('Establishments found:', $establishments->toArray());
    
        // Return the raw data for debugging
        return response()->json(['data' => $establishments], 200);
    }
    
    

    public function getMenusByEstablishment(Request $request)
    {
        $validated = $request->validate([
            'establishmentName' => 'required|string',
        ]);
    
        $menus = Menu::where('establishmentName', $validated['establishmentName'])
            ->get()
            ->map(function ($menu) {
                return [
                    'name' => $menu->name,
                    'description' => $menu->description,
                    'price' => $menu->price,
                    'availability' => $menu->availability ?? 'Not Available',
                    'cookTime' => $menu->cookTime, // For restaurants
                    'expirationDate' => $menu->expirationDate, // For pharmacies
                    'size' => $menu->size, // For real estate
                    'location' => $menu->location, // For real estate
                    'image' => $menu->image ? asset('storage/' . $menu->image) : null,
                ];
            });
    
        return response()->json(['data' => $menus], 200);
    }
    




}

