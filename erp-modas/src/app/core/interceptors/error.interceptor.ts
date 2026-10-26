import { catchError, throwError, from, map, Observable, switchMap, of } from 'rxjs';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {STATUS_TELA} from "./http-context.interceptor";
import { AuthService } from '@core/services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const authService = inject(AuthService);

      return next(req).pipe(
      catchError((erroOriginal: HttpErrorResponse) =>
        // Em downloads (responseType 'blob') o corpo do erro também chega como Blob:
        // converte de volta para JSON antes de seguir com o tratamento normal
        converterErroBlob(erroOriginal).pipe(
          switchMap(error => {
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
                if (authService.logado()) {
                  messageService.add({
                    severity: 'warn',
                    summary: 'Sessão expirada',
                    detail: 'Faça login novamente',
                  });
                }
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
        )
      )
    );
};

function converterErroBlob(error: HttpErrorResponse): Observable<HttpErrorResponse> {
  if (!(error.error instanceof Blob)) {
    return of(error);
  }

  return from(error.error.text()).pipe(
    map(texto => {
      let corpo: unknown = texto;
      try {
        corpo = JSON.parse(texto);
      } catch {
        // Não era JSON: mantém o texto puro
      }
      return new HttpErrorResponse({
        error: corpo,
        headers: error.headers,
        status: error.status,
        statusText: error.statusText,
        url: error.url ?? undefined,
      });
    }),
    // Se nem a leitura do Blob funcionar, segue com o erro original
    catchError(() => of(error))
  );
}