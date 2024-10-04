import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PharmacyService } from 'src/app/Services/pharmacy.service';

@Component({
  selector: 'app-pharmacy-serving',
  templateUrl: './pharmacy-serving.component.html',
  styleUrl: './pharmacy-serving.component.css'
})
export class PharmacyServingComponent implements OnInit{


  CategoryId: number = 0;
  pharmacyList: any[] = [];
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pharmacyService: PharmacyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CategoryId = +params['categoryId']; // Debug log
      this.getPharmaciesByCategoryId();
    });
  }

  getPharmaciesByCategoryId(): void {
    this.pharmacyService.getPharmaciesByCategoryId(this.CategoryId).subscribe(
      (data: any) => {
        this.pharmacyList = data.data;
        this.error = null; // Clear error if request succeeds
      },
      (error: HttpErrorResponse) => {
        this.error = error.message || 'Unknown error occurred. Please try again later.';
        console.error('Error fetching pharmacies', error);
      }
    );
  }

  navigate(restaurantId: number): void {
    this.router.navigate(['/pharmacy-items', restaurantId, this.CategoryId]);
  }
}
