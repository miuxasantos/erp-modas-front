import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CaixaService } from '@core/services/caixa/caixa.service';
import { Caixa } from '@core/models/caixa.model';
import { StatusCaixa } from '@core/enums/status-caixa.enum';

@Component({
  selector: 'app-caixa-historico',
  imports: [ButtonModule, TableModule, TagModule, CurrencyPipe, DatePipe, PageHeaderComponent],
  templateUrl: './caixa-historico.component.html',
})
export class CaixaHistoricoComponent implements OnInit {
  private readonly caixaService = inject(CaixaService);
  private readonly router       = inject(Router);

  caixas: Caixa[] = [];

  breadcrumbs: MenuItem[] = [
    { label: 'Dashboard',  routerLink: '/dashboard' },
    { label: 'Financeiro' },
    { label: 'Caixa',      routerLink: '/financeiro/caixa' },
    { label: 'Histórico' },
  ];

  ngOnInit(): void {
    this.caixaService.getAll().subscribe({
      next: caixas => this.caixas = caixas,
    });
  }

  verDetalhe(id: number): void {
    this.router.navigate(['/financeiro/caixa/historico', id]);
  }

  voltar(): void {
    this.router.navigate(['/financeiro/caixa']);
  }

  getStatusSeverity(status: StatusCaixa): 'success' | 'secondary' {
    return status === StatusCaixa.ABERTO ? 'success' : 'secondary';
  }
}