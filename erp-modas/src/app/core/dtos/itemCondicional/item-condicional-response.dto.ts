import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalResponseDto {
    id: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    quantidade: number;
}