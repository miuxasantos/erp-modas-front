import { FormaPagamento } from "@core/enums/forma-pagamento.enum";
import { ContasPagarResponseDto } from "../../dtos/dependentes/contasPagar/contas-pagar-response.dto";
import { StatusConta } from "../../enums/status-conta.enum";
import { parseDataLocal } from "@core/utils/data.utils";

export class ContasPagar {
    id: number;
    dataLancamento: Date;
    dataVencimento: Date;
    dataPagamento: Date | null;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
    formaPagamento: FormaPagamento | null;

    constructor(dto: ContasPagarResponseDto) {
        this.id = dto.id;
        this.dataLancamento = parseDataLocal(dto.dataLancamento)!;
        this.dataVencimento = parseDataLocal(dto.dataVencimento)!;
        this.dataPagamento = parseDataLocal(dto.dataPagamento);
        this.valor = dto.valor;
        this.numeroParcela = dto.numeroParcela;
        this.totalParcelas = dto.totalParcelas;
        this.observacoes = dto.observacoes;
        this.statusConta = dto.statusConta;
        this.formaPagamento = dto.formaPagamento;
    }
}