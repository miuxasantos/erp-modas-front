// pages/vendas/venda-detalhe/venda-detalhe.component.ts
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
import { VendaApiService } from '@core/services/venda/venda-api.service';
import { VendaResponseDto } from '@core/dtos/venda/venda-response.dto';

@Component({
    selector: 'app-venda-detalhe',
    imports: [
        ButtonModule, CardModule, TableModule,
        TagModule, CurrencyPipe, DatePipe,
        PageHeaderComponent,
    ],
    templateUrl: './venda-detalhe.component.html',
})
export class VendaDetalheComponent implements OnInit {
    private readonly vendaApi = inject(VendaApiService);
    private readonly router   = inject(Router);

    id    = input.required<number>();
    venda: VendaResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Vendas',    routerLink: '/vendas' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        this.vendaApi.getById(this.id()).subscribe({
            next: venda => this.venda = venda,
        });
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

    editar(): void {
        this.router.navigate(['/vendas', this.id(), 'editar']);
    }

    voltar(): void {
        this.router.navigate(['/vendas']);
    }
}