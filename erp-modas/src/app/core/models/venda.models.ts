import { VendaResponseDto } from "../dtos/venda/venda-response.dto";
import { FormaPagamento } from "../enums/forma-pagamento.enum";
import { Cliente } from "./cliente.model";
import { ContasReceber } from "./dependentes/contas-receber.model";
import { ItemVenda } from "./dependentes/item-venda.model";

export class Venda {
    id: number;
    cliente: Cliente;
    dataVenda: Date;
    observacoes: string;
    formaPagamento: FormaPagamento;
    valorTotal: number;
    numeroParcelas: number;
    contasReceber: ContasReceber[];
    itensVenda: ItemVenda[];
    desconto: number;

    constructor(dto: VendaResponseDto) {
        this.id = dto.id;
        this.cliente = new Cliente(dto.cliente);
        this.dataVenda = new Date(dto.dataVenda);
        this.observacoes = dto.observacoes;
        this.formaPagamento = dto.formaPagamento;
        this.valorTotal = dto.valorTotal;
        this.numeroParcelas = dto.numeroParcelas;
        this.contasReceber = dto.contasReceber.map(cr => new ContasReceber(cr));
        this.itensVenda = dto.itensVenda.map(iv => new ItemVenda(iv));
        this.desconto = dto.desconto;
    }
}