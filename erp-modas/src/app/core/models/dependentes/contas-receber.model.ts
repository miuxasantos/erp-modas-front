import { ContasReceberResponseDto } from "../../dtos/dependentes/contasReceber/contas-receber-response.dto";
import { StatusConta } from "../../enums/status-conta.enum";

export class ContasReceber {
    id: number;
    dataLancamento: Date;
    dataVencimento: Date;
    dataRecebimento: Date;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;

    constructor(dto: ContasReceberResponseDto) {
        this.id = dto.id;
        this.dataLancamento = new Date(dto.dataLancamento);
        this.dataVencimento = new Date(dto.dataVencimento);
        this.dataRecebimento = new Date(dto.dataRecebimento);
        this.valor = dto.valor;
        this.numeroParcela = dto.numeroParcela;
        this.totalParcelas = dto.totalParcelas;
        this.observacoes = dto.observacoes;
        this.statusConta = dto.statusConta;
    }
}