// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const token = inject(AuthService).getToken();

  // if (!token) return next(req);

  // return next(req.clone({
  //   setHeaders: { Authorization: `Bearer ${token}` }
  // }));
  // auth.interceptor.ts — temporário
  return next(req); // passa direto sem token
};