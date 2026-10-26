import { FormaPagamento } from "@core/enums/forma-pagamento.enum";
import { ContasReceberResponseDto } from "../../dtos/dependentes/contasReceber/contas-receber-response.dto";
import { StatusConta } from "../../enums/status-conta.enum";
import { parseDataLocal } from "@core/utils/data.utils";

export class ContasReceber {
    id: number;
    dataLancamento: Date;
    dataVencimento: Date;
    dataRecebimento: Date | null;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
    formaPagamento: FormaPagamento | null;

    constructor(dto: ContasReceberResponseDto) {
        this.id = dto.id;
        this.dataLancamento = parseDataLocal(dto.dataLancamento)!;
        this.dataVencimento = parseDataLocal(dto.dataVencimento)!;
        this.dataRecebimento = parseDataLocal(dto.dataRecebimento);
        this.valor = dto.valor;
        this.numeroParcela = dto.numeroParcela;
        this.totalParcelas = dto.totalParcelas;
        this.observacoes = dto.observacoes;
        this.statusConta = dto.statusConta;
        this.formaPagamento = dto.formaPagamento;
    }
}