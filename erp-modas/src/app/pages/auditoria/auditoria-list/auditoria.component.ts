
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AuditoriaApiService } from '@core/services/especial/auditoria-api.service';
import { AuditoriaResponseDto } from '@core/dtos/auditoria/auditoria-response.dto';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    PageHeaderComponent,
  ],
  templateUrl: './auditoria.component.html',
})
export class AuditoriaComponent implements OnInit {
    private readonly auditoriaApi = inject(AuditoriaApiService);
    private readonly messageService = inject(MessageService);

    auditorias = signal<AuditoriaResponseDto[]>([]);
    carregando = signal(false);

    breadcrumbs: MenuItem[] = [
        {label: 'Home', routerLink: '/home'},
        { label: 'Auditoria' },
    ];

    ngOnInit(): void {
        this.carregarAuditorias();
    }

    carregarAuditorias(): void {
        this.carregando.set(true);

        this.auditoriaApi.listar().subscribe({
        next: (dados) => {
            this.auditorias.set(dados);
            this.carregando.set(false);
        },
        error: () => {
            this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar os registros de auditoria.',
            });

            this.carregando.set(false);
        },
        });
    }
}
