import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.css'
})
export class SwiperComponent {
  slides: any[] = [
    {
      imageUrl: 'assets/img/fast.jpg',
      title: 'The 5 best fastfood resturant for the hottest days of the year',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/banner/restu.jpg',
      title: 'The  best chilling place  for the hottest days of the year in south sudan',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/pizza.jpg',
      title: 'The 5 best fastfood resturant for the hottest days of the year',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/product-sale.webp',
      title: 'The 5 best fastfood resturant for the hottest days of the year',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/home.jpeg',
      title: 'The 5 best fastfood resturant for the hottest days of the year',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/banner/pharm.jpg',
      title: 'Get your skincare product and other pharmacuetical products within 15 mins',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
    {
      imageUrl: 'assets/img/banner/courier.jpg',
      title: 'The best courier service in juba we deliver internation within a period of time',
      category: 'Without category',
      date: '2024-04-11T11:20:22+00:00'
    },
   




  ];

  slideGroups: any[][] = [];

  constructor(private datePipe: DatePipe) {
    this.prepareSlideGroups();
  }

  formatDate(date: string | null): string {
    if (!date) {
      return ''; // Return an empty string if date is null
    }
    return this.datePipe.transform(date, 'MMMM d, yyyy') || ''; // Use optional chaining to handle null case
  }

  plusSlides(n: number) {
    // Implement your logic for navigating to the next or previous group of slides
  }

  private prepareSlideGroups() {
    const groupSize = 3; // Number of slides per group
    const totalSlides = this.slides.length;

    for (let i = 0; i < totalSlides; i += groupSize) {
      this.slideGroups.push(this.slides.slice(i, i + groupSize));
    }
  }
}

