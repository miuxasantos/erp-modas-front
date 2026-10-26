import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { TecidoApiService } from '@core/services/apoio/tecido-api.service';
import { TecidoResponseDto } from '@core/dtos/apoio/tecido/tecido-response.dto';

@Component({
    selector: 'app-tecido-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './tecido-detalhe.component.html',
})

export class TecidoDetalheComponent implements OnInit {
    private readonly tecidoApi = inject(TecidoApiService);
    private readonly router     = inject(Router);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;

    tecido: TecidoResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Home',  routerLink: '/home' },
        { label: 'Tecidos',   routerLink: '/tecidos' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.carregarDados();
    }

    carregarDados(): void {
        this.tecidoApi.getById(this.id!).subscribe({
        next: tecido => this.tecido = tecido,
        });
    }
    voltar(): void {
        this.router.navigate(['/tecidos']);
    }
}