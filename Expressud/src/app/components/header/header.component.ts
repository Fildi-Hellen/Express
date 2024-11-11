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

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkAuthenticationStatus();

    this.authService.authStatus$.subscribe(isAuthenticated => {
      this.isAuth = isAuthenticated;
      this.user = this.authService.getUser();
    });

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

  checkAuthenticationStatus(): void {
    this.isAuth = this.authService.isAuthenticated();
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.user = {};
    this.isAuth = false;
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
}
