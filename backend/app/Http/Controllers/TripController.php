<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class TripController extends Controller

{     
    public function getTripHistory(Request $request)
    {
    $driverId = $request->user()->id; // assuming driver is authenticated

    $deliveries = DB::table('deliveries')
        ->where('driver_id', $driverId)
        ->select(
            'created_at as date',
            'earnings',
            'customer_name as passenger',
            'rating',
            'notes'
        );

    $rides = DB::table('rides')
        ->where('driver_id', $driverId)
        ->select(
            'created_at as date',
            'earnings',
            'passenger_name as passenger',
            'rating',
            'notes'
        );

    $trips = $deliveries->unionAll($rides)->orderBy('date', 'desc')->get();

    return response()->json($trips);

}
 

public function getCurrentTrips(Request $request)
    {
        $driverId = $request->user()->id;

        $currentTrips = DB::table('rides')
            ->where('driver_id', $driverId)
            ->where('status', 'ongoing')
            ->select('passenger_name as passengerName', 'pickup_location as pickupLocation', 'destination', 'eta', 'fare')
            ->get();

        return response()->json($currentTrips);
    }

    public function getTripRequests(Request $request)
    {
        $driverId = $request->user()->id;

        $tripRequests = DB::table('trip_requests')
            ->where('driver_id', $driverId)
            ->where('status', 'pending')
            ->select('passenger_name as passengerName', 'pickup_location as pickupLocation', 'destination', 'distance', 'fare_estimate as fareEstimate')
            ->get();

        return response()->json($tripRequests);
    }

    public function acceptTrip(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
        ]);

        DB::table('trip_requests')
            ->where('id', $request->request_id)
            ->update([
                'status' => 'accepted',
            ]);

        return response()->json(['success' => true]);
    }

    public function declineTrip(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer',
        ]);

        DB::table('trip_requests')
            ->where('id', $request->request_id)
            ->update([
                'status' => 'declined',
            ]);

        return response()->json(['success' => true]);
    }
}
