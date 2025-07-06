<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\User;
use App\Models\Ride;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        echo "🌱 Creating comprehensive test data...\n";

        // Create test users (passengers)
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $users[] = User::create([
                'name' => "Test Passenger $i",
                'email' => "passenger$i@example.com",
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
        }
        echo "✅ Created " . count($users) . " test passengers\n";

        // Create test drivers
        $drivers = [];
        for ($i = 1; $i <= 3; $i++) {
            $drivers[] = Driver::create([
                'name' => "Test Driver $i",
                'email' => "driver$i@example.com",
                'password' => Hash::make('password123'),
                'phone' => "+25078812345$i",
                'vehicle_type' => $i == 1 ? 'Motorcycle' : ($i == 2 ? 'Car' : 'SUV'),
                'vehicle_number' => "RAD12$i" . chr(65 + $i),
                'is_available' => true,
                'is_available_for_ride' => true,
                'rating' => 4.0 + ($i * 0.3)
            ]);
        }
        echo "✅ Created " . count($drivers) . " test drivers\n";

        // Create test rides with different statuses
        $locations = [
            ['from' => 'Kigali City Center', 'to' => 'Nyamirambo'],
            ['from' => 'Remera', 'to' => 'Kimisagara'],
            ['from' => 'Gikondo', 'to' => 'Kacyiru'],
            ['from' => 'Nyabugogo', 'to' => 'Gaculiro'],
            ['from' => 'Kabuga', 'to' => 'Kicukiro'],
        ];

        $rides = [];
        
        // Create some pending unassigned rides (available for all drivers)
        for ($i = 0; $i < 3; $i++) {
            $location = $locations[$i];
            $rides[] = Ride::create([
                'user_id' => $users[array_rand($users)]->id,
                'pickup_location' => $location['from'],
                'destination' => $location['to'],
                'fare' => rand(1500, 5000),
                'currency' => 'RWF',
                'passengers' => rand(1, 3),
                'ride_type' => 'standard',
                'status' => 'pending',
                'driver_id' => null, // Unassigned
                'created_at' => now()->subMinutes(rand(10, 120)),
            ]);
        }

        // Create some rides assigned to specific drivers
        for ($i = 0; $i < 2; $i++) {
            $location = $locations[$i + 3];
            $rides[] = Ride::create([
                'user_id' => $users[array_rand($users)]->id,
                'driver_id' => $drivers[0]->id, // Assigned to first driver
                'pickup_location' => $location['from'],
                'destination' => $location['to'],
                'fare' => rand(1500, 5000),
                'currency' => 'RWF',
                'passengers' => rand(1, 3),
                'ride_type' => 'standard',
                'status' => 'confirmed',
                'created_at' => now()->subMinutes(rand(5, 60)),
            ]);
        }

        // Create some completed rides for history
        for ($i = 0; $i < 5; $i++) {
            $location = $locations[array_rand($locations)];
            $driver = $drivers[array_rand($drivers)];
            $rides[] = Ride::create([
                'user_id' => $users[array_rand($users)]->id,
                'driver_id' => $driver->id,
                'pickup_location' => $location['from'],
                'destination' => $location['to'],
                'fare' => rand(1500, 5000),
                'currency' => 'RWF',
                'passengers' => rand(1, 3),
                'ride_type' => 'standard',
                'status' => 'completed',
                'completed_at' => now()->subHours(rand(1, 48)),
                'created_at' => now()->subHours(rand(2, 72)),
            ]);
        }

        echo "✅ Created " . count($rides) . " test rides\n";

        echo "\n🎉 Test data creation complete!\n";
        echo "==========================================\n";
        echo "📱 TEST ACCOUNTS:\n";
        echo "Driver 1: driver1@example.com / password123\n";
        echo "Driver 2: driver2@example.com / password123\n";
        echo "Driver 3: driver3@example.com / password123\n";
        echo "\nPassenger: passenger1@example.com / password123\n";
        echo "==========================================\n";
        echo "📊 DATA CREATED:\n";
        echo "- " . count($users) . " passengers\n";
        echo "- " . count($drivers) . " drivers\n";
        echo "- " . count($rides) . " rides (pending, confirmed, completed)\n";
        echo "==========================================\n";
        echo "🚀 You can now test the trip filtering system!\n";
    }
}
