import { computed, inject, Injectable, signal } from "@angular/core";
import { LoginRequestDto } from "@core/dtos/auth/login-request.dto";
import { UsuarioResponseDto } from "@core/dtos/usuario/usuario-response.dto";
import { map, Observable, tap } from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { Router } from "@angular/router";
import { Usuario } from "@core/models/usuario.model";
import { Cargo } from "@core/enums/cargo.enum";

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly api = inject(AuthApiService);
    private readonly router = inject(Router);

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USUARIO_KEY = 'auth_usuario';

    private readonly _usuario = signal<Usuario | null>(this.getUsuarioStorage());

    readonly usuario = this._usuario.asReadonly();
    readonly logado = computed(() => !!this._usuario());

    // roles

    readonly isProprietario = computed(() => this._usuario()?.cargo === Cargo.PROPRIETARIO);
    readonly isVendedor = computed(() => this._usuario()?.cargo === Cargo.VENDEDOR);

    readonly gerenciarUsuarios = computed(() => this.isProprietario());
    readonly gerenciarFinanceiro = computed(() => this.isProprietario());
    readonly gerenciarProdutos = computed(() => this.isProprietario() || this.isVendedor());
    readonly abrirCaixa = computed(() => this.isProprietario() || this.isVendedor());
    readonly fecharCaixa = computed(() => this.isProprietario() || this.isVendedor());

    login(dto: LoginRequestDto): Observable<void> {
        return this.api.login(dto).pipe(
            tap(response => {
                const usuario = response.usuarioResponseDTO;
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
                this._usuario.set(new Usuario(usuario));
                this.router.navigate(['/home']);
            }),
            map(() => void 0)
        );  
    }

    logout(): void {
        if (!this.getToken()) {
            this.encerrarSessaoLocal();
            return;
        }

        this.api.logout().subscribe({
            complete: () => this.encerrarSessaoLocal(),
            error: () => this.encerrarSessaoLocal(),
        });
    }

    encerrarSessaoLocal(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USUARIO_KEY);
        this._usuario.set(null);
        void this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private getUsuarioStorage(): Usuario | null {
        const raw = localStorage.getItem(this.USUARIO_KEY);

        if (typeof raw !== 'string' || raw.trim().length === 0) {
            return null;
        }

        try {
            const dto = JSON.parse(raw) as UsuarioResponseDto;
            return new Usuario(dto);
        } catch (error) {
            console.error('Erro ao ler usuário salvo:', error);

            localStorage.removeItem(this.USUARIO_KEY);
            localStorage.removeItem(this.TOKEN_KEY);

            return null;
        }
    }

    private limparEDirecionar(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USUARIO_KEY);
        this._usuario.set(null);
        this.router.navigate(['/auth/login']);
    }

}