import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole, AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  login(role: UserRole): void {
    this.authService.login(role);

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const destination =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/orders';

    void this.router.navigateByUrl(destination);
  }
}
