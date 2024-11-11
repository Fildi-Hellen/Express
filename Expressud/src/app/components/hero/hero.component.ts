import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  @ViewChild(SlickCarouselComponent) slickModal: SlickCarouselComponent | undefined;

  slides = [
    { img: "assets/img/blog/bag.webp" },
    { img: "assets/img/blog/home.jpg" },
    // { img: "assets/img/home.jpeg" },
    {img: "assets/img/instagram/boutiques.jpg"}
  ];
  

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000
  };

  ngAfterViewInit() {
    if (this.slickModal) {
    
    }
  }
}
