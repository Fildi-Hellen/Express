<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverAuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\DriverRideController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MessagingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorLoginController;
use App\Http\Controllers\SecureDriverTripController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::options('/{any}', function () {
    return response()->noContent();
})->where('any', '.*');

Route::get('/health', function () {
    $db = 'ok';
    try {
        DB::select('SELECT 1'); // lightweight ping
    } catch (\Throwable $e) {
        $db = 'fail';
        Log::error('DB health check failed', ['err' => $e->getMessage()]);
    }

    return response()->json([
        'status'   => 'ok',
        'app'      => config('app.name'),
        'env'      => config('app.env'),
        'debug'    => (bool) config('app.debug'),
        'url'      => config('app.url'),
        'php'      => PHP_VERSION,
        'db'       => $db,
        'time'     => now()->toIso8601String(),
    ], $db === 'ok' ? 200 : 500);
});


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Test login for development (REMOVE IN PRODUCTION)
Route::post('/test-login', function() {
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'test@example.com'],
        [
            'name' => 'Test User',
            'password' => bcrypt('password123')
        ]
    );
    
    $token = $user->createToken('test-token')->plainTextToken;
    
    return response()->json([
        'user' => $user,
        'token' => $token,
        'message' => 'Test login successful'
    ]);
});
Route::middleware('auth:sanctum')->get('/checkout', function () {
    return response()->json(['message' => 'You are authorized']);
});

Route::post('/api/address', [AddressController::class, 'store']);

Route::post('/vendor/register', [VendorController::class, 'register']);
// Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);

// Route::post('/vendor/forgot-password', [VendorLoginController::class, 'sendResetLink']);
// Route::post('/vendor/reset-password', [VendorLoginController::class, 'resetPassword']);


Route::prefix('vendor')->group(function () {
    Route::post('register', [VendorLoginController::class, 'register']);
    Route::post('login', [VendorLoginController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('profile', [VendorLoginController::class, 'profile']);
        Route::post('logout', [VendorLoginController::class, 'logout']);
    });
});

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




// Public routes (no authentication needed)
Route::post('/drivers/register', [DriverAuthController::class, 'register']); // Driver Registration
Route::post('/drivers/login', [DriverAuthController::class, 'login']);       // Driver Login
Route::get('/drivers/{driverId}/orders', [DriverController::class, 'getDriverOrders']); // Fetch Assigned Orders

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/drivers/logout', [DriverAuthController::class, 'logout']); // Driver Logout
    Route::get('/drivers/available', [DriverController::class, 'getAvailableDrivers']); // Fetch Available Drivers
    Route::post('/orders/{id}/assign-driver', [DriverController::class, 'assignDriver']);   // Assign Driver
    Route::put('/orders/{id}/status', [DriverController::class, 'updateOrderStatus']);     // Update Order Status
    Route::get('/payout/earnings', [DriverController::class, 'earnings']);
    Route::get('/payout/history', [DriverController::class, 'history']);
    Route::get('/payout/settings', [DriverController::class, 'settings']);
    Route::post('/payout/settings', [DriverController::class, 'updateSettings']);
    Route::post('/payout/initiate', [DriverController::class, 'initiate']);
    Route::post('/payout/callback', [DriverController::class, 'callback']);
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

    Route::post('/pay/initiate', [PaymentController::class, 'initiate']);
    Route::post('/webhook/flutterwave', [PaymentController::class, 'handle']);


    Route::middleware('auth:sanctum')->group(function () {
        // Use SecureDriverTripController for proper customer ID handling
        Route::get('/driver/trip-history', [SecureDriverTripController::class, 'getMyTripHistory']);
        Route::get('/driver/current-trips', [SecureDriverTripController::class, 'getMyCurrentRides']);
        Route::get('/driver/trip-requests', [SecureDriverTripController::class, 'getAvailableRideRequests']);
        Route::post('/driver/trip-accept/{rideId}', [SecureDriverTripController::class, 'acceptRide']);
        Route::post('/driver/trip-cancel/{rideId}', [SecureDriverTripController::class, 'cancelMyRide']);
        Route::post('/driver/trip-start/{rideId}', [SecureDriverTripController::class, 'startMyTrip']);
        Route::post('/driver/trip-complete/{rideId}', [SecureDriverTripController::class, 'completeMyTrip']);
        Route::get('/driver/earnings', [SecureDriverTripController::class, 'getMyEarnings']);
    });

