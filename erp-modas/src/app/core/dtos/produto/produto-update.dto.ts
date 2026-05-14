export interface ProdutoUpdateDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    compraId: number;
    tecido: string;
    marca: string;
    categoriaId: number;
    imagem: string;
}