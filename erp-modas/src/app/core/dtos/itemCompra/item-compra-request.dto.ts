import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCompraRequestDto {
    compraId: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;
}