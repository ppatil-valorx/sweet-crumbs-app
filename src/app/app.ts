
import { Component, inject, signal } from '@angular/core';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoadingService } from './services/loading-service';
import { ErrorService } from './services/error.service';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  loadingService = inject(LoadingService);
  errorService = inject(ErrorService);
  authService = inject(AuthService);

  private router = inject(Router);

  readonly isNavigating = signal(false);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isNavigating.set(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isNavigating.set(false);
        }
      });
  }

  async logout(): Promise<void> {
    const navigated = await this.router.navigateByUrl('/orders');

    if (navigated) {
      this.authService.logout();
    }
  }

}
