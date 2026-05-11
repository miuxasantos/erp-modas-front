export interface CategoriaRequestDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    dataDesativacao: string;
    compraId: number;
    tecido: string;
    marca: string;
    categoriaId: number;
    imagem: string;
}