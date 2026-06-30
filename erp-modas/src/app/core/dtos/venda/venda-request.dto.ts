import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ItemVendaRequestDto } from "../dependentes/itemVenda/item-venda-request.dto";

export interface VendaRequestDto {
    clienteId: number;
    dataVenda: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itensVenda: ItemVendaRequestDto[];
    desconto: number;
}