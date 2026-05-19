import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CorApiService } from '@core/services/apoio/cor-api.service';
import { CorResponseDto } from '@core/dtos/cor/cor-response.dto';

@Component({
    selector: 'app-cor-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './cor-detalhe.component.html',
})

export class CorDetalheComponent implements OnInit {
    private readonly corApi = inject(CorApiService);
    private readonly router     = inject(Router);

    id = input.required<number>();

    cor: CorResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Cores',   routerLink: '/cores' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        this.corApi.getById(this.id()).subscribe({
        next: cor => this.cor = cor,
        });
    }

    voltar(): void {
        this.router.navigate(['/cores']);
    }
}