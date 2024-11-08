<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function sendMessage(ContactFormRequest $request)
    {
        $name = $request->input('name');
        $email = $request->input('email');
        $subject = $request->input('subject');
        $messageBody = $request->input('message');

        // Send email
        Mail::to('intysilva1@gmail.com')->send(new ContactMessage($name, $email, $subject, $messageBody));

        return response()->json(['message' => 'Message sent successfully'], 200);
    }
}
