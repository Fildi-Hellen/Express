<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PharmaController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

// routes to get all restaurants
Route::get('restaurants', [RestaurantController::class, 'index']);

Route::get('pharmacies ', [PharmacyController::class, 'index']);

// Route to get all categories
Route::get('categories', [CategoryController::class, 'getAllCategories']);

Route::get('categories/from-36-to-46', [CategoryController::class, 'getCategoriesFrom36To46']);
Route::get('categories/47', [CategoryController::class, 'getCategory47']);

// Route to get restaurants by category
Route::get('categories/{categoryId}/restaurants', [CategoryController::class, 'getRestaurantsByCategory']);

Route::get('categories/{categoryId}/pharmacies', [CategoryController::class, 'getPharmaciesByCategory']);

Route::get('GetFoodItemOfRestaurantByCategory', [FoodController::class, 'getFoodItemsByRestaurantAndCategory']);
Route::get('food-items', [FoodController::class, 'getFoodItemsByRestaurantAndCategory']);

Route::get('GetPharmItemsByPharmacyAndCategory', [PharmaController::class, 'getPharmItemsByPharmacyAndCategory']);
Route::get('pharm-items', [PharmaController::class, 'getPharmItemsByPharmacyAndCategory']);

//authentication
Route::post('vendors/register', [VendorController::class, 'register']);
Route::post('register/customer', [CustomerController::class, 'register']);
Route::post('register/driver', [DriverController::class, 'register']);
Route::post('register/admin', [AdminController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//order
Route::middleware('auth:api')->group(function () {
    Route::post('cart', [CartController::class, 'addToCart']);
  Route::get('cart-items', [CartController::class, 'getCartItems']);
   
});
Route::post('place-order', [OrderController::class, 'placeOrder']);
Route::get('orders', [OrderController::class, 'getOrders']);
Route::get('orders/{id}', [OrderController::class, 'getOrderDetails']);
Route::put('orders/{id}/status', [OrderController::class, 'updateOrderStatus']);

Route::post('send-feedback', [FeedbackController::class, 'sendFeedback']);

Route::post('contact', [ContactController::class, 'sendMessage']);


Route::get('notifications', [NotificationController::class, 'index']);
Route::post('notifications', [NotificationController::class, 'store']);
Route::put('notifications/{id}/read', [NotificationController::class, 'markAsRead']);


Route::get('settings', [SettingsController::class, 'getSettings']);
Route::put('settings', [SettingsController::class, 'updateSettings']);

Route::get('search', [SearchController::class, 'search']);

