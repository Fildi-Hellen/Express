import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-heading',
  templateUrl: './hero-heading.component.html',
  styleUrl: './hero-heading.component.css'
})
export class HeroHeadingComponent {

  
  isCollapsed = false;
  isMenuOpen = false;
  isResponsive = false;

 

  ngOnInit(): void {
    
  }

 

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  
}
