import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { UsuarioApiService } from '@core/services/usuario-api.service';
import { UsuarioResponseDto } from '@core/dtos/usuario/usuario-response.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-usuario-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './usuario-detalhe.component.html',
})

export class UsuarioDetalheComponent implements OnInit {
    private readonly usuarioApi = inject(UsuarioApiService);
    private readonly router     = inject(Router);
    private readonly route      = inject(ActivatedRoute);

    id: number | null = null;

    usuario: UsuarioResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Usuarios',   routerLink: '/usuarios' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.carregarDados();
    }

    carregarDados(): void {
        this.usuarioApi.getById(this.id!).subscribe({
            next: usuario => this.usuario = usuario,
        });
    }
    
    voltar(): void {
        this.router.navigate(['/usuarios']);
    }
}