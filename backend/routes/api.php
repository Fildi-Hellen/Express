<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/checkout', function () {
    return response()->json(['message' => 'You are authorized']);
});

Route::post('/api/address', [AddressController::class, 'store']);

Route::post('/api/payment', [PaymentController::class, 'process']);

Route::post('/vendor/register', [VendorController::class, 'register']);
Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);

Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);
Route::post('/vendor/reset-password', [VendorLoginController::class, 'resetPassword']);

Route::post('/contact', [ContactController::class, 'store']);

Route::post('/send-feedback', [FeedbackController::class, 'store']);


Route::get('/menus', [CustomerController::class, 'getMenusByCategory']);
Route::post('/orders', [CustomerController::class, 'placeOrder']);

Route::get('/menus', [CustomerController::class, 'index'])->name('customer.menus.index');
Route::get('/menus/{id}', [CustomerController::class, 'show'])->name('customer.menus.show');

Route::post('/menu', [MenuController::class, 'addMenuItem']);
Route::delete('/menu/{id}', [MenuController::class, 'deleteMenuItem']);
Route::post('/submit-menus', [MenuController::class, 'submitToAdmin']);

Route::get('/categories', [MenuController::class, 'getCategories']);
Route::get('/establishments', [MenuController::class, 'getEstablishmentsByCategory']);
Route::get('/menus-by-establishment', [MenuController::class, 'getMenusByEstablishment']);

Route::post('/save-recipient', [OrderController::class, 'saveRecipient']);
Route::post('/confirm-order', [OrderController::class, 'confirmOrder']);
Route::patch('/update-status/{id}', [OrderController::class, 'updateOrderStatus']);
Route::get('/track-order/{tracking_id}', [OrderController::class, 'trackOrder']);
Route::get('vendor-orders', [OrderController::class, 'getVendorOrders']);



Route::middleware(['auth:sanctum'])->group(function () {
Route::patch('/orders/{id}/assign-driver', [OrderController::class, 'assignDriver']);
Route::get('/drivers', [OrderController::class, 'getAvailableDrivers']);
Route::get('/drivers/available', [OrderController::class, 'getAvailableDrivers']);
Route::get('/driver-orders/{driverId}', [OrderController::class, 'getDriverOrders']);
});
Route::post('/save-payment', [OrderController::class, 'savePayment']);
Route::post('/address', [OrderController::class, 'store']);

// Route::middleware('auth:vendor')->group(function () {
//     Route::post('/vendor/menus', [MenuController::class, 'store']);
//     Route::get('/vendor/profile', [VendorController::class, 'profile']);
// });
// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/orders/{id}/assign-driver', [DriverController::class, 'assignDriver']);
//     Route::get('/drivers/available', [DriverController::class, 'getAvailableDrivers']);
//     Route::get('/drivers', [DriverController::class, 'getAllDrivers']);
//     Route::get('/drivers/{driverId}/orders', [DriverController::class, 'getDriverOrders']);

// });


// Public routes (no authentication needed)
Route::post('/drivers/register', [DriverController::class, 'register']); // Driver Registration
Route::post('/drivers/login', [DriverController::class, 'login']);       // Driver Login
Route::get('/drivers/{driverId}/orders', [DriverController::class, 'getDriverOrders']); // Fetch Assigned Orders

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/drivers/logout', [DriverController::class, 'logout']); // Driver Logout
    Route::get('/drivers/available', [DriverController::class, 'getAvailableDrivers']); // Fetch Available Drivers
    Route::post('/orders/{id}/assign-driver', [DriverController::class, 'assignDriver']);   // Assign Driver
    Route::put('/orders/{id}/status', [DriverController::class, 'updateOrderStatus']);     // Update Order Status
});

Route::prefix('admin')->group(function () {
    Route::get('/menus', [AdminController::class, 'getIncomingMenus']);
    Route::post('/menus/{id}/approve', [AdminController::class, 'approveMenu']);
    Route::post('/menus/{id}/disapprove', [AdminController::class, 'disapproveMenu']);
    Route::put('/menus/{id}/edit', [AdminController::class, 'editMenu']);
        
    Route::get('unverified-vendors', [AdminController::class, 'unverifiedVendors']);
    Route::post('verify-vendor/{id}', [AdminController::class, 'verifyVendor']);
    Route::post('reject-vendor/{id}', [AdminController::class, 'rejectVendor']);
    Route::post('request-more-info/{id}', [AdminController::class, 'requestMoreInfo']);
});

Route::apiResource('blogs', BlogController::class);

Route::post('/blogs/{id}/comments', [BlogController::class, 'addComment']);
Route::delete('/comments/{id}', [BlogController::class, 'deleteComment']);
Route::post('/blogs/{id}/like', [BlogController::class, 'likeBlog']);
Route::get('/blogs/{id}/comments', [BlogController::class, 'viewComments']);



    Route::get('/users', [UserController::class, 'index']); // Retrieve users
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete a user



