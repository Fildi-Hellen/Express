import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
 
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  
  likeCount: number = 400; // Initial likes
  isLiked: boolean = false;

  toggleLike() {
    if (this.isLiked) {
      this.likeCount--;
    } else {
      this.likeCount++;
    }
    this.isLiked = !this.isLiked;
  }

}
