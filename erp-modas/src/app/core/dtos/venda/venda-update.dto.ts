import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ContasReceberResponseDto } from "../contasReceber/contas-receber-response.dto";
import { ItemVendaResponseDto } from "../itemVenda/item-venda-response.dto";

export interface VendaUpdateDto {
    clienteId?: number;
    dataVenda?: string;
    observacoes?: string;
    formaPagamento?: FormaPagamento;
    numeroParcelas?: number;
    valorTotal?: number;
    contasReceber?: ContasReceberResponseDto[];
    itensVenda?: ItemVendaResponseDto[];
    desconto?: number;
}