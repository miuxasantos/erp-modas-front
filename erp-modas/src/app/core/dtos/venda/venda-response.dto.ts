import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ItemVendaResponseDto } from "../itemVenda/item-venda-response.dto";

export interface VendaResponseDto {
    id: number;
    clienteId: number;
    dataVenda: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itens: ItemVendaResponseDto[];
    desconto: number;
}