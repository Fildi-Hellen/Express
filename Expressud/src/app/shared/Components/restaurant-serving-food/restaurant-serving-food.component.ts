import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/Services/food.service';



@Component({
  selector: 'app-restaurant-serving-food',
  templateUrl: './restaurant-serving-food.component.html',
  styleUrls: ['./restaurant-serving-food.component.css']
})
export class RestaurantServingFoodComponent implements OnInit {
 CategoryId: number = 0;
  restaurantList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CategoryId = +params['categoryId']; // Debug log
      this.GetRestaurantServingByCategoryId();
    });
  }

  GetRestaurantServingByCategoryId(): void {
    this.foodService.getRestaurantServingByCategoryId(this.CategoryId).subscribe(
      data => {
        this.restaurantList = data.data;
      },
      error => {
        console.error('Error fetching restaurants', error);
      }
    );
  }
  

  navigate(restaurantId: number): void {
    this.router.navigate(['/restaurant-food-item', restaurantId, this.CategoryId]);
  }
}

