import { AfterViewInit, Component,  ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent  implements AfterViewInit{
  @ViewChild(SlickCarouselComponent) slickModal: SlickCarouselComponent | undefined;

  slides = [
    { img: "assets/img/product-sale.webp" },
    { img: "assets/img/fast.jpg" },
    {img: "assets/img/bag.jpg"}
  ];
  

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

  ngAfterViewInit() {
    if (this.slickModal) {
    
    
    }
  }
}

