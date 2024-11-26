<?php

namespace App\Http\Controllers;

class VendorDashboardController extends Controller
{
    public function index()
    {
        return view('vendor.dashboard');
    }
}
