import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/Services/auth.service';
import { CartService } from 'src/app/Services/cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   cartItemCount: number = 0;
  isAuth: boolean = false;
  user: any = {};
  headerType: string = ''; // Track the header type
  isCollapsed = false;
  isMenuOpen = false;
  isResponsive = false;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.cartService.cartItemCount$.subscribe((count: number) => {
      this.cartItemCount = count;
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderType(event.urlAfterRedirects || '');
      });

    this.checkResponsive();
  }
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkResponsive();
  }

  checkResponsive(): void {
    this.isResponsive = window.innerWidth <= 768;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  

 
  updateHeaderType(url: string): void {
    if (url.includes('/partner')) {
      this.headerType = 'vendor-header';
    } else if (url.includes('/deliver')) {
      this.headerType = 'driver-header';
    } else if (url.includes('/admin')) {
      this.headerType = 'admin-header';
    } else {
      this.headerType = 'default-header';
    }
  }
   closeMenu() {
    // If you want the menu to close after clicking a link, just uncomment:
    this.isMenuOpen = false;

    // However, the user requested that after routing, the links should display automatically.
    // So we can leave this commented out if we want to keep the menu open after navigation.
    // If you do want to close the menu on click and then re-open automatically after navigation:
    // Uncomment below line:
    this.isMenuOpen = false;
  }
}
