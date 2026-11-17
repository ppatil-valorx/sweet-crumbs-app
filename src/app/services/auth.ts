import { Injectable, signal } from '@angular/core';

export type UserRole = 'staff' | 'owner';

export interface AuthUser {
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(null);

  login(role: UserRole): void {
    this.currentUser.set({ role });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
