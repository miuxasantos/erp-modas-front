import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalUpdateDto {
    compraId?: number;
    variacaoProduto?: VariacaoProdutoResponseDto;
    quantidade?: number;
}