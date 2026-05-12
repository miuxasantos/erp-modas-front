import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";
import { VendaResponseDto } from "../venda/venda-response.dto";

export interface ItemVendaRequestDto {
    venda: VendaResponseDto;
    variacaoProduto: VariacaoProdutoResponseDto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;
}