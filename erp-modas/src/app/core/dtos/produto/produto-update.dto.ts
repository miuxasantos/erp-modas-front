export interface ProdutoUpdateDto {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
    precoCusto?: number;
    precoVenda?: number;
    tecidoId?: number;
    marcaId?: number;
    categoriaId?: number;
    imagem?: string;
}