// pages/financeiro/caixa/caixa-detalhe/caixa-detalhe.component.ts
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CaixaService } from '@core/services/caixa/caixa.service';
import { MovimentacoesCaixaApiService } from '@core/services/dependentes/movimentacoes-caixa-api.service';
import { Caixa } from '@core/models/caixa.model';
import { MovimentacoesCaixaResponseDto } from '@core/dtos/dependentes/movimentacoesCaixa/movimentacoes-caixa-response.dto';
import { TipoMovCaixa } from '@core/enums/tipo-mov-caixa.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-caixa-detalhe',
    imports: [ButtonModule, CardModule, TableModule, TagModule, CurrencyPipe, DatePipe, PageHeaderComponent],
    templateUrl: './caixa-detalhe.component.html',
})

export class CaixaDetalheComponent implements OnInit {
    private readonly caixaService = inject(CaixaService);
    private readonly movimentacaoApi = inject(MovimentacoesCaixaApiService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;
    caixa: Caixa | null = null;
    movimentacoes: MovimentacoesCaixaResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Financeiro' },
        { label: 'Caixa', routerLink: '/financeiro/caixa' },
        { label: 'Histórico', routerLink: '/financeiro/caixa/historico' },
        { label: 'Detalhe' },
    ];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.carregarDados();
    }

    carregarDados(): void {
        this.caixaService.getById(this.id!).subscribe({
            next: caixa => {
                this.caixa = caixa;
                this.movimentacaoApi.getByCaixa(caixa.id).subscribe({
                next: movs => this.movimentacoes = movs,
                });
            },
        });
    }

    getTipoSeverity(tipo: TipoMovCaixa): 'success' | 'danger' {
        return tipo === TipoMovCaixa.ENTRADA ? 'success' : 'danger';
    }

    voltar(): void {
        this.router.navigate(['/financeiro/caixa/historico']);
    }
}