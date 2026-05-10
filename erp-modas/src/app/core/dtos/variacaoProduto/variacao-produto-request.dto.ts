export interface VariacaoProdutoRequestDto {
    sku: string;
    estoque: number;
    produtoId: number;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
    corId: number;
    tamanhoId: number;
}