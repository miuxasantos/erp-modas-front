import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasPagarUpdateDto {
    dataLancamento: string;
    dataVencimento: string;
    dataPagamento: string;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}