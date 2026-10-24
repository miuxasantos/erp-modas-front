import { EstoqueVariacaoResponseDto } from "./estoque-variacao-response.dto";

export interface EstoqueProdutoResponseDto {
    id: number;
    codigo: number;
    nome: string;
    categoria: string;
    ativo: boolean;
    quantidadeVariacoes: number;
    quantidadeUnidades: number;
    valorEstoqueCusto: number;
    valorEstoqueVenda: number;
    variacoes: EstoqueVariacaoResponseDto[];
}