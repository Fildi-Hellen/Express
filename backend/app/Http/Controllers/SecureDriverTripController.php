<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SecureDriverTripController extends Controller
{
    /**
     * Get ride requests available to all drivers (unassigned pending rides)
     * Security: Only shows rides that don't have a driver assigned yet
     */
    public function getAvailableRideRequests(Request $request)
    {
        try {
            // Only show pending rides that don't have a driver assigned yet
            $requests = Ride::where('status', 'pending')
                ->whereNull('driver_id') // Only unassigned rides
                ->with('user:id,name') 
                ->orderBy('created_at', 'desc')
                ->get(['id','user_id','pickup_location','destination','eta','fare','created_at'])
                ->map(fn($r) => [
                    'id'             => $r->id,
                    'user_id'        => $r->user_id, // Include customer ID
                    'customer_id'    => $r->user_id, // Alternative field name
                    'customerId'     => $r->user_id, // Another alternative
                    'passengerName'  => $r->user->name,
                    'pickupLocation' => $r->pickup_location,
                    'destination'    => $r->destination,
                    'eta'            => $r->eta,
                    'fareEstimate'   => $r->fare,
                    'requestTime'    => $r->created_at->format('H:i'),
                ]);

            return response()->json([
                'success' => true,
                'data' => $requests,
                'message' => 'Available ride requests retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting available ride requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve ride requests'
            ], 500);
        }
    }

    /**
     * Get current rides assigned to the authenticated driver
     * Security: Only shows rides assigned to this specific driver
     */
    public function getMyCurrentRides(Request $request)
    {
        try {
            $driverId = $request->user()->id;

            $currentRides = Ride::with('user:id,name')
                ->where('driver_id', $driverId)
                ->whereIn('status', ['confirmed', 'in_progress'])
                ->orderBy('created_at', 'desc')
                ->get(['id','user_id','pickup_location','destination','fare','status','created_at'])
                ->map(fn($r) => [
                    'id'             => $r->id,
                    'user_id'        => $r->user_id, // Include customer ID
                    'customer_id'    => $r->user_id, // Alternative field name
                    'customerId'     => $r->user_id, // Another alternative
                    'passengerName'  => $r->user->name,
                    'pickupLocation' => $r->pickup_location,
                    'destination'    => $r->destination,
                    'fare'           => $r->fare,
                    'status'         => $r->status,
                    'assignedAt'     => $r->created_at->format('Y-m-d H:i'),
                ]);

            return response()->json([
                'success' => true,
                'data' => $currentRides,
                'message' => 'Current rides retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting driver current rides: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve current rides'
            ], 500);
        }
    }

    /**
     * Get trip history for the authenticated driver
     * Security: Only shows completed/cancelled trips assigned to this driver
     */
    public function getMyTripHistory(Request $request)
    {
        try {
            $driverId = $request->user()->id;
            
            $history = Ride::with('user:id,name')
                ->where('driver_id', $driverId)
                ->whereIn('status', ['completed', 'cancelled'])
                ->orderBy('completed_at', 'desc')
                ->get(['id','user_id','pickup_location','destination','fare','status','created_at','completed_at'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'user_id' => $r->user_id, // Include customer ID
                    'passengerName' => $r->user->name,
                    'pickupLocation' => $r->pickup_location,
                    'destination' => $r->destination,
                    'fare' => $r->fare,
                    'status' => $r->status,
                    'date' => $r->created_at->format('Y-m-d'),
                    'time' => $r->created_at->format('H:i'),
                    'completedAt' => $r->completed_at?->format('Y-m-d H:i'),
                ]);

            return response()->json([
                'success' => true,
                'data' => $history,
                'message' => 'Trip history retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting driver trip history: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve trip history'
            ], 500);
        }
    }

    /**
     * Accept a ride request
     * Security: Verifies ride is available and driver is authenticated
     */
    public function acceptRide(Request $request, $rideId)
    {
        try {
            $driverId = $request->user()->id;
            
            // Find the ride and ensure it's available
            $ride = Ride::where('id', $rideId)
                ->where('status', 'pending')
                ->whereNull('driver_id')
                ->first();

            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not available or already assigned'
                ], 404);
            }

            // Assign the ride to this driver
            $ride->update([
                'driver_id' => $driverId,
                'status' => 'confirmed',
            ]);

            // Update driver availability
            $driver = Driver::find($driverId);
            if ($driver) {
                $driver->update(['is_available' => false]);
            }

            return response()->json([
                'success' => true,
                'data' => $ride,
                'message' => 'Ride accepted successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error accepting ride: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept ride'
            ], 500);
        }
    }

    /**
     * Cancel a ride assigned to the driver
     * Security: Only allows canceling rides assigned to this driver
     */
    public function cancelMyRide(Request $request, $rideId)
    {
        try {
            $driverId = $request->user()->id;
            
            $validated = $request->validate([
                'reason' => 'required|string|min:5|max:255'
            ]);
            
            // Find the ride assigned to this driver
            $ride = Ride::where('id', $rideId)
                ->where('driver_id', $driverId)
                ->where('status', 'confirmed')
                ->first();

            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not found or cannot be cancelled'
                ], 404);
            }

            // Cancel the ride
            $ride->update([
                'status' => 'cancelled',
                'cancellation_reason' => $validated['reason']
            ]);

            // Make driver available again
            $driver = Driver::find($driverId);
            if ($driver) {
                $driver->update(['is_available' => true]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Ride cancelled successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error cancelling ride: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel ride'
            ], 500);
        }
    }

    /**
     * Start a trip (when driver reaches pickup location)
     * Security: Only allows starting trips assigned to this driver
     */
    public function startMyTrip(Request $request, $rideId)
    {
        try {
            $driverId = $request->user()->id;
            
            $ride = Ride::where('id', $rideId)
                ->where('driver_id', $driverId)
                ->where('status', 'confirmed')
                ->first();

            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not found or cannot be started'
                ], 404);
            }

            $ride->update([
                'status' => 'in_progress',
                'started_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'data' => $ride,
                'message' => 'Trip started successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error starting trip: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to start trip'
            ], 500);
        }
    }

    /**
     * Complete a trip
     * Security: Only allows completing trips assigned to this driver
     */
    public function completeMyTrip(Request $request, $rideId)
    {
        try {
            $driverId = $request->user()->id;
            
            $ride = Ride::where('id', $rideId)
                ->where('driver_id', $driverId)
                ->where('status', 'in_progress')
                ->first();

            if (!$ride) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride not found or cannot be completed'
                ], 404);
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
                'data' => $ride,
                'message' => 'Trip completed successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error completing trip: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete trip'
            ], 500);
        }
    }

    /**
     * Get driver's earnings summary
     * Security: Only shows earnings for this driver
     */
    public function getMyEarnings(Request $request)
    {
        try {
            $driverId = $request->user()->id;
            
            $completedRides = Ride::where('driver_id', $driverId)
                ->where('status', 'completed')
                ->get();

            $totalEarnings = $completedRides->sum('fare');
            $totalTrips = $completedRides->count();
            $averageEarning = $totalTrips > 0 ? $totalEarnings / $totalTrips : 0;

            // Today's earnings
            $todayEarnings = Ride::where('driver_id', $driverId)
                ->where('status', 'completed')
                ->whereDate('completed_at', today())
                ->sum('fare');

            return response()->json([
                'success' => true,
                'data' => [
                    'totalEarnings' => $totalEarnings,
                    'totalTrips' => $totalTrips,
                    'averageEarning' => round($averageEarning, 2),
                    'todayEarnings' => $todayEarnings,
                ],
                'message' => 'Earnings retrieved successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting driver earnings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve earnings'
            ], 500);
        }
    }
}
