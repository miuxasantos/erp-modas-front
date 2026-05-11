import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ContasPagarResponseDto } from "../contasPagar/contas-pagar-response.dto";
import { FornecedorResponseDto } from "../fornecedor/fornecedor-response.dto";
import { ItemCompraResponseDto } from "../itemCompra/item-compra-response.dto";

export interface CompraUpdateDto {
    fornecedor?: FornecedorResponseDto;
    lote?: string;
    dataChegada?: string;
    observacoes?: string;
    formaPagamento?: FormaPagamento;
    numeroParcelas?: number;
    valorTotal?: number;
    itensCompra?: ItemCompraResponseDto[];
    contasPagar?: ContasPagarResponseDto[];
}