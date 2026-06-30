import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ContasPagarResponseDto } from "../dependentes/contasPagar/contas-pagar-response.dto";
import { FornecedorResponseDto } from "../fornecedor/fornecedor-response.dto";
import { ItemCompraResponseDto } from "../dependentes/itemCompra/item-compra-response.dto";

export interface CompraResponseDto {
    id: number;
    fornecedor: FornecedorResponseDto;
    lote: string;
    dataChegada: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itensCompra: ItemCompraResponseDto[];
    contasPagar: ContasPagarResponseDto[];
}