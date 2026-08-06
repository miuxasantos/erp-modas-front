export interface ProdutoRequestDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    tecidoId: number;
    marcaId: number;
    categoriaId: number;
    imagem: string;
}