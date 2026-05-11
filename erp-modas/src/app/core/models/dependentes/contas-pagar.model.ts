import { ContasPagarResponseDto } from "../dtos/contasPagar/contas-pagar-response.dto";
import { StatusConta } from "../enums/status-conta.enum";
import { Compra } from "./compra.model";

export class ContasPagar {
    id: number;
    dataLancamento: Date;
    dataVencimento: Date;
    dataPagamento: Date;
    compra: Compra;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;

    constructor(dto: ContasPagarResponseDto) {
        this.id = dto.id;
        this.dataLancamento = new Date(dto.dataLancamento);
        this.dataVencimento = new Date(dto.dataVencimento);
        this.dataPagamento = new Date(dto.dataPagamento);
        this.compra = new Compra(dto.compraId);
        this.valor = dto.valor;
        this.numeroParcela = dto.numeroParcela;
        this.totalParcelas = dto.totalParcelas;
        this.observacoes = dto.observacoes;
        this.statusConta = dto.statusConta;
    }
}