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
import { TagModule } from 'primeng/tag';
import { CompraApiService } from '@core/services/compra/compra-api.service';
import { ProdutoApiService } from '@core/services/produto/produto-api.service';
import { VariacaoProdutoApiService } from '@core/services/apoio/variacao-produto-api.service';
import { FornecedorResponseDto } from '@core/dtos/fornecedor/fornecedor-response.dto';
import { ProdutoResponseDto } from '@core/dtos/produto/produto-response.dto';
import { VariacaoProdutoResponseDto } from '@core/dtos/variacaoProduto/variacao-produto-response.dto';
import { FornecedorApiService } from '@core/services/fornecedor-api.service';
import { CorApiService } from '@core/services/apoio/cor-api.service';
import { TamanhoApiService } from '@core/services/apoio/tamanho-api.service';
import { forkJoin } from 'rxjs';
import { CorResponseDto } from '@core/dtos/cor/cor-response.dto';
import { TamanhoResponseDto } from '@core/dtos/tamanho/tamanho-response.dto';
import { ActivatedRoute } from '@angular/router';

interface VariacaoEnriquecida extends Omit<VariacaoProdutoResponseDto, 'cor' | 'tamanho'> {
    cor: CorResponseDto;
    tamanho: TamanhoResponseDto;
}

@Component({
    selector: 'app-compra-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule, CardModule, InputTextModule,
        InputNumberModule, SelectModule, DialogModule,
        TableModule, TooltipModule, CurrencyPipe, TagModule,
        PageHeaderComponent,
    ],
    templateUrl: './compra-form.component.html',
})

export class CompraFormComponent implements OnInit {
    private readonly compraApi = inject(CompraApiService);
    private readonly fornecedorApi = inject(FornecedorApiService);
    private readonly produtoApi = inject(ProdutoApiService);
    private readonly variacaoApi = inject(VariacaoProdutoApiService);
    private readonly corApi = inject(CorApiService);
    private readonly tamanhoApi = inject(TamanhoApiService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);

    id: number | null = null;
    isEdicao = false;
    salvando = signal(false);

    fornecedores: FornecedorResponseDto[] = [];
    formasPagamento = Object.values(FormaPagamento);

    termoBusca = signal('');
    produtosFiltrados: ProdutoResponseDto[] = [];
    todosProdutos: ProdutoResponseDto[] = [];

    dialogVariacaoVisivel = signal(false);
    variacoesDoProduto: VariacaoEnriquecida[] = [];
    produtoSelecionado: ProdutoResponseDto | null = null;
    cores: CorResponseDto[] = [];
    tamanhos: TamanhoResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Compras',    routerLink: '/compras' },
        { label: 'Nova Compra' },
    ];

    form = this.fb.group({
        fornecedorId: new FormControl<number | null>(null, Validators.required),
        dataChegada: [new Date(), Validators.required],
        formaPagamento: new FormControl<FormaPagamento | null>(null,Validators.required),
        numeroParcelas: new FormControl<number | null>(null, Validators.required),
        lote: new FormControl<string | null>(null),
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

    get valorTotal(): number {
        return this.subtotal;
    }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;

        this.isEdicao = this.id ? true : false;
        this.carregarDados();
    }

    carregarDados(): void {
        if (this.isEdicao) {
            forkJoin({
                fornecedores: this.fornecedorApi.getAll(),
                produtos: this.produtoApi.getAll(),
                cores: this.corApi.getAll(),
                tamanhos: this.tamanhoApi.getAll(),
                compra: this.compraApi.getById(this.id!),
            }).subscribe({
                next: ({ fornecedores, produtos, cores, tamanhos, compra }) => {
                    this.fornecedores   = fornecedores;
                    this.todosProdutos  = produtos;
                    this.cores          = cores;
                    this.tamanhos       = tamanhos;

                    this.form.patchValue({
                        fornecedorId:   compra.fornecedor.id,
                        dataChegada:    new Date(compra.dataChegada),
                        formaPagamento: compra.formaPagamento,
                        numeroParcelas: compra.numeroParcelas,
                        lote:           compra.lote,
                        observacoes:    compra.observacoes,
                    });

                    compra.itensCompra.forEach(item => this.adicionarItemForm(item));
                },
            });
        } else {
            forkJoin({
                fornecedores: this.fornecedorApi.getAll(),
                produtos:     this.produtoApi.getAll(),
                cores: this.corApi.getAll(),
                tamanhos: this.tamanhoApi.getAll(),
            }).subscribe({
                next: ({ fornecedores, produtos, cores, tamanhos }) => {
                    this.fornecedores = fornecedores;
                    this.todosProdutos = produtos;
                    this.cores = cores;
                    this.tamanhos = tamanhos;
                },
            });
        }
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
                this.variacoesDoProduto = variacoes.map(variacao => ({
                    ...variacao,
                    cor: this.cores.find(c => c.id === variacao.corId)
                        ?? { id: variacao.corId, nome: '—', codigoHex: '' } as CorResponseDto,
                    tamanho: this.tamanhos.find(t => t.id === variacao.tamanhoId)
                        ?? { id: variacao.tamanhoId, tamanho: '—' as any } as TamanhoResponseDto,
                })) as VariacaoEnriquecida[];
                this.dialogVariacaoVisivel.set(true);
            },
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DIALOG DE VARIAÇÃO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    selecionarVariacao(variacao: VariacaoEnriquecida): void {
        this.adicionarItemForm(variacao);
        this.dialogVariacaoVisivel.set(false);
        this.variacoesDoProduto  = [];
        this.produtoSelecionado  = null;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ITENS DO FORMULÁRIO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    adicionarItemForm(item: any): void {
        const quantidade = item?.quantidade ?? 1;
        const valorUnit  = item?.valorUnit ?? item?.precoCusto ?? 0;

        const itemForm = this.fb.group({
            variacaoProdutoId: [item?.variacaoProduto?.id ?? item?.id, Validators.required],
            nomeProduto:       [item?.variacaoProduto?.produto?.nome ?? item?.produto?.nome ?? ''],
            sku:               [item?.variacaoProduto?.sku ?? item?.sku ?? ''],
            quantidade:        [item?.quantidade ?? 1, [Validators.required, Validators.min(1)]],
            valorUnit:         [item?.valorUnit ?? item?.precoCusto ?? 0, Validators.required],
            subTotal:          [quantidade * valorUnit],
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
            fornecedorId:      formValue.fornecedorId,
            dataChegada:      formValue.dataChegada,
            formaPagamento: formValue.formaPagamento,
            numeroParcelas: formValue.numeroParcelas,
            lote:       formValue.lote,
            observacoes:    formValue.observacoes,
            valorTotal:     this.valorTotal,
            itensCompra: formValue.itens!.map((item: any) => ({
                variacaoProdutoId: item.variacaoProdutoId,
                quantidade:        item.quantidade,
                valorUnit:         item.valorUnit,
                subTotal:          item.subTotal,
            })),
        };

        const request$ = this.isEdicao
        ? this.compraApi.update(this.id!, dto as any)
        : this.compraApi.create(dto as any);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.isEdicao ? 'Compra atualizada!' : 'Compra registrada com sucesso!',
                    });
                    this.router.navigate(['/compras']);
                    this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    cancelar(): void {
        this.router.navigate(['/compras']);
    }
}