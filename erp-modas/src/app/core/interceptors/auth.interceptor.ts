import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiBase = environment.apiUrl.replace(/\/$/, '');
  const url = req.url.split('?')[0];

  const isApi = url.startsWith(`${apiBase}/`);
  const isLogin = url === `${apiBase}/auth/login`;
  const isLogout = url === `${apiBase}/auth/logout`;
  const isPublic = url.startsWith(`${apiBase}/publico/`) || url ===(`${apiBase}/catalogo/`)
  || url.startsWith(`${apiBase}/catalogo/`);


  const token = authService.getToken();

  const requisicao = isApi && token && !isLogin && !isPublic ? req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }) : req;

  return next(requisicao).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        isApi &&
        !isLogin &&
        !isLogout &&
        !isPublic
      ) {
        authService.encerrarSessaoLocal();
      }

      return throwError(() => error);
    })
  );
  //return next(req); // passa direto sem token
};