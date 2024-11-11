import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

import { PharmacyService } from 'src/app/Services/pharmacy.service';

@Component({
  selector: 'app-pharmacy-items',
  templateUrl: './pharmacy-items.component.html',
  styleUrl: './pharmacy-items.component.css'
})
export class PharmacyItemsComponent implements OnInit {
  pharmacyId: number = 0;
  categoryId: number = 0;
  pharmItemsList: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pharmacyService: PharmacyService,
    private cartService:CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.categoryId = res.categoryId;
      this.pharmacyId = res.pharmacyId;
      this.getPharmItemsByPharmacyAndCategory();
    });
  }

  getPharmItemsByPharmacyAndCategory(): void {
    this.pharmacyService.getPharmItemsByPharmacyAndCategory(this.pharmacyId, this.categoryId).subscribe(
      (res: any) => {
        this.pharmItemsList = res.data;
      },
      (err: any) => {
        console.error('Error fetching pharm items:', err);
      }
    );
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
   
  }

}
