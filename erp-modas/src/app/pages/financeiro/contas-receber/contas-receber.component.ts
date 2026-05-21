import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ContasReceberApiService } from '@core/services/dependentes/contas-receber-api.service';
import { ContasReceberResponseDto } from '@core/dtos/contasReceber/contas-receber-response.dto';
import { StatusConta } from '@core/enums/status-conta.enum';

@Component({
    selector: 'app-contas-receber',
    imports: [
        ReactiveFormsModule, TableModule, ButtonModule,
        TagModule, TooltipModule, DialogModule,
        InputNumberModule, CurrencyPipe, DatePipe,
        PageHeaderComponent,
    ],
    templateUrl: './contas-receber.component.html',
})
export class ContasReceberComponent implements OnInit {
    private readonly contasReceberApi = inject(ContasReceberApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly fb = inject(FormBuilder);

    contas: ContasReceberResponseDto[] = [];
    dialogBaixaVisivel = signal(false);
    contaSelecionada: ContasReceberResponseDto | null = null;
    processando = signal(false);

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Financeiro' },
        { label: 'Contas a Receber' },
    ];

    formBaixa = this.fb.group({
        dataRecebimento: [new Date(), Validators.required],
        valor: [0, [Validators.required, Validators.min(0.01)]],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.contasReceberApi.getAll().subscribe({
        next: contas => this.contas = contas,
        });
    }

    abrirBaixa(conta: ContasReceberResponseDto): void {
        this.contaSelecionada = conta;
        this.formBaixa.patchValue({ valor: conta.valor });
        this.dialogBaixaVisivel.set(true);
    }

    registrarBaixa(): void {
        if (this.formBaixa.invalid || !this.contaSelecionada) return;
        this.processando.set(true);

        const dto = {
        dataRecebimento: this.formBaixa.get('dataRecebimento')?.value,
        statusConta:     StatusConta.PAGO,
        };

        this.contasReceberApi.receber(this.contaSelecionada.id, dto as any).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Recebimento registrado',
            detail: `Parcela ${this.contaSelecionada!.numeroParcela}/${this.contaSelecionada!.totalParcelas} recebida`,
            });
            this.dialogBaixaVisivel.set(false);
            this.contaSelecionada = null;
            this.carregar();
            this.processando.set(false);
        },
        error: () => this.processando.set(false),
        });
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir esta conta?',
        header: 'Confirmar exclusão',
        acceptLabel: 'Sim, excluir',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
            this.contasReceberApi.delete(id).subscribe({
            next: () => {
                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta excluída',
                });
                this.carregar();
            },
            });
        },
        });
    }

    getStatusSeverity(status: StatusConta): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
        const map: Record<StatusConta, 'success' | 'warn' | 'danger' | 'secondary' | 'info' > = {
        [StatusConta.PAGO]:      'success',
        [StatusConta.PENDENTE]:  'warn',
        [StatusConta.VENCIDO]:   'danger',
        [StatusConta.CANCELADO]: 'secondary',
        };
        return map[status] ?? 'info';
    }

    isPendente(status: StatusConta): boolean {
        return status === StatusConta.PENDENTE || status === StatusConta.VENCIDO;
    }
}