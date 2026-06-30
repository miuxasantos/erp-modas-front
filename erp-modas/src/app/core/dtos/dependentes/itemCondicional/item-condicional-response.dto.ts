import { VariacaoProdutoResponseDto } from "../../apoio/variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalResponseDto {
    id: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    quantidade: number;
}