<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Send feedback as an email
        $feedbackData = $request->only('comment', 'rating', 'email');
        Mail::send('emails.feedback', $feedbackData, function ($message) use ($feedbackData) {
            $message->to('intysilva1@gmail.com') // Replace with your support email
                ->subject('New Feedback Received')
                ->from($feedbackData['email'], 'Feedback System');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Feedback sent successfully!',
        ], 200);
    }
}
