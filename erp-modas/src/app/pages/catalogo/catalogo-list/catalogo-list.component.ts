// pages/catalogo/catalogo-list/catalogo-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ImagemUrlPipe } from '../../../core/pipes/imagens-url.pipe';
import { CatalogoApiService, CatalogoFiltros } from '../../../core/services/catalogo/catalogo-api-.service';
import { CatalogoResponseDto } from '@core/dtos/catalogo/catalogo-response.dto';
import { CategoriaApiService } from '@core/services/categoria-api.service';
import { CategoriaResponseDto } from '../../../core/dtos/categoria/categoria-response.dto';
import { CorResponseDto } from '@core/dtos/apoio/cor/cor-response.dto';

@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    InputTextModule,
    SelectModule,
    ButtonModule,
    PaginatorModule,
    TagModule,
    ImagemUrlPipe,
  ],
  templateUrl: './catalogo-list.component.html',
})
export class CatalogoListComponent implements OnInit {
  private readonly catalogoApi = inject(CatalogoApiService);
  private readonly categoriaApi = inject(CategoriaApiService);
  private readonly router = inject(Router);

  produtos = signal<CatalogoResponseDto[]>([]);
  categorias = signal<CategoriaResponseDto[]>([]);
  totalElements = signal(0);
  carregando = signal(false);

  // Estado dos filtros
  busca = '';
  categoriaSelecionada: number | null = null;
  page = 0;
  size = 20;

  ngOnInit(): void {
    this.categoriaApi.getAll().subscribe({
      next: cats => this.categorias.set(cats),
    });
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    const filtros: CatalogoFiltros = {};
    if (this.busca.trim())            filtros.q = this.busca.trim();
    if (this.categoriaSelecionada)     filtros.categoriaId = this.categoriaSelecionada;

    this.catalogoApi.listar(this.page, this.size, filtros).subscribe({
      next: res => {
        this.produtos.set(res.content);
        this.totalElements.set(res.totalElements);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  filtrar(): void {
    this.page = 0;
    this.carregar();
  }

  limparFiltros(): void {
    this.busca = '';
    this.categoriaSelecionada = null;
    this.filtrar();
  }

  onPageChange(event: PaginatorState): void {
    this.page = event.page ?? 0;
    this.size = event.rows ?? 20;
    this.carregar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  verDetalhe(id: number): void {
    this.router.navigate(['/catalogo', id]);
  }

  temFiltroAtivo(): boolean {
    return this.busca.trim().length > 0 || this.categoriaSelecionada !== null;
  }

  coresUnicas(produto: CatalogoResponseDto): CorResponseDto[] {
  const map = new Map<number, CorResponseDto>();
    produto.variacoes
      .filter(v => v.cor)
      .forEach(v => map.set(v.cor.id, v.cor));
    return [...map.values()];
  }
}