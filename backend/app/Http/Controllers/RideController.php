<?php

namespace App\Http\Controllers;

use App\Events\RequestAccept;
use App\Events\RideCancelled;
use App\Events\RideRequested;
use App\Models\Driver;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\RideAssignedNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class RideController extends Controller



{
// ✅ Create a new ride after payment

   public function createAndFindDrivers(Request $request)
{
    $validated = $request->validate([
       'ride_type'       => 'required|string',
        'pickup_location' => 'required|string',
        'destination'     => 'required|string',
        'fare'            => 'required|numeric|min:1',
        'currency'        => 'required|string',
        'passengers'      => 'required|integer|min:1|max:5',
    ]);

    $ride = Ride::create([
        'user_id'   => Auth::id(),
        'ride_type' => $validated['ride_type'],
        'fare'      => $validated['fare'],
        'pickup_location' => $validated['pickup_location'],  
        'destination'     => $validated['destination'],  
        'currency'  => $validated['currency'],
        'passengers'=> $validated['passengers'],
        'status'    => 'pending',
    ]);

    $availableDrivers = Driver::where('is_available', true)
        ->where('is_available_for_ride', true)
        ->get()
        ->map(function ($driver) use ($ride) {
            $driver->distance = rand(1, 15);
            $driver->time = rand(5, 20);
            $driver->price = $ride->fare + rand(0, 2);
            $driver->rating = number_format(rand(40, 50) / 10, 1);
            $driver->image = 'https://api.dicebear.com/7.x/miniavs/svg?seed=' . urlencode($driver->name);
            return $driver;
        });

    return response()->json([
        'ride' => $ride,
        'drivers' => $availableDrivers
    ]);
}
 public function getCreatedRides(Request $request)
    {
        $userId = Auth::id();

        $rides = Ride::with('driver')           // eager-load driver if you need it
            ->where('user_id', $userId)         // rides the user (passenger) created
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'pickup_location',
                'destination',
                'fare',
                'status',
                'created_at'
            ]);

        return response()->json($rides);
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'ride_id' => 'required|exists:rides,id',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        $ride = Ride::findOrFail($validated['ride_id']);

        if ($ride->status !== 'pending') {
            return response()->json(['message' => 'Ride is already confirmed or assigned'], 400);
        }

        $ride->update([
            'driver_id' => $validated['driver_id'],
            'status' => 'confirmed'
        ]);

        $driver = Driver::find($validated['driver_id']);
        $driver->is_available = false;
        $driver->save();

        Notification::send($driver, new RideAssignedNotification($ride));

        return response()->json(['message' => 'Ride confirmed successfully', 'ride' => $ride]);
    }

    public function userRides()
    {
        try {
            $userId = Auth::id();
            
            $rides = Ride::with(['driver:id,name,phone,vehicle_type,vehicle_model,license_plate,rating'])
                        ->where('user_id', $userId)
                        ->orderBy('created_at', 'desc')
                        ->get();

            // Format the response to match frontend expectations
            $formattedRides = $rides->map(function($ride) {
                return [
                    'id' => $ride->id,
                    'user_id' => $ride->user_id,
                    'driver_id' => $ride->driver_id,
                    'ride_type' => $ride->ride_type ?? 'standard',
                    'pickup_location' => $ride->pickup_location,
                    'destination' => $ride->destination,
                    'fare' => (float) $ride->fare,
                    'currency' => $ride->currency ?? 'RWF',
                    'passengers' => (int) ($ride->passengers ?? 1),
                    'status' => $ride->status,
                    'created_at' => $ride->created_at ? $ride->created_at->format('c') : null, // ISO 8601 format
                    'started_at' => $ride->started_at ? $ride->started_at->format('c') : null,
                    'completed_at' => $ride->completed_at ? $ride->completed_at->format('c') : null,
                    'eta' => $ride->eta,
                    'proposed_price' => $ride->proposed_price ? (float) $ride->proposed_price : null,
                    'price_offer_message' => $ride->price_offer_message,
                    'cancellation_reason' => $ride->cancellation_reason,
                    'driver' => $ride->driver ? [
                        'id' => $ride->driver->id,
                        'name' => $ride->driver->name,
                        'phone' => $ride->driver->phone,
                        'vehicle_type' => $ride->driver->vehicle_type,
                        'vehicle_model' => $ride->driver->vehicle_model,
                        'license_plate' => $ride->driver->license_plate,
                        'rating' => (float) ($ride->driver->rating ?? 0)
                    ] : null
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedRides,
                'count' => $formattedRides->count()
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error fetching user rides: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rides',
                'error' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Debug endpoint to check database content
     */
    public function debugUserRides(Request $request)
    {
        try {
            $userId = Auth::id();
            
            // Get raw ride data without any formatting
            $rawRides = Ride::where('user_id', $userId)->get();
            
            // Get rides with driver relationship
            $ridesWithDriver = Ride::with('driver')
                                ->where('user_id', $userId)
                                ->get();
            
            return response()->json([
                'success' => true,
                'debug_info' => [
                    'user_id' => $userId,
                    'raw_rides_count' => $rawRides->count(),
                    'rides_with_driver_count' => $ridesWithDriver->count(),
                    'raw_rides_sample' => $rawRides->take(2),
                    'rides_with_driver_sample' => $ridesWithDriver->take(2)
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

   

//     public function driverAcceptRide(Request $request)
// {
//     $validated = $request->validate([
//         'ride_id' => 'required|exists:rides,id',
//         'driver_id' => 'required|exists:drivers,id'
//     ]);

//     $ride = Ride::findOrFail($validated['ride_id']);

//     if ($ride->status !== 'pending') {
//         return response()->json(['message' => 'Ride is not available'], 400);
//     }

//     $ride->update([
//         'driver_id' => $validated['driver_id'],
//         'status' => 'confirmed'
//     ]);

//     $driver = Driver::find($validated['driver_id']);
//     $driver->is_available = false;
//     $driver->save();

//     event(new RequestAccept($ride));

//     return response()->json(['message' => 'Ride accepted and user notified']);
// }

public function cancelRide(Request $request, $id)
{
    $ride = Ride::where('user_id', Auth::id())->findOrFail($id);

    if (!in_array($ride->status, ['pending', 'confirmed'])) {
        return response()->json(['message' => 'Only pending or confirmed rides can be cancelled'], 400);
    }

    $validated = $request->validate([
        'reason' => 'required|string|min:5'
    ]);

    $ride->update([
        'status' => 'cancelled',
        'cancellation_reason' => $validated['reason']
    ]);

    if ($ride->driver_id) {
        event(new RideCancelled($ride));
    }

    return response()->json(['message' => 'Ride cancelled', 'reason' => $validated['reason']]);
}

// public function driverCancelRide(Request $request, $id)
// {
//     $ride = Ride::where('driver_id', $request->user()->id)->findOrFail($id);

//     if ($ride->status !== 'confirmed') {
//         return response()->json(['message' => 'Only confirmed rides can be cancelled by driver'], 400);
//     }

//     $validated = $request->validate([
//         'reason' => 'required|string|min:5'
//     ]);

//     $ride->update([
//         'status' => 'cancelled',
//         'cancellation_reason' => $validated['reason']
//     ]);

//     event(new RideCancelled($ride));

//     return response()->json(['message' => 'Ride cancelled successfully by driver']);
// }

 public function getDriverRideRequests(Request $request)
{
    try {
        // Get the authenticated driver ID for logging
        $driverId = $request->user()->id;
        $driver = $request->user(); // Get full driver info
        
        // Get query parameters for filtering
        $filterByDriver = $request->get('filter_by_driver', false);
        $maxDistance = $request->get('max_distance', null);
        $showAll = $request->get('show_all', true); // Default to show all for backwards compatibility

        // Base query: Only show pending rides that don't have a driver assigned yet
        $query = Ride::where('status', 'pending')
            ->whereNull('driver_id') // CRITICAL: Only unassigned rides
            ->with('user:id,name');

        // If driver-specific filtering is requested
        if ($filterByDriver && !$showAll) {
            // Example filtering logic - you can customize this based on your business rules:
            // 1. Filter by driver's preferred ride types
            // 2. Filter by geographic proximity 
            // 3. Filter by driver's working hours
            // 4. Filter by driver's rating requirements
            
            // For now, let's add a simple example filter
            // You might want to add these fields to your database:
            
            // If driver has preferences, filter by them
            // $query->where('ride_type', $driver->preferred_ride_type ?? 'any');
            
            // Limit to recent requests (last 2 hours) for active drivers
            $query->where('created_at', '>=', now()->subHours(2));
        }

        $requests = $query->orderBy('created_at', 'desc')
            ->get(['id','user_id','pickup_location','destination','eta','fare','created_at'])
            ->map(fn($r) => [
                'id'             => $r->id,
                'passengerName'  => $r->user->name,
                'pickupLocation' => $r->pickup_location,
                'destination'    => $r->destination,
                'eta'            => $r->eta ?? '15 mins',
                'fareEstimate'   => $r->fare,
                'distance'       => rand(1, 15) . ' km',
                'requestTime'    => $r->created_at->diffForHumans(),
                'available_to'   => $filterByDriver ? "driver_{$driverId}" : 'all_drivers',
                'created_at'     => $r->created_at->toISOString(),
            ]);

        \Log::info("Returning {$requests->count()} available requests for driver {$driverId} (filtered: " . ($filterByDriver ? 'yes' : 'no') . ")");

        return response()->json([
            'success' => true,
            'data' => $requests,
            'count' => $requests->count(),
            'requested_by_driver' => $driverId,
            'filtering_applied' => $filterByDriver,
            'show_all' => $showAll,
            'security_filter' => 'unassigned_pending_rides_only'
        ]);
        
    } catch (\Exception $e) {
        \Log::error('Error getting ride requests: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'data' => [],
            'error' => 'Failed to load ride requests'
        ], 500);
    }
}

    /** 2. Driver accepts a ride */
    public function driverAcceptRide(Request $request, $id)
    {
        $driverId = Auth::id();
        $ride = Ride::findOrFail($id);

        if ($ride->status !== 'pending') {
            return response()->json(['message'=>'Already processed'], 400);
        }

        $ride->update([
            'driver_id' => $driverId,
            'status'    => 'confirmed',
        ]);

        return response()->json([
            'success' => true,
            'ride'    => $ride
        ]);
    }

    /** 3. Driver cancels a previously confirmed ride */
    public function driverCancelRide(Request $request, $id)
    {
        $driverId = Auth::id();
        $ride = Ride::where('id', $id)
                    ->where('driver_id', $driverId)
                    ->firstOrFail();

        if ($ride->status !== 'confirmed') {
            return response()->json(['message'=>'Cannot cancel'], 400);
        }

        $ride->update(['status' => 'cancelled']);

        return response()->json(['success'=>true]);
    }

  

public function getDriverCurrentRides(Request $request)
{
    $driverId = Auth::id();

    $current = Ride::with('user:id,name')
        ->where('driver_id', $driverId)
        ->whereIn('status', ['confirmed', 'in_progress'])
        ->get(['id','user_id','pickup_location','destination','fare','status'])
        ->map(fn($r) => [
            'id'             => $r->id,
            'passengerName'  => $r->user->name,
            'pickupLocation' => $r->pickup_location,
            'destination'    => $r->destination,
            'fare'           => $r->fare,
            'status'         => $r->status,
        ]);

    return response()->json($current);
}

    /** Driver makes a price offer (increase price) */
    public function driverMakePriceOffer(Request $request, $id)
    {
        $validated = $request->validate([
            'proposed_price' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:255'
        ]);

        $ride = Ride::findOrFail($id);
        
        if ($ride->status !== 'pending') {
            return response()->json(['message' => 'Can only make offers on pending rides'], 400);
        }

        // Update the ride with driver's proposed price
        $ride->update([
            'proposed_price' => $validated['proposed_price'],
            'price_offer_message' => $validated['message'] ?? 'Driver price adjustment'
        ]);

        // Notify user about price change (you can implement real-time notification)
        return response()->json([
            'success' => true,
            'message' => 'Price offer sent to customer',
            'ride' => $ride
        ]);
    }

    /** Start trip (when driver reaches pickup location) */
    public function driverStartTrip(Request $request, $id)
    {
        $driverId = Auth::id();
        $ride = Ride::where('id', $id)
                    ->where('driver_id', $driverId)
                    ->firstOrFail();

        if ($ride->status !== 'confirmed') {
            return response()->json(['message' => 'Trip must be confirmed first'], 400);
        }

        $ride->update([
            'status' => 'in_progress',
            'started_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trip started',
            'ride' => $ride
        ]);
    }

    /** Complete trip */
    public function driverCompleteTrip(Request $request, $id)
    {
        $driverId = Auth::id();
        $ride = Ride::where('id', $id)
                    ->where('driver_id', $driverId)
                    ->firstOrFail();

        if ($ride->status !== 'in_progress') {
            return response()->json(['message' => 'Trip must be in progress'], 400);
        }

        $ride->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);

        // Make driver available again
        $driver = Driver::find($driverId);
        if ($driver) {
            $driver->update(['is_available' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Trip completed successfully',
            'ride' => $ride
        ]);
    }

    /** Get driver's trip history */
    public function getDriverTripHistory(Request $request)
    {
        $driverId = Auth::id();
        
        $history = Ride::with('user:id,name')
            ->where('driver_id', $driverId)
            ->whereIn('status', ['completed', 'cancelled'])
            ->orderBy('created_at', 'desc')
            ->get(['id','user_id','pickup_location','destination','fare','status','created_at','completed_at'])
            ->map(fn($r) => [
                'id' => $r->id,
                'passengerName' => $r->user->name,
                'pickupLocation' => $r->pickup_location,
                'destination' => $r->destination,
                'fare' => $r->fare,
                'status' => $r->status,
                'date' => $r->created_at->format('Y-m-d H:i'),
                'completedAt' => $r->completed_at?->format('Y-m-d H:i')
            ]);

        return response()->json($history);
    }

    /** 
     * Get available ride requests for drivers
     * Security: Only shows unassigned pending rides
     */
    public function getAvailableRideRequestsForDrivers(Request $request)
    {
        try {
            // Only show pending rides that don't have a driver assigned yet
            // This allows any available driver to see and accept these rides
            $requests = Ride::where('status', 'pending')
                ->whereNull('driver_id') // Only unassigned rides
                ->with('user:id,name') 
                ->orderBy('created_at', 'desc')
                ->get(['id','user_id','pickup_location','destination','eta','fare','created_at'])
                ->map(fn($r) => [
                    'id'             => $r->id,
                    'passengerName'  => $r->user->name,
                    'pickupLocation' => $r->pickup_location,
                    'destination'    => $r->destination,
                    'eta'            => $r->eta ?? '15 mins',
                    'fareEstimate'   => $r->fare,
                    'requestTime'    => $r->created_at->diffForHumans(),
                ]);

            return response()->json([
                'success' => true,
                'data' => $requests,
                'count' => $requests->count(),
                'message' => 'Available ride requests retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            // \Log::error('Error getting available ride requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve ride requests'
            ], 500);
        }
    }



}
