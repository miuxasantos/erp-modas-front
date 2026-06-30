import { FormaPagamento } from "../../enums/forma-pagamento.enum";
import { ItemCompraRequestDto } from "../dependentes/itemCompra/item-compra-request.dto";

export interface CompraRequestDto {
    fornecedorId: number;
    lote: string;
    dataChegada: string;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    itensCompra: ItemCompraRequestDto[];
}