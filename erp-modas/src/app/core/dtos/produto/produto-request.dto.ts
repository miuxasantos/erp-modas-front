export interface ProdutoRequestDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    tecido: string;
    marca: string;
    categoriaId: number;
    imagem: string;
}