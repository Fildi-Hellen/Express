import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { StoreService } from 'src/app/Services/store.service';
import { Item } from 'src/app/Shared1/models/item';

@Component({
  selector: 'app-store-item-page',
  templateUrl: './store-item-page.component.html',
  styleUrls: ['./store-item-page.component.css'] 
})
export class StoreItemPageComponent implements OnInit {
  item!: Item;

  // constructor(
  //   private activatedRoute: ActivatedRoute,
  //   private storeService: StoreService<Item>, 
  //   private cartService: CartService<Item>,
  //   private router: Router
  // ) {
  //   this.activatedRoute.params.subscribe((params) => {
  //     if (params.id) {
  //       this.storeService.getItemById(params.id).subscribe((serverItem: Item) => {
  //         this.item = serverItem;
  //       });
  //     }
  //   });
  // }

  ngOnInit(): void {}

  // addToCart() {
  //   this.cartService.addToCart(this.item);
  //   this.router.navigateByUrl('/cart-page');
  // }
}
