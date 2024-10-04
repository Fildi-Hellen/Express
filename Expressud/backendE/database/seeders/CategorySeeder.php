<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Soft Drinks', 'photoUrl' => 'assets/img/mvp/drinks.jpg'],
            ['name' => 'Smoothie & Juice', 'photoUrl' => 'assets/img/mvp/smoothie.jpg'],
            ['name' => 'Ice Creams', 'photoUrl' => 'assets/img/mvp/ice.jpg'],
            ['name' => 'Sweets', 'photoUrl' => 'assets/img/mvp/sweets.jpg'],
            ['name' => 'Thai & Chinese', 'photoUrl' => 'assets/img/mvp/thai.jpg'],
            ['name' => 'Sandwich', 'photoUrl' => 'assets/img/mvp/sandwich.jpg'],
            ['name' => 'Stew', 'photoUrl' => 'assets/img/mvp/stew.jpg'],
            ['name' => 'Soups', 'photoUrl' => 'assets/img/mvp/soup.jpg'],
            ['name' => 'Pizzas', 'photoUrl' => 'assets/img/mvp/pizza.jpg'],
            ['name' => 'Side Dish', 'photoUrl' => 'assets/img/mvp/side-dish.jpg'],
            ['name' => 'Main Dish', 'photoUrl' => 'assets/img/mvp/main.jpg'],
            ['name' => 'Skin care', 'photoUrl' => 'assets/img/mvp/eco.jpeg'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
