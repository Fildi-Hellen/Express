import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from 'src/app/Services/food.service';
import { PharmacyService } from 'src/app/Services/pharmacy.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.css'
})
export class PharmacyComponent implements OnInit{

  pharmItems: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private pharmacyService: PharmacyService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllPharmaCategory();
  }

  loadAllPharmaCategory() {
    this.pharmacyService.getAllPharms().subscribe(
      (res: any) => {
        if (Array.isArray(res.data)) {
          // If the response is an array, assign it directly to pharmItems
          this.pharmItems = res.data;
        } else if (typeof res.data === 'object') {
          // If the response is an object, convert it to an array with a single element
          this.pharmItems = [res.data];
        } else {
          // If the response is neither an array nor an object, set pharmItems to an empty array
          this.pharmItems = [];
          this.error = 'Unexpected response format';
          console.error('Expected an array or object but got:', res.data);
        }
        this.loading = false;
        this.error = null;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.error = error.message || 'Unknown error occurred. Please try again later.';
      }
    );
  }

  navigateToPharmacyItem(categoryId: number) {
    if (categoryId !== undefined && categoryId !== null) {
      this.router.navigate(['/pharmacy-item', categoryId]);
    } else {
      console.error("Category ID is undefined or null.");
    }
  }


}
