import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatusConta } from '@core/enums/status-conta.enum';
import { MenuItem } from 'primeng/api';
import { CompraApiService } from '@core/services/compra/compra-api.service';
import { CompraResponseDto } from '@core/dtos/compra/compra-response.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-compra-detalhe',
    imports: [
        ButtonModule, CardModule, TableModule,
        TagModule, CurrencyPipe, DatePipe,
        PageHeaderComponent,
    ],
    templateUrl: './compra-detalhe.component.html',
})
export class CompraDetalheComponent implements OnInit {
    private readonly compraApi = inject(CompraApiService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;
    compra: CompraResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Compras',    routerLink: '/compras' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;
        this.carregarCompra();
    }

    getStatusSeverity(status: StatusConta): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
            PAGO:      'success',
            PENDENTE:  'warn',
            VENCIDO:   'danger',
            CANCELADO: 'secondary',
        };
        return map[status] ?? 'info';
    }

    carregarCompra(): void {
        this.compraApi.getById(this.id!).subscribe({
            next: compra => this.compra = compra,
        });
    }

    editar(): void {
        this.router.navigate(['/compras', this.id!, 'editar']);
    }

    voltar(): void {
        this.router.navigate(['/compras']);
    }
}