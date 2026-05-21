import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CompraApiService } from '@core/services/compra/compra-api.service';
import { CompraResponseDto } from '@core/dtos/compra/compra-response.dto';

@Component({
    selector: 'app-compra-list',
    imports: [
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        PageHeaderComponent,
        CurrencyPipe,
        DatePipe,
    ],
    templateUrl: './compra-list.component.html',
})

export class CompraListComponent implements OnInit {
    private readonly compraApi            = inject(CompraApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService      = inject(MessageService);
    private readonly router              = inject(Router);

    compras: CompraResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Compras' },
    ];

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.compraApi.getAll().subscribe({
        next: compras => this.compras = compras,
        });
    }

    nova(): void {
        this.router.navigate(['/compras/nova']);
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/compras', id]);
    }

    editar(id: number): void {
        this.router.navigate(['/compras', id, 'editar']);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta compra?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.compraApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Compra excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}