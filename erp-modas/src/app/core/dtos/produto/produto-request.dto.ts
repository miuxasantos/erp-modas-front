export interface ProdutoRequestDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    tecido: string;
    marca: string;
    categoriaId: number;
    imagem: string;
}