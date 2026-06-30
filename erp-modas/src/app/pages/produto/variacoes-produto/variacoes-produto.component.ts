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
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface VariacaoGrade {
    corId: number;
    corNome: string;
    tamanhoId: number;
    tamanhoNome: string;
    sku: string;
    estoque: number;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
}

@Component({
    selector: 'app-variacoes-produto',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        TableModule,
        MultiSelectModule,
        InputNumberModule,
        TagModule,
        TooltipModule,
        CurrencyPipe,
        PageHeaderComponent,
    ],
    templateUrl: './variacoes-produto.component.html',
})

export class VariacoesProdutoComponent implements OnInit {
    private readonly produtoApi    = inject(ProdutoApiService);
    private readonly variacaoApi   = inject(VariacaoProdutoApiService);
    private readonly corApi        = inject(CorApiService);
    private readonly tamanhoApi    = inject(TamanhoApiService);
    private readonly uploadApi = inject(UploadApiService);
    private readonly messageService = inject(MessageService);
    private readonly router        = inject(Router);
    private readonly route         = inject(ActivatedRoute);
    private readonly fb            = inject(FormBuilder);

    id: number | null = null;

    produto: ProdutoResponseDto | null = null;
    variacoesCadastradas: VariacaoProdutoResponseDto[] = [];
    cores: CorResponseDto[] = [];
    tamanhos: TamanhoResponseDto[] = [];
    gradePreview: VariacaoGrade[] = [];
    salvando = signal(false);
    imagemEspPreview = signal<string | null>(null);
    uploadingEsp = signal(false);

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Produtos',  routerLink: '/produtos' },
        { label: 'Variações' },
    ];

    formGrade = this.fb.group({
        coresSelecionadas:    [[] as CorResponseDto[]],
        tamanhosSelecionados: [[] as TamanhoResponseDto[]],
        precoCusto: [0],
        precoVenda: [0],
        estoqueInicial: [0],
        imagemEsp: [''],
    });

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? Number(idParam) : null;
        this.carregarDados();
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
                    cor:     cores.find(c => c.id === variacao.corId)!,
                    tamanho: tamanhos.find(t => t.id === variacao.tamanhoId)!,
                }));
            },
        });
    }

    // gera o preview da grade — cores x tamanhos
    gerarGrade(): void {
        const { coresSelecionadas, tamanhosSelecionados, precoCusto, precoVenda, estoqueInicial, imagemEsp }
        = this.formGrade.getRawValue();

            if (!coresSelecionadas?.length || !tamanhosSelecionados?.length) {
                this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione pelo menos uma cor e um tamanho',
            });
            return;
        }

        // gera todas as combinações
        this.gradePreview = coresSelecionadas.flatMap(cor =>
            tamanhosSelecionados.map(tamanho => ({
                corId: cor.id ?? 0,
                corNome: cor.nome ?? '',
                tamanhoId: tamanho.id ?? 0,
                tamanhoNome: tamanho.tamanho ?? '',
                sku: `${this.produto!.codigo}-${cor.nome.toUpperCase().slice(0, 3)}-${tamanho.tamanho}`,
                estoque: estoqueInicial ?? 0,
                precoCusto: precoCusto ?? this.produto?.precoCusto ?? 0,
                precoVenda: precoVenda ?? this.produto?.precoVenda ?? 0,
                imagemEsp: imagemEsp ?? this.produto?.imagem ?? '',
            }))
        );
    }

    // salva todas as variações da grade
    salvarGrade(): void {
        if (!this.gradePreview.length) return;
        this.salvando.set(true);

        const requests = this.gradePreview.map(variacao => ({
            produtoId:  Number(this.id!),
            corId:      variacao.corId,
            tamanhoId:  variacao.tamanhoId,
            sku:        variacao.sku ?? '',
            estoque:    variacao.estoque ?? 0,
            precoCusto: variacao.precoCusto ?? 0,
            precoVenda: variacao.precoVenda ?? 0,
            imagemEsp: variacao.imagemEsp ?? '',
        }));

        // envia uma por uma — ou adapta para um endpoint de bulk no back
        let concluidos = 0;
        requests.forEach(dto => {
            this.variacaoApi.create(this.id!, dto).subscribe({
                next: () => {
                concluidos++;
                    if (concluidos === requests.length) {
                        this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: `${concluidos} variações cadastradas com sucesso!`,
                        });
                        this.gradePreview = [];
                        this.carregarDados();
                        this.salvando.set(false);
                    }
                },
                error: () => this.salvando.set(false),
            });
        });
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
            next: ({ url }) => {
                this.formGrade.patchValue({ imagemEsp: url });
                this.uploadingEsp.set(false);
            },
        error: () => this.uploadingEsp.set(false),
        });
    }

    voltar(): void {
        this.router.navigate(['/produtos']);
    }
}