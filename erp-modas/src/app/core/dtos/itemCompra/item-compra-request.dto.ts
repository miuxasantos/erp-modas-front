import { CompraResponseDto } from "../compra/compra-response.dto";
import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCompraRequestDto {
    compra: CompraResponseDto;
    variacaoProduto: VariacaoProdutoResponseDto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;
}