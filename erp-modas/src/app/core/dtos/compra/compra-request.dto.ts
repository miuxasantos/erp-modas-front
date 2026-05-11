import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ContasPagarRequestDto } from "../contasPagar/contas-pagar-request.dto";
import { FornecedorResponseDto } from "../fornecedor/fornecedor-response.dto";
import { ItemCompraResponseDto } from "../itemCompra/item-compra-response.dto";

export interface CategoriaRequestDto {
    fornecedor: FornecedorResponseDto;
    lote: string;
    dataChegada: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itensCompra: ItemCompraResponseDto[];
    contasPagar: ContasPagarRequestDto[];
}