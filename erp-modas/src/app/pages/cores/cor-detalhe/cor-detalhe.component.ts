import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CorApiService } from '@core/services/apoio/cor-api.service';
import { CorResponseDto } from '@core/dtos/apoio/cor/cor-response.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-cor-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './cor-detalhe.component.html',
})

export class CorDetalheComponent implements OnInit {
    private readonly corApi = inject(CorApiService);
    private readonly router     = inject(Router);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;

    cor: CorResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Cores',   routerLink: '/cores' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.carregarDados();
    }

    carregarDados(): void {
        this.corApi.getById(this.id!).subscribe({
        next: cor => this.cor = cor,
        });
    }
    voltar(): void {
        this.router.navigate(['/cores']);
    }
}