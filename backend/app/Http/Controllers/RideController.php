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
        $rides = Ride::where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($rides);
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
        // all rides still “pending”
        $requests = Ride::where('status', 'pending')
            ->with('user:id,name') 
            ->get(['id','user_id','pickup_location','destination','eta','fare'])
            ->map(fn($r) => [
                'id'             => $r->id,
                'passengerName'  => $r->user->name,
                'pickupLocation' => $r->pickup_location,
                'destination'    => $r->destination,
                'eta'            => $r->eta,
                'fareEstimate'   => $r->fare,
            ]);

        return response()->json($requests);
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



}
