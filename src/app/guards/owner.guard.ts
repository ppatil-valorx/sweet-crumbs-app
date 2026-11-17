import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const ownerGuard: CanMatchFn = () =>
  inject(AuthService).currentUser()?.role === 'owner';
