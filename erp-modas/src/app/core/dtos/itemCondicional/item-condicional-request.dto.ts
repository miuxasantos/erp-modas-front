import { CondicionalResponseDto } from "../condicional/condicional-response.dto";
import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCondicionalRequestDto {
    condicional: CondicionalResponseDto;
    variacaoProduto: VariacaoProdutoResponseDto;
    quantidade: number;
}