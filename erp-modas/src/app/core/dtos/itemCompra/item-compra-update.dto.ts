import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemCompraUpdateDto {
    compraId?: number;
    variacaoProduto?: VariacaoProdutoResponseDto;
    valorUnit?: number;
    quantidade?: number;
    subTotal?: number;
}