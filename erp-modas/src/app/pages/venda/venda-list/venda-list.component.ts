import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { VendaResponseDto } from '@core/dtos/venda/venda-response.dto';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { VendaApiService } from '@core/services/venda/venda-api.service';
import { TemPermissaoDirective } from '@core/directives/tem-permissao.directive';

@Component({
    selector: 'app-venda-list',
    imports: [
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        PageHeaderComponent,
        CurrencyPipe,
        DatePipe,
        TemPermissaoDirective
    ],
    templateUrl: './venda-list.component.html',
})

export class VendaListComponent implements OnInit {
    private readonly vendaApi            = inject(VendaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService      = inject(MessageService);
    private readonly router              = inject(Router);

    vendas: VendaResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Vendas' },
    ];

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.vendaApi.getAll().subscribe({
        next: vendas => this.vendas = vendas,
        });
    }

    nova(): void {
        this.router.navigate(['/vendas/nova']);
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/vendas', id]);
    }

    editar(id: number): void {
        this.router.navigate(['/vendas', id, 'editar']);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta venda?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.vendaApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Venda excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}