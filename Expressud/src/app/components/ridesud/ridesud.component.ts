// ridesud.component.ts

import { Component, OnInit } from '@angular/core';

interface Slide {
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-ridesud',
  templateUrl: './ridesud.component.html',
  styleUrls: ['./ridesud.component.css']
})
export class RidesudComponent implements OnInit {

  slides: Slide[] = [
    {
      imageUrl: '/assets/img/slide1.jpg',
      title: 'Mobility',
      description: 'Experience seamless transportation with our Mobility services.',
      link: 'https://indriver.onelink.me/lhG6'
    },
    {
      imageUrl: '/assets/img/slide2.jpg',
      title: 'Delivery',
      description: 'Fast and reliable delivery services at your fingertips.',
      link: 'https://indriver.onelink.me/lhG6'
    },
    {
      imageUrl: '/assets/img/slide3.jpg',
      title: 'Specialists',
      description: 'Connect with experts for your specialized transportation needs.',
      link: 'https://indriver.onelink.me/lhG6'
    },
    {
      imageUrl: '/assets/img/slide4.jpg',
      title: 'inVision',
      description: 'Join a fair journey where everyone agrees on ride prices together.',
      link: 'https://indriver.onelink.me/lhG6'
    }
  ];

  activeSlide = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onDownload(): void {
    // Implement desired functionality here
    alert('Download functionality coming soon!');
  }

}
