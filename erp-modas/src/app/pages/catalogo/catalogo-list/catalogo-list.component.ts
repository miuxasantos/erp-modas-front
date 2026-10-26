// pages/catalogo/catalogo-list/catalogo-list.component.ts
import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ImagemUrlPipe } from '../../../core/pipes/imagens-url.pipe';
import { CatalogoApiService, filtros } from '../../../core/services/catalogo/catalogo-api-.service';
import { CatalogoResponseDto } from '@core/dtos/catalogo/catalogo-response.dto';
import { CatalogoFiltrosDto } from '@core/dtos/catalogo/catalogo-filtros.dto';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { catchError, switchMap, tap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coresDoProduto, produtoEsgotado, corCss } from '@core/utils/catalogo.utils';
 

interface OpcaoOrdenacao {
  label: string;
  value: string;
}

const ORDENACAO_PADRAO = 'nome,asc';
const ITENS_POR_PAGINA_PADRAO = 20;
const MAX_BOLINHAS_CORES = 5;


@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    CurrencyPipe,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    ButtonModule,
    PaginatorModule,
    TagModule,
    SkeletonModule,
    PageHeaderComponent,
    ImagemUrlPipe,
  ],
  templateUrl: './catalogo-list.component.html',
})
export class CatalogoListComponent implements OnInit {
  private readonly catalogoApi = inject(CatalogoApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly breadcrumbs: MenuItem[] = [
    { icon: 'pi pi-home', routerLink: '/catalogo' },
    { label: 'Catálogo' },
  ];

  readonly opcoesOrdenacao: OpcaoOrdenacao[] = [
    { label: 'Nome (A-Z)', value: 'nome,asc' },
    { label: 'Menor preço', value: 'precoVenda,asc' },
    { label: 'Maior preço', value: 'precoVenda,desc' },
  ];

  produtos = signal<CatalogoResponseDto[]>([]);
  opcoes = signal<CatalogoFiltrosDto>({ categorias: [], cores: [], tamanhos: [] });
  totalElements = signal(0);
  carregando = signal(false);
  primeiraCarga = signal(true);

  // Estado dos filtros
  busca = signal('');
  categoriaId = signal<number | null>(null);
  corId = signal<number | null>(null);
  tamanhoId = signal<number | null>(null);
  ordenacao = signal(ORDENACAO_PADRAO);
  page = signal(0);
  size = signal(ITENS_POR_PAGINA_PADRAO);

  filtrosAbertos = signal(false);

  readonly skeleton = Array.from({ length: 8 });
  
  qtdFiltrosAtivos = computed(() => 
    [this.categoriaId(), this.corId(), this.tamanhoId()].filter(v => v !== null).length
  );

  temFiltroAtivo = computed(() =>
    this.busca().trim().length > 0 || this.qtdFiltrosAtivos() > 0
  );

  chipsAtivos = computed(() => {
    const o = this.opcoes();
    const chips: { label: string, limpar: Params }[] = [];
    
    const termo = this.busca().trim();
    if(termo) chips.push({ label: `Busca: "${termo}"`, limpar: { q: null } });

    const cat = o.categorias.find(c => c.id === this.categoriaId());
    if(cat) chips.push({ label: `Categoria: ${cat.nome}`, limpar: { categoriaId: null } });

    const cor = o.cores.find(c => c.id === this.corId());
    if(cor) chips.push({ label: `Cor: ${cor.nome}`, limpar: { corId: null } });

    const tam = o.tamanhos.find(t => t.id === this.tamanhoId());
    if(tam) chips.push({ label: `Tamanho: ${tam.tamanho}`, limpar: { tamanhoId: null } });
    
    return chips;
  });

  ngOnInit(): void {
    this.catalogoApi.filtros().subscribe({
      next: f => this.opcoes.set(f),
    });

    const p = this.route.snapshot.queryParamMap;
    if (['categoriaId', 'corId', 'tamanhoId', 'sort'].some(k => p.has(k))) {
      this.filtrosAbertos.set(true);
    }

    this.route.queryParamMap.pipe(
      tap(params => {
        this.lerParams(params);
        this.carregando.set(true);
      }),
      switchMap(() =>
        this.catalogoApi.listar(this.page(), this.size(), this.montarFiltros()).pipe(
          catchError(() => of(null)) // erro já vira toast no errorInterceptor
        )
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(res => {
      this.produtos.set(res?.content ?? []);
      this.totalElements.set(res?.totalElements ?? 0);
      this.carregando.set(false);
      this.primeiraCarga.set(false);
    });
  }

  filtrar(): void {
    this.navegar({ pagina: null });
  }

  limparFiltros(): void {
    this.busca.set('');
    this.categoriaId.set(null);
    this.corId.set(null);
    this.tamanhoId.set(null);
    this.navegar({ pagina: null });
  }

  removerChip(limpar: Params): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...limpar, pagina: null },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PaginatorState): void {
    const pagina = (event.page ?? 0) + 1;
    const itens = event.rows ?? ITENS_POR_PAGINA_PADRAO;
    this.navegar({ 
      pagina: pagina > 1 ? pagina : null,
      itens: itens !== ITENS_POR_PAGINA_PADRAO ? itens : null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  alternarFiltros(): void {
    this.filtrosAbertos.update(v => !v);
  }

  estadoNavegacao(): { voltarPara: Params } {
    return { voltarPara: { ...this.route.snapshot.queryParams } };
  }

  coresVisiveis(produto: CatalogoResponseDto) {
    return coresDoProduto(produto).slice(0, MAX_BOLINHAS_CORES);
  }

  coresExcedentes(produto: CatalogoResponseDto): number {
    return Math.max(coresDoProduto(produto).length - MAX_BOLINHAS_CORES, 0);
  }

  esgotado = produtoEsgotado;
  corCss = corCss;

  onImagemErro(event: Event, produto: CatalogoResponseDto): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallback']) {
      img.style.visibility = 'hidden';
      return;
    }
    img.dataset['fallback'] = '1';
    img.src = new ImagemUrlPipe().transform(produto.imagem, 'full');
  }

  private lerParams(params: ParamMap): void {
    const numero = (chave: string): number | null => {
      const v = Number(params.get(chave));
      return Number.isInteger(v) && v > 0 ? v : null;
    };

    this.busca.set(params.get('q') ?? '');
    this.categoriaId.set(numero('categoriaId'));
    this.corId.set(numero('corId'));
    this.tamanhoId.set(numero('tamanhoId'));

    const sort = params.get('ordem');
    this.ordenacao.set(this.opcoesOrdenacao.some(o => o.value === sort) ? sort! : ORDENACAO_PADRAO);

    this.page.set((numero('pagina') ?? 1) - 1);
    this.size.set(numero('itens') ?? ITENS_POR_PAGINA_PADRAO);
  }

  private montarFiltros(): filtros {
    return {
      q: this.busca().trim() || undefined,
      categoriaId: this.categoriaId() ?? undefined,
      corId: this.corId() ?? undefined,
      tamanhoId: this.tamanhoId() ?? undefined,
      sort: this.ordenacao(),
    };
  }

  private navegar(extras: Params): void {
    const ordem = this.ordenacao();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.busca().trim() || null,
        categoriaId: this.categoriaId(),
        corId: this.corId(),
        tamanhoId: this.tamanhoId(),
        ordem: ordem !== ORDENACAO_PADRAO ? ordem : null,
        itens: this.size() !== ITENS_POR_PAGINA_PADRAO ? this.size() : null,
        ...extras,
      },
    });
  }
}