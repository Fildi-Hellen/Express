<?php

namespace App\Http\Controllers;

use App\Mail\FeedbackMail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    public function sendFeedback(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'comment' => 'required|string',
                'rating' => 'required|integer|min:1|max:5',
                'email' => 'required|email'
            ]);

            $feedbackData = [
                'comment' => $validatedData['comment'],
                'rating' => $validatedData['rating'],
                'email' => $validatedData['email']
            ];

            Mail::to('intysilva1@gmail.com')->send(new FeedbackMail($feedbackData));

            return response()->json(['message' => 'Feedback sent successfully'], 200);
        } catch (Exception $e) {
            // Log the error message
            Log::error('Error sending feedback: ' . $e->getMessage());

            // Return an error response with a meaningful message
            return response()->json(['message' => 'Error sending feedback. Please try again later.'], 500);
        }
    }
}
