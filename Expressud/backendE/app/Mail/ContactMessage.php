<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;
    public $name;
    public $email;
    public $subject;
    public $messageBody;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $subject, $messageBody)
    {
        $this->name = $name;
        $this->email = $email;
        $this->subject = $subject;
        $this->messageBody = $messageBody;
    }
    
    public function build()
    {
        return $this->from('intysilva1@gmail.com')
                    ->subject('New Contact Message: ' . $this->subject)
                    ->view('email.contact');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contact Message',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'email.contact',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
