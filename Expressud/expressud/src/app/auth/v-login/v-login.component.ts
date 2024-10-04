import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-v-login',
  templateUrl: './v-login.component.html',
  styleUrls: ['./v-login.component.css']
})
export class VLoginComponent {

  credentials = { email: '', password: '' };
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.authService.login(this.credentials).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.authService.setUser(res.user);
        this.router.navigateByUrl(this.returnUrl);
      },
      err => console.error('Login error:', err)
    );
  }

}
