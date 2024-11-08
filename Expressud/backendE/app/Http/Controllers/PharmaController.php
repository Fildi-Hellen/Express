<?php

namespace App\Http\Controllers;

use App\Models\Pharma;
use Illuminate\Http\Request;

class PharmaController extends Controller
{
    public function getPharmItemsByPharmacyAndCategory(Request $request)
    {
        // Retrieve pharmacyId and categoryId from query parameters
        $pharmacyId = $request->query('pharmacyId');
        $categoryId = $request->query('categoryId');
        
        // Validate the parameters
        if (!$pharmacyId || !$categoryId) {
            return response()->json(['error' => 'Both pharmacyId and categoryId are required'], 400);
        }

        // Retrieve pharm items from database based on provided IDs
        $pharmItems = Pharma::where('pharmacy_id', $pharmacyId)
                         ->where('category_id', $categoryId)
                         ->get();
        
        // Return JSON response with pharm items data
        return response()->json(['data' => $pharmItems]);
    }
}
