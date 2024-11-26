<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VendorRequestMoreInfo extends Mailable
{
    use Queueable, SerializesModels;
    public $vendor;
    public $message;

    /**
     * Create a new message instance.
     */
    public function __construct( $vendor, $message)
    {
        $this->vendor = $vendor;
        $this->message = $message;
    }

    public function build()
    {
        return $this->view('emails.vendor-request-more-info')
                    ->subject('Request for More Information');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vendor Request More Info',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
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
