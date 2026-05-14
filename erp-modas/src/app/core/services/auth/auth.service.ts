import { computed, inject, Injectable, signal } from "@angular/core";
import { LoginRequestDto } from "@core/dtos/auth/login-request.dto";
import { UsuarioResponseDto } from "@core/dtos/usuario/usuario-response.dto";
import { Observable, tap } from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly api = inject(AuthApiService);
    private readonly router = inject(Router);

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USUARIO_KEY = 'auth_usuario';

    private readonly _usuario = signal<UsuarioResponseDto | null>(this.getUsuarioStorage());

    readonly usuario = this._usuario.asReadonly();
    readonly logado = computed(() => !!this._usuario());

    login(dto: LoginRequestDto): Observable<void> {
        return this.api.login(dto).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USUARIO_KEY, JSON.stringify(response.usuario));
                this._usuario.set(response.usuario);
                this.router.navigate(['/dashboard']);
            }),
            // converte o tipo para Observable<void> — o componente não precisa do response
            tap({ next: () => {} })
        ) as unknown as Observable<void>;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USUARIO_KEY);
        this._usuario.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private getUsuarioStorage(): UsuarioResponseDto | null {
        const raw = localStorage.getItem(this.USUARIO_KEY);
        return raw ? JSON.parse(raw) : null;
    }

}