<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorDashboardController;
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

// Route::prefix('vendor')->name('vendor.')->group(function () {
//     Route::get('login', [VendorLoginController::class, 'showLoginForm'])->name('login');
//     Route::post('login', [VendorLoginController::class, 'login']);

//     Route::middleware('auth:vendor')->group(function () {
//         Route::post('logout', [VendorLoginController::class, 'logout'])->name('logout');
//         Route::get('dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');
       
//     });
// });
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



// Route::middleware('auth:vendor')->group(function () {
//     Route::post('/vendor/menus', [MenuController::class, 'store']);
//     Route::get('/vendor/profile', [VendorController::class, 'profile']);
// });



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
