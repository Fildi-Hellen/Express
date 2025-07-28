<?php

namespace App\Http\Controllers ;

use App\Models\vendor;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class VendorLoginController extends Controller
{


     public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:vendors',
            'password' => 'required|string|min:6',
        ]);

        $vendor = vendor::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Vendor registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $vendor = vendor::where('email', $request->email)->first();

        if (!$vendor || !Hash::check($request->password, $vendor->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $vendor->createToken('vendor-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'vendor'  => $vendor,
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
    // protected $redirectTo = '/vendor/dashboard';

    // public function __construct()
    // {
    //     $this->middleware('guest:vendor')->except('logout');
    // }

    // public function showLoginForm()
    // {
    //     return view('vendor.auth.login');
    // }

    // public function login(Request $request)
    // {
    //     $credentials = $request->only('email', 'password');
    
    //     if (Auth::guard('vendor')->attempt($credentials)) {
    //         return response()->json(['message' => 'Login successful'], 200);
    //     }
    
    //     return response()->json(['message' => 'Invalid email or password'], 401);
    // }
    


    // public function logout(Request $request)
    // {
    //     Auth::guard('vendor')->logout();
    //     return redirect('/vendor/login');
    // }

    // public function sendResetLink(Request $request)
    // {
    //     $request->validate(['email' => 'required|email']);
    
    //     // Use the 'vendors' broker
    //     $status = Password::broker('vendors')->sendResetLink(
    //         $request->only('email')
    //     );
    
    //     if ($status === Password::RESET_LINK_SENT) {
    //         return response()->json(['message' => __('A reset link has been sent to your email.')], 200);
    //     }
    
    //     return response()->json(['message' => __('Unable to send reset link.')], 400);
    // }
    

  
    // public function resetPassword(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required|string|min:8|confirmed',
    //         'token' => 'required',
    //     ]);
    
        
    //     $status = Password::broker('vendors')->reset(
    //         $request->only('email', 'password', 'password_confirmation', 'token'),
    //         function ($vendor, $password) {
    //             $vendor->password = Hash::make($password);
    //             $vendor->save();
    //         }
    //     );
    
    //     if ($status === Password::PASSWORD_RESET) {
    //         return response()->json(['message' => __('Password has been reset successfully.')], 200);
    //     }
    
    //     return response()->json(['message' => __('Unable to reset password.')], 400);
    // }
    

}
