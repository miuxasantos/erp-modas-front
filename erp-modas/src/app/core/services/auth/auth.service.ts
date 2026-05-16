import { computed, inject, Injectable, signal } from "@angular/core";
import { LoginRequestDto } from "@core/dtos/auth/login-request.dto";
import { UsuarioResponseDto } from "@core/dtos/usuario/usuario-response.dto";
import { map, Observable, tap } from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { Router } from "@angular/router";
import { Usuario } from "@core/models/usuario.model";

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly api = inject(AuthApiService);
    private readonly router = inject(Router);

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USUARIO_KEY = 'auth_usuario';

    private readonly _usuario = signal<Usuario | null>(this.getUsuarioStorage());

    readonly usuario = this._usuario.asReadonly();
    readonly logado = computed(() => !!this._usuario());

    login(dto: LoginRequestDto): Observable<void> {
        return this.api.login(dto).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USUARIO_KEY, JSON.stringify(response.usuario));
                this._usuario.set(new Usuario(response.usuario));
                this.router.navigate(['/dashboard']);
            }),
            map(() => void 0)
        );
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

    private getUsuarioStorage(): Usuario | null {
        const raw = localStorage.getItem(this.USUARIO_KEY);
        if(!raw) return null;
        const dto = JSON.parse(raw) as UsuarioResponseDto;
        return new Usuario(dto); 
    }

}