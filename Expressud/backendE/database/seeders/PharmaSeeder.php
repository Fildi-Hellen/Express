<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Pharma;
use App\Models\Pharmacy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PharmaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // Retrieve the pharmacy named 'Eco Chic'
       $pharmacy = Pharmacy::where('name', 'Eco Chic')->first();
        
       if (!$pharmacy) {
           throw new \Exception('Pharmacy "Eco Chic" not found.');
       }

       // Check if the category with ID 12 exists
       $category = Category::find(12);
       if (!$category) {
           throw new \Exception('No category found with ID 12.');
       }


       // Example pharma items to be seeded
       $pharmas = [
           ['name' => 'Ayurvedic Hydrating Face Cream', 'photoUrl' => 'assets/eco/facecream.jpeg', 'category_id' => 12, 'price' => 25],
           ['name' => 'Ayurvedic Exfoliating Face Wash', 'photoUrl' => 'assets/eco/facewash.jpeg', 'category_id' => 12, 'price' => 25],
           ['name' => 'Ayurvedic Instant Glow Vitamin C Serum', 'photoUrl' => 'assets/eco/serum.jpeg', 'category_id' => 12, 'price' => 25],
           ['name' => 'Ayurvedic Anti Aging Face Oil', 'photoUrl' => 'assets/eco/ant-aging.jpeg', 'category_id' => 12, 'price' => 19],
           ['name' => 'Ayurvedic Whitening Cream', 'photoUrl' => 'assets/eco/racedark.jpeg', 'category_id' => 12, 'price' => 25],
           ['name' => 'Ayurvedic Hydrating & Glowing Toner', 'photoUrl' => 'assets/eco/echo1.jpeg', 'category_id' => 12, 'price' => 25],
           ['name' => 'Ayurvedic Acne Mask', 'photoUrl' => 'assets/eco/greentea.jpeg', 'category_id' => 12, 'price' => 25],
       ];

       // Seed the pharma items
       foreach ($pharmas as $pharma) {
           Pharma::create([
               'name' => $pharma['name'],
               'photoUrl' => $pharma['photoUrl'],
               'pharmacy_id' => $pharmacy->id,
               'category_id' => $pharma['category_id'],
               'price' => $pharma['price'],
               'created_at' => now(),
               'updated_at' => now(),
           ]);
       }

    }
}
