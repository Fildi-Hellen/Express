<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Call;
use App\Models\User;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MessagingController extends Controller
{
    /**
     * Send a message between user and driver
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|integer',
            'content' => 'required|string|max:1000',
            'sender_type' => 'required|in:user,driver'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            
            // Determine sender based on sender_type
            $senderId = $request->sender_type === 'driver' ? 
                $this->getDriverId() : $user->id;

            $message = Message::create([
                'sender_id' => $senderId,
                'recipient_id' => $request->recipient_id,
                'content' => $request->content,
                'sender_type' => $request->sender_type
            ]);

            // Load sender information
            $message->load('sender');

            // Here you would broadcast the message via WebSocket
            // broadcast(new MessageSent($message))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get conversation between user and driver
     */
    public function getConversation(Request $request, $participantId): JsonResponse
    {
        try {
            $user = Auth::user();
            $currentUserId = $user->id;
            
            // Get messages where current user is either sender or recipient
            // and the other participant is the specified participant
            $messages = Message::where(function ($query) use ($currentUserId, $participantId) {
                $query->where('sender_id', $currentUserId)
                      ->where('recipient_id', $participantId);
            })->orWhere(function ($query) use ($currentUserId, $participantId) {
                $query->where('sender_id', $participantId)
                      ->where('recipient_id', $currentUserId);
            })
            ->with(['sender'])
            ->orderBy('created_at', 'asc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load conversation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Make a call
     */
    public function makeCall(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|integer',
            'caller_type' => 'required|in:user,driver'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            
            // Determine caller based on caller_type
            $callerId = $request->caller_type === 'driver' ? 
                $this->getDriverId() : $user->id;

            // End any existing active calls for this user
            Call::where('caller_id', $callerId)
                ->orWhere('recipient_id', $callerId)
                ->where('status', 'active')
                ->update(['status' => 'ended', 'ended_at' => now()]);

            $call = Call::create([
                'caller_id' => $callerId,
                'recipient_id' => $request->recipient_id,
                'caller_type' => $request->caller_type,
                'status' => 'ringing',
                'started_at' => now()
            ]);

            // Here you would broadcast the call via WebSocket
            // broadcast(new CallInitiated($call))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Call initiated',
                'data' => $call
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate call',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Answer a call
     */
    public function answerCall(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $userId = $user->id;

            // Find the active call for this user
            $call = Call::where('recipient_id', $userId)
                        ->where('status', 'ringing')
                        ->first();

            if (!$call) {
                return response()->json([
                    'success' => false,
                    'message' => 'No incoming call found'
                ], 404);
            }

            $call->update([
                'status' => 'connected',
                'answered_at' => now()
            ]);

            // Here you would broadcast the call status via WebSocket
            // broadcast(new CallAnswered($call))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Call answered',
                'data' => $call
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to answer call',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * End a call
     */
    public function endCall(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $userId = $user->id;

            // Find the active call for this user
            $call = Call::where(function ($query) use ($userId) {
                $query->where('caller_id', $userId)
                      ->orWhere('recipient_id', $userId);
            })
            ->whereIn('status', ['ringing', 'connected'])
            ->first();

            if (!$call) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active call found'
                ], 404);
            }

            $call->update([
                'status' => 'ended',
                'ended_at' => now()
            ]);

            // Here you would broadcast the call status via WebSocket
            // broadcast(new CallEnded($call))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Call ended',
                'data' => $call
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end call',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current driver ID
     */
    private function getDriverId(): int
    {
        // This assumes you have a way to identify if the authenticated user is a driver
        // You might need to adjust this based on your authentication system
        $user = Auth::user();
        
        // Check if user is a driver by looking at driver table
        $driver = Driver::where('email', $user->email)->first();
        
        return $driver ? $driver->id : $user->id;
    }
}
