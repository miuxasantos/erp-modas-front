// pages/financeiro/caixa/caixa-atual/caixa-atual.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CaixaService } from '@core/services/caixa/caixa.service';
import { MovimentacoesCaixaApiService } from '@core/services/dependentes/movimentacoes-caixa-api.service';
import { MovimentacoesCaixaResponseDto } from '@core/dtos/dependentes/movimentacoesCaixa/movimentacoes-caixa-response.dto';
import { TipoMovCaixa } from '@core/enums/tipo-mov-caixa.enum';

@Component({
    selector: 'app-caixa-atual',
    imports: [
        ReactiveFormsModule, ButtonModule, CardModule,
        DialogModule, InputNumberModule, TableModule,
        TagModule, CurrencyPipe, DatePipe, PageHeaderComponent,
    ],
    templateUrl: './caixa-atual.component.html',
})
export class CaixaAtualComponent implements OnInit {
    private readonly caixaService = inject(CaixaService);
    private readonly movimentacaoApi = inject(MovimentacoesCaixaApiService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    caixaAtual = this.caixaService.caixaAtual;
    caixaAberto = this.caixaService.caixaAberto;

    movimentacoes: MovimentacoesCaixaResponseDto[] = [];

    dialogAbrirVisivel = signal(false);
    dialogFecharVisivel = signal(false);
    processando = signal(false);

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Financeiro' },
        { label: 'Caixa' },
    ];

    formAbrir = this.fb.group({
        saldoAbertura: [0, [Validators.required, Validators.min(0)]],
    });

    formFechar = this.fb.group({
        saldoFechamento: [0, [Validators.required, Validators.min(0)]],
    });

    ngOnInit(): void {
        this.caixaService.carregarCaixaAtual().subscribe({
            next: caixa => {
                if (caixa?.id) this.carregarMovimentacoes(caixa.id);
            },
            error: (err) => {
                this.movimentacoes = [];
                if (err.status === 500) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Caixa',
                        detail: 'Nenhum caixa aberto no momento'
                    });
                    return;
                }

                this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar caixa atual'
                });
            }
        });
    }

    carregarMovimentacoes(caixaId: number): void {
        this.movimentacaoApi.getByCaixa(caixaId).subscribe({
        next: movs => this.movimentacoes = movs,
        });
    }

    abrirCaixa(): void {
        if (this.formAbrir.invalid) return;
        this.processando.set(true);

        this.caixaService.abrir().subscribe({
            next: caixa => {
                this.messageService.add({
                severity: 'success',
                summary: 'Caixa aberto',
                detail: `Saldo inicial: ${caixa.saldoAbertura}`,
                });
                this.dialogAbrirVisivel.set(false);
                this.formAbrir.reset({ saldoAbertura: 0 });
                this.carregarMovimentacoes(caixa.id);
                this.processando.set(false);
            },
            error: () => this.processando.set(false),
        });
    }

    fecharCaixa(): void {
        if (this.formFechar.invalid || !this.caixaAtual()?.id) return;
        this.processando.set(true);

        this.caixaService.fechar(this.caixaAtual()!.id).subscribe({
            next: () => {
                this.messageService.add({
                severity: 'success',
                summary: 'Caixa fechado',
                detail: 'Caixa fechado com sucesso',
                });
                this.dialogFecharVisivel.set(false);
                this.formFechar.reset({ saldoFechamento: 0 });
                this.movimentacoes = [];
                this.processando.set(false);
            },
            error: () => this.processando.set(false),
        });
    }

    verHistorico(): void {
        this.router.navigate(['/financeiro/caixa/historico']);
    }

    getTipoSeverity(tipo: TipoMovCaixa): 'success' | 'danger' {
        return tipo === TipoMovCaixa.ENTRADA ? 'success' : 'danger';
    }
}