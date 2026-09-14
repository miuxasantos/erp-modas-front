import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { MarcaApiService } from '@core/services/marca-api.service';
import { MarcaResponseDto } from '@core/dtos/marca/marca-response.dto';

@Component({
    selector: 'app-marca-detalhe',
    imports: [ButtonModule, CardModule, PageHeaderComponent],
    templateUrl: './marca-detalhe.component.html',
})

export class MarcaDetalheComponent implements OnInit {
    private readonly marcaApi = inject(MarcaApiService);
    private readonly router     = inject(Router);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;

    marca: MarcaResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Marcas',   routerLink: '/marcas' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.carregarDados();
    }

    carregarDados(): void {
        this.marcaApi.getById(this.id!).subscribe({
        next: marca => this.marca = marca,
        });
    }
    
    voltar(): void {
        this.router.navigate(['/marcas']);
    }
}