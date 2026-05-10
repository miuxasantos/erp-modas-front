import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ItemCompraResponseDto } from "../itemCompra/item-compra-response.dto";

export interface CategoriaRequestDto {
    fornecedorId: number;
    lote: string;
    dataChegada: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itens: ItemCompraResponseDto[];
}