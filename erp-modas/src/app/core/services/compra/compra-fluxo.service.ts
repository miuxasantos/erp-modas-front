import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormaPagamento } from '@core/enums/forma-pagamento.enum';

// item que entra na compra ao voltar do cadastro de produto/variações
export interface ItemCompraPendente {
    variacaoProdutoId: number;
    nomeProduto: string;
    sku: string;
    quantidade: number;
    valorUnit: number;
}

// valores do formulário de compra no momento em que o usuário saiu dele
export interface FormCompraSalvo {
    fornecedorId: number | null;
    dataChegada: Date | string | null;   // volta como string do JSON
    formaPagamento: FormaPagamento | null;
    numeroParcelas: number | null;
    lote: string | null;
    observacoes: string | null;
    itens: ItemCompraPendente[];
}

export interface RascunhoCompra {
    rotaRetorno: string;                  // '/compras/nova' ou '/compras/5/editar'
    form: FormCompraSalvo;
    itensPendentes: ItemCompraPendente[]; // variações criadas durante o atalho
}

const CHAVE_STORAGE = 'erp-modas:rascunho-compra';

/**
 * Guarda a compra em andamento enquanto o usuário cadastra um produto/variações
 * a partir dela, e devolve tudo quando ele volta.
 *
 * sessionStorage: sobrevive a um F5 no meio do cadastro, é separado por aba
 * (duas compras em abas diferentes não se misturam) e some quando a aba fecha.
 */
@Injectable({ providedIn: 'root' })
export class CompraFluxoService {
    private readonly router = inject(Router);

    // cópia em memória: o fluxo continua funcionando mesmo se o storage estiver indisponível
    private readonly rascunho = signal<RascunhoCompra | null>(this.lerStorage());

    /** Existe uma compra esperando o retorno do cadastro de produto. */
    readonly ativo = computed(() => this.rascunho() !== null);

    iniciar(rotaRetorno: string, form: FormCompraSalvo): void {
        this.gravar({ rotaRetorno, form, itensPendentes: [] });
    }

    adicionarItens(itens: ItemCompraPendente[]): void {
        const atual = this.rascunho();
        if (!atual || !itens.length) return;
        this.gravar({ ...atual, itensPendentes: [...atual.itensPendentes, ...itens] });
    }

    voltarParaCompra(): void {
        const atual = this.rascunho();
        if (!atual) {
            this.router.navigate(['/compras']);
            return;
        }
        this.router.navigate([atual.rotaRetorno], { queryParams: { retomar: 1 } });
    }

    /**
     * Entrega o rascunho uma única vez e o remove.
     * Retorna null se ele pertence a outra compra (ex.: saiu de /compras/nova e voltou em /compras/5/editar).
     */
    retomar(rotaAtual: string): RascunhoCompra | null {
        const atual = this.rascunho();
        this.descartar();
        return atual?.rotaRetorno === rotaAtual ? atual : null;
    }

    descartar(): void {
        this.gravar(null);
    }

    private gravar(rascunho: RascunhoCompra | null): void {
        this.rascunho.set(rascunho);
        try {
            if (rascunho) sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(rascunho));
            else sessionStorage.removeItem(CHAVE_STORAGE);
        } catch {
            // storage bloqueado/cheio: segue só com a cópia em memória
        }
    }

    private lerStorage(): RascunhoCompra | null {
        try {
            const bruto = sessionStorage.getItem(CHAVE_STORAGE);
            return bruto ? (JSON.parse(bruto) as RascunhoCompra) : null;
        } catch {
            return null;
        }
    }
}