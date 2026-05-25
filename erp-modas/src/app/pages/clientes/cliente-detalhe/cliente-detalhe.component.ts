import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ClienteApiService } from '@core/services/cliente-api.service';
import { ClienteResponseDto } from '@core/dtos/cliente/cliente-response.dto';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-cliente-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './cliente-detalhe.component.html',
})

export class ClienteDetalheComponent implements OnInit {
    private readonly clienteApi = inject(ClienteApiService);
    private readonly router     = inject(Router);
    private readonly route      = inject(ActivatedRoute);

    id: number | null = null;

    cliente: ClienteResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Clientes',   routerLink: '/clientes' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;
        this.carregarDados();
    }

    carregarDados(): void {
        this.clienteApi.getById(this.id!).subscribe({
        next: cliente => this.cliente = cliente,
        });
    }

    voltar(): void {
        this.router.navigate(['/clientes']);
    }
}