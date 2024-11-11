<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Pharmacy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      
       // Retrieve the category with ID 47
       $category = Category::find(12);

       if (!$category) {
           // If no category with ID 47 exists, throw an error
           throw new \Exception('No category found with ID 12.');
       }

       // Create the pharmacy
       $pharmacy = Pharmacy::create([
           'name' => 'Eco Chic',
       ]);

       // Attach the pharmacy to the retrieved category
       $pharmacy->categories()->attach($category);
   }

    
}
