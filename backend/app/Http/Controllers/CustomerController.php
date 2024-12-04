<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
   // Retrieve menus by category
   public function getMenusByCategory(Request $request)
   {
       $validated = $request->validate([
           'category' => 'required|string',
       ]);

       $menus = Menu::where('category', $validated['category'])
           ->where('availability', 'available')
           ->get();

       return response()->json(['data' => $menus], 200);
   }

   // Place an order
   public function placeOrder(Request $request)
   {
       $validated = $request->validate([
           'customer_name' => 'required|string|max:255',
           'customer_email' => 'required|email',
           'items' => 'required|array',
           'items.*.menu_id' => 'required|exists:menus,id',
           'items.*.quantity' => 'required|integer|min:1',
       ]);

       $order = Order::create([
           'customer_name' => $validated['customer_name'],
           'customer_email' => $validated['customer_email'],
           'status' => 'pending',
       ]);

       foreach ($validated['items'] as $item) {
           $menu = Menu::find($item['menu_id']);
           $order->items()->create([
               'menu_id' => $menu->id,
               'quantity' => $item['quantity'],
               'price' => $menu->price,
           ]);
       }

       return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
   }
}
