// pages/condicionals/condicional-detalhe/condicional-detalhe.component.ts
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatusConta } from '@core/enums/status-conta.enum';
import { MenuItem } from 'primeng/api';
import { CondicionalApiService } from '@core/services/condicional/condicional-api.service';
import { CondicionalResponseDto } from '@core/dtos/condicional/condicional-response.dto';

@Component({
    selector: 'app-condicional-detalhe',
    imports: [
        ButtonModule, CardModule, TableModule,
        TagModule, DatePipe,
        PageHeaderComponent,
    ],
    templateUrl: './condicional-detalhe.component.html',
})
export class CondicionalDetalheComponent implements OnInit {
    private readonly condicionalApi = inject(CondicionalApiService);
    private readonly router   = inject(Router);

    id = input.required<number>();
    condicional: CondicionalResponseDto  | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Condicionais', routerLink: '/condicionais' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        this.condicionalApi.getById(this.id()).subscribe({
            next: condicional => this.condicional = condicional,
        });
    }

    editar(): void {
        this.router.navigate(['/condicionais', this.id(), 'editar']);
    }

    voltar(): void {
        this.router.navigate(['/condicionais']);
    }
}