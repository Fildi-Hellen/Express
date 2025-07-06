<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use Illuminate\Support\Facades\Hash;

class TestDriverSeeder extends Seeder
{
    public function run()
    {
        // Create a test driver to verify the system works
        Driver::create([
            'name' => 'Test Driver',
            'email' => 'testdriver@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+250788123456',
            'vehicle_type' => 'Motorcycle',
            'vehicle_number' => 'RAD123B',
            'is_available' => true,
            'is_available_for_ride' => true,
            'rating' => 5.0
        ]);

        echo "Test driver created successfully!\n";
        echo "Email: testdriver@example.com\n";
        echo "Password: password123\n";
    }
}
