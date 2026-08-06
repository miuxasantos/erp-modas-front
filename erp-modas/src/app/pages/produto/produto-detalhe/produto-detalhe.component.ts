import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ProdutoService } from '@core/services/produto/produto.service';
import { CurrencyPipe } from '@angular/common';
import { Produto } from '@core/models/produto.model';
import { forkJoin } from 'rxjs';
import { DatePipe } from "@angular/common";
import { CategoriaApiService } from '@core/services/categoria-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-produto-detalhe',
    imports: [ButtonModule, CardModule, CurrencyPipe, DatePipe, PageHeaderComponent],
    templateUrl: './produto-detalhe.component.html',
})

export class ProdutoDetalheComponent implements OnInit {
    private readonly produtoService = inject(ProdutoService);
    private readonly router     = inject(Router);
    private readonly route      = inject(ActivatedRoute);

    id: number | null = null;

    produto: Produto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard',  routerLink: '/dashboard' },
        { label: 'Produtos',   routerLink: '/produtos' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
       const idParam = this.route.snapshot.paramMap.get('id');
       this.id = idParam ? Number(idParam) : null;
       this.carregarDados();
    }

    carregarDados(): void {
        this.produtoService.getById(this.id!).subscribe({
            next: (produto) => {
                this.produto = produto;
            },
        });
    }

    voltar(): void {
        this.router.navigate(['/produtos']);
    }
}