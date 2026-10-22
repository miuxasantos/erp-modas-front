import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TamanhoResponseDto } from '@core/dtos/apoio/tamanho/tamanho-response.dto';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ImagemUrlPipe } from '@core/pipes/imagens-url.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute, Params } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CatalogoApiService } from '@core/services/catalogo/catalogo-api-.service';
import { CorResponseDto } from '@core/dtos/apoio/cor/cor-response.dto';
import { CatalogoResponseDto } from '@core/dtos/catalogo/catalogo-response.dto';
import { compararTamanhos, corCss, coresDoProduto } from '@core/utils/catalogo.utils';
import { linkWhatsapp } from '@core/const/public.constant';

interface OpcaoTamanho {
    tamanho: TamanhoResponseDto;
    disponivel: boolean;
}

@Component({
    selector: 'app-catalogo-detalhe',
    imports: [
        RouterLink,
        CurrencyPipe,
        ButtonModule,
        CardModule,
        TagModule,
        SkeletonModule,
        PageHeaderComponent,
        ImagemUrlPipe, 
    ],
    templateUrl: './catalogo-detalhe.component.html',
})
export class CatalogoDetalheComponent implements OnInit {
    private readonly catalogoApi = inject(CatalogoApiService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    produto = signal<CatalogoResponseDto | null>(null);
    carregando = signal(true);
    naoEncontrado = signal(false);

    corSelecionada = signal<CorResponseDto | null>(null);
    tamanhoSelecionado = signal<TamanhoResponseDto | null>(null);
    imagemAtiva = signal<string | null>(null);

    private readonly voltarPara: Params = (history.state?.['voltarPara'] as Params) ?? {};

    breadcrumbs = computed<MenuItem[]>(() => [
        { icon: 'pi pi-home', routerLink: '/catalogo' },
        { label: 'Catálogo', routerLink: '/catalogo', queryParams: this.voltarPara },
        { label: this.produto()?.nome ?? 'Produto' },
    ]);

    cores = computed(() => {
        const p = this.produto();
        return p ? coresDoProduto(p) : [];
    });

    tamanhos = computed<OpcaoTamanho[]>(() => {
        const p = this.produto();
        if(!p) return [];

        const cor = this.corSelecionada();
        const variacoes = p.variacoes.filter(v => !cor || v.cor?.id === cor.id);

        const map = new Map<number, OpcaoTamanho>();
        for(const v of variacoes) {
            const atual = map.get(v.tamanho!.id);
            map.set(v.tamanho!.id, {
                tamanho: v.tamanho!,
                disponivel: (atual?.disponivel ?? false) || v.disponivel,
            });
        }
        return [...map.values()].sort((a, b) => compararTamanhos(a.tamanho, b.tamanho));
    });

    imagens = computed<string[]>(() => {
        const p = this.produto();
        if (!p) return [];
        const todas = [p.imagem, ...p.variacoes.map(v => v.imagemEsp)];
        return [...new Set(todas.filter((img): img is string => !!img))];
    });

    temEstoque = computed(() => this.produto()?.variacoes.some(v => v.disponivel) ?? false);

    tamanhoDisponivel = computed<boolean | null>(() => {
        const t = this.tamanhoSelecionado();
        if (!t) return null;
        return this.produto()?.variacoes.some(v => v.tamanho?.id === t.id && v.disponivel) ?? false;
    });

    resumoMensagem = computed(() => {
        const itens = ['o produto'];
        if (this.corSelecionada()) itens.push('a cor');
        if (this.tamanhoSelecionado()) itens.push('o tamanho');
        if (itens.length === 1) return itens[0];
        return `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}`;
    });

    linkWhatsapp = computed(() => {
        const p = this.produto();
        if (!p) return '';

        const partes = [`Olá! Tenho interesse no produto *${p.nome}*`];
        const cor = this.corSelecionada();
        const tam = this.tamanhoSelecionado();
        if (cor) partes.push(`. Na cor *${cor.nome}*`);
        if (tam) partes.push(`. No tamanho *${tam.tamanho}*`);

        const pergunta = this.tamanhoDisponivel() === false ? "Você tem previsão de reposição?" : "Ainda está disponível?";

        return linkWhatsapp(`${partes.join(' - ')}. ${pergunta}\n${window.location.href}`);
    });

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
        this.marcarNaoEncontrado();
        return;
        }

        this.catalogoApi.buscarPorId(id).subscribe({
            next: produto => {
                this.produto.set(produto);
                this.imagemAtiva.set(produto.imagem ?? this.imagens()[0] ?? null);
                this.selecionarCorInicial();
                this.carregando.set(false);
            },
            error: (err: HttpErrorResponse) => {
                if(err.status === 404) this.naoEncontrado.set(true);
                this.carregando.set(false);
            },
        });
    }

    selecionarCor(cor: CorResponseDto): void {
        this.corSelecionada.set(cor);

        const tam = this.tamanhoSelecionado();
        if(tam && !this.tamanhos().some(o => o.tamanho.id === tam.id)) {
            this.tamanhoSelecionado.set(null);
        }

        const imagemDaCor = this.produto()?.variacoes.find(v => v.cor?.id === cor.id && v.imagemEsp)?.imagemEsp;
        if(imagemDaCor) this.imagemAtiva.set(imagemDaCor);
    }

    selecionarTamanho(tamanho: TamanhoResponseDto): void {
        this.tamanhoSelecionado.set(
            this.tamanhoSelecionado()?.id === tamanho.id ? null : tamanho
        );
    }

    voltar(): void {
        this.router.navigate(['/catalogo'], { queryParams: this.voltarPara });
    }

    corCss = corCss;

    private selecionarCorInicial(): void {
        const p = this.produto();
        if(!p) return;

        const comEstoque = p.variacoes.find(v => v.cor && v.disponivel)?.cor;
        const inicial = comEstoque ?? this.cores()[0] ?? null;
        if(inicial) this.selecionarCor(inicial);
    }

    private marcarNaoEncontrado(): void {
        this.naoEncontrado.set(true);
        this.carregando.set(false);
    }   
}