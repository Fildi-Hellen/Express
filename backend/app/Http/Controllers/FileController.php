<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    /**
     * Serve profile pictures directly through PHP
     */
    public function serveProfilePicture($filename)
    {
        try {
            // Log the request for debugging
            Log::info('File request: ' . $filename);
            
            $path = 'profile_pictures/' . $filename;
            
            if (!Storage::disk('public')->exists($path)) {
                Log::warning('File not found: ' . $path);
                return response()->json(['error' => 'Image not found'], 404);
            }
            
            $file = Storage::disk('public')->get($path);
            $mimeType = Storage::disk('public')->mimeType($path);
            
            return Response::make($file, 200, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
                'Cache-Control' => 'public, max-age=3600'
            ]);
        } catch (\Exception $e) {
            Log::error('Error serving file: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}