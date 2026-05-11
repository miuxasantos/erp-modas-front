import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalRequestDto {
    compraId: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    quantidade: number;
}