// Debug route for storage issues
Route::get('/debug/storage', function() {
    $publicPath = public_path('storage/profile_pictures');
    $storagePath = storage_path('app/public/profile_pictures');
    
    return response()->json([
        'public_path_exists' => is_dir($publicPath),
        'storage_path_exists' => is_dir($storagePath),
        'public_files' => is_dir($publicPath) ? array_diff(scandir($publicPath), ['.', '..']) : [],
        'storage_files' => is_dir($storagePath) ? array_diff(scandir($storagePath), ['.', '..']) : [],
        'symlink_exists' => is_link(public_path('storage')),
        'symlink_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
        'app_url' => config('app.url'),
        'asset_url' => asset('storage/profile_pictures/driver_7_1753608290.png'),
        'url_helper' => url('storage/profile_pictures/driver_7_1753608290.png'),
    ]);
});

    Route::middleware('auth:sanctum')->get('/user/notifications', function () {
    return response()->json(Auth::user()->notifications);
});
Route::middleware('auth:sanctum')->group(function () {

    // Create a new ride
    Route::post('/create-ride', [RideController::class, 'create']);

    // Get available drivers for a ride
    Route::get('/find-drivers/{ride}', [RideController::class, 'findDrivers']);

    // Confirm ride with selected driver
    Route::post('/confirm-ride', [RideController::class, 'confirm']);
    Route::get('/rides/created', [RideController::class, 'getCreatedRides']);

    // Get all rides for the logged-in user
    Route::get('/user/rides', [RideController::class, 'userRides']);
    
    // Debug endpoint for troubleshooting
    Route::get('/user/rides/debug', [RideController::class, 'debugUserRides']);

    // Cancel a pending ride
    Route::post('/cancel-ride/{id}', [RideController::class, 'cancelRide']);

     // 2. Driver panel
    Route::get('/driver/rides/requests',    [RideController::class, 'getDriverRideRequests']);
    Route::post('/driver/rides/{id}/accept',[RideController::class, 'driverAcceptRide']);
    Route::post('/driver/rides/{id}/cancel',[RideController::class, 'driverCancelRide']);
    Route::get('/driver/rides/current',     [RideController::class, 'getDriverCurrentRides']);
    Route::post('/driver/rides/{id}/price-offer',[RideController::class, 'driverMakePriceOffer']);
    Route::post('/driver/rides/{id}/start',[RideController::class, 'driverStartTrip']);
    Route::post('/driver/rides/{id}/complete',[RideController::class, 'driverCompleteTrip']);
    Route::get('/driver/rides/history',[RideController::class, 'getDriverTripHistory']);
    
    // Create ride and find drivers (MOVED INSIDE AUTH GROUP)
    Route::post('/create-and-find-drivers', [RideController::class, 'createAndFindDrivers']);
});

// Note: Removed duplicate routes - already defined above
Route::middleware('auth:sanctum')->group(function () {
    
    // Get all available drivers (for admin or dispatch UI)
    Route::get('/drivers/available', [DriverRideController::class, 'getAvailableDrivers']);

    // Assign a driver to a specific order
    Route::post('/orders/{id}/assign-driver', [DriverRideController::class, 'assignDriver']);

    // Get all active (assigned / on-the-way) orders for a driver
    Route::get('/drivers/{driverId}/orders', [DriverRideController::class, 'getDriverOrders']);

    // Update order status (e.g., assigned → on the way → delivered)
    Route::post('/orders/{id}/status', [DriverRideController::class, 'updateOrderStatus']);
});

// Messaging routes
Route::middleware('auth:sanctum')->group(function () {
    // Messages
    Route::post('/messages', [MessagingController::class, 'sendMessage']);
    Route::get('/conversations/{participantId}', [MessagingController::class, 'getConversation']);
    Route::get('/driver/conversations/{customerId}', [MessagingController::class, 'getDriverConversation']);
    Route::get('/user/current', [MessagingController::class, 'getCurrentUser']);
    
    // Calls
    Route::post('/calls/make', [MessagingController::class, 'makeCall']);
    Route::post('/calls/answer', [MessagingController::class, 'answerCall']);
    Route::post('/calls/end', [MessagingController::class, 'endCall']);
});

// Driver profile routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/drivers/{id}/profile', [DriverController::class, 'getProfile']);
    Route::put('/drivers/{id}/profile', [DriverController::class, 'updateProfile']);
    Route::post('/drivers/{id}/profile-picture', [DriverController::class, 'uploadProfilePicture']);
    Route::delete('/drivers/{id}/profile-picture', [DriverController::class, 'removeProfilePicture']);
});

Route::post('/driver/accept-ride', [RideController::class, 'driverAcceptRide']);
Route::post('/driver/cancel-ride/{id}', [RideController::class, 'driverCancelRide']);

// File serving route for profile pictures
Route::get('/files/profile-pictures/{filename}', [FileController::class, 'serveProfilePicture']);

// Test route to verify routing works
Route::get('/test-route', function() {
    return response()->json(['message' => 'Route is working!']);
});

// Testing routes for messaging (remove in production)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/messaging/test-data', [MessagingController::class, 'createTestData']);
    Route::get('/messaging/conversations', [MessagingController::class, 'getAllConversations']);
    Route::delete('/messaging/clear', [MessagingController::class, 'clearAllMessages']);
    
    // Debug route to check trip data structure
    Route::get('/debug/trip-structure', function() {
        $user = Auth::user();
        $driverId = $user->id;
        
        // Get a sample ride to check structure
        $ride = \App\Models\Ride::with('user:id,name')
            ->where('driver_id', $driverId)
            ->orWhere('driver_id', null)
            ->first();
            
        if (!$ride) {
            // Create a test ride
            $testUser = \App\Models\User::first();
            $ride = \App\Models\Ride::create([
                'user_id' => $testUser->id,
                'pickup_location' => 'Test Pickup',
                'destination' => 'Test Destination',
                'fare' => 1500,
                'status' => 'confirmed',
                'driver_id' => $driverId
            ]);
            $ride->load('user:id,name');
        }
        
        return response()->json([
            'raw_ride' => $ride->toArray(),
            'mapped_current_trip' => [
                'id' => $ride->id,
                'user_id' => $ride->user_id,
                'customer_id' => $ride->user_id,
                'customerId' => $ride->user_id,
                'passengerName' => $ride->user->name,
                'pickupLocation' => $ride->pickup_location,
                'destination' => $ride->destination,
                'fare' => $ride->fare,
                'status' => $ride->status,
                'assignedAt' => $ride->created_at->format('Y-m-d H:i'),
            ],
            'available_fields' => array_keys($ride->toArray()),
            'user_data' => $ride->user ? $ride->user->toArray() : null
        ]);
    });
});