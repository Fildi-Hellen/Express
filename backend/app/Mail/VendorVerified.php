<?php

namespace App\Mail;

use App\Models\vendor;
use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VendorVerified extends Mailable
{
    use Queueable, SerializesModels;
    
    public $vendor;
    public $link;

    /**
     * Create a new message instance.
     */
    public function __construct($vendor, $link)
    {
        $this->vendor = $vendor;
        $this->link = $link;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vendor Verified',
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

    public function build()
    {
        return $this->subject('Your Business is Verified')
            ->view('emails.vendor_verified');
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
