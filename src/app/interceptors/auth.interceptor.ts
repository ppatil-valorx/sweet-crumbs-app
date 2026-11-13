import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer sweetcrumbs-token'
    }
  });

  return next(authReq);
};