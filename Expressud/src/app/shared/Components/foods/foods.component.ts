import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from 'src/app/Services/food.service';



@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {
  foodItems: any[] = [];
  loading: boolean = true;
  error: string | null = null; // Add an error property

  constructor(private foodService: FoodService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllFoodCategory();
  }

  loadAllFoodCategory() {
    this.foodService.getAllFoods().subscribe(
      (res: any) => {
        this.foodItems = res.data;
        this.loading = false;
        this.error = null; // Reset error if request succeeds
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.error = error.message || 'Unknown error occurred. Please try again later.';
      }
    );
  }
  

  navigateToRestaurantFoods(categoryId: number) {
    // Verify that categoryId is not undefined or null
    if (categoryId !== undefined && categoryId !== null) {
      console.log("Category categoryId:", categoryId); // Log the categoryId
      this.router.navigate(['/restaurant-foods', categoryId]);
    } else {
      console.error("Category categoryId is undefined or null.");
      // Handle the error appropriately, e.g., display a message to the user
    }
  }

  
}

