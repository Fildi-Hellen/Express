<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Pharmacy;
use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure categories with IDs from 1 to 11 exist
        $categories = Category::whereBetween('id', [1, 11])->get();

        if ($categories->isEmpty()) {
            // If no categories with these IDs exist, throw an error
            throw new \Exception('No categories found with IDs from 1 to 11.');
        }

        // Create the restaurant
        $restaurant = Restaurant::create([
            'name' => 'London Castle',
        ]);

      


        // Attach the restaurant to the retrieved categories
        $restaurant->categories()->attach($categories);

       
    }
 }



