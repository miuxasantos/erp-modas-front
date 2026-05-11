import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ClienteResponseDto } from "../cliente/cliente-response.dto";
import { ContasReceberResponseDto } from "../contasReceber/contas-receber-response.dto";
import { ItemVendaResponseDto } from "../itemVenda/item-venda-response.dto";

export interface VendaRequestDto {
    cliente: ClienteResponseDto;
    dataVenda: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    contasReceber: ContasReceberResponseDto[];
    itensVenda: ItemVendaResponseDto[];
    desconto: number;
}