export interface ProdutoResponseDto {
    id: number;
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    dataDesativacao: string;
    compraId: number;
    tecido: number;
    marca: number;
    categoriaId: number;
    imagem: string;
}