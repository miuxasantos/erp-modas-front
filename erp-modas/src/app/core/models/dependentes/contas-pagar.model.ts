import { ContasPagarResponseDto } from "../../dtos/dependentes/contasPagar/contas-pagar-response.dto";
import { StatusConta } from "../../enums/status-conta.enum";

export class ContasPagar {
    id: number;
    dataLancamento: Date;
    dataVencimento: Date;
    dataPagamento: Date;
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
        this.valor = dto.valor;
        this.numeroParcela = dto.numeroParcela;
        this.totalParcelas = dto.totalParcelas;
        this.observacoes = dto.observacoes;
        this.statusConta = dto.statusConta;
    }
}