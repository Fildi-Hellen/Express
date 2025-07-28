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
use Illuminate\Support\Facades\Log;

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

            // Log for debugging
            Log::info('Sending message', [
                'sender_id' => $senderId,
                'recipient_id' => $request->recipient_id,
                'sender_type' => $request->sender_type,
                'user_id' => $user->id
            ]);

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
            Log::error('Failed to send message', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            
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
            
            Log::info('Getting conversation', [
                'current_user_id' => $currentUserId,
                'participant_id' => $participantId
            ]);
            
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
                'data' => $messages,
                'debug' => [
                    'current_user_id' => $currentUserId,
                    'participant_id' => $participantId,
                    'message_count' => $messages->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to load conversation', [
                'error' => $e->getMessage(),
                'participant_id' => $participantId
            ]);
            
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
        $user = Auth::user();
        
        // Check if user is a driver by looking at driver table
        $driver = Driver::where('email', $user->email)->first();
        
        if (!$driver) {
            // If no driver found, create a test driver for development
            Log::warning('No driver found for user', ['user_id' => $user->id, 'email' => $user->email]);
            
            // For development, create or get a default driver
            $driver = Driver::firstOrCreate(
                ['email' => $user->email],
                [
                    'name' => $user->name,
                    'phone' => $user->phone ?? '0000000000',
                    'license_number' => 'DEV-' . $user->id,
                    'vehicle_make' => 'Toyota',
                    'vehicle_model' => 'Camry',
                    'vehicle_year' => 2020,
                    'vehicle_plate' => 'DEV-' . $user->id,
                    'status' => 'active'
                ]
            );
        }
        
        return $driver->id;
    }

    /**
     * Get messages for testing (driver interface)
     */
    public function getDriverConversation(Request $request, $customerId): JsonResponse
    {
        try {
            $user = Auth::user();
            $driverId = $this->getDriverId();
            
            Log::info('Getting driver conversation', [
                'driver_id' => $driverId,
                'customer_id' => $customerId
            ]);
            
            // Get messages between driver and customer
            $messages = Message::where(function ($query) use ($driverId, $customerId) {
                $query->where('sender_id', $driverId)
                      ->where('recipient_id', $customerId)
                      ->where('sender_type', 'driver');
            })->orWhere(function ($query) use ($driverId, $customerId) {
                $query->where('sender_id', $customerId)
                      ->where('recipient_id', $driverId)
                      ->where('sender_type', 'user');
            })
            ->with(['sender'])
            ->orderBy('created_at', 'asc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $messages,
                'debug' => [
                    'driver_id' => $driverId,
                    'customer_id' => $customerId,
                    'message_count' => $messages->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to load driver conversation', [
                'error' => $e->getMessage(),
                'customer_id' => $customerId
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to load conversation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current authenticated user info
     */
    public function getCurrentUser(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $driver = Driver::where('email', $user->email)->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'driver_id' => $driver ? $driver->id : null,
                    'is_driver' => $driver ? true : false,
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user info',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create test data for messaging system
     */
    public function createTestData(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get or create test customer
            $testCustomer = User::firstOrCreate(
                ['email' => 'testcustomer@example.com'],
                [
                    'name' => 'Test Customer',
                    'password' => bcrypt('password123'),
                    'phone' => '1234567890'
                ]
            );

            // Get or create test driver
            $testDriver = Driver::firstOrCreate(
                ['email' => 'testdriver@example.com'],
                [
                    'name' => 'Test Driver',
                    'phone' => '0987654321',
                    'license_number' => 'TEST-001',
                    'vehicle_make' => 'Toyota',
                    'vehicle_model' => 'Camry',
                    'vehicle_year' => 2020,
                    'vehicle_plate' => 'TEST-001',
                    'status' => 'active'
                ]
            );

            // Create test messages
            $testMessages = [
                [
                    'sender_id' => $testCustomer->id,
                    'recipient_id' => $testDriver->id,
                    'content' => "Hello! I'm ready for pickup.",
                    'sender_type' => 'user',
                    'created_at' => now()->subMinutes(5),
                    'updated_at' => now()->subMinutes(5)
                ],
                [
                    'sender_id' => $testDriver->id,
                    'recipient_id' => $testCustomer->id,
                    'content' => "Hi! I'm on my way, arriving in 3 minutes.",
                    'sender_type' => 'driver',
                    'created_at' => now()->subMinutes(4),
                    'updated_at' => now()->subMinutes(4)
                ],
                [
                    'sender_id' => $testCustomer->id,
                    'recipient_id' => $testDriver->id,
                    'content' => "Perfect! I'm wearing a red jacket.",
                    'sender_type' => 'user',
                    'created_at' => now()->subMinutes(2),
                    'updated_at' => now()->subMinutes(2)
                ],
                [
                    'sender_id' => $testDriver->id,
                    'recipient_id' => $testCustomer->id,
                    'content' => "Great! I can see you. Blue Honda Civic.",
                    'sender_type' => 'driver',
                    'created_at' => now()->subMinutes(1),
                    'updated_at' => now()->subMinutes(1)
                ]
            ];

            foreach ($testMessages as $messageData) {
                Message::create($messageData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Test data created successfully',
                'data' => [
                    'test_customer_id' => $testCustomer->id,
                    'test_driver_id' => $testDriver->id,
                    'messages_created' => count($testMessages)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to create test data', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create test data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all conversations for debugging
     */
    public function getAllConversations(Request $request): JsonResponse
    {
        try {
            $conversations = Message::with(['sender'])
                ->select('sender_id', 'recipient_id', 'sender_type', 
                        DB::raw('COUNT(*) as message_count'),
                        DB::raw('MAX(created_at) as last_message'))
                ->groupBy('sender_id', 'recipient_id', 'sender_type')
                ->orderBy('last_message', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $conversations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get conversations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all messages (for testing)
     */
    public function clearAllMessages(Request $request): JsonResponse
    {
        try {
            $deletedCount = Message::truncate();
            
            return response()->json([
                'success' => true,
                'message' => 'All messages cleared successfully',
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
