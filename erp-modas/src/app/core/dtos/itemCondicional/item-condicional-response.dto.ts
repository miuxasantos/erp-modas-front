import { CondicionalResponseDto } from "../condicional/condicional-response.dto";
import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalResponseDto {
    id: number;
    condicional: CondicionalResponseDto;
    variacaoProduto: VariacaoProdutoResponseDto;
    quantidade: number;
}