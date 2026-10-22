import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {STATUS_TELA} from "./http-context.interceptor";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.context.get(STATUS_TELA).includes(error.status)) {
          return throwError(() => error);
        }
        const caixaAtualNaoEncontrado =
          req.method === 'GET' &&
          req.url.split('?')[0].endsWith('/caixas/atual') &&
          error.status === 404;

        if (caixaAtualNaoEncontrado) {
          return throwError(() => error);
        }

        switch (error.status) {
          case 401:
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