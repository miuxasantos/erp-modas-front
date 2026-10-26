import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ProdutoApiService } from '@core/services/produto/produto-api.service';
import { VariacaoProdutoApiService } from '@core/services/apoio/variacao-produto-api.service';
import { CorApiService } from '@core/services/apoio/cor-api.service';
import { TamanhoApiService } from '@core/services/apoio/tamanho-api.service';
import { ProdutoResponseDto } from '@core/dtos/produto/produto-response.dto';
import { VariacaoProdutoResponseDto } from '@core/dtos/apoio/variacaoProduto/variacao-produto-response.dto';
import { CorResponseDto } from '@core/dtos/apoio/cor/cor-response.dto';
import { TamanhoResponseDto } from '@core/dtos/apoio/tamanho/tamanho-response.dto';
import { UploadApiService } from '@core/services/upload-api.service';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImagemUrlPipe } from '@core/pipes/imagens-url.pipe';
import { VariacaoProdutoRequestDto } from '@core/dtos/apoio/variacaoProduto/variacao-produto-request.dto';
import { CompraFluxoService, ItemCompraPendente } from '@core/services/compra/compra-fluxo.service';
import { ItemCompra } from '@core/models/dependentes/item-compra.model';
import { CheckboxModule } from 'primeng/checkbox';

interface VariacaoGrade {
    corId: number;
    corNome: string;
    tamanhoId: number;
    tamanhoNome: string;
    sku: string;
    // estoque inicial ou quantidade comprada, conforme o modo da tela
    quantidade: number;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
}

interface ResultadoEnvio {
    variacao: VariacaoGrade;
    criada: VariacaoProdutoResponseDto | null;  
}

const STATUS_TRATADOS_GRADE = [0, 400, 409, 500, 502, 503, 504];

@Component({
    selector: 'app-variacoes-produto',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        CardModule,
        CheckboxModule,
        TableModule,
        MultiSelectModule,
        InputNumberModule,
        TagModule,
        TooltipModule,
        CurrencyPipe,
        PageHeaderComponent,
        ImagemUrlPipe,
    ],
    templateUrl: './variacoes-produto.component.html',
})

export class VariacoesProdutoComponent implements OnInit {
    private readonly produtoApi    = inject(ProdutoApiService);
    private readonly variacaoApi   = inject(VariacaoProdutoApiService);
    private readonly corApi        = inject(CorApiService);
    private readonly tamanhoApi    = inject(TamanhoApiService);
    private readonly uploadApi = inject(UploadApiService);
    private readonly compraFluxo = inject(CompraFluxoService);
    private readonly messageService = inject(MessageService);
    private readonly router        = inject(Router);
    private readonly route         = inject(ActivatedRoute);
    private readonly fb            = inject(FormBuilder);

    id: number | null = null;

    //shortcut com contexto
    modoCompra = false;

