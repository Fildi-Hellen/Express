<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
     /**
     * Get all categories
     */
    // public function getAllCategories()
    // {
    //     $categories = Category::all();
    //     return response()->json(['data' => $categories]);
    // }

    /**
     * Get categories with IDs from 36 to 46
     */
    public function getCategoriesFrom36To46()
    {
        $categories = Category::whereBetween('id', [1, 11])->get();
        return response()->json(['data' => $categories]);
    }

    /**
     * Get category with ID 47
     */
    public function getCategory47()
    {
        $category = Category::find(12);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['data' => $category]);
    }

    /**
     * Get restaurants by category ID
     */
    public function getRestaurantsByCategory($categoryId)
    {
        $category = Category::with('restaurants')->find($categoryId);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $restaurants = $category->restaurants->map(function ($restaurant) use ($category) {
            return [
                'restaurantId' => $restaurant->id,
                'name' => $restaurant->name,
                'photoUrl' => $category->photoUrl,
                'categoryName' => $category->name
            ];
        });

        return response()->json(['data' => $restaurants]);
    }

    /**
     * Get pharmacies by category ID
     */
    public function getPharmaciesByCategory($categoryId)
    {
        $category = Category::with('pharmacies')->find($categoryId);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $pharmacies = $category->pharmacies->map(function ($pharmacy) use ($category) {
            return [
                'pharmacyId' => $pharmacy->id,
                'name' => $pharmacy->name,
                'photoUrl' => $category->photoUrl,
                'categoryName' => $category->name
            ];
        });

        return response()->json(['data' => $pharmacies]);
    }
}

