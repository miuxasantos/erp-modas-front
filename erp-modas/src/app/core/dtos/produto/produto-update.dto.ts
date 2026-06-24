export interface ProdutoUpdateDto {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
    precoCusto?: number;
    precoVenda?: number;
    tecido?: string;
    marca?: string;
    categoriaId?: number;
    imagem?: string;
}