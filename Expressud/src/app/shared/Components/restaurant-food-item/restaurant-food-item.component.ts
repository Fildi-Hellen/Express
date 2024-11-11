import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { FoodService } from 'src/app/Services/food.service';

@Component({
  selector: 'app-restaurant-food-item',
  templateUrl: './restaurant-food-item.component.html',
  styleUrls: ['./restaurant-food-item.component.css']
})
export class RestaurantFoodItemComponent implements OnInit {

  restaurantId: number = 0;
  categoryId: number = 0;
  foodItemsList: any[] = [];

  // nnnnnn

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService:CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.categoryId = res.categoryId;
      this.restaurantId = res.restaurantId;
      this.getFoodItemsByRestaurantAndCategory();
    });
  }

  getFoodItemsByRestaurantAndCategory(): void {
    this.foodService.getFoodItemsByRestaurantAndCategory(this.restaurantId, this.categoryId).subscribe(
      (res: any) => {
        this.foodItemsList = res.data;
      },
      (err: any) => {
        console.error('Error fetching food items:', err);
      }
    );
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
   
  }
}

