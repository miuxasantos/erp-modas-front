import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule, CheckboxModule],
    templateUrl: './login-page.component.html',
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly msg = inject(MessageService);

    carregando = signal(false);

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    login(): void {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.carregando.set(true);
        const { email, senha } = this.form.getRawValue();

        console.log('E-mail enviado:', email);
        console.log('Senha enviada:', senha);

        this.authService.login({ email: email!, senha: senha! }).subscribe({
            next: () => {}, //redirecionamento
            error: (err) => {
                this.carregando.set(false);
                const detalhe = err.error?.message ?? 'Verifique seu e-mail ou senha';
                this.msg.add({ severity: 'error', summary: 'Erro ao entrar', detail: detalhe  });
            },
        });
    }

    get emailInvalido() {
        const c = this.form.controls.email;
        return c.invalid && c.touched;
    }

    get senhaInvalida() {
        const c = this.form.controls.senha;
        return c.invalid && c.touched;
    }
}