<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    public function getFoodItemsByRestaurantAndCategory(Request $request)
    {
        // Retrieve restaurantId and categoryId from query parameters
        $restaurantId = $request->query('restaurantId');
        $categoryId = $request->query('categoryId');
        
        // Validate the parameters
        if (!$restaurantId || !$categoryId) {
            return response()->json(['error' => 'Both restaurantId and categoryId are required'], 400);
        }

        // Retrieve food items from database based on provided IDs
        $foodItems = Food::where('restaurant_id', $restaurantId)
                         ->where('category_id', $categoryId)
                         ->get();
        
        // Return JSON response with food items data
        return response()->json(['data' => $foodItems]);
    }
}
