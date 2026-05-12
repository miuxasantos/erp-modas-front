import { CompraResponseDto } from "../dtos/compra/compra-response.dto";
import { FormaPagamento } from "../enums/forma-pagamento.enum";
import { ContasPagar } from "./dependentes/contas-pagar.model";
import { ItemCompra } from "./dependentes/item-compra.model";
import { Fornecedor } from "./fornecedor.model";

export class Compra {
    id: number;
    fornecedor: Fornecedor;
    lote: string;
    dataChegada: Date;
    observacoes: string;
    formaPagamento: FormaPagamento;
    numeroParcelas: number;
    valorTotal: number;
    contasPagar: ContasPagar[];
    itensCompra: ItemCompra[];

    constructor(dto: CompraResponseDto) {
        this.id = dto.id;
        this.fornecedor = new Fornecedor(dto.fornecedor);
        this.lote = dto.lote;
        this.dataChegada = new Date(dto.dataChegada);
        this.observacoes = dto.observacoes;
        this.formaPagamento = dto.formaPagamento;
        this.numeroParcelas = dto.numeroParcelas;
        this.valorTotal = dto.valorTotal;
        this.contasPagar = dto.contasPagar.map(cp => new ContasPagar(cp));
        this.itensCompra = dto.itensCompra.map(ic => new ItemCompra(ic));
    }
}