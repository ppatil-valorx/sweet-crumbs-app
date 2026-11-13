
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let errorMessage = '';

      switch (error.status) {

        case 0:
          errorMessage = 'Cannot reach the order server. Is it running?';
          break;

        case 401:
          errorMessage = 'Not allowed. The server rejected the token.';
          break;

        case 404:
          errorMessage = 'That order no longer exists.';
          break;

        case 400: {
          const serverMessage = error.error?.message || 'Validation failed.';
          const firstError = error.error?.errors?.[0]?.message;

          errorMessage = firstError
            ? `${serverMessage} ${firstError}`
            : serverMessage;

          break;
        }

        default:
          errorMessage = `Server error (${error.status}).`;
          break;
      }

      errorService.showError(errorMessage);

      console.error('HTTP Error:', errorMessage);

      return throwError(() => error);
    })
  );
};
