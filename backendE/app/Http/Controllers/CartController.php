<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;




class CartController extends Controller

{
    public function addToCart(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'item_id' => 'required|exists:foods,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Find the cart item or create a new one
        $cart = Cart::firstOrCreate([
            'customer_id' => $request->customer_id,
            'item_id' => $request->item_id,
        ]);

        // Increment the quantity
        $cart->increment('quantity', $request->quantity);

        return response()->json(['message' => 'Item added to cart successfully']);
    }

}
