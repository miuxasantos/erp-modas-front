// pages/vendas/venda-form/venda-form.component.ts
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MessageService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormaPagamento } from '@core/enums/forma-pagamento.enum';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SelectModule } from 'primeng/select';
import { VendaApiService } from '@core/services/venda/venda-api.service';
import { ClienteApiService } from '@core/services/cliente-api.service';
import { ProdutoApiService } from '@core/services/produto-api.service';
import { VariacaoProdutoApiService } from '@core/services/apoio/variacao-produto-api.service';
import { ClienteResponseDto } from '@core/dtos/cliente/cliente-response.dto';
import { ProdutoResponseDto } from '@core/dtos/produto/produto-response.dto';
import { VariacaoProdutoResponseDto } from '@core/dtos/variacaoProduto/variacao-produto-response.dto';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-venda-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule, CardModule, InputTextModule,
        InputNumberModule, SelectModule, DialogModule,
        TableModule, TooltipModule, CurrencyPipe, TagModule,
        PageHeaderComponent,
    ],
    templateUrl: './venda-form.component.html',
})
export class VendaFormComponent implements OnInit {
    private readonly vendaApi = inject(VendaApiService);
    private readonly clienteApi = inject(ClienteApiService);
    private readonly produtoApi = inject(ProdutoApiService);
    private readonly variacaoApi = inject(VariacaoProdutoApiService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    id = input<number>();
    isEdicao = false;
    salvando = signal(false);

    // dados para os dropdowns
    clientes: ClienteResponseDto[] = [];
    formasPagamento = Object.values(FormaPagamento);

    // busca de produto
    termoBusca = signal('');
    produtosFiltrados: ProdutoResponseDto[] = [];
    todosProdutos: ProdutoResponseDto[] = [];

    // dialog de variações
    dialogVariacaoVisivel = signal(false);
    variacoesDoProduto: VariacaoProdutoResponseDto[] = [];
    produtoSelecionado: ProdutoResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Vendas',    routerLink: '/vendas' },
        { label: 'Nova Venda' },
    ];

    form = this.fb.group({
        clienteId: new FormControl<number | null>(null, Validators.required),
        dataVenda: [new Date(), Validators.required],
        formaPagamento: new FormControl<FormaPagamento | null>(null,Validators.required),
        numeroParcelas: new FormControl<number | null>(null, Validators.required),
        desconto: new FormControl<number | null>(null),
        observacoes: [''],
        itens: this.fb.array([]),
    });

    get itens(): FormArray {
        return this.form.get('itens') as FormArray;
    }

    get subtotal(): number {
        return this.itens.controls.reduce((sum, item) =>
            sum + (item.get('subTotal')?.value || 0), 0
        );
    }

    get valorDesconto(): number {
        return this.form.get('desconto')?.value || 0;
    }

    get valorTotal(): number {
        return this.subtotal - this.valorDesconto;
    }

    ngOnInit(): void {
        this.isEdicao = !!this.id();
        this.carregarDados();

        if (this.isEdicao) {
        this.breadcrumbs[2].label = 'Editar Venda';
        this.carregarVenda();
        }
    }

    carregarDados(): void {
        this.clienteApi.getAll().subscribe({
        next: clientes => this.clientes = clientes,
        });
        this.produtoApi.getAll().subscribe({
        next: produtos => this.todosProdutos = produtos,
        });
    }

    carregarVenda(): void {
        this.vendaApi.getById(this.id()!).subscribe({
        next: venda => {
            this.form.patchValue({
            clienteId:      venda.cliente.id,
            dataVenda:      new Date(venda.dataVenda),
            formaPagamento: venda.formaPagamento,
            numeroParcelas: venda.numeroParcelas,
            desconto:       venda.desconto,
            observacoes:    venda.observacoes,
            });
            venda.itensVenda.forEach(item => this.adicionarItemForm(item));
        },
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BUSCA DE PRODUTO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    buscarProduto(evento: Event): void {
        const termo = (evento.target as HTMLInputElement).value.toLowerCase();
        this.termoBusca.set(termo);

        if (!termo) {
        this.produtosFiltrados = [];
            return;
        }

        this.produtosFiltrados = this.todosProdutos.filter(p =>
            p.nome.toLowerCase().includes(termo) ||
            p.marca.toLowerCase().includes(termo) ||
            p.codigo.toString().includes(termo)
        );
    }

    selecionarProduto(produto: ProdutoResponseDto): void {
        this.produtoSelecionado = produto;
        this.produtosFiltrados  = [];
        this.termoBusca.set('');

        // carrega as variações do produto selecionado
        this.variacaoApi.getAll(produto.id).subscribe({
            next: variacoes => {
                this.variacoesDoProduto = variacoes;
                this.dialogVariacaoVisivel.set(true);
            },
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DIALOG DE VARIAÇÃO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    selecionarVariacao(variacao: VariacaoProdutoResponseDto): void {
        this.adicionarItemForm(variacao);
        this.dialogVariacaoVisivel.set(false);
        this.variacoesDoProduto  = [];
        this.produtoSelecionado  = null;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ITENS DO FORMULÁRIO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    adicionarItemForm(item: any): void {
        const itemForm = this.fb.group({
            variacaoProdutoId: [item?.variacaoProduto?.id ?? item?.id, Validators.required],
            nomeProduto:       [item?.variacaoProduto?.produto?.nome ?? item?.produto?.nome ?? ''],
            sku:               [item?.variacaoProduto?.sku ?? item?.sku ?? ''],
            quantidade:        [item?.quantidade ?? 1, [Validators.required, Validators.min(1)]],
            valorUnit:         [item?.valorUnit ?? item?.precoVenda ?? 0, Validators.required],
            subTotal:          [item?.subTotal ?? item?.precoVenda ?? 0],
        });

        itemForm.get('quantidade')?.valueChanges.subscribe(() => this.recalcularItem(itemForm));
        itemForm.get('valorUnit')?.valueChanges.subscribe(() => this.recalcularItem(itemForm));

        this.itens.push(itemForm);
    }

    recalcularItem(itemForm: any): void {
        const quantidade = itemForm.get('quantidade')?.value || 0;
        const valorUnit  = itemForm.get('valorUnit')?.value  || 0;
        itemForm.get('subTotal')?.setValue(quantidade * valorUnit, { emitEvent: false });
    }

    removerItem(index: number): void {
        this.itens.removeAt(index);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SALVAR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    salvar(): void {
        if (this.form.invalid || this.itens.length === 0) return;
        this.salvando.set(true);

        const formValue = this.form.getRawValue();
        const dto = {
            clienteId:      formValue.clienteId,
            dataVenda:      formValue.dataVenda,
            formaPagamento: formValue.formaPagamento,
            numeroParcelas: formValue.numeroParcelas,
            desconto:       formValue.desconto,
            observacoes:    formValue.observacoes,
            valorTotal:     this.valorTotal,
            itensVenda: formValue.itens!.map((item: any) => ({
                variacaoProdutoId: item.variacaoProdutoId,
                quantidade:        item.quantidade,
                valorUnit:         item.valorUnit,
                subTotal:          item.subTotal,
            })),
        };

        const request$ = this.isEdicao
        ? this.vendaApi.update(this.id()!, dto as any)
        : this.vendaApi.create(dto as any);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.isEdicao ? 'Venda atualizada!' : 'Venda registrada com sucesso!',
                    });
                    this.router.navigate(['/vendas']);
                    this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    cancelar(): void {
        this.router.navigate(['/vendas']);
    }
}