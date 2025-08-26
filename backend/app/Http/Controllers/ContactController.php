<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Send email (optional)
        Mail::raw($request->message, function ($message) use ($request) {
            $message->to('intysilva1@gmail.com')
                ->subject($request->subject)
                ->from($request->email, $request->name);
        });

        // Optionally, save the data to the database (uncomment if needed)
        // ContactMessage::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Your message has been sent successfully!',
        ], 200);
    }
}

