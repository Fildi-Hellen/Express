<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorDashboardController;
use App\Http\Controllers\VendorLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/vendor/register', [VendorController::class, 'register']);
Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);

Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);
Route::post('/vendor/reset-password', [VendorLoginController::class, 'resetPassword']);



// Route::prefix('vendor')->name('vendor.')->group(function () {
//     Route::get('login', [VendorLoginController::class, 'showLoginForm'])->name('login');
//     Route::post('login', [VendorLoginController::class, 'login']);

//     Route::middleware('auth:vendor')->group(function () {
//         Route::post('logout', [VendorLoginController::class, 'logout'])->name('logout');
//         Route::get('dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');
       
//     });
// });

Route::get('/menus', [CustomerController::class, 'index'])->name('customer.menus.index');
Route::get('/menus/{id}', [CustomerController::class, 'show'])->name('customer.menus.show');

// Route::middleware('auth:vendor')->group(function () {
//     Route::post('/vendor/menus', [MenuController::class, 'store']);
//     Route::get('/vendor/profile', [VendorController::class, 'profile']);
// });




Route::prefix('admin')->group(function () {
    Route::get('unapproved-menus', [AdminController::class, 'unapprovedMenus']);
    Route::post('approve-menu/{id}', [AdminController::class, 'approveMenu']);

    Route::get('unverified-vendors', [AdminController::class, 'unverifiedVendors']);
    Route::post('verify-vendor/{id}', [AdminController::class, 'verifyVendor']);
    Route::post('reject-vendor/{id}', [AdminController::class, 'rejectVendor']);
    Route::post('request-more-info/{id}', [AdminController::class, 'requestMoreInfo']);
});