    produto: ProdutoResponseDto | null = null;
    variacoesCadastradas: VariacaoProdutoResponseDto[] = [];
    cores: CorResponseDto[] = [];
    tamanhos: TamanhoResponseDto[] = [];
    gradePreview: VariacaoGrade[] = [];
    salvando = signal(false);
    imagemEspPreview = signal<string | null>(null);
    uploadingEsp = signal(false);

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Produtos',  routerLink: '/produtos' },
        { label: 'Variações' },
    ];

    formGrade = this.fb.group({
        coresSelecionadas:    [[] as CorResponseDto[]],
        tamanhosSelecionados: [[] as TamanhoResponseDto[]],
        precoCusto: [0],
        precoVenda: [0],
        // marcada por padrão: estoque só entra pela compra.
        // Desmarcar só para produto que já estava na loja antes do sistema (estoque inicial).
        produtoDeCompra: [true],
        quantidadePadrao: [0],
        imagemEsp: [''],
    });

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;
        // só entra no modo compra se ainda existir uma compra esperando o retorno
        this.modoCompra =
            this.route.snapshot.queryParamMap.get('origem') === 'compra' && this.compraFluxo.ativo();

        if (this.modoCompra) {
            this.formGrade.controls.produtoDeCompra.disable();   // travada como "de compra"
            this.formGrade.controls.quantidadePadrao.setValue(1);
        }
        this.carregarDados();
    }

    get informaEstoqueInicial(): boolean {
        return !this.modoCompra && !this.formGrade.controls.produtoDeCompra.value;
    }

    get exibeQuantidade(): boolean {
        return this.modoCompra || this.informaEstoqueInicial;
    }

    get rotuloQuantidade(): string {
        return this.modoCompra ? 'Qtd. comprada' : 'Estoque';
    }

    carregarDados(): void {
        forkJoin({
            produto:   this.produtoApi.getById(this.id!),
            variacoes: this.variacaoApi.getAll(this.id!),
            cores:     this.corApi.getAll(),
            tamanhos:  this.tamanhoApi.getAll(),
        }).subscribe({
            next: ({ produto, variacoes, cores, tamanhos }) => {
                this.produto  = produto;
                this.cores    = cores;
                this.tamanhos = tamanhos;

                this.breadcrumbs[2].label = `Variações — ${produto.nome}`;

                this.formGrade.patchValue({
                    precoCusto: produto.precoCusto,
                    precoVenda: produto.precoVenda,
                });

                this.variacoesCadastradas = variacoes.map(variacao => ({
                    ...variacao,
                    cor:     cores.find(c => c.id === variacao.cor.id)!,
                    tamanho: tamanhos.find(t => t.id === variacao.tamanho.id)!,
                }));
            },
        });
    }

    // gera o preview da grade — cores x tamanhos
    gerarGrade(): void {
        const { coresSelecionadas, tamanhosSelecionados, precoCusto, precoVenda, quantidadePadrao, imagemEsp }
        = this.formGrade.getRawValue();

            if (!coresSelecionadas?.length || !tamanhosSelecionados?.length) {
                this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione pelo menos uma cor e um tamanho',
            });
            return;
        }

        const cadastradas = new Set(
            this.variacoesCadastradas.map(v => this.chaveGrade(v.cor.id, v.tamanho.id))
        );

        const combinacoes = coresSelecionadas.flatMap(cor =>
            tamanhosSelecionados.map(tamanho => ({cor, tamanho}))
        );

        const novas = combinacoes.filter(c => !cadastradas.has(this.chaveGrade(c.cor.id, c.tamanho.id)));
        const ignoradas = combinacoes.filter(c => cadastradas.has(this.chaveGrade(c.cor.id, c.tamanho.id)));

        if(ignoradas.length) {
            const nomes = ignoradas.map(c => `${c.cor.nome} ${c.tamanho.tamanho}`).join(', ');
            this.messageService.add({
                severity: novas.length ? 'info' : 'warn',
                summary: novas.length ? "Algumas combinações já existem e foram ignoradas" : "Nada novo para gerar",
                detail: `Já cadastradas: ${nomes}`,
            });
        }

        const quantidadeDigitada = new Map(
            this.gradePreview.map(v => [this.chaveGrade(v.corId, v.tamanhoId), v.quantidade])
        );

        // gera todas as combinações
        this.gradePreview = coresSelecionadas.flatMap(cor =>
            tamanhosSelecionados.map(tamanho => ({
                corId: cor.id ?? 0,
                corNome: cor.nome ?? '',
                tamanhoId: tamanho.id ?? 0,
                tamanhoNome: tamanho.tamanho ?? '',
                sku: `${this.produto!.codigo}-${cor.nome.toUpperCase().slice(0, 3)}-${tamanho.tamanho}`,
                quantidade: quantidadeDigitada.get(this.chaveGrade(cor.id, tamanho.id)) ?? quantidadePadrao ?? 0,
                precoCusto: precoCusto ?? this.produto?.precoCusto ?? 0,
                precoVenda: precoVenda ?? this.produto?.precoVenda ?? 0,
                imagemEsp: imagemEsp ?? this.produto?.imagem ?? '',
            }))
        );
    }

    // sobrescrever estoque das linhas com estoque padrão do form
    aplicarQuantidadePadrao(): void {
        const padrao = this.formGrade.controls.quantidadePadrao.value ?? 0;
        this.gradePreview.forEach(v => v.quantidade = padrao);
    }

    // soma peças da grade - conferir antes de salvar
    get totalPecas(): number {
        return this.gradePreview.reduce((total, v) => total + (v.quantidade ?? 0), 0);
    }

    private chaveGrade(corId: number, tamanhoId: number): string {
        return `${corId}-${tamanhoId}`;
    }

    // salva todas as variações da grade
    salvarGrade(): void {
        if (!this.gradePreview.length || this.salvando()) return;
        this.salvando.set(true);

        const envios = this.gradePreview.map(variacao => 
            this.variacaoApi.create(this.id!, this.paraRequest(variacao), { statusTela: STATUS_TRATADOS_GRADE }).pipe(
                map((criada): ResultadoEnvio => ({ variacao, criada })),
                catchError(() => of<ResultadoEnvio>({ variacao, criada: null })),
            )
        );

        forkJoin(envios).pipe(
            finalize(() => this.salvando.set(false)),
        ).subscribe(resultados => {
            const salvas = resultados.filter(r => r.criada !== null);
            const falhas = resultados.filter(r => r.criada === null).map(r => r.variacao);

            this.gradePreview = falhas;

            if (this.modoCompra) {
                this.reservarNaCompra(salvas);
                if(!falhas.length) {
                    this.compraFluxo.voltarParaCompra();
                    return;
                }
            }

            this.carregarDados();

            if(!falhas.length) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `${salvas.length} variações cadastradas com sucesso!`,
                });
                return;
            }

            const nomes = falhas.map(v => `${v.corNome} ${v.tamanhoNome}`).join(", ");
            const complemento = this.modoCompra && salvas.length ? 'Variações salvas na compra' : '';
            this.messageService.add({
                severity: salvas.length ? 'warn' : 'error',
                summary:  salvas.length ? `${salvas.length} de ${resultados.length} variações salvas` : 'Nenhuma variação foi salva',
                detail:   `Não foi possível salvar: ${nomes}. Elas continuam na prévia para tentar novamente.`,
                life: 8000,
            });
        });
    }

    private reservarNaCompra(salvas: ResultadoEnvio[]): void {
        const itens: ItemCompraPendente[] = salvas
            .filter(r => r.variacao.quantidade > 0)
            .map(r => ({
                variacaoProdutoId: r.criada!.id,
                nomeProduto: this.produto?.nome ?? '',
                sku: r.criada!.sku,
                quantidade: r.variacao.quantidade,
                valorUnit: r.variacao.precoCusto
        }));

        this.compraFluxo.adicionarItens(itens);

        const semQuantidade = salvas.length - itens.length;
        if(semQuantidade) {
            this.messageService.add({
                severity: 'info',
                summary: 'Variações sem quantidade',
                detail: `${semQuantidade} variação(ões) com quantidade 0 foram cadastradas, mas não entraram na compra.`,
                life: 8000,
            });
        }
    }

    private paraRequest(variacao: VariacaoGrade): VariacaoProdutoRequestDto {
        return {
            produtoId:  Number(this.id!),
            corId:      variacao.corId,
            tamanhoId:  variacao.tamanhoId,
            sku:        variacao.sku ?? '',
            estoque:    this.informaEstoqueInicial ? (variacao.quantidade ?? 0) : 0,
            precoCusto: variacao.precoCusto ?? 0,
            precoVenda: variacao.precoVenda ?? 0,
            imagemEsp:  variacao.imagemEsp ?? '',
        };
    }

    excluirVariacao(variacaoId: number): void {
        this.variacaoApi.delete(this.id!, variacaoId).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Variação excluída',
            });
            this.carregarDados();
        },
        });
    }

    onImagemEspSelecionada(event: Event): void {
        const input   = event.target as HTMLInputElement;
        const arquivo = input.files?.[0];
        if (!arquivo) return;

        // preview local imediato
        const reader = new FileReader();
        reader.onload = () => this.imagemEspPreview.set(reader.result as string);
        reader.readAsDataURL(arquivo);

        // upload e salva URL no form
        this.uploadingEsp.set(true);
        this.uploadApi.uploadImagem(arquivo).subscribe({
            next: ({ caminho }) => {
                this.formGrade.patchValue({ imagemEsp: caminho });
                this.uploadingEsp.set(false);
            },
        error: () => this.uploadingEsp.set(false),
        });
    }

    voltar(): void {
        if (this.modoCompra) {
            this.compraFluxo.voltarParaCompra();
            return;
        }
        this.router.navigate(['/produtos']);
    }
}