import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemVendaUpdateDto {
    vendaId?: number;
    variacaoProduto?: VariacaoProdutoResponseDto;
    valorUnit?: number;
    quantidade?: number;
    subTotal?: number;
}