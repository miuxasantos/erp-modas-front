export interface EstoqueGeralResponseDto {
    quantidadeProdutos: number;
    produtosComEstoque: number;
    quantidadeVariacoes: number;
    variacoesSemEstoque: number;
    quantidadeUnidades: number;
    valorEstoqueCusto: number;
    valorEstoqueVenda: number;
}