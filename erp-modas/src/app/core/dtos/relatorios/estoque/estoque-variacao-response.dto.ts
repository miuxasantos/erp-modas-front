export interface EstoqueVariacaoResponseDto {
    id: number;
    sku: string;
    cor: string;
    tamanho: string;
    quantidade: number;
    precoCusto: number;
    precoVenda: number;
    valorEstoqueCusto: number;
    valorEstoqueVenda: number;
}