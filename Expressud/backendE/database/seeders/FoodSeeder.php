<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Food;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Ensure that the restaurant and categories exist
        $restaurant = Restaurant::where('name', 'London Castle')->first();
        $categoryIds = Category::whereBetween('id', [1, 11])->pluck('id')->toArray();

        if (!$restaurant) {
            throw new \Exception('Restaurant "London Castle" not found.');
        }

        if (empty($categoryIds)) {
            throw new \Exception('No categories found with IDs from 1 to 11.');
        }

        // Example food items to be seeded
        $foods = [

                //smoothie
            ['name' => 'Strawberry with zbade', 'photoUrl' => 'assets/pics/straw.jpg', 'category_id' => 2, 'price' => 8500],
            ['name' => 'Raisins with milk', 'photoUrl' => 'assets/pics/raisin.jpg', 'category_id' => 2, 'price' => 7500],

            ['name' => 'London Special', 'photoUrl' => 'assets/pics/london.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'mixed juice', 'photoUrl' => 'assets/pics/mixed-juice.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Orange juice', 'photoUrl' => 'assets/pics/orange.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Banana with milk', 'photoUrl' => 'assets/pics/banana.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Avocado with milk', 'photoUrl' => 'assets/pics/avocado.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Mango with milk', 'photoUrl' => 'assets/pics/mango.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Guava with milk', 'photoUrl' => 'assets/pics/guava.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Passion Fruit', 'photoUrl' => 'assets/pics/passion.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'water melon juice', 'photoUrl' => 'assets/pics/watermalon.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Avocado', 'photoUrl' => 'assets/pics/avocado.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Guava', 'photoUrl' => 'assets/pics/guava.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Lemon Juice', 'photoUrl' => 'assets/pics/lemon.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Pineapple juice', 'photoUrl' => 'assets/pics/pina.jpg', 'category_id' => 2, 'price' => 6500],
            ['name' => 'Fruit salad', 'photoUrl' => 'assets/pics/salad.jpg', 'category_id' => 2, 'price' => 6500],
        
                //stews
                ['name' => 'chicken curry', 'photoUrl' => 'assets/pics/curry.jpg', 'category_id' => 7, 'price' => 13500],
                ['name' => 'Beef curry', 'photoUrl' => 'assets/pics/curry.jpg', 'category_id' => 7, 'price' => 13500],
                ['name' => 'chicken stew', 'photoUrl' => 'assets/pics/chicken-stew.webp', 'category_id' => 7, 'price' => 13500],
                ['name' => 'Beef stew', 'photoUrl' => 'assets/pics/beef-stew.jpg', 'category_id' => 7, 'price' => 13500],
                ['name' => 'Fish stew', 'photoUrl' => 'assets/pics/fish-stew.jpg', 'category_id' => 7, 'price' => 13500],
                ['name' => 'Vegetable curry', 'photoUrl' => 'assets/pics/vege-soup.jpg', 'category_id' => 7, 'price' => 12500],
                ['name' => 'Chips masala', 'photoUrl' => 'assets/pics/masala.webp', 'category_id' => 7, 'price' => 10500],

             //side dish

             ['name' => 'Chips with eggs', 'photoUrl' => 'assets/pics/chips-eggs.jpg', 'category_id' => 10, 'price' => 10500],
             ['name' => 'Chips ', 'photoUrl' => 'assets/pics/chips.avif', 'category_id' => 10, 'price' => 8500],
             ['name' => 'Steam rice', 'photoUrl' => 'assets/pics/steam.jpg', 'category_id' => 10, 'price' => 8500],
             ['name' => 'Fatira', 'photoUrl' => 'assets/pics/fatira.jpg', 'category_id' => 10, 'price' => 1500],
             ['name' => 'Bread', 'photoUrl' => 'assets/pics/bread.jpg', 'category_id' => 10, 'price' => 600],
            
             //sandwich
             ['name' => 'London Special Burger', 'photoUrl' => 'assets/pics/london-special.jpg', 'category_id' => 6, 'price' => 14500],
             ['name' => 'Cheese Burger', 'photoUrl' => 'assets/pics/cheese.jpg', 'category_id' => 6, 'price' => 13500],
             ['name' => 'Burger Jambo', 'photoUrl' => 'assets/pics/jumbo.jpeg', 'category_id' => 6, 'price' => 8500],
        
             ['name' => 'Shawrama with Cheese', 'photoUrl' => 'assets/pics/Chicken-Shawarma.jpg', 'category_id' => 6, 'price' => 8000],
             ['name' => 'Fish Crispy', 'photoUrl' => 'assets/pics/fish-crispy.jpg', 'category_id' => 6, 'price' => 8000],
             ['name' => 'Shish Tawuk', 'photoUrl' => 'assets/pics/shish.jpg', 'category_id' => 6, 'price' => 8000],
             ['name' => 'Chicken Crispy', 'photoUrl' => 'assets/pics/chicken-crispy.jpg', 'category_id' => 6, 'price' => 8000],
             ['name' => 'Shawrama chicken', 'photoUrl' => 'assets/pics/Chicken-Shawarma.jpg', 'category_id' => 6, 'price' => 8000],
             ['name' => 'Shawrama Beef', 'photoUrl' => 'assets/pics/shawrma.jpg', 'category_id' => 6, 'price' => 7500],
             ['name' => 'Hot Dog', 'photoUrl' => 'assets/pics/hotdog.jpg', 'category_id' => 6, 'price' => 7500],
             ['name' => 'Shish kabab', 'photoUrl' => 'assets/pics/kabab.jpg', 'category_id' => 6, 'price' => 7500],

             //thai & chinese
             ['name' => 'Beef Stir Fried', 'photoUrl' => 'assets/pics/beef-stir.jpg', 'category_id' => 5, 'price' => 13500],
             ['name' => 'Chicken Stir Fried', 'photoUrl' => 'assets/pics/chicken-stir.jpg', 'category_id' => 5, 'price' => 13500],
             ['name' => 'Fried Rice with Chicken', 'photoUrl' => 'assets/pics/chicken-stir.jpg', 'category_id' => 5, 'price' => 13500],
             ['name' => 'Vegetable Stir Fried', 'photoUrl' => 'assets/pics/vegge.jpg', 'category_id' => 5, 'price' => 12500],
             ['name' => 'Fried Rice With Vegetable', 'photoUrl' => 'assets/pics/rice-fried.jpg', 'category_id' => 5, 'price' => 12500],
            

             //pizza
             ['name' => 'Family Pizza', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 23000],


             ['name' => 'Chicken & Tuna Pizza (S)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 13500],
             ['name' => 'Chicken & Tuna Pizza (M)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 15500],
             ['name' => 'Chicken & Tuna Pizza (L)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 19500],
             
             ['name' => 'Tuna Pizza (S)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' =>13500],
             ['name' => 'Tuna Pizza (M)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 15500],
             ['name' => 'Tuna Pizza (L)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 18500],

             ['name' => 'London Pizza (S)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 13000],
             ['name' => 'London Pizza (M)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'London Pizza (L)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Chicken Pizza (S)', 'photoUrl' => 'assets/pics/chicken-pizza.jpg', 'category_id' => 9, 'price' => 13000],
             ['name' => 'Chicken Pizza (M)', 'photoUrl' => 'assets/pics/chicken-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Chicken Pizza (L)', 'photoUrl' => 'assets/pics/chicken-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Beef Pizza (S)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 13000],
             ['name' => 'Beef Pizza (M)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Beeef Pizza (L)', 'photoUrl' => 'assets/pics/beef-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Hotdog Pizza (S)', 'photoUrl' => 'assets/pics/hot-pizza.jpg', 'category_id' => 9, 'price' =>13000],
             ['name' => 'Hotdog Pizza (M)', 'photoUrl' => 'assets/pics/hot-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Hotdog Pizza (L)', 'photoUrl' => 'assets/pics/hot-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Vegetable Pizza (S)', 'photoUrl' => 'assets/pics/vege-pizza.jpg', 'category_id' => 9, 'price' =>13000],
             ['name' => 'Vegetable Pizza (M)', 'photoUrl' => 'assets/pics/vege-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Vegetable Pizza (L)', 'photoUrl' => 'assets/pics/vege-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Tuna Fish (S)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' =>13000],
             ['name' => 'Tuna Fish (M)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Tuna Fish Pizza (L)', 'photoUrl' => 'assets/pics/tuna-pizza.jpg', 'category_id' => 9, 'price' => 17000],

             ['name' => 'Margarita Pizza (S)', 'photoUrl' => 'assets/pics/margherita.jpg', 'category_id' => 9, 'price' =>13000],
             ['name' => 'Margarita Pizza (M)', 'photoUrl' => 'assets/pics/margherita.jpg', 'category_id' => 9, 'price' => 15000],
             ['name' => 'Margarita Pizza (L)', 'photoUrl' => 'assets/pics/margherita.jpg', 'category_id' => 9, 'price' => 17000],
 


             //sweets

             ['name' => 'Basta (Q)', 'photoUrl' => 'assets/pics/basta.jpg', 'category_id' => 4, 'price' => 5500],
             ['name' => 'Basta (H)', 'photoUrl' => 'assets/pics/basta.jpg', 'category_id' => 4, 'price' => 10500],
             ['name' => 'Basta (K)', 'photoUrl' => 'assets/pics/basta.jpg', 'category_id' => 4, 'price' => 6500],

             ['name' => 'Uma All (K)', 'photoUrl' => 'assets/pics/uma.jpg', 'category_id' => 4, 'price' => 5500],

             //main dish
             ['name' => 'Whole Fried Fish', 'photoUrl' => 'assets/pics/whole-fish.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Grilled Chicken Breast', 'photoUrl' => 'assets/pics/grilled-breast.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Chicken with bone', 'photoUrl' => 'assets/pics/chicken-bone.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Fish Fried Fillet', 'photoUrl' => 'assets/pics/fillet-fried.jpg', 'category_id' => 11, 'price' => 15500],
             ['name' => 'Fried Goat Meat', 'photoUrl' => 'assets/pics/goat.jpg', 'category_id' => 11, 'price' => 15500],
             ['name' => 'Half Chicken Fried', 'photoUrl' => 'assets/pics/half.jpg', 'category_id' => 11, 'price' => 15500],
             ['name' => 'Chicken Wings', 'photoUrl' => 'assets/pics/wings.jpg', 'category_id' => 11, 'price' => 14500],
             ['name' => 'Pepper Steak', 'photoUrl' => 'assets/pics/steak.jpg', 'category_id' => 11, 'price' => 14500],
             ['name' => 'Selection of Sausage', 'photoUrl' => 'assets/pics/sausage.jpg', 'category_id' => 11, 'price' => 14500],
             ['name' => 'Fried Chicken Legs', 'photoUrl' => 'assets/pics/legs.jpg', 'category_id' => 11, 'price' => 11500],
             ['name' => 'Mixed Grilled', 'photoUrl' => 'assets/pics/mix.jpg', 'category_id' => 11, 'price' => 18500],
             ['name' => 'Arabic Shawrama', 'photoUrl' => 'assets/pics/meat.jpg', 'category_id' => 11, 'price' => 18500],
             ['name' => 'Broasr Chicken Fried', 'photoUrl' => 'assets/pics/broast.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Chicken Crispy ', 'photoUrl' => 'assets/pics/chicken-crispy.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Fish Crispy', 'photoUrl' => 'assets/pics/fish-crispy.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Shish Kabab', 'photoUrl' => 'assets/pics/kabab.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Shish Tawook ', 'photoUrl' => 'assets/pics/shish.jpg', 'category_id' => 11, 'price' => 16500],
             ['name' => 'Half Chicken BBQ', 'photoUrl' => 'assets/pics/bbq.jpg', 'category_id' => 11, 'price' => 15500],

             //soft drinks
             ['name' => 'Bavaria', 'photoUrl' => 'assets/pics/bavaria.jpg', 'category_id' => 1, 'price' => 5500],
            
             ['name' => 'Redbull', 'photoUrl' => 'assets/pics/redbull.jpg', 'category_id' => 1, 'price' => 5500],
            
             ['name' => 'Soda Bottle', 'photoUrl' => 'assets/pics/soda.jpg', 'category_id' => 1, 'price' => 2500],
            
             ['name' => 'Soda Tin', 'photoUrl' => 'assets/pics/tin.jpg', 'category_id' =>1, 'price' => 2500],
             ['name' => 'Water', 'photoUrl' => 'assets/pics/water.jpg', 'category_id' =>1, 'price' => 800],
            

             //soup
             ['name' => 'Fish Soup full', 'photoUrl' => 'assets/pics/fish-soup.jpg', 'category_id' => 8, 'price' => 13500],
             ['name' => 'Chicken Soup cream', 'photoUrl' => 'assets/pics/chicken-soup.jpg', 'category_id' => 8, 'price' => 10500],
             ['name' => 'Chicken Soup', 'photoUrl' => 'assets/pics/chicken-soup.jpg', 'category_id' => 8, 'price' => 10500],
             ['name' => 'Mushroom Soup Cream', 'photoUrl' => 'assets/pics/mushroom.jpg', 'category_id' => 8, 'price' => 8500],
             ['name' => 'Mushroom Soup ', 'photoUrl' => 'assets/pics/mushroom.jpg', 'category_id' => 8, 'price' => 8500],
             ['name' => 'Vegetable Soup Cream', 'photoUrl' => 'assets/pics/vege-soup.jpg', 'category_id' => 8, 'price' => 8500],
             ['name' => 'Vegetable Soup', 'photoUrl' => 'assets/pics/vege-soup.jpg', 'category_id' => 8, 'price' => 8500],
             

             //ice cream
               
             ['name' => 'ice cream (S)', 'photoUrl' => 'assets/pics/ice-cream.jpg', 'category_id' => 3, 'price' => 1100],
             ['name' => 'ice cream (M)', 'photoUrl' => 'assets/pics/ice-cream.jpg', 'category_id' => 3, 'price' => 3500],
             ['name' => 'ice cream (L)', 'photoUrl' => 'assets/pics/ice-cream.jpg', 'category_id' => 3, 'price' => 4000],



        
            // Add more food items as needed
        ];

        foreach ($foods as $food) {
            Food::create([
                'name' => $food['name'],
                'photoUrl' => $food['photoUrl'],
                'restaurant_id' => $restaurant->id,
                'category_id' => $food['category_id'],
                'price' => $food['price'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    }
}

}