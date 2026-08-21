import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CondicionalApiService } from '@core/services/condicional/condicional-api.service';
import { CondicionalResponseDto } from '@core/dtos/condicional/condicional-response.dto';
import { TemPermissaoDirective } from '@core/directives/tem-permissao.directive';

@Component({
    selector: 'app-condicional-list',
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
    templateUrl: './condicional-list.component.html',
})

export class CondicionalListComponent implements OnInit {
    private readonly condicionalApi = inject(CondicionalApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);

    condicionais: CondicionalResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Condicionais' },
    ];

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.condicionalApi.getAll().subscribe({
        next: condicionais => this.condicionais = condicionais,
        });
    }

    nova(): void {
        this.router.navigate(['/condicionais/nova']);
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/condicionais', id]);
    }

    editar(id: number): void {
        this.router.navigate(['/condicionais', id, 'editar']);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta condicional?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.condicionalApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Condicional excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}