import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCompraResponseDto {
    id: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;
}