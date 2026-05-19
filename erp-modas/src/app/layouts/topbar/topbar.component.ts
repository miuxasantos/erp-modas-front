import { Component, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/services/auth/auth.service";
import { CaixaService } from "@core/services/caixa/caixa.service";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { AvatarModule } from "primeng/avatar";

@Component({
    selector: 'app-topbar',
    imports: [ButtonModule, AvatarModule, MenuModule],
    templateUrl: './topbar.component.html',
})

export class TopbarComponent {
    private readonly authService = inject(AuthService);
    private readonly caixaService = inject(CaixaService);
    private readonly router = inject(Router);

    menuClick = output<void>();

    usuario = this.authService.usuario;
    caixaAberto = this.caixaService.caixaAberto;

    menuUsuario: MenuItem[] = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => this.router.navigate(['/perfil']),
        },
        {
            separator: true,
        },
        {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout(),
        }
    ];
}