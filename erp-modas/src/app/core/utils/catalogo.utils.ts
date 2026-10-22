import { CorResponseDto } from '@core/dtos/apoio/cor/cor-response.dto';
import { TamanhoResponseDto } from '@core/dtos/apoio/tamanho/tamanho-response.dto';
import { CatalogoResponseDto } from '@core/dtos/catalogo/catalogo-response.dto';
import { TamanhoEnum } from '@core/enums/tamanho.enum';

// Funções puras compartilhadas entre listagem e detalhe do catálogo.

const ORDEM_TAMANHOS = Object.values(TamanhoEnum) as string[];

/** Cores distintas das variações do produto, por ID (nunca por nome). */
export function coresDoProduto(produto: CatalogoResponseDto): CorResponseDto[] {
    const map = new Map<number, CorResponseDto>();
    produto.variacoes.forEach(v => { if (v.cor) map.set(v.cor.id, v.cor); });
    return [...map.values()];
}

/** Ordena tamanhos pela ordem do enum (G, GG, XG... 44, 46...), não alfabética. */
export function compararTamanhos(a: TamanhoResponseDto, b: TamanhoResponseDto): number {
    return ORDEM_TAMANHOS.indexOf(a.tamanho) - ORDEM_TAMANHOS.indexOf(b.tamanho);
}

/** Produto com variações cadastradas e nenhuma com estoque. */
export function produtoEsgotado(produto: CatalogoResponseDto): boolean {
    return produto.variacoes.length > 0 && !produto.variacoes.some(v => v.disponivel);
}

/**
 * Cor de fundo segura para a bolinha. O cadastro aceita "#AABBCC" ou "AABBCC";
 * qualquer outra coisa cai num cinza neutro em vez de quebrar o CSS.
 */
export function corCss(cor: CorResponseDto | null | undefined): string {
    const hex = cor?.codigoHex?.trim() ?? '';
    if (/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
        return hex.startsWith('#') ? hex : `#${hex}`;
    }
    return '#d1d5db';
}