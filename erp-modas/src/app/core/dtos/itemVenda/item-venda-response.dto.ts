import { VariacaoProdutoResponseDto } from "../variacaoProduto/variacao-produto-response.dto";

export interface ItemVendaResponseDto {
    id: number;
    vendaId: number;
    variacaoProduto: VariacaoProdutoResponseDto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;
}