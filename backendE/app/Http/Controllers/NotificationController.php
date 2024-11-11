<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $notifications = Notification::all();
            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json(['result' => false, 'message' => 'Failed to fetch notifications'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string',
            ]);

            $notification = Notification::create([
                'message' => $request->message,
            ]);

            return response()->json(['result' => true, 'message' => 'Notification created successfully', 'data' => $notification]);
        } catch (\Exception $e) {
            Log::error('Error creating notification: ' . $e->getMessage());
            return response()->json(['result' => false, 'message' => 'Failed to create notification'], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $notification = Notification::find($id);
            if ($notification) {
                $notification->read = true;
                $notification->save();
                return response()->json(['result' => true, 'message' => 'Notification marked as read']);
            }

            return response()->json(['result' => false, 'message' => 'Notification not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error marking notification as read: ' . $e->getMessage());
            return response()->json(['result' => false, 'message' => 'Failed to mark notification as read'], 500);
        }
    }
}

