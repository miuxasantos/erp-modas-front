import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ProdutoApiService } from '@core/services/produto-api.service';
import { ProdutoResponseDto } from '@core/dtos/produto/produto-response.dto';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-produto-detalhe',
    imports: [ButtonModule, CardModule, CurrencyPipe, PageHeaderComponent],
    templateUrl: './produto-detalhe.component.html',
})

export class ProdutoDetalheComponent implements OnInit {
    private readonly produtoApi = inject(ProdutoApiService);
    private readonly router     = inject(Router);

    id = input.required<number>();

    produto: ProdutoResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Produtos',   routerLink: '/produtos' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        this.produtoApi.getById(this.id()).subscribe({
        next: produto => this.produto = produto,
        });
    }

    voltar(): void {
        this.router.navigate(['/produtos']);
    }
}