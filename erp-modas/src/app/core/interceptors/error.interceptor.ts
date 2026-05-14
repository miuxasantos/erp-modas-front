import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          router.navigate(['/login']);
          messageService.add({
            severity: 'warn',
            summary: 'Sessão expirada',
            detail: 'Faça login novamente',
          });
          break;

        case 403:
          messageService.add({
            severity: 'error',
            summary: 'Acesso negado',
            detail: 'Você não tem permissão para esta ação',
          });
          break;

        case 500:
          messageService.add({
            severity: 'error',
            summary: 'Erro no servidor',
            detail: 'Tente novamente mais tarde',
          });
          break;

        default:
          messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error?.message || 'Ocorreu um erro inesperado',
          });
      }

      return throwError(() => error);
    })
    );
